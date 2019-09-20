class Module {
    DOM() {
        //this.addContentDom = coo.query('.addContent', DOMAIN);
    }

    EVENT() {
        cp.on('.enter', DOMAIN, 'click', t => this.enter(t));
        cp.on('.delete', DOMAIN, 'click', t => this.delete(t));
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
        this.defaultSize = 125;
        this.autoSize();
        window.onresize = () => this.autoSize();
    }

    delete(target) {
        let p = cp.parent(target, ".item");
        let id = cp.getData(p);
        cp.ajax(CONF.IxDAddr + "/file/delete", {
            data: {
                id: id
            },
            success: res => {
                if (res.code === 0) {
                    cp.remove(p)
                } else {
                    console.error(res)
                }
            }
        });
    }

    loadFileList() {
        let {key} = MODULE("option").currNavigate();
        cp.ajax(CONF.IxDAddr + "/file/list", {
            data: {
                pid: key
            },
            success: res => {
                if (res.code === 0) {
                    let html = "";
                    res.data.forEach(v => {
                        html += `<div class="item" data-id=${v.id}>
                            <div class="inner">
                                <div class="img enter centerWrap">
                                      <i class="iconfont">${this.icon[v.type]}</i>                          
                                </div>
                                <div class="option">
                                    ${(v.type === "image" || v.type === "video" || v.type === "richText" || v.type === "text")
                            ? '<i class="preview iconfont icon alt" data-type="${v.type}">&#xe611;</i>' : ''}
                                    <i class="share iconfont icon alt">&#xe602;</i>
                                    <i class="download iconfont icon alt">&#xe635;</i>
                                    <i class="delete iconfont icon alt">&#xe624;</i>
                                </div>
                                <div class="name">${v.name}</div>
                            </div>
                        </div>`;
                    });
                    cp.empty(DOMAIN, html);
                } else {
                    console.error(res)
                }
            }
        });
    }

    autoSize() {
        let {width} = cp.domSize(DOMAIN);
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
        cp.removeClass(DOMAIN, /^auto-/g);
        //目标类名
        let clazz = 'auto-' + autoWidth + '' + autoWidth;
        let selectorText = '#' + NAME + '.' + clazz + ' > .item';
        //判断是否存在样式
        !cp.hasSheet(selectorText) && cp.setSheet(selectorText, {
            width: autoWidth + 'px',
            height: autoWidth + 'px'
        });
        cp.addClass(DOMAIN, clazz);
    }

    enter(target) {
        let p = cp.parent(target, ".item");
        let id = cp.getData(p);
        let name = cp.text(cp.query(".name", p));
        MODULE("option").setNavigate(id, name);
        this.loadFileList();
    }
}