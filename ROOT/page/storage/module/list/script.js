class Module {
    DOM() {
        this.listDom = cp.query('.list', DOMAIN);
        this.shareWindowDom = cp.query('.share-window', DOMAIN);
        this.shareLikDom = cp.query('.link', this.shareWindowDom);
        this.shareNameDom = cp.query('.name', this.shareWindowDom);
    }

    EVENT() {
        cp.on('.enter', DOMAIN, 'click', t => this.enter(t));
        cp.on('.delete', DOMAIN, 'click', t => this.delete(t));
        cp.on('.download', DOMAIN, 'click', t => this.download(t));
        cp.on('.preview', DOMAIN, 'click', t => this.preview(t));
        cp.on('.share', DOMAIN, 'click', t => this.share(t));
        cp.on('.copy', this.shareWindowDom, 'click', () => this.copyLink());
    }

    INIT() {
        this.icon = {
            js: "&#xe64d;",
            css: "&#xe64c;",
            zip: "&#xe7b4;",
            html: "&#xe64b;",
            psd: "&#xe649;",
            excel: "&#xe648;",
            json: "&#xe641;",
            word: "&#xe92b;",
            file: "&#xe674;",
            exe: "&#xe651;",
            txt: "&#xe63d;",
            ppt: "&#xe7a2;",
            video: "&#xe63c;",
            folder: "&#xe63b;",
            image: "&#xe643;",
            richText: "&#xe650;",
            audio: "&#xe623;",
            database: "&#xe659;",
            dmg: "&#xe69c;",
            pkg: "&#xe65b;",
            apk: "&#xe65a;",
            pdf: "&#xe740;"
        };
        this.recycle = false;
        this.defaultSize = 125;
        this.autoSize();
        window.onresize = () => this.autoSize();
        //相应go
        //下载列表
        window.externalInvokeLoadingList = res => this.loadingList(res);
        //进度
        window.externalInvokeLoadingProgress = res => this.loadingProgress(res);
        this.isClient = localStorage.getItem("client")
    }

    copyLink() {
        cp.setClipboard(this.shareLikDom)
    }

    loadingProgress(res) {
        clearTimeout(this.stoLoadingProgress);
        let uploadingDoms = cp.query(".loading", this.listDom, true);
        for (let key in res) {
            [...uploadingDoms].some(v => {
                if (cp.getData(v, "etag") === key) {
                    let imgDom = cp.query(".img", v);
                    let progressDom = cp.query(".progress", imgDom);
                    if (!progressDom) {
                        //移除旋转
                        cp.remove(".animation_rotate", v);
                        //创建progress
                        progressDom = cp.createDom("span", {
                            "class": "progress"
                        });
                        cp.append(imgDom, progressDom)
                    }
                    cp.text(progressDom, res[key] + "%");
                    if (parseInt(res[key]) >= 100) {
                        cp.remove(v);
                    }
                    return true
                }
            })
        }
        console.log("检查进度");
        this.stoLoadingProgress = setTimeout(() => this.progress(), 3000)
    }

    share(target) {
        let p = cp.parent(target, ".item");
        let fid = cp.getData(p);
        let name = cp.text(cp.query(".name", p));
        this.shareLikDom.value = CONF.WebAddr + "/pick?f=" + fid;
        this.shareNameDom.value = name;
        MODULE("window").show(this.shareWindowDom);
    }

    delete(target) {
        MODULE("dialog").show({
            type: "warn",
            text: "确定要删除?",
            confirm: close => {
                let p = cp.parent(target, ".item");
                let id = cp.getData(p);
                let url = CONF.ServerAddr + "/file/delete";
                if (this.recycle) {
                    url = CONF.ServerAddr + "/file/remove";
                }
                cp.ajax(url, {
                    data: {
                        id: id
                    },
                    success: res => {
                        if (res.code === 0) {
                            cp.remove(p);
                            close()
                        } else {
                            console.error(res)
                        }
                    }
                });
            },
            cancel: close => close()
        });

    }

    download(target) {
        let p = cp.parent(target, ".item");
        let etag = cp.attr(p, "data-etag");
        let name = cp.text(cp.query(".name", p));
        let type = cp.attr(p, "data-type");
        if (this.isClient) {
            if (type === "folder") {
                MODULE("dialog").show({
                    text: "暂不支持下载目录"
                });
                return;
            }
            MODULE("dialog").show({
                type: "warn",
                text: "保存到默认下载目录",
                confirm: hide => {
                    //后台下载
                    external.invoke ? external.invoke(JSON.stringify({
                        key: "downloadFile",
                        value: etag
                    })) : downloadFile(etag);
                    hide()
                },
                cancel: hide => hide()
            });
        } else {
            if (type === "folder") {
                MODULE("dialog").show({
                    text: "请使用客户端下载文件夹"
                });
                return
            }
            window.saveAs(CONF.QiniuAddr + "/" + etag, name);
        }
    }

    preview(target) {
        let p = cp.parent(target, ".item");
        let etag = cp.attr(p, "data-etag");
        let name = cp.text(cp.query(".name", p));
        let type = cp.attr(p, "data-type");
        let mime = cp.attr(p, "data-mime");
        console.log(type);
        if (type !== "image" && (type !== "video" && mime !== "video/mp4")) {
            MODULE("dialog").show({
                type: "warn",
                text: "此文件不支持预览"
            });
            return;
        }
        window.open(CONF.QiniuAddr + "/" + etag, "newwindow")
    }

    loadFileList() {
        this.recycle = false;//是否在回收站内
        let {key, type} = MODULE("option").currNavigate();

        //隐藏不必要的菜单
        MODULE("option").hideForBucket(type);

        let url = CONF.ServerAddr + "/file/list";
        let data = {
            pid: key
        };
        if (type === "recycleBucket") {//回收站
            this.recycle = true;
            url = CONF.ServerAddr + "/file/deleteList";
            data = {}
        }
        if (type === "taskBucket") {//任务列表
            cp.empty(this.listDom);
            this.taskList();
            return;
        }
        //加载列表
        this.showFileList(url, data)
    }

    showFileList(url, data) {
        cp.ajax(url, {
            data: data,
            success: res => {
                if (res.code === 0) {
                    let html = "";
                    res.data.forEach(v => {
                        html += `<div class="item ${v.state ? "loading" : ""} ${v.user}" data-id=${v.id} data-etag="${v.etag}" data-type="${v.type}" data-mime="${v.mime}">
                            <div class="inner">
                                <!-- icon -->
                                <div class="img enter centerWrap">
                                    ${v.type === "image" && v.state !== 2
                            ? `<div class="image centerBg" style="background-image:url(${CONF.QiniuAddr}/${v.etag}?${CONF.QiniuThumbnail})"></div>`
                            : `${v.state === 2
                                ? `<i class='iconfont animation_rotate'>&#xe6ab;</i><i class='iconfont hide'>${this.icon[v.type]}</i>`
                                : `<i class='iconfont'>${this.icon[v.type]}</i>`
                            }`
                        }       
                                </div>
                                
                                <!-- option -->
                                <div class="option ${v.state === 2 ? 'hide' : ''}">
                                    ${(v.type === "image" || v.type === "video" || v.type === "richText" || v.type === "text")
                            ? `<i class="preview iconfont icon alt disable" data-type="${v.type}">&#xe611;</i>`
                            : ''
                        }
                                    
                                    ${this.recycle
                            ? ""
                            : '<i class="share iconfont icon alt">&#xe602;</i>'
                        }
                                    <i class="download iconfont icon alt">&#xe635;</i>
                                    <i class="delete iconfont icon alt">&#xe624;</i>
                                </div>
                                
                                <!-- name -->
                                <div class="name ellipsis">${v.name}</div>
                                
                            </div>
                        </div>`;
                    });
                    cp.empty(this.listDom, html);
                    //如果是浏览器，则不查询
                    if (this.isClient) {//客户端
                        //定期检查是否完全上传
                        this.checkFinish();
                        //如果是在任务列表下，查询试试进度
                        this.progress();
                    }
                } else {
                    console.error(res)
                }
            }
        });
    }

    progress() {
        let {type} = MODULE("option").currNavigate();
        if (type === "taskBucket") {
            external.invoke ? external.invoke(JSON.stringify({
                key: "getLoadingProgress"
            })) : getLoadingProgress()
        }
    }

    autoSize() {
        let {width} = cp.domSize(this.listDom);
        /*
        //取模:不定长和基数取模
        let mod = width % this.defaultSize;
        //取商:不定长和基数取商
        let div = Math.floor(width / this.defaultSize);
        //取模的商
        let modDiv = mod / div;
        //基数加模的商
        let autoWidth = width + modDiv;
        */
        //自动适应的宽度
        let autoWidth = Math.floor(width % this.defaultSize / Math.floor(width / this.defaultSize) + this.defaultSize);

        //移除尺寸
        cp.removeClass(this.listDom, /^auto-/g);
        //目标类名
        let clazz = 'auto-' + autoWidth + '' + autoWidth;
        let selectorText = '#' + NAME + '> .list.' + clazz + ' > .item';
        //判断是否存在样式
        !cp.hasSheet(selectorText) && cp.setSheet(selectorText, {
            width: autoWidth + 'px',
            height: autoWidth + 'px'
        });
        cp.addClass(this.listDom, clazz);
    }

    enter(target) {
        let p = cp.parent(target, ".item");
        let type = cp.attr(p, "data-type");
        if (type === "folder") {//文件夹才可以进入
            let id = cp.getData(p);
            let name = cp.text(cp.query(".name", p));
            MODULE("option").setNavigate(id, name, type);
            this.loadFileList();
        }
    }

    taskList() {
        external.invoke ? external.invoke(JSON.stringify({
            key: "getLoadingList"
        })) : getLoadingList()
    }

    loadingList(res) {
        let etags = res.split(",");
        //获取未完成的文件列表
        this.showFileList(CONF.ServerAddr + "/file/uploading", {
            etags: etags
        })
    }

    checkFinish() {
        let ids = [];
        cp.query(".own", this.listDom, true).forEach(v =>
            cp.hasClass(v, "loading") && ids.push(cp.getData(v)));
        if (ids.length) {
            cp.ajax(CONF.ServerAddr + "/file/checkFinish", {
                data: {
                    ids: ids
                },
                success: res => {
                    if (res.code === 0) {
                        res.data.forEach(v => this.loadFinish(v.id))
                    } else {
                        console.error(res)
                    }
                }
            });
            clearTimeout(this.stoCheckFinish);
            this.stoCheckFinish = setTimeout(() => {
                this.checkFinish()
            }, 5000)
        }
    }

    loadFinish(id) {
        cp.query(".loading", this.listDom, true).forEach(v => {
            if (cp.getData(v) === id) {
                let imgDom = cp.query(".img", v);
                cp.removeClass(v, "loading");
                cp.remove(".animation_rotate", imgDom);
                cp.remove(".progress", imgDom);
                cp.show(cp.query(".hide", imgDom));
                return true
            }
        })
    }
}