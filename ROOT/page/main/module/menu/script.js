class Module {
    DOM() {
        // this.addContentDom = coo.query('.addContent', this.domain);
    }

    INIT() {
        this.componentCache = new Map();
        cp["componentClassCache"] = new Map();
        cp["componentEntity"] = new Map();
        this.library();
    }

    EVENT() {
        //添加一个
        cp.on('.slice', DOMAIN, 'click', t => this.addSlice(t));
        //激活组件
        cp.on('.sort', DOMAIN, 'click', t => this.activeSort(t));
    }

    activeSort(target) {
        cp.toggleActive(target);
        //显示内容
        let parent = cp.parent(target, ".wrap");
        cp.toggleActive(cp.query("." + cp.getData(target), parent))
    }

    //创建库
    library() {
        //单品
        let single = {
            classify: [
                {
                    id: "intro",
                    name: "简介",
                    icon: "&#xe613;"
                }, {
                    id: "history",
                    name: "历程",
                    icon: "&#xe888;"
                }, {
                    id: "display",
                    name: "展示",
                    icon: "&#xe888;"
                }
            ],
            content: {
                intro: [
                    {
                        id: "single/intro01",
                        name: "简介01"
                    }, {
                        id: "single/intro02",
                        name: "简介02"
                    }, {
                        id: "single/intro03",
                        name: "简介03"
                    }
                ],
                history: [
                    {
                        id: "single/history01",
                        name: "历程01"
                    }
                ],
                display: [
                    {
                        id: "single/logoWall",
                        name: "logo墙"
                    }
                ]
            }
        };
        let singleClassifyHtml = "", singleContentHtml = "";
        single.classify.forEach((v, i) => {
            singleClassifyHtml += `
                <div class="sort ${!i && 'active'}" data-id="${v.id}">
                    <span class="iconfont icon">${v.icon}</span>
                    <span class="name">${v.name}</span>
                </div>
                `;
            singleContentHtml += `<div class="ul ${!i && 'active'} ${v.id}">`;
            single.content[v.id].forEach(vv => {
                singleContentHtml += `
                    <div class="li slice" data-id="${vv.id}">
                        <div class="thumbnail">
                            <span class="iconfont icon">&#xe611;</span>
                            <span class="iconfont icon">&#xe647;</span>
                        </div>
                        <div class="title">${vv.name}</div>
                    </div>
                `;
            });
            singleContentHtml += `</div>`;
        });
        cp.html(cp.query(".single-classify", DOMAIN), singleClassifyHtml);
        cp.html(cp.query(".single-content", DOMAIN), singleContentHtml);

        //控件库
        let block = {
            classify: [
                {
                    id: "text",
                    name: "文本",
                    icon: "&#xe613;"
                }, {
                    id: "picture",
                    name: "图片",
                    icon: "&#xe888;"
                }
            ],
            content: {
                text: [
                    {
                        id: "block/singleText",
                        name: "单行文本"
                    }, {
                        id: "block/multiText",
                        name: "多行文本"
                    }
                ],
                picture: [
                    {
                        id: "block/image",
                        name: "图片"
                    }, {
                        id: "block/banner01",
                        name: "轮播01"
                    }, {
                        id: "block/banner02",
                        name: "轮播02"
                    }
                ]
            }
        };
        let blockClassifyHtml = "", blockContentHtml = "";
        block.classify.forEach((v, i) => {
            blockClassifyHtml += `
                <div class="sort ${!i && 'active'}" data-id="${v.id}">
                    <span class="iconfont icon">${v.icon}</span>
                    <span class="name">${v.name}</span>
                </div>
                `;
            blockContentHtml += `<div class="ul ${!i && 'active'} ${v.id}">`;
            block.content[v.id].forEach(vv => {
                blockContentHtml += `
                    <div class="li slice" data-id="${vv.id}">
                        <div class="thumbnail">
                            <span class="iconfont icon">&#xe611;</span>
                            <span class="iconfont icon">&#xe647;</span>
                        </div>
                        <div class="title">${vv.name}</div>
                    </div>
                `;
            });
            blockContentHtml += `</div>`;
        });
        cp.html(cp.query(".block-classify", DOMAIN), blockClassifyHtml);
        cp.html(cp.query(".block-content", DOMAIN), blockContentHtml);

        //图标库
        let chart = {
            classify: [
                {
                    id: "line",
                    name: "折线图",
                    icon: "&#xe62a;"
                }, {
                    id: "bar",
                    name: "柱状图",
                    icon: "&#xe620;"
                }, {
                    id: "pie",
                    name: "饼状图",
                    icon: "&#xe608;"
                }, {
                    id: "map",
                    name: "地图",
                    icon: "&#xe882;"
                }/* {
                    id: "scatter",
                    name: "散点图",
                    icon: "&#xe703;"
                }, {
                    id: "candlestick",
                    name: "k线图",
                    icon: "&#xe622;"
                } {
                    id: "radar",
                    name: "雷达图",
                    icon: "&#xe66b;"
                }, {
                    id: "graph",
                    name: "关系图",
                    icon: "&#xe608;"
                }, {
                    id: "gauge",
                    name: "仪表盘",
                    icon: "&#xe608;"
                }*/
            ],
            content: {
                line: [
                    {
                        id: "chart/basicLine",
                        name: "基础折线图"
                    }
                ],
                bar: [
                    {
                        id: "chart/basicBar",
                        name: "基础柱状图"
                    }
                ],
                pie: [
                    {
                        id: "chart/basicPie",
                        name: "基础饼状图"
                    }
                ],
                scatter: [
                    {
                        id: "chart/basicScatter",
                        name: "基础散点图"
                    }
                ],
                map: [
                    {
                        id: "chart/basicMap",
                        name: "基础地图"
                    }
                ],
                candlestick: [
                    {
                        id: "chart/basicCandlestick",
                        name: "基础k线图"
                    }
                ],
                radar: [
                    {
                        id: "chart/basicRadar",
                        name: "基础雷达图"
                    }
                ],
                graph: [
                    {
                        id: "chart/basicGraph",
                        name: "基础关系图"
                    }
                ],
                gauge: [
                    {
                        id: "chart/basicGauge",
                        name: "基础仪表盘"
                    }
                ]
            }
        };
        let chartClassifyHtml = "", chartContentHtml = "";
        chart.classify.forEach((v, i) => {
            chartClassifyHtml += `
                <div class="sort ${!i && 'active'}" data-id="${v.id}">
                    <span class="iconfont icon">${v.icon}</span>
                    <span class="name">${v.name}</span>
                </div>
                `;
            chartContentHtml += `<div class="ul ${!i && 'active'} ${v.id}">`;
            chart.content[v.id].forEach(vv => {
                chartContentHtml += `
                    <div class="li slice" data-id="${vv.id}">
                        <div class="thumbnail">
                            <span class="iconfont icon">&#xe611;</span>
                            <span class="iconfont icon">&#xe647;</span>
                        </div>
                        <div class="title">${vv.name}</div>
                    </div>
                `;
            });
            chartContentHtml += `</div>`;
        });
        cp.html(cp.query(".chart-classify", DOMAIN), chartClassifyHtml);
        cp.html(cp.query(".chart-content", DOMAIN), chartContentHtml);
    }

    addSlice(target) {
        //组件类型
        let name = cp.attr(target, "data-id");
        //获取组件
        this.getComponent(name);
        cp.parent(target, ".item").blur();
    }

    /**
     * 添加一个新的组件
     * @param name
     * @param data 当为的时值候，是打开已有的场景时候调用的，{}和空为手动点击组件调用的
     */
    getComponent(name, data = null) {
        //查询是否包含了组件
        //this.APP.getComponent();
        if (this.componentCache.has(name)) {
            this.makeComponent(name, this.componentCache.get(name), data);
            return;
        }

        let xhr = new XMLHttpRequest();
        xhr.onload = () => this.makeComponent(name, xhr.responseText, data);
        xhr.open("GET", "/component/" + name, true);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.send(null);
    }

    /**
     * 根据请求到的字符串片段组成组件，数据来自：
     *  新请求:
     *      手动点击
     *      加载编辑过的场景
     *  缓存:
     *      手动点击
     *      加载编辑过的场景
     * @param name
     * @param compStr
     * @param data 有值是来自已编辑过的数据,null来自手动点击
     */
    makeComponent(name, compStr, data = null) {
        let dataArr = compStr.split("--- IxD component ---");
        let defaultData = null;
        try {
            defaultData = JSON.parse(dataArr[0]);
        } catch (e) {
            console.error(e);
            return
        }

        defaultData.name = name.replace("/", "-");

        //不是加载编辑过的
        if (!data) {
            //生成id
            defaultData.id = cp.randomNum() + cp.randomChar() + new Date().getTime();
            //追加定位，获取页面尺寸
            let pageData = this.APP.getPageData();
            defaultData.position.top = parseInt((pageData.size.height - defaultData.size.height) / 2);
            defaultData.position.left = parseInt((pageData.size.width - defaultData.size.width) / 2);
            //保存数据
            this.APP.scene.components.push(defaultData);
        }

        //加载组件dom
        this.componentHtmlCompiler(dataArr[1], data || defaultData, !data);

        //缓存策略
        if (!this.componentCache.has(name)) {
            //首次加载
            //css
            this.componentStyleCompiler(dataArr[3], defaultData.name);
            //js
            this.componentScriptCompiler(dataArr[2], defaultData.name);
            //缓存
            this.componentCache.set(name, compStr)
        }
        //忽略css
        //忽略类js
        //创建实体
        let entity = null;
        let entityId = data ? data.id : defaultData.id;
        try {
            entity = new (cp.componentClassCache.get(defaultData.name))(document.querySelector("#slice_" + entityId));
        } catch (e) {
            cp.log("创建组件 " + defaultData.name + " 时出错，错误组件的实体 " + entityId, "error");
            console.error(e);
            return;
        }

        //
        cp.componentEntity.set(entityId, entity);

        //执行
        let optionData = data ? data.option : defaultData.option;
        optionData.some(v => {
            if (typeof v.value === "object") {
                for (let vv in v.value) {
                    if (!this.setComponentEntity(entity, v.key + "/" + vv, v.value[vv], defaultData.name, entityId))
                        return true
                }
            } else {
                return !this.setComponentEntity(entity, v.key, v.value, defaultData.name, entityId)
            }
        });
        //数据
        let dataData = data ? data.data : defaultData.data;
        this.setComponentEntity(entity, "data", dataData, defaultData.name, entityId)
    }

    setComponentEntity(entity, key, value, name, id) {
        try {
            entity.OPTION(key, value);
        } catch (e) {
            cp.log("组件 " + name + " 内部出错，错误组件的实体 " + id, "error");
            console.error(e);
            return false
        }
        return true
    }


    componentHtmlCompiler(htmlStr, defaultData, single) {
        //识别里面的库文件
        //追加里面的模块src
        /*let scriptReg = /<script.*?>.*?<\/script>/gi,
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
        })();*/
        //添加html
        MODULE("canvas").addSlice(defaultData, htmlStr, single)
    }

    componentStyleCompiler(styleStr, name) {
        let scope = ".slice-" + name;
        let newStr = "";
        styleStr.split("}").forEach(v => {
            if (v) {
                let brr = v.split("{");
                let name = "";
                let crr = brr[0].split(",");
                crr.forEach(cv => name += scope + " > " + cv + ",");
                name = cp.trim(name, {char: ",", position: "right"});
                newStr += name + "{" + brr[1] + "}"
            }
        });
        cp.setStrSheet(newStr)
    }

    componentScriptCompiler(scriptStr, name) {

        //兼容golang安全核心
        scriptStr = scriptStr.replace("class", "clazz");
        scriptStr = scriptStr.replace(/DOMAI/g, "DOMAI_");
        //简写
        scriptStr = scriptStr.replace(/DOMAI_N/g, "this.COMP");
        //获得构造控制权
        scriptStr = scriptStr.replace(/clazz (\S*) {/, `
             clazz Module {
                 constructor(COMP) {
                     this.COMP = COMP;
                     this.DOM();
                     this.INIT();
                     this.EVENT();
                 }
         `);
        //兼容golang安全核心
        scriptStr = scriptStr.replace("clazz", "class");

        //加载js
        cp.loadScriptStr(name, `;(() =>cp.componentClassCache.set("${name}",${scriptStr}))();`);


    }
}