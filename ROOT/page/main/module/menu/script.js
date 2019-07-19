class Module {
    DOM() {
        // this.addContentDom = coo.query('.addContent', this.domain);
    }

    INIT() {
        this.componentCache = new Map();
        cp["componentClassCache"] = new Map();
        cp["componentEntity"] = new Map();
    }

    EVENT() {
        cp.on('.slice', DOMAIN, 'click', t => this.addSlice(t));
    }

    addSlice(target) {
        //组件类型
        let name = cp.attr(target, "data-name");
        //获取组件
        this.getComponent(name);
        cp.parent(target, ".item").blur();
    }

    //添加一个新的组件
    getComponent(name) {
        //查询是否包含了组件
        //this.APP.getComponent();

        if (this.componentCache.has(name)) {
            this.makeComponent(name, this.componentCache.get(name));
            return;
        }

        let xhr = new XMLHttpRequest();
        xhr.onload = () => this.makeComponent(name, xhr.responseText);
        xhr.open("GET", "/component/" + name, true);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.send(null);
    }


    //根据请求到的字符串片段组成组件
    makeComponent(name, compStr) {
        let dataArr = compStr.split("--- IxD component ---");
        let defaultData;
        try {
            defaultData = JSON.parse(dataArr[0]);
        } catch (e) {
            console.error(e);
            return
        }

        //生成id
        defaultData.id = cp.randomNum() + cp.randomChar() + new Date().getTime();
        //name
        defaultData.name = name.replace("/", "-");
        //追加定位

        //获取页面尺寸
        let pageData = this.APP.getPageData();

        defaultData.position.top = parseInt((pageData.size.height - defaultData.size.height) / 2);
        defaultData.position.left = parseInt((pageData.size.width - defaultData.size.width) / 2);
        //保存数据
        this.APP.scene.components.push(defaultData);
        //生成右侧编辑器
        MODULE("edit").initComponentPanel(defaultData);

        //加载组件dom
        this.componentHtmlCompiler(dataArr[1], defaultData);

        //缓存策略
        if (!this.componentCache.has(name)) {
            //首次加载
            //css
            this.componentStyleCompiler(dataArr[3], defaultData);

            //js
            this.componentScriptCompiler(dataArr[2], defaultData);

            //缓存
            this.componentCache.set(name, compStr)
        }
        //忽略css
        //忽略类js
        //创建实体
        let entity = null;
        try {
            entity = new (cp.componentClassCache.get(defaultData.name))(document.querySelector("#slice_" + defaultData.id));
        } catch (e) {
            cp.log("组件 " + defaultData.name + " 内部出错，错误组件的实体 " + defaultData.id, "error");
            console.error(e);
            return;
        }
        cp.componentEntity.set(defaultData.id, entity);
        //执行
        defaultData.data.forEach(v => {
            if (typeof v.value === "object") {
                for (let vv in v.value) {
                    try {
                        entity.OPTION(v.key + "/" + vv, v.value[vv])
                    } catch (e) {
                        cp.log("组件 " + defaultData.name + " 内部出错，错误组件的实体 " + defaultData.id, "error");
                        console.error(e);
                        break;
                    }
                }
            } else {
                try {
                    entity.OPTION(v.key, v.value)
                } catch (e) {
                    cp.log("组件 " + defaultData.name + " 内部出错，错误组件的实体 " + defaultData.id, "error");
                    console.error(e);
                }
            }
        })
    }

    componentHtmlCompiler(htmlStr, defaultData) {
        //识别里面的库文件
        //追加里面的模块src
        let scriptReg = /<script.*?>.*?<\/script>/gi,
            srcReg = /src=['"]?([^'"]*)['"]?/i;
        let scriptArr = [];
        let scriptMatch = htmlStr.match(scriptReg);
        scriptMatch && scriptMatch.forEach(v => {
            let src = v.match(srcReg)[1];
            if (src.startsWith("./lib/")) {
                src = src.replace("./lib/", path + "/lib/");
            }
            scriptArr.push(src);
            //去掉html里的script标签
            htmlStr = htmlStr.replace(v, "")
        });

        //同步加载js
        (function loadJs() {
            scriptArr.length && cp.loadScriptAsync(scriptArr.shift(), loadJs);
        })();
        //添加html
        MODULE("canvas").addSlice(defaultData, htmlStr, true)
    }

    componentStyleCompiler(styleStr, defaultData) {
        let scope = ".slice-" + defaultData.name;
        let newStr = "";
        styleStr.split("}").forEach(v => {
            if (v) {
                let brr = v.split("{");
                let name = "";
                let crr = brr[0].split(",");
                crr.forEach(cv => name += scope + ">" + cv + ",");
                name = cp.trim(name, {char: ",", position: "right"});
                newStr += name + "{" + brr[1] + "}"
            }
        });
        cp.setStrSheet(newStr)
    }

    componentScriptCompiler(scriptStr, defaultData) {
        //兼容golang安全核心
        scriptStr = scriptStr.replace("class", "clazz");
        scriptStr = scriptStr.replace("DOMAI", "DOMAI_");
        scriptStr = scriptStr.replace("NAM", "NAM_");
        //简写
        scriptStr = scriptStr.replace(/DOMAI_N/g, "this.COMP");
        scriptStr = scriptStr.replace(/NAM_E/g, "this.COMPNAM");
        //获得构造控制权
        scriptStr = scriptStr.replace(/clazz (\S*) {/, `
             clazz Module {
                 constructor(COMP) {
                     this.COMP = COMP;
                     this.COMPNAM = "comp_${defaultData.id}";
                     this.DOM();
                     this.INIT();
                     this.EVENT();
                 }
         `);
        //兼容golang安全核心
        scriptStr = scriptStr.replace("clazz", "class");
        //加载js
        cp.loadScriptStr(defaultData.name, `;(() =>cp.componentClassCache.set("${defaultData.name}",${scriptStr}))();`);
    }
}