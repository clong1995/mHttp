class Module {
    DOM() {
        this.pageDom = cp.query('.page', DOMAIN);
        this.componentDom = cp.query('.component', DOMAIN);
        this.pageTabDom = cp.query('.pageTab', DOMAIN);
        this.componentTabDom = cp.query('.componentTab', DOMAIN);

        //page
        this.pageName = cp.query('.name-value', this.pageDom);
        this.pageWidth = cp.query('.width-value', this.pageDom);
        this.pageHeight = cp.query('.height-value', this.pageDom);
        this.pageFill = cp.query('.fill-value', this.pageDom);
        this.pageColor = cp.query('.color-value', this.pageDom);
        this.pageImage = cp.query('.image-value', this.pageDom);
        this.pageFlipOver = cp.query('.flip-over-value', this.pageDom);
        this.pageCover = cp.query('.cover-value', this.pageDom);
        this.pageComment = cp.query('.comment-value', this.pageDom);

    }

    EVENT() {
        cp.on('.pageTab', DOMAIN, 'click', t => this.activePageEdit(t));
        cp.on('.componentTab', DOMAIN, 'click', t => this.activeComponentEdit(t));
        //改变页面参数
        cp.on('.value', this.pageDom, 'change', t => this.changePage(t));
        //改变组件参数
        cp.on('.value', this.componentDom, 'change', t => this.changeComponent(t));
    }

    INIT() {
        this.initPagePanel()
    }

    changePage(target) {
        let pageData = this.APP.getPageData();
        //修改页面名称
        if (cp.hasClass(target, "name-value")) {
            pageData.name = target.value;
        }

        //修改页面宽度
        if (cp.hasClass(target, "width-value")) {

            pageData.size.width = target.value;

            let width = target.value;
            let height = this.pageHeight.value;
            MODULE("canvas").setSize(width, height);
        }

        //修改页面高度
        if (cp.hasClass(target, "height-value")) {

            pageData.size.height = target.value;

            let width = this.pageWidth.value;
            let height = target.value;
            MODULE("canvas").setSize(width, height);
        }

        //修改页面填充方式
        if (cp.hasClass(target, "fill-value")) {
            pageData.fill = target.value;
        }

        //修改页面颜色
        if (cp.hasClass(target, "color-value") || cp.hasClass(target, "color-text-value")) {
            pageData.background.color = target.value;
        }

        //修改背景图
        if (cp.hasClass(target, "image-value")) {
            pageData.background.image = target.value;
        }

    }

    changeComponent(target) {
        //通知到组件
        let id = this.componentDom.id.split("_")[1];
        let componentData = this.APP.getComponentData(id);
        //修改名称
        if (cp.hasClass(target, "name-value")) {
            componentData.name = target.value;
        }
        //修改宽度
        else if (cp.hasClass(target, "width-value")) {
            componentData.size.width = target.value;
            this.setComponent("width")
        }

        //修改高度
        else if (cp.hasClass(target, "height-value")) {
            componentData.size.height = target.value;
            this.setComponent("height")
        }

        //修改top
        else if (cp.hasClass(target, "top-value")) {
            componentData.position.top = target.value;
            this.setComponent("top")
        }

        //修改left
        else if (cp.hasClass(target, "left-value")) {
            componentData.position.left = target.value;
            this.setComponent("left")
        }

        //修改页面颜色
        else if (cp.hasClass(target, "color-value") || cp.hasClass(target, "color-text-value")) {
            componentData.background.color = target.value;
            this.setComponent("backgroundColor")
        }

        //修改背景图
        else if (cp.hasClass(target, "image-value")) {
            componentData.background.image = target.value;
            this.setComponent("backgroundImage")
        }
    }

    getComponentDom() {
        this.compName = cp.query('.name-value', this.componentDom);
        this.compWidth = cp.query('.width-value', this.componentDom);
        this.compHeight = cp.query('.height-value', this.componentDom);
        this.compTop = cp.query('.top-value', this.componentDom);
        this.compLeft = cp.query('.left-value', this.componentDom);
    }

    activePageEdit(target) {
        cp.toggleActive(target);
        cp.show(this.pageDom);
        cp.hide(this.componentDom);

        let idstr = this.componentDom.id;
        let id = idstr.split("_")[1];
        MODULE("canvas").removeActiveById(id);
        MODULE("coverage").removeActiveById(id);
    }

    activeComponentEdit(target) {
        cp.toggleActive(target);
        cp.show(this.componentDom);
        cp.hide(this.pageDom);
    }

    activeComponentEditById(id) {
        let component = this.APP.getComponentData(id);
        this.initComponentPanel(component);
        this.componentDom.id = "component_" + id;
        this.activeComponentEdit(this.componentTabDom);
    }

    initPagePanel() {
        let pageData = this.APP.getPageData();
        this.pageName.value = pageData.name;
        this.pageWidth.value = pageData.size.width;
        this.pageHeight.value = pageData.size.height;
        //this.pageFill = pageData.fill;
        this.pageColor.value = pageData.background.color;
        this.pageColor.nextSibling.value = pageData.background.color;
        this.pageImage.value = pageData.background.image;
        //this.pageFlipOver = pageData.flipOver;
        this.pageCover.src = pageData.cover;
        this.pageComment.value = pageData.comment;
    }

    /**
     *
     * @param data
     */
    initComponentPanel(data) {

        //title
        this.componentDom.id = "edit_" + data.id;

        //名字
        let nameHtml = `
            <div class="row name">
                <div class="name">名称</div>
                <input class="value input name-value" type="text" value="${data.name}">
            </div>`;
        cp.html(this.componentDom, nameHtml);

        //位置
        let positionHtml = `
            <div class="row position">
                <div class="name">宽度</div>
                <input class="value input width-value" type="number" value="${data.size.width}">
                <div class="name">高度</div>
                <input class="value input height-value" type="number" value="${data.size.height}">
                <div class="name">顶距</div>
                <input class="value input top-value" type="number" value="${data.position.top}">
                <div class="name">侧距</div>
                <input class="value input left-value" type="number" value="${data.position.left}">
            </div>`;
        cp.html(this.componentDom, positionHtml, "beforeend");

        //背景
        let backgroundHtml = `
             <div class="row color">
                <div class="name">背景色</div>
                <input type="color" class="value input color-value" value="${data.background.color}">
                <input type="text" class="value input color-text-value" value="${data.background.color}">
            </div>
            <div class="row file">
                <div class="name">背景图</div>
                <input type="text" class="value input image-value" readonly value="${data.background.image}">
            </div>
        `;
        cp.html(this.componentDom, backgroundHtml, "beforeend");

        //其他数据
        data.data.forEach(v => {
            let editHtml;
            switch (v.type) {
                case "color"://颜色
                    editHtml = `
                        <div class="row color">
                            <div class="name">${v.name}</div>
                            <input type="color" class="value input" value="${v.value}">
                        </div>
                    `;
                    break;
            }
            editHtml && cp.html(this.componentDom, editHtml, "beforeend");
        });

        this.activeComponentEdit(this.componentTabDom);

        this.getComponentDom();
    }

    changePosition(id) {
        let component = this.APP.getComponentData(id);
        this.compTop.value = component.position.top;
        this.compLeft.value = component.position.left;
    }

    changeSize(id) {
        let component = this.APP.getComponentData(id);
        this.compWidth.value = component.size.width;
        this.compHeight.value = component.size.height;
    }

    getEditData() {

    }

    setEditData() {

    }


    setComponent(key) {
        //当前组件
        let id = this.componentDom.id.split("_")[1];
        let componentDom = cp.query("#slice_" + id);
        let componentData = this.APP.getComponentData(id);
        switch (key) {
            case "width":
                cp.css(componentDom, {
                    width: componentData.size.width + "px"
                });
                break;
            case "height":
                cp.css(componentDom, {
                    height: componentData.size.height + "px"
                });
                break;
            case "top":
                cp.css(componentDom, {
                    top: componentData.position.top + "px"
                });
                break;
            case "left":
                cp.css(componentDom, {
                    left: componentData.position.left + "px"
                });
                break;
            case "backgroundColor":
                break;
            case "backgroundImage":
                break;
        }
    }
}