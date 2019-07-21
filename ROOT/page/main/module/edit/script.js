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
        this.pageColorCheckDom = cp.query('.background-color-check-value', this.pageDom);
        this.pageColorDom = cp.query('.background-color-value', this.pageDom);
        this.pageColorTextDom = cp.query('.background-color-text-value', this.pageDom);
        this.pageImage = cp.query('.background-image-value', this.pageDom);
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

    /**
     * 改变页面
     * @param target
     */
    changePage(target) {
        let pageData = this.APP.getPageData();
        //TODO 修改页面名称
        if (cp.hasClass(target, "name-value")) {
            pageData.name = target.value;
        }

        //修改页面宽度
        else if (cp.hasClass(target, "width-value")) {
            pageData.size.width = target.value;
            let width = target.value;
            let height = this.pageHeight.value;
            MODULE("canvas").setSize(width, height);
        }

        //修改页面高度
        else if (cp.hasClass(target, "height-value")) {
            pageData.size.height = target.value;
            let width = this.pageWidth.value;
            let height = target.value;
            MODULE("canvas").setSize(width, height);
        }

        //TODO 修改页面填充方式
        else if (cp.hasClass(target, "fill-value")) {
            pageData.fill = target.value;
        }

        //修改页面背景颜色的开启状态
        else if (cp.hasClass(target, "background-color-check-value")) {
            if (!target.checked) {
                this.pageColorDom.value = "#ffffff";
                this.pageColorTextDom.value = "";
                pageData.background.color = "";
                //修改画布颜色
                MODULE("canvas").setBackgroundColor();
            }
        }

        //修改页面背景颜色颜色
        else if (cp.hasClass(target, "background-color-value")) {
            //打钩勾
            this.pageColorCheckDom.checked = true;
            pageData.background.color = target.value;
            this.pageColorTextDom.value = target.value;
            //修改画布颜色
            MODULE("canvas").setBackgroundColor();
        }

        //修改页面背景颜色文本
        else if (cp.hasClass(target, "background-color-text-value")) {
            //打钩勾
            this.pageColorCheckDom.checked = true;
            pageData.background.color = target.value;
            this.pageColorDom.value = target.value;
            //修改画布颜色
            MODULE("canvas").setBackgroundColor();
        }

        //TODO 修改背景图
        else if (cp.hasClass(target, "image-value")) {
            pageData.background.image = target.value;
        }
    }

    /**
     * 改变组件
     * @param target
     */
    changeComponent(target) {
        //通知到组件
        let id = this.componentDom.id.split("_")[1];
        let componentData = this.APP.getComponentData(id);
        //修改宽度
        if (cp.hasClass(target, "width-value")) {
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
        //修改背景颜色的开启状态
        else if (cp.hasClass(target, "background-color-check-value")) {
            if (!target.checked) {
                cp.query("INPUT", target.parentNode, true).forEach((v, i) => {
                    if (i === 1) {
                        v.value = "#ffffff";
                    }
                    if (i === 2) {
                        v.value = "";
                    }
                });
                componentData.background.color = "";
                this.setComponent("backgroundColor")
            }
        }
        //修改背景颜色颜色
        else if (cp.hasClass(target, "background-color-value")) {
            //打钩
            target.previousSibling.checked = true;
            target.nextSibling.value = target.value;
            componentData.background.color = target.value;
            this.setComponent("backgroundColor")
        }
        //修改背景颜色文本
        else if (cp.hasClass(target, "background-color-text-value")) {
            //打钩
            target.previousSibling.previousSibling.checked = true;
            target.previousSibling.value = target.value;
            componentData.background.color = target.value;
            this.setComponent("backgroundColor")
        }
        //TODO 修改背景图
        else if (cp.hasClass(target, "image-value")) {
            componentData.background.image = target.value;
            this.setComponent("backgroundImage")
        }
        //专有配置
        else {
            let key = cp.getData(target, "id");
            let value = target.value;

            //映射到数据文件
            let keyArr = key.split("/");
            if (keyArr.length === 2) {
                componentData.data.some(v => {
                    if (v.key === keyArr[0]) {
                        v.value[keyArr[1]] = value;
                        return true
                    }
                });
            } else {
                componentData.data.some(v => {
                    if (v.key === key) {
                        v.value = value;
                        return true
                    }
                })
            }

            //通知到组件
            try {
                cp.componentEntity.get(id).OPTION(key, value);
            } catch (e) {
                cp.log("组件 " + this.componentDom.name + " 内部出错，错误组件的实体 " + id, "error");
                console.error(e);
            }
        }
    }

    getComponentDom() {
        /*this.compName = cp.query('.name-value', this.componentDom);*/
        this.compWidth = cp.query('.width-value', this.componentDom);
        this.compHeight = cp.query('.height-value', this.componentDom);
        this.compTop = cp.query('.top-value', this.componentDom);
        this.compLeft = cp.query('.left-value', this.componentDom);
    }

    activePageEdit(target) {
        cp.toggleActive(target);
        cp.show(this.pageDom);
        cp.hide(this.componentDom);

        cp.html(this.componentDom, `<div class="info centerWrap">请选中一个组件</div>`);

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

        if (pageData.background.color) {
            cp.attr(this.pageColorCheckDom, {
                checked: true
            });
            this.pageColorDom.value = pageData.background.color;
            this.pageColorTextDom.value = pageData.background.color;
        } else {
            this.pageColorDom.value = "#ffffff";
            this.pageColorTextDom.value = "";
        }

        //this.pageFlipOver = pageData.flipOver;
        this.pageCover.src = pageData.cover;
        this.pageComment.value = pageData.comment;
    }

    /**
     *
     * @param data
     */
    initComponentPanel(data) {

        console.log(data);

        cp.html(this.componentDom, `<div class="hr">${data.title}</div>`);
        //id
        this.componentDom.id = "edit_" + data.id;
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
                <input type="checkbox" class="value input background-color-check-value" ${data.background.color ? " checked" : ""} ><input 
                    type="color" class="value input background-color-value" value="${data.background.color || "#ffffff"}"><input 
                        type="text" class="value input background-color-text-value"  value="${data.background.color}">
            </div>
            <div class="row image">
                <div class="name">背景图</div>
                <input type="checkbox" class="value input background-image-check-value"><input 
                    type="text" class="value input background-image-value" readonly value="${data.background.image}"><select 
                        class="value input background-image-fill-value">
                    <option selected>原尺寸</option>
                    <option>等比拉伸</option>
                    <option>完全填充</option>
                </select>
            </div>
        `;
        cp.html(this.componentDom, backgroundHtml, "beforeend");

        //其他数据
        let editHtml = `<div class="hr">专有配置</div>`;
        data.data.forEach(v => {
            switch (v.type) {
                case "color"://颜色
                    editHtml += `
                        <div class="row color">
                            <div class="name">${v.name}</div>
                            <input type="color" class="value input" data-id="${v.key}" value="${v.value}">
                            <input type="text" class="value input" data-id="${v.key}" value="${v.value}">
                        </div>
                    `;
                    break;
                case "text"://文本输入
                    editHtml += `
                        <div class="row text">
                            <div class="name">${v.name}</div>
                            <input type="text" class="value input" data-id="${v.key}" value="${v.value}">
                        </div>
                    `;
                    break;
                case "font"://字体选择
                    let fontFamily = [
                        {name: "默认", value: ""},
                        {name: "雅黑", value: "雅黑"},
                        {name: "宋体", value: "宋体"},
                    ];
                    editHtml += `
                        <div class="row font">
                            <div class="name">字体</div>
                            <input type="number" class="value input" data-id="${v.key}/size" value="${v.value.size}">
                            <input type="color" class="value input" data-id="${v.key}/color" value="${v.value.color}">
                            <select class="value input" data-id="${v.key}/family">
                                ${fontFamily.map(fv => {
                        return `<option ${fv.value === v.value.family ? "selected" : ""} value="${fv.value}">${fv.name}</option>`
                    })}
                            </select>
                        </div>
                    `;
                    break;
                case "number"://数字输入
                    editHtml += `
                        <div class="row number">
                            <div class="name">${v.name}</div>
                            <input type="number" class="value input" data-id="${v.key}" value="${v.value}">
                        </div>
                    `;
                    break;
                case "align"://对齐选择
                    let align = [
                        {name: "居左", value: "left"},
                        {name: "居右", value: "right"},
                        {name: "居中", value: "center"}
                    ];
                    editHtml += `
                        <div class="row align">
                            <div class="name">${v.name}</div>
                            <select class="value input" data-id="${v.key}">
                            ${align.map(fv => {
                        return `<option ${fv.value === v.value ? "selected" : ""} value="${fv.value}">${fv.name}</option>`
                    })}
                            </select>
                        </div>
                    `;
                    break;
            }
        });
        editHtml && cp.html(this.componentDom, editHtml, "beforeend");
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

    /**
     * 设置组件公共配置
     * @param key
     */
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
                componentData.background.color ? cp.css(componentDom, {
                    backgroundColor: componentData.background.color
                }) : cp.css(componentDom, {
                    backgroundColor: null
                });
                break;
            case "backgroundImage":
                break;
            default:
                cp.log("无效配置", "warn");
                break
        }
    }
}