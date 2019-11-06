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
            icon: "&#xe7ee;",
            key: "login?logout=true",
            name: "退出登录"
        }, {
            icon: "&#xe682;",
            key: "userInfo",
            name: "个人信息"
        }, {
            icon: "&#xe664;",
            key: "historyMessage",
            disable: true,
            name: "历史消息"
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
        let dataId = cp.getData(target);
        if (dataId === "login?logout=true") {
            //清理
            localStorage.clear()
        }
        cp.link("/" + dataId)
    }
}