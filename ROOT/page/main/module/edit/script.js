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
        //背景色
        this.pageColorCheckDom = cp.query('.background-color-check-value', this.pageDom);
        this.pageColorDom = cp.query('.background-color-value', this.pageDom);
        this.pageColorTextDom = cp.query('.background-color-text-value', this.pageDom);
        //背景图
        this.pageImageCheckDom = cp.query('.background-image-check-value', this.pageDom);
        this.pageImageDom = cp.query('.background-image-value', this.pageDom);
        //背景填充方式
        this.pageImageFillDom = cp.query('.background-image-fill-value', this.pageDom);
        this.pageImageFillOptionDoms = cp.query("option", this.pageImageFillDom, true);

        //翻页效果
        this.pageFlipOverDom = cp.query('.flip-over-value', this.pageDom);

        this.pageCover = cp.query('.cover-value', this.pageDom);
        this.pageComment = cp.query('.comment-value', this.pageDom);
    }

    EVENT() {
        cp.on('.pageTab', DOMAIN, 'click', t => this.activePageEdit(t));
        cp.on('.componentTab', DOMAIN, 'click', t => this.activeComponentEdit(t));
        //改变页面参数
        cp.on('.value', this.pageDom, 'change', t => this.changePage(t));
        //另存为模板
        cp.on('.saveTemplate-btn', this.pageDom, 'click', t => this.saveTemplate());
        //改变组件参数
        cp.on('.value', this.componentDom, 'change', t => this.changeComponent(t));
        //编辑器
        cp.on('.dataEdit', this.componentDom, 'click', () => this.showDataEdit());
    }

    INIT() {
        this.fontFamily = [
            {name: "默认", value: ""},
            {name: "雅黑", value: "雅黑"},
            {name: "宋体", value: "宋体"},
        ];
        //TODO 根据数据加载右侧页面配置
        //this.initPagePanel();
    }

    //保存为模板
    saveTemplate() {
        let name = this.APP.scene.page.name;
        let data = JSON.stringify(this.APP.scene);

        cp.ajax(CONF.IxDAddr + "/template/add", {
            data: {
                name: name,
                data: data
            },
            success: res => {


            }
        })
    }

    showDataEdit() {
        let id = this.componentDom.id.split("_")[1];
        let componentData = this.APP.getComponentData(id);
        let data = componentData.data;
        MODULE("table").init(data, data => {
            componentData.data = data;
            this.setComponentEntity(id, "data", data, this.componentDom.name);
        });
        this.APP.dataEditShow();
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

        //背景图填充方式
        else if (cp.hasClass(target, "background-image-fill-value")) {
            this.pageImageCheckDom.checked = true;
            pageData.background.fill = target.value;
            MODULE("canvas").setBackgroundFill();
        }
        //背景上传
        else if (cp.hasClass(target, "background-image-value")) {
            this.pageImageCheckDom.checked = true;
            MODULE("upload").upload(target, res => {
                pageData.background.image = res.url;
                MODULE("canvas").setBackgroundImage();
            })
        }
        //背景图开启
        else if (cp.hasClass(target, "background-image-check-value")) {
            if (!target.checked) {
                pageData.background.image = "";
                this.pageImageDom.value = null;
                MODULE("canvas").setBackgroundImage();
            }
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
        //修改字体大小
        else if (cp.hasClass(target, "font-size-value")) {
            componentData.font.size = target.value;
            this.setComponent("fontSize")
        }
        //修改字体样式
        else if (cp.hasClass(target, "font-family-value")) {
            componentData.font.family = target.value;
            this.setComponent("fontFamily")
        }
        //修改字体
        else if (cp.hasClass(target, "font-color-value")) {
            target.nextSibling.value = target.value;
            componentData.font.color = target.value;
            this.setComponent("fontColor")
        }
        //修改字体颜色文本
        else if (cp.hasClass(target, "font-color-text-value")) {
            target.previousSibling.value = target.value;
            componentData.font.color = target.value;
            this.setComponent("fontColor")
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

            //对文件的特殊处理
            if (target.type === "file") {
                //TODO 超大，则使用文件码
                //调用上传组件
                MODULE("upload").upload(target, res => {
                    value = res.type + "||" + res.url;
                    componentData.option.some(v => {
                        if (v.key === key) {
                            v.value = value;
                            return true
                        }
                    });
                    //通知到组件
                    this.setComponentEntity(id, key, value, this.componentDom.name);
                });
                return;
            }

            //映射到数据文件
            let keyArr = key.split("/");
            if (keyArr.length === 2) {
                componentData.option.some(v => {
                    if (v.key === keyArr[0]) {
                        v.value[keyArr[1]] = value;
                        return true
                    }
                });
            } else {
                //保存配置
                componentData.option.some(v => {
                    if (v.key === key) {
                        v.value = value;
                        return true
                    }
                });
            }
            //通知到组件
            this.setComponentEntity(id, key, value, this.componentDom.name);
        }
    }

    //设置组件
    setComponentEntity(id, key, value, name) {
        try {
            cp.componentEntity.get(id).OPTION(key, value);
        } catch (e) {
            cp.log("组件 " + name + " 内部出错，错误组件的实体 " + id, "error");
            console.error(e);
        }
    }

    getComponentDomPosition() {
        this.compWidthDom = cp.query('.width-value', this.componentDom);
        this.compHeightDom = cp.query('.height-value', this.componentDom);
        this.compTopDom = cp.query('.top-value', this.componentDom);
        this.compLeftDom = cp.query('.left-value', this.componentDom);
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

    deleteComponentEdit() {
        cp.html(this.componentDom, `<div class="info centerWrap">请选中一个组件</div>`);
    }

    activeComponentEdit(target) {
        cp.toggleActive(target);
        cp.show(this.componentDom);
        cp.hide(this.pageDom);
    }

    activeComponentEditById(id) {

        console.log("--------->加载左侧编辑器，不要重复");

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

        //背景色
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

        //背景图
        if (pageData.background.image) {
            cp.attr(this.pageImageCheckDom, {
                checked: true
            });
        }
        this.pageImageFillOptionDoms[parseInt(pageData.background.fill)].selected = true;

        //this.pageFlipOver = pageData.flipOver;
        this.pageCover.src = pageData.cover;
        this.pageComment.value = pageData.comment;
    }

    /**
     *
     * @param data
     */
    initComponentPanel(data) {
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
                <div class="br"></div>
                <div class="name">顶距</div>
                <input class="value input top-value" type="number" value="${data.position.top}">
                <div class="name">侧距</div>
                <input class="value input left-value" type="number" value="${data.position.left}">
            </div>`;
        cp.html(this.componentDom, positionHtml, "beforeend");

        //背景
        let backgroundHtml = `
            <div class="row backgroundColor">
                <div class="name">背景色</div>
                <input type="checkbox" class="value input background-color-check-value" ${data.background.color ? " checked" : ""} ><input 
                    type="color" class="value input background-color-value" value="${data.background.color || "#ffffff"}"><input 
                        type="text" class="value input background-color-text-value"  value="${data.background.color}">
            </div>
            <div class="row image">
                <div class="name">背景图</div>
                <input type="checkbox" class="value input background-image-check-value">
                <select class="value input background-image-fill-value">
                    <option selected>原尺寸</option>
                    <option>等比拉伸</option>
                    <option>完全填充</option>
                </select>
                <input type="file" class="value input background-image-value" value="${data.background.image}">
            </div>
        `;
        cp.html(this.componentDom, backgroundHtml, "beforeend");

        //字体
        let fontHtml = `
                        <div class="row font">
                            <div class="name">字体</div>
                            <input type="number" class="value input font-size-value" value="${data.font.size}">
                            <select class="value input font-family-value">
                                ${this.fontFamily.map(fv => {
            return `<option ${fv.value === data.font.family ? "selected" : ""} value="${fv.value}">${fv.name}</option>`
        })}
                            </select>
                            <div class="br"></div>
                            <div class="name">字颜色</div>
                            <input type="color" class="value input font-color-value" value="${data.font.color}"><input 
                                    type="text" class="value input font-color-text-value" value="${data.font.color}">
                        </div>
                    `;
        cp.html(this.componentDom, fontHtml, "beforeend");

        //其他数据
        let editHtml = `<div class="hr">专有配置</div>`;

        //是否有data数据
        if (data.data) {
            editHtml += `
                    <div class="row data">
                        <div class="name">数据</div>
                        <button class="value input dataEdit">数据编辑器</button>
                    </div>
                    `;
        }

        data.option.forEach(v => {
            switch (v.type) {
                //文本输入
                case "text":
                    editHtml += `
                        <div class="row ${v.type}">
                            <div class="name">${v.name}</div>
                            <input type="text" class="value input" data-id="${v.key}" value="${v.value}">
                        </div>
                    `;
                    break;

                //字体选择
                case "font":
                    editHtml += `
                        ${v.title ? `<div class="small-title">${v.title}</div>` : ""}
                        <div class="row ${v.type}">
                            <div class="name">字体</div>
                            <input type="number" class="value input" data-id="${v.key}/size" value="${v.value.size}">
                            <select class="value input" data-id="${v.key}/family">
                                ${this.fontFamily.map(fv => {
                        return `<option ${fv.value === v.value.family ? "selected" : ""} value="${fv.value}">${fv.name}</option>`
                    })}
                            </select>
                        </div>
                        <div class="br"></div>
                        <div class="row ${v.type}">
                            <div class="name">字色</div>
                            <input type="color" class="value input" data-id="${v.key}/color" value="${v.value.color}"><input 
                                    type="text" class="value input" data-id="${v.key}/color" value="${v.value.color}">
                        </div>
                    `;
                    break;

                //排版
                case "compose":
                    editHtml += `
                        <div class="row ${v.type}">
                            <div class="name">字间距</div>
                            <input type="number" class="value input" data-id="${v.key}/letterSpacing" value="${v.value.letterSpacing}">
                            <div class="name">行高</div>
                            <input type="number" class="value input" data-id="${v.key}/lineHeight" value="${v.value.lineHeight}">
                        </div>
                    `;
                    break;

                //数字输入
                case "number":
                    editHtml += `
                        <div class="row ${v.type}">
                            <div class="name">${v.name}</div>
                            <input type="number" class="value input" data-id="${v.key}" value="${v.value}">
                        </div>
                    `;
                    break;

                //对齐选择
                case "align":
                    let align = [
                        {name: "居左", value: "left"},
                        {name: "居右", value: "right"},
                        {name: "居中", value: "center"}
                    ];
                    editHtml += `
                        <div class="row ${v.type}">
                            <div class="name">${v.name}</div>
                            <select class="value input" data-id="${v.key}">
                            ${align.map(fv => {
                        return `<option ${fv.value === v.value ? "selected" : ""} value="${fv.value}">${fv.name}</option>`
                    })}
                            </select>
                        </div>
                    `;
                    break;

                //文本域名
                case "textarea":
                    editHtml += `
                    <div class="row ${v.type}">
                        <div class="name">${v.name}</div>
                        <textarea class="value input" data-id="${v.key}">${v.value}</textarea>
                    </div>
                    `;
                    break;

                //文件
                case "file":
                    editHtml += `
                    <div class="row ${v.type}">
                        <div class="name">${v.name}</div>
                        <input type="file" class="value input" data-id="${v.key}" data-value="${v.value}">
                    </div>
                    `;
                    break
            }
        });
        editHtml && cp.html(this.componentDom, editHtml, "beforeend");
        //激活组件面板
        this.activeComponentEdit(this.componentTabDom);
        //获取定位，这里是为了组件拖拽的反馈
        this.getComponentDomPosition();
    }

    changePosition(id) {
        let component = this.APP.getComponentData(id);
        this.compTopDom.value = component.position.top;
        this.compLeftDom.value = component.position.left;
    }

    changeSize(id) {
        let component = this.APP.getComponentData(id);
        this.compWidthDom.value = component.size.width;
        this.compHeightDom.value = component.size.height;
        //通知到组件，有时候组件胡需要大小变化信息，比如echarts
        this.setComponentEntity(id, "width", component.size.width, this.componentDom.name);
        this.setComponentEntity(id, "height", component.size.height, this.componentDom.name);
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
                this.setComponentEntity(id, "width", componentData.size.width, this.componentDom.name);
                break;
            case "height":
                cp.css(componentDom, {
                    height: componentData.size.height + "px"
                });
                this.setComponentEntity(id, "width", componentData.size.height, this.componentDom.name);
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
            case "fontSize":
                cp.css(componentDom, {
                    fontSize: componentData.font.size + "px"
                });
                break;
            case "fontColor":
                cp.css(componentDom, {
                    color: componentData.font.color
                });
                break;
            case "fontFamily":
                cp.css(componentDom, {
                    fontFamily: componentData.font.family
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