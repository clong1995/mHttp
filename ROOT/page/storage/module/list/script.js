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
            richText: "&#xe650;"
        };
        this.recycle = false;
        this.defaultSize = 125;
        this.autoSize();
        window.onresize = () => this.autoSize();
    }

    share(target) {
        let p = cp.parent(target, ".item");
        let etag = cp.attr(p, "data-etag");
        let name = cp.text(cp.query(".name", p));
        this.shareLikDom.value = CONF.QiniuAddr + "/" + etag;
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
                cp.ajax(CONF.IxDAddr + "/file/delete", {
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
        if (type === "folder") {
            MODULE("dialog").show({
                text: "请使用客户端下载文件夹"
            });
            return
        }
        window.saveAs(CONF.QiniuAddr + "/" + etag, name);
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
        let url = CONF.IxDAddr + "/file/list";
        let data = {
            pid: key
        };
        if (type === "recycleBucket") {
            this.recycle = true;
            url = CONF.IxDAddr + "/file/deleteList";
            data = {}
        }
        //加载列表
        cp.ajax(url, {
            data: data,
            success: res => {
                if (res.code === 0) {
                    let html = "";
                    res.data.forEach(v => {
                        html += `<div class="item" data-id=${v.id} data-etag="${v.etag}" data-type="${v.type}" data-mime="${v.mime}">
                            <div class="inner">
                                <div class="img enter centerWrap">
                                    ${v.type === "image" ? `<div class="image centerBg" 
                                        style="background-image:url(${CONF.QiniuAddr}/${v.etag}?${CONF.QiniuThumbnail})"></div>`
                            //: v.type === "video" ? "视频"
                            : `<i class="iconfont">${this.icon[v.type]}</i>`}                          
                                </div>
                                <div class="option">
                                    ${(v.type === "image" || v.type === "video" || v.type === "richText" || v.type === "text")
                            ? '<i class="preview iconfont icon alt" data-type="${v.type}">&#xe611;</i>' : ''}
                                    ${this.recycle ? "" : '<i class="share iconfont icon alt">&#xe602;</i>'}
                                    <i class="download iconfont icon alt">&#xe635;</i>
                                    <i class="delete iconfont icon alt">&#xe624;</i>
                                </div>
                                <div class="name">${v.name}</div>
                            </div>
                        </div>`;
                    });
                    cp.empty(this.listDom, html);
                } else {
                    console.error(res)
                }
            }
        });
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
}