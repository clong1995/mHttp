class Module {
    DOM() {
        this.tooBarDom = cp.query('.tool-bar', DOMAIN);
        this.rangeBoxDom = cp.query('.range-box', this.tooBarDom);
        this.rangeBomNumberDom = cp.query('.number', this.rangeBoxDom);
        this.rangeBomRangeDom = cp.query('.range', this.rangeBoxDom);
        this.axisBoxDom = cp.query('.axis-box', this.tooBarDom);
        this.gridBoxDom = cp.query('.grid-box', this.tooBarDom);
        this.riftBoxDom = cp.query('.rift-box', this.tooBarDom);
        this.riftBoxNumberDoms = cp.query('.number', this.riftBoxDom, true);

        this.axisLineDoms = cp.query('.axis-line', DOMAIN, true);
    }

    INIT() {
        this.sceneDom = null;
        this.scale = 0;
        this.autoScale = true;
        this.riftDomArr = [];
        this.toolBarHeight = 20;
        this.rulerWidth = 15;
        this.gridDom = null;

        this.loadScene();
        this.loadGridDom();
        this.loadRift();
        this.loadRange();
    }

    EVENT() {
        //slice
        cp.on('.slice', this.sceneDom, 'drag', t => this.dragSlice(t));
        cp.on('.slice', this.sceneDom, 'resize', t => this.resizeSlice(t));

        cp.on(".slice", this.sceneDom, 'mousedown', t => this.toggleActive(t));

        //移动标尺线
        cp.on('.line-X', DOMAIN, 'drag', t => {
        });
        cp.on('.line-Y', DOMAIN, 'drag', t => {
        });
        //标尺线
        cp.on('.checkbox', this.axisBoxDom, 'click', t => this.toggleAxisLine(t));
        //网格子
        cp.on('.checkbox', this.gridBoxDom, 'click', t => this.toggleGrid(t));
        //屏幕拼缝
        cp.on('.checkbox', this.riftBoxDom, 'click', t => this.toggleRift(t));
        cp.on('.number', this.riftBoxDom, 'change', () => this.changeRift());
        //缩放
        cp.on('.number', this.rangeBoxDom, 'change', t => this.changeRange(t));
        cp.on('.range', this.rangeBoxDom, 'change', t => this.changeRange(t));
        cp.on('.checkbox', this.rangeBoxDom, 'click', t => this.changeScale(t));
    }

    dragSlice(target) {
        let id = target.id.split("_")[1];
        //改变保存的数据
        let component = this.APP.getComponentData(id);
        component.position.top = parseInt(target.style.top);
        component.position.left = parseInt(target.style.left);
        //改变右侧的配置
        MODULE("edit").changePosition(id);
    }

    resizeSlice(target) {
        let id = target.id.split("_")[1];
        //改变保存的数据
        let component = this.APP.getComponentData(id);
        component.size.width = parseInt(target.style.width);
        component.size.height = parseInt(target.style.height);
        //改变右侧的配置
        MODULE("edit").changeSize(id);
    }

    changeScale(target) {
        let checked = target.checked;
        if (checked) {
            //开启缩放
            cp.removeClass([this.rangeBomNumberDom, this.rangeBomRangeDom], 'disable');
            this.autoScale = false;
        } else {
            //还原缩放
            cp.addClass([this.rangeBomNumberDom, this.rangeBomRangeDom], 'disable');
            this.autoScale = true;
            this.sceneSize();
        }
    }

    changeRange(target) {
        let value = target.value;
        //改变数字
        cp.hasClass(target, 'number')
            ? this.rangeBomRangeDom.value = value
            : this.rangeBomNumberDom.value = value;

        //改变缩放
        this.sceneSize(value / 100);
    }

    loadRange() {
        this.rangeBomNumberDom.value = parseInt(this.scale * 100);
        this.rangeBomRangeDom.value = parseInt(this.scale * 100);
    }

    changeRift() {
        let row = this.riftBoxNumberDoms.item(0).value,
            column = this.riftBoxNumberDoms.item(1).value;
        this.loadRift(row, column);
    }

    toggleRift(target) {
        let checked = target.checked;
        if (checked) {
            cp.show(this.riftDomArr);
            cp.removeClass(this.riftBoxNumberDoms, 'disable')
        } else {
            cp.hide(this.riftDomArr);
            cp.addClass(this.riftBoxNumberDoms, 'disable')
        }
    }

    toggleAxisLine(target) {
        let checked = target.checked;

        if (checked) {
            cp.show(this.axisLineDoms);
            if (!this.axisLineDoms[0].style.top) {
                let size = cp.domSize(DOMAIN);
                cp.css(this.axisLineDoms[0], {
                    top: size.height / 2 + 'px'
                });
                cp.css(this.axisLineDoms[1], {
                    left: size.width / 2 + 'px'
                })
            }
        } else {
            cp.hide(this.axisLineDoms);
        }
    }

    toggleGrid(target) {
        let checked = target.checked;
        if (checked) {
            cp.show(this.gridDom);
        } else {
            cp.hide(this.gridDom);
        }
    }

    getProjectData() {

        //请求当前project的信息

    }

    //加载场景
    loadScene() {
        //加载场景
        this.sceneDom = cp.createDom();
        cp.addClass(this.sceneDom, 'scene');
        let pageData = this.APP.getPageData();
        cp.css(this.sceneDom, {
            width: pageData.size.width + 'px',
            height: pageData.size.height + 'px',
        });
        this.sceneSize(this.autoScale ? null : this.scale);
        cp.append(DOMAIN, this.sceneDom);
        //加载组件
        this.loadComponent(this.APP.scene.components);
        //重新计算大小
        window.onresize = () => this.sceneSize(this.autoScale ? null : this.scale);
    }

    //加载组件
    loadComponent(data) {
        data.forEach(v => {
            //组件
            this.addSlice(v);
        });
    }

    //加载网格
    loadGridDom() {
        this.gridDom = cp.createDom();
        cp.addClass(this.gridDom, ['grid', 'hide']);
        cp.css(this.gridDom, {
            backgroundSize: (20 * (1 / this.scale)) + 'px ' + (20 * (1 / this.scale)) + 'px'
        });
        cp.append(this.sceneDom, this.gridDom);
    }

    //加载拼缝
    loadRift(row = 0, column = 0) {
        row++;
        column++;
        //清除拼缝
        cp.remove(this.riftDomArr);
        this.riftDomArr = [];
        let pageData = this.APP.getPageData();
        //重新建立
        if (row > 1) {
            let rowPlus = pageData.size.height / row;
            let rowDom = cp.createDom();
            cp.addClass(rowDom, 'row');
            for (let r = 1; r < row; ++r) {
                let newRowDom = rowDom.cloneNode();
                cp.css(newRowDom, {
                    top: rowPlus * r + 'px',
                    height: 1 / this.scale + 'px'
                });
                cp.append(this.sceneDom, newRowDom);
                this.riftDomArr.push(newRowDom);
            }
        }

        if (column > 1) {
            let columnPlus = pageData.size.width / column;
            let columnDom = cp.createDom();
            cp.addClass(columnDom, 'column');
            for (let c = 1; c < column; ++c) {
                let newColumnDom = columnDom.cloneNode();
                cp.css(newColumnDom, {
                    left: columnPlus * c + 'px',
                    width: 1 / this.scale + 'px'
                });
                cp.append(this.sceneDom, newColumnDom);
                this.riftDomArr.push(newColumnDom);
            }
        }
    }

    setSize(width, height) {
        this.autoScale = true;

        let pageData = this.APP.getPageData();

        pageData.size.width = width;
        pageData.size.height = height;

        cp.css(this.sceneDom, {
            width: pageData.size.width + 'px',
            height: pageData.size.height + 'px',
        });

        this.sceneSize();
    }

    sceneSize(scale = null) {
        //获取容器大小
        let {width, height} = cp.domSize(DOMAIN);
        let cWidth = width - (this.rulerWidth + 1) * 2,
            cHeight = height - (this.rulerWidth + this.toolBarHeight + 1) * 2;
        let size = {};

        let pageData = this.APP.getPageData();

        //不指定缩放大小，
        if (!scale && this.autoScale) {
            size = cp.autoSize({
                w: cWidth, h: cHeight
            }, {
                w: pageData.size.width, h: pageData.size.height
            })
        } else {
            //指定缩放大小
            size.scale = scale;
            //缩放后的感官大小
            let sWidth = pageData.size.width * scale,
                sHeight = pageData.size.height * scale;
            size.l = (cWidth - sWidth) / 2;
            size.t = (cHeight - sHeight) / 2;
        }

        this.scale = size.scale;

        //适应分割线的宽度
        this.riftDomArr.forEach(v => v.style.width
            ? v.style.width = 1 / this.scale + 'px'
            : v.style.height = 1 / this.scale + 'px');

        //适应网格
        if (this.gridDom)
            this.gridDom.style.backgroundSize = (20 / this.scale) + 'px ' + (20 / this.scale) + 'px';

        //返回大小
        cp.css(this.sceneDom, {
            zoom: this.scale,
            top: (size.t + this.rulerWidth + this.toolBarHeight - (this.toolBarHeight - this.rulerWidth) / 2) / this.scale + 'px',
            left: (size.l + this.rulerWidth + this.rulerWidth / 2) / this.scale + 'px',
            //适应背景大小
            backgroundSize: (20 / this.scale) + 'px ' + (20 / this.scale) + 'px'
        });

        this.rangeBomRangeDom.value = this.rangeBomNumberDom.value = parseInt(this.scale * 100);
    }

    /**
     *
     * @param data 组件容器的数据
     * @param dom  组件容器的dom
     * @param single 是否选中
     */
    addSlice(data, dom, single = false) {
        //增加一片
        let sliceDom = cp.createDom("div", {
            id: "slice_" + data.id,
            class: "slice"
        });
        let index = cp.query(".slice", this.sceneDom, true).length + 1;
        data.index = index;

        cp.css(sliceDom, {
            top: data.position.top + "px",
            left: data.position.left + "px",
            width: data.size.width + "px",
            height: data.size.height + "px",
            zIndex: index
        });
        cp.html(sliceDom, dom);
        cp.append(this.sceneDom, sliceDom);

        //图层
        MODULE("coverage").addLayer(data);
        single && this.toggleActive(sliceDom);
    }


    toggleActive(target) {
        let idstr = target.id;
        let id = idstr.split("_")[1];
        cp.toggleActive(target);
        MODULE("coverage").toggleActiveById(id);
        MODULE("edit").activeComponentEditById(id);
    }

    toggleActiveById(id) {
        let sliceDom = cp.query("#slice_" + id, this.sceneDom);
        cp.toggleActive(sliceDom)
    }

    removeActiveById(id) {
        let sliceDom = cp.query("#slice_" + id, this.sceneDom);
        cp.removeActive(sliceDom)
    }
}