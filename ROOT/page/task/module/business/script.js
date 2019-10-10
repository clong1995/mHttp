class Module {
    DOM() {

    }

    EVENT() {
        cp.on('.item', DOMAIN, 'click', t => this.into(t));
    }

    INIT() {
        this.defaultSize = 150;
        this.autoSize();
        this.loadItem();
        window.onresize = () => this.autoSize();
    }

    loadItem() {
        let html = '';
        [{
            icon: "&#xe65e;",
            disable: true,
            name: "项目进度"
        }, {
            icon: "&#xe660;",
            disable: true,
            name: "打卡签到"
        }, {
            icon: "&#xe65c;",
            key: "bug",
            name: "提交BUG"
        }, {
            icon: "&#xe661;",
            disable: true,
            name: "差旅报销"
        }, {
            icon: "&#xe65d;",
            disable: true,
            name: "请假"
        }, {
            icon: "&#xe65f;",
            disable: true,
            name: "工时"
        }].forEach(v => {
            html += `<div class="item ${v.disable ? "disable" : ""}" data-id="${v.key}">
                            <div class="inner">
                                <div class="img centerWrap">
                                    <i class="iconfont">${v.icon}</i>
                                </div>
                                <div class="name">${v.name}</div>
                            </div>
                        </div>`;
        });
        cp.html(DOMAIN, html);

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

    into(target) {
        cp.link("/" + cp.getData(target))
    }
}