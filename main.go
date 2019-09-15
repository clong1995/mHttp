//轻量、高效、易用、#可分布！！
package main

import (
	"flag"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"path"
	"regexp"
	"strconv"
	"strings"
)

func init() {
	log.SetFlags(log.Llongfile)
}

type config struct {
	Addr  string
	Root  string
	Cors  bool
	Cache bool
	//TODO 专用
	Component string
}

var CONF *config

//自建缓存，目的和功效：降低至磁盘IO（包含任何文本图片等静态资源）为1次；js,css,html的链接，编译，为1次；
//用空间换时间
//数据结构：
type cacheItem struct {
	Type   string
	Length string
	Body   []byte
}

var cacheServer = make(map[string]cacheItem)

func main() {
	addr := flag.String("addr", ":8800", "服务器端口")
	root := flag.String("root", "./ROOT", "项目根目录")
	cors := flag.Bool("cors", true, "跨域")
	cache := flag.Bool("cache", false, "缓存")

	//TODO 专用
	component := flag.String("component", "./component", "组件目录")
	flag.Parse()
	CONF = new(config)
	CONF.Addr = *addr
	CONF.Root = *root
	CONF.Cors = *cors
	CONF.Cache = *cache

	//TODO 专用
	CONF.Component = *component

	//静态资源服
	http.Handle("/resource/", http.StripPrefix("/resource/", http.FileServer(http.Dir(CONF.Root+"/resource"))))
	//页面和模块内静态资源
	http.Handle("/page/", http.StripPrefix("/page/", http.FileServer(http.Dir(CONF.Root+"/page"))))
	//TODO 专用
	http.HandleFunc("/component/", componentHandle)
	//动态页面路由
	http.HandleFunc("/", pageHandle)

	log.Fatal(http.ListenAndServe(CONF.Addr, nil))
}

//TODO 专用
func componentHandle(w http.ResponseWriter, r *http.Request) {
	urlPath := r.URL.Path

	//判断缓存
	if value, ok := cacheServer[urlPath]; ok {
		httpWrite(w, &value)
		return
	}

	comp := strings.Split(urlPath, "/")

	if len(comp) == 4 { //加载主模块
		cPath := CONF.Component + "/" + comp[2] + "/" + comp[3]
		//检查三个基本文件是否存在
		files := [4]string{"/default.json", "/app.html", "/script.js", "/style.css"}
		for _, v := range files {
			if !existsAndWrite(cPath+v, w) {
				return
			}
		}
		//读取三个文件
		//读取default
		defaultStr, _ := ioutil.ReadFile(cPath + files[0])

		appStr, _ := ioutil.ReadFile(cPath + files[1])

		scriptStr, _ := ioutil.ReadFile(cPath + files[2])

		styleStr, _ := ioutil.ReadFile(cPath + files[3])

		splitStr := "--- IxD component ---"
		str := string(defaultStr) + splitStr + string(appStr) + splitStr + string(scriptStr) + splitStr + string(styleStr)
		//_, _ = io.WriteString(w, str)

		//TODO 加入缓存
		data := []byte(str)
		httpWriteAndCache(w, urlPath, "text/html", data)
	} else if len(comp) > 4 { //加载内部链接的文件
		cFilePath := CONF.Component + "/"
		for i := 2; i < len(comp); i++ {
			cFilePath += comp[i] + "/"
		}
		cFilePath = strings.TrimRight(cFilePath, "/")
		if existsAndWrite(cFilePath, w) {
			data, _ := ioutil.ReadFile(cFilePath)

			//这里根据扩展名设置type
			ext := path.Ext(urlPath)
			typee := "text/html"
			if ext == ".png" {
				typee = "image/png"
			} else if ext == ".jpg" || ext == ".jpeg" {
				typee = "image/jpeg"
			} else if ext == ".gif" {
				typee = "image/gif"
			} else if ext == ".bmp" {
				typee = "application/x-bmp"
			}

			//TODO 加入缓存
			httpWriteAndCache(w, urlPath, typee, data)
		}
	} else {
		w.WriteHeader(http.StatusNotFound)
		return
	}
}

func pageHandle(w http.ResponseWriter, r *http.Request) {
	urlPath := r.URL.Path

	//判断缓存
	if value, ok := cacheServer[urlPath]; ok {
		httpWrite(w, &value)
		return
	}

	//转发到resource处理器
	if urlPath == "/favicon.ico" {
		http.Redirect(w, r, "/resource/image/favicon.ico", http.StatusFound)
		return
	}

	if urlPath == "/" {
		urlPath = "/index"
	}
	//page
	//page := CONF.Root + "/page" + urlPath
	if !existsAndWrite(CONF.Root+"/page"+urlPath, w) {
		return
	}

	//resource
	resource := CONF.Root + "/resource"
	log.Println(resource)
	if !existsAndWrite(resource, w) {
		return
	}
	makeFile(urlPath, resource, w)
}

func existsAndWrite(ckPath string, w http.ResponseWriter) bool {
	_, err := os.Stat(ckPath)
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
		log.Printf("not found : %s", ckPath)
		return os.IsExist(err)
	}
	return true
}

func exists(ckPath string) bool {
	_, err := os.Stat(ckPath)
	if err != nil {
		return os.IsExist(err)
	}
	return true
}

//组装文件，带缓存
func makeFile(pPath, resource string, w http.ResponseWriter) {
	page := CONF.Root + "/page" + pPath
	//查找主要文件
	appPath := page + "/app.html"
	if !existsAndWrite(appPath, w) {
		return
	}
	appMain, err := ioutil.ReadFile(appPath)
	if err != nil {
		log.Printf("read err : %s", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	appHtml := string(appMain)
	//=== 解析 ===
	//解析 entry属性
	entryReg := regexp.MustCompile(`entry=['"]?([^'"]*)['"]?`)
	//解析 id属性
	idReg := regexp.MustCompile(`id=['"]?([^'"]*)['"]?`)
	//解析 class属性
	classReg := regexp.MustCompile(`class=['"]?([^'"]*)['"]?`)
	//解析 scope属性
	scopeReg := regexp.MustCompile(`scope=['"]?([^'"]*)['"]?`)

	//=== 编译 ===
	//编译主style
	appHtml = moduleStyleCompiler("", pPath, "", appHtml)
	//编译主script
	appHtml = moduleScriptCompiler(page, "", appHtml)
	//编译图片
	appHtml = moduleImgTagCompiler("", pPath, "", appHtml)
	//模块html
	for _, param := range regexp.MustCompile(`<module.*?(?:>|/>)`).FindAllStringSubmatch(appHtml, -1) {
		//模块
		moduleTag := param[0]
		//entry
		entryMatch := entryReg.FindStringSubmatch(moduleTag)
		if len(entryMatch) != 2 {
			log.Println("entry属性缺失")
			continue
		}
		entry := entryMatch[1]
		if entry == "" {
			log.Println("entry属性为空")
			continue
		}

		//id
		idMatch := idReg.FindStringSubmatch(moduleTag)
		if len(idMatch) == 2 {
			if idMatch[1] != "" {
				entry = idMatch[1]
			}
		}

		//class
		class := ""
		classMatch := classReg.FindStringSubmatch(moduleTag)
		if len(classMatch) == 2 {
			if classMatch[1] != "" {
				class = fmt.Sprintf(` class="%s"`, classMatch[1])
			}
		}

		//scope
		scope := ""
		scopeMatch := scopeReg.FindStringSubmatch(moduleTag)
		if len(scopeMatch) == 2 {
			if scopeMatch[1] != "" {
				scope = scopeMatch[1]
			}
		}

		/*log.Println("entry ==>", entry)
		log.Println("class ==>", class)
		log.Println("scope ==>", scope)*/

		//模块
		entryPath := page + "/module/" + entry

		//公共资源
		if scope != "" {
			entryPath = resource + "/module/" + entry
		}

		//编译html
		appHtml = moduleHtmlCompiler(entryPath, entry, moduleTag, class, appHtml)

		//编译style
		appHtml = moduleStyleCompiler(scope, pPath, entry, appHtml)

		//编译script
		appHtml = moduleScriptCompiler(entryPath, entry, appHtml)

		//编译图片
		appHtml = moduleImgTagCompiler(scope, pPath, entry, appHtml)
	}

	//TODO 加入缓存
	data := []byte(appHtml)
	httpWriteAndCache(w, pPath, "text/html", data)
}

//输出并缓存
func httpWriteAndCache(w http.ResponseWriter, urlPath, contentType string, body []byte) {
	//缓存
	cache := cacheItem{
		contentType,
		strconv.Itoa(len(body)),
		body,
	}
	if CONF.Cache {
		cacheServer[urlPath] = cache
	}
	//输出
	httpWrite(w, &cache)
}

//输出
func httpWrite(w http.ResponseWriter, cache *cacheItem) {
	w.Header().Set("Content-Type", cache.Type)
	w.Header().Set("Content-Length", cache.Length)
	_, err := w.Write(cache.Body)
	if err != nil {
		log.Println(err)
	}
}

//html
func moduleHtmlCompiler(entryPath, entry, moduleTag, class, appHtml string) string {
	htmlPath := entryPath + "/app.html"
	if exists(htmlPath) {
		data, err := ioutil.ReadFile(htmlPath)
		if err != nil {
			log.Printf("%s read fail, %s", htmlPath, err)
			return appHtml
		} else {
			appHtml = strings.ReplaceAll(appHtml, moduleTag, fmt.Sprintf(`<div id="%s"%s>%s</div>`, entry, class, string(data)))
			return appHtml
		}
	} else {
		log.Printf("%s not found", htmlPath)
		return appHtml
	}
}

//style
func moduleStyleCompiler(scope, pagePath, entry, appHtml string) string {
	var stylePath string
	if scope != "" {
		stylePath = CONF.Root + "/resource/module/" + entry + "/style.css"
	} else {
		if entry != "" {
			stylePath = CONF.Root + "/page" + pagePath + "/module/" + entry + "/style.css"
		} else {
			stylePath = CONF.Root + "/page" + pagePath + "/style.css"
		}
	}

	if exists(stylePath) {
		data, err := ioutil.ReadFile(stylePath)
		if err != nil {
			log.Printf("%s read fail, %s", stylePath, err)
			return appHtml
		} else {
			str := string(data)
			if str == "" {
				log.Printf("%s is empty", stylePath)
				return appHtml
			}

			backgroundReg := regexp.MustCompile(`.*background[^;"]+url\(([^)]+)\).*`)
			urlReg := regexp.MustCompile(`url\(['".]?([^'".]*)['".]\)?`)
			//提取了background
			for _, param := range backgroundReg.FindAllStringSubmatch(str, -1) {
				bgItem := param[0]
				urlMatch := urlReg.FindStringSubmatch(bgItem)
				if len(urlMatch) == 2 {
					url := urlMatch[1]
					if url != "" {
						if strings.HasPrefix(url, "/resource/image/") ||
							strings.HasPrefix(url, "http://") ||
							strings.HasPrefix(url, "https://") ||
							strings.HasPrefix(url, "file://") {
							continue
						}
						if strings.HasPrefix(url, "/image/") {
							str = strings.ReplaceAll(str, bgItem, strings.Replace(bgItem, url, "/page"+pagePath+url, 1))
						} else if strings.HasPrefix(url, "image/") {
							var realUrl string
							if scope != "" {
								realUrl = "/resource/module/" + entry + "/" + url
							} else {
								realUrl = "/page" + pagePath + "/module/" + entry + "/" + url
							}
							str = strings.ReplaceAll(str, bgItem, strings.Replace(bgItem, url, realUrl, 1))
						}
					}
				}
			}

			arr := strings.Split(str, "}")
			newStr := ""
			for _, v := range arr {
				if v == "" {
					continue
				}

				brr := strings.Split(v, "{")
				if len(brr) != 2 {
					continue
				}

				//主模块的style
				if entry != "" {
					//limitPrefix =
					name := ""
					crr := strings.Split(brr[0], ",")
					for _, cv := range crr {
						name += "#" + entry + ">" + cv + ","
					}
					name = strings.TrimRight(name, ",")

					newStr += name + "{" + brr[1] + "}"
				} else {

					newStr += brr[0] + "{" + brr[1] + "}"
				}
			}
			lastStyleIndex := strings.LastIndex(appHtml, "</style>")

			if lastStyleIndex == -1 {
				//没有</style>,替换</head>
				appHtml = strings.Replace(appHtml, "</head>", "<style>"+newStr+"</style></head>", 1)
			} else {
				//替换最后一个</style>
				appHtml = strings.Replace(appHtml, "</style>", newStr+"</style>", 1)
			}
			return appHtml
		}
	} else {
		log.Printf("%s not found", stylePath)
		return appHtml
	}
}

//script
func moduleScriptCompiler(entryPath, entry, appHtml string) string {
	scriptPath := entryPath + "/script.js"
	if exists(scriptPath) {
		data, err := ioutil.ReadFile(scriptPath)
		if err != nil {
			log.Printf("%s read fail, %s", scriptPath, err)
			return appHtml
		} else {
			str := string(data)
			if str == "" {
				log.Printf("%s is empty", scriptPath)
				return appHtml
			}

			classReg, err := regexp.Compile("class (\\S*) {")
			if err != nil {
				log.Println(err)
				return appHtml
			}

			//简化书写调用模块
			str = strings.ReplaceAll(str, "MODULE", "this.APP.getModule")
			str = strings.ReplaceAll(str, "DOMAIN", "this.DOMAIN")
			str = strings.ReplaceAll(str, "NAME", "this.NAME")

			//子模块的script
			if entry != "" {
				str = classReg.ReplaceAllString(str, `
				;app.setModule("`+entry+`",new class{
            		constructor(APP, DOMAIN) {
                		this.APP = APP;
                		this.DOMAIN = DOMAIN;
                		this.NAME = "`+entry+`";
                		this.DOM();
                		this.INIT();
                		this.EVENT();
            	}`)
				str += `(app,document.querySelector("#` + entry + `")))`
			} else {
				//主模块的script
				str = classReg.ReplaceAllString(str, `
				document.addEventListener("DOMContentLoaded", () => {
					const app = new class{
						constructor() {
							this.moduleMap = new Map();
							this.DOM();
							this.INIT();
							this.EVENT();
						}
						getModule(moduleName) {
							return this.moduleMap.get(moduleName);
						}
						setModule(moduleName, module) {
							this.moduleMap.set(moduleName, module);
						}
						destroyModule(moduleName) {
							let module = this.getModule(moduleName);
							module.destroy();
							this.moduleMap.delete(moduleName);
						}
						reloadModule(name = null) {
							name ? this.getModule(name).init()
								: this.moduleMap.forEach(v => v.init && v.init());
						}`)
				str += "()"
			}
			endStr := ";app.READY && app.READY();})</script>"
			//
			if strings.LastIndex(appHtml, "</script></head>") == -1 {
				//没有</script>,替换</head>
				appHtml = strings.Replace(appHtml, "</head>", "<script>"+str+endStr+"</head>", 1)
			} else {
				//替换最后一个</script>
				appHtml = strings.Replace(appHtml, endStr, str+endStr, 1)
			}
			return appHtml
		}
	} else {
		log.Printf("%s not found", scriptPath)
		return appHtml
	}
}

//image
func moduleImgTagCompiler(scope, pagePath, entry, appHtml string) string {
	//img
	imgReg := regexp.MustCompile(`<img.*?(?:>|/>)`)
	//解析 src 属性
	srcReg := regexp.MustCompile(`src=['"]?([^'"]*)['"]?`)
	//提取了img标签
	for _, param := range imgReg.FindAllStringSubmatch(appHtml, -1) {
		imgTag := param[0]
		srcMatch := srcReg.FindStringSubmatch(imgTag)
		if len(srcMatch) == 2 {
			src := srcMatch[1]
			if src != "" {
				if strings.HasPrefix(src, "/resource/image/") ||
					strings.HasPrefix(src, "http://") ||
					strings.HasPrefix(src, "https://") ||
					strings.HasPrefix(src, "file://") {
					continue
				}

				if strings.HasPrefix(src, "/image/") {
					appHtml = strings.ReplaceAll(appHtml, imgTag, strings.Replace(imgTag, src, "/page"+pagePath+src, 1))
				} else if entry != "" && strings.HasPrefix(src, "image/") {
					var realSrc string
					if scope != "" {
						realSrc = "/resource/module/" + entry + "/" + src
					} else {
						realSrc = "/page" + pagePath + "/module/" + entry + "/" + src
					}
					appHtml = strings.ReplaceAll(appHtml, imgTag, strings.Replace(imgTag, src, realSrc, 1))
				}
			}
		}
	}
	return appHtml
}
