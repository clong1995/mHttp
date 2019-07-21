class Module {
    DOM() {
        // this.addContentDom = coo.query('.addContent', DOMAIN);
    }

    EVENT() {
        cp.on('.inner', DOMAIN, 'click', t => this.edit(t));
        // coo.on('.close', this.domain, 'click', t => this.hideStory());
    }

    INIT() {
        this.defaultSize = 180;
        this.autoSize();
        this.loadItem();
        window.onresize = () => this.autoSize();
    }

    loadItem() {
        //假设获取到的项目
        let item = [
            {id: "1", name: "测试"},
            {id: "2", name: "测试"},
            {id: "3", name: "测试"},
            {id: "4", name: "测试"},
            {id: "5", name: "测试"},
            {id: "6", name: "测试"},
            {id: "6", name: "测试"},
            {id: "6", name: "测试"},
            {id: "6", name: "测试"},
            {id: "6", name: "测试"},
            {id: "6", name: "测试"},
            {id: "6", name: "测试"},
            {id: "6", name: "测试"},
            {id: "6", name: "测试"},
        ];

        let html = '';
        item.forEach(v => {
            html += `<div class="item">
                <div class="inner"data-id=${v.id}></div>
            </div>`;
        });
        cp.html(DOMAIN, html);
    }

    edit(target) {
        let id = cp.getData(target, "id");
        cp.setLocTempData(id);
        cp.link('/main');
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