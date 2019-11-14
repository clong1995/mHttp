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
        let list = [{
            icon: "&#xe667;",
            disable: true,
            name: "我的设备"
        }, {
            icon: "&#xe699;",
            disable: true,
            name: "员工电脑"
        }, {
            icon: "&#xe66c;",
            key: "exhibition",
            name: "公司设备"
        }, {
            icon: "&#xe66d;",
            key: "exhibition",
            name: "长乐厅"
        }, {
            icon: "&#xe66d;",
            key: "exhibition",
            name: "青岛厅"
        }, {
            icon: "&#xe66d;",
            key: "exhibition",
            name: "菏泽厅"
        }];

        let html = '';
        list.forEach(v => {
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

        //加载员工电脑
        /*cp.ajax(CONF.ServerAddr + "/user/list", {
            success: res => {
                if (res.code === 0) {
                    let html = '';
                    res.data.forEach(v => {
                        html += `<div class="item" data-id="${v.id}">
                            <div class="inner">
                                <div class="img centerWrap">
                                    <i class="iconfont">&#xe68d;</i>
                                </div>
                                <div class="name">${v.email}</div>
                            </div>
                        </div>`;
                    });
                    cp.html(DOMAIN, html);
                } else {
                    console.error(res)
                }
            }
        });*/
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