class Module {
    DOM() {
        //this.addContentDom = coo.query('.addContent', DOMAIN);
    }

    EVENT() {
        //cp.on('.enter', DOMAIN, 'click', t => this.enter(t));
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
            exe: "&#xe68d;",
            txt: "&#xe63d;",
            ppt: "&#xe7a2;",
            video: "&#xe63c;",
            folder: "&#xe63b;",
            image: "&#xe643;",
        };
        this.defaultSize = 180;
        this.autoSize();
        this.loadMyFile();
        window.onresize = () => this.autoSize();

    }

    loadMyFile() {
        let html = "";
        [
            {id: 1, name: "xxxx", type: "folder"},
            {id: 2, name: "dddd", type: "image", thumbnail: ""},
            {id: 2, name: "dddd", type: "zip"},
            {id: 2, name: "dddd", type: "word"},
            {id: 2, name: "dddd", type: "exe"},
            {id: 2, name: "dddd", type: "ppt"},
            {id: 2, name: "dddd", type: "psd"},
            {id: 2, name: "dddd", type: "file"}
        ].forEach(v => {
            html += `<div class="item" data-id=${v.id}>
                            <div class="inner">
                                <div class="img enter centerWrap">
                                      <i class="iconfont">${this.icon[v.type]}</i>                          
                                </div>
                                <div class="option">
                                    <i class="preview iconfont icon alt">&#xe602;</i>
                                    <i class="copy iconfont icon alt">&#xe635;</i>
                                    <i class="delete iconfont icon alt">&#xe624;</i>
                                </div>
                                <div class="name">${v.name}</div>
                            </div>
                        </div>`;
        });
        cp.html(DOMAIN, html);
    }

    loadCompanyFile() {
        let html = "";
        [
            {id: 1, name: "青岛项目"},
            {id: 2, name: "福州长乐项目"},
            {id: 3, name: "内蒙电力"},
            {id: 4, name: "内蒙联通"}
        ].forEach(v => {
            html += `<div class="item" data-id=${v.id}>
                            <div class="inner">
                                <div class="img enter centerWrap">
                                    <i class="iconfont">&#xe60f;</i>                            
                                </div>
                                <div class="option">
                                    <i class="preview iconfont icon alt disable">&#xe602;</i>
                                    <i class="copy iconfont icon alt disable">&#xe635;</i>
                                </div>
                                <div class="name">${v.name}</div>
                            </div>
                        </div>`;
        });
        cp.html(DOMAIN, html);
    }

    loadShareFile() {
        cp.empty(DOMAIN);
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
}