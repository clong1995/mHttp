class Module {
    DOM() {
        this.tooBarDom = cp.query('.tool-bar', DOMAIN);
        this.rangeBoxDom = cp.query('.range-box', this.tooBarDom);
        this.rangeBoxCheckboxDom = cp.query('.checkbox', this.rangeBoxDom);
        this.rangeBoxNumberDom = cp.query('.number', this.rangeBoxDom);
        this.rangeBoxRangeDom = cp.query('.range', this.rangeBoxDom);
        this.axisBoxDom = cp.query('.axis-box', this.tooBarDom);
        this.gridBoxDom = cp.query('.grid-box', this.tooBarDom);
        this.riftBoxDom = cp.query('.rift-box', this.tooBarDom);
        this.riftBoxNumberDoms = cp.query('.number', this.riftBoxDom, true);
        this.axisLineDoms = cp.query('.axis-line', DOMAIN, true);
        this.containerDom = cp.query('.container', DOMAIN);
    }

    INIT() {
        this.sceneDom = null;
        this.scale = 0;
        this.autoScale = true;
        this.riftDomArr = [];
        this.sceneMargin = 10;
        this.gridDom = null;
        this.ctrlMousewheel = false;

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

        //滚轮缩放
        document.onkeydown = e => this.keydownScale(e);
        document.onkeyup = e => this.keyupScale(e);
        cp.on('.container', DOMAIN, 'mousewheel', (_, __, e) => this.mousewheelScale(e));

    }

    /**
     * 拖拽
     * @param target
     */
    dragSlice(target) {
        let id = target.id.split("_")[1];
        //改变保存的数据
        let component = this.APP.getComponentData(id);
        component.position.top = parseInt(target.style.top);
        component.position.left = parseInt(target.style.left);
        //改变右侧的配置
        MODULE("edit").changePosition(id);
    }

    /**
     * 改变大小
     * @param target
     */
    resizeSlice(target) {
        let id = target.id.split("_")[1];
        //改变保存的数据
        let component = this.APP.getComponentData(id);
        component.size.width = parseInt(target.style.width);
        component.size.height = parseInt(target.style.height);
        //改变右侧的配置
        MODULE("edit").changeSize(id);
    }

    /**
     * 改变缩放
     * @param target
     */
    changeScale(target) {
        let checked = target.checked;
        if (checked) {
            //开启缩放
            cp.removeClass([this.rangeBoxNumberDom, this.rangeBoxRangeDom], 'disable');
            this.autoScale = false;
        } else {
            //还原缩放
            cp.addClass([this.rangeBoxNumberDom, this.rangeBoxRangeDom], 'disable');
            this.autoScale = true;
            this.sceneSize();
        }
    }


    keydownScale(e) {
        if (e.key === "Control") {
            this.ctrlMousewheel = true
        }
    }

    keyupScale(e) {
        if (e.key === "Control") {
            this.ctrlMousewheel = false
        }
    }


    mousewheelScale(e) {
        //按住ctrl
        if (!this.ctrlMousewheel) return;

        //开启手动
        this.rangeBoxCheckboxDom.checked = true;
        this.changeScale(this.rangeBoxCheckboxDom);
        //this.autoScale = false;
        //获取缩放级别
        let scale = this.rangeBoxNumberDom.value;
        e.wheelDelta > 0 ? ++scale : --scale;
        if (scale > 100) {
            scale = 100;
        }
        if (scale < 1) {
            scale = 1;
        }

        this.rangeBoxNumberDom.value = scale;
        this.rangeBoxRangeDom.value = scale;

        this.sceneSize(scale / 100);
    }

    /**
     * 改变缩放范围
     * @param target
     */
    changeRange(target) {
        let value = target.value;
        //改变数字
        cp.hasClass(target, 'number')
            ? this.rangeBoxRangeDom.value = value
            : this.rangeBoxNumberDom.value = value;

        //改变缩放
        this.sceneSize(value / 100);
    }

    /**
     * 加载范围
     */
    loadRange() {
        this.rangeBoxNumberDom.value = parseInt(this.scale * 100);
        this.rangeBoxRangeDom.value = parseInt(this.scale * 100);
    }

    /**
     * 改变拼缝
     */
    changeRift() {
        let row = this.riftBoxNumberDoms.item(0).value,
            column = this.riftBoxNumberDoms.item(1).value;
        this.loadRift(row, column);
    }

    /**
     * 切换拼缝
     * @param target
     */
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

    /**
     * 辅助线
     * @param target
     */
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

    /**
     * 网格
     * @param target
     */
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

    /**
     * 加载场景
     */
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

        cp.append(this.containerDom, this.sceneDom);
        //加载组件
        //this.loadComponent(this.APP.scene.components);
        //重新计算大小
        window.onresize = () => this.sceneSize(this.autoScale ? null : this.scale);
    }

    /**
     * 加载网格
     */
    loadGridDom() {
        this.gridDom = cp.createDom();
        cp.addClass(this.gridDom, ['grid', 'hide']);
        cp.css(this.gridDom, {
            backgroundSize: (20 * (1 / this.scale)) + 'px ' + (20 * (1 / this.scale)) + 'px'
        });
        cp.append(this.sceneDom, this.gridDom);
    }

    /**
     * 加载拼缝
     * @param row
     * @param column
     */
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

    /**
     * 改变大小
     * @param width
     * @param height
     */
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

    /**
     * 场景大小
     * @param scale
     */
    sceneSize(scale = null) {

        //获取容器大小
        let {width, height} = cp.domSize(this.containerDom);

        let size = {};

        let pageData = this.APP.getPageData();

        //不指定缩放大小，
        if (scale === null && this.autoScale) {
            size = cp.autoSize({
                w: width, h: height
            }, {
                w: parseInt(pageData.size.width) + 2, h: parseInt(pageData.size.height) + 2
            }, this.sceneMargin)
        } else {
            //指定缩放大小
            size.scale = scale;
            //缩放后的感官大小
            let sWidth = pageData.size.width * scale,
                sHeight = pageData.size.height * scale;
            //中心缩放
            size.l = (width - sWidth) / 2;
            size.t = (height - sHeight) / 2;
            if (width < sWidth) {
                size.l = 0;
            }

            if (height < sHeight) {
                size.t = 0;
            }
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
            top: size.t / this.scale + 'px',
            left: size.l / this.scale + 'px',
            //适应背景大小
            backgroundSize: (20 / this.scale) + 'px ' + (20 / this.scale) + 'px'
        });

        this.rangeBoxRangeDom.value = this.rangeBoxNumberDom.value = this.scale.toFixed(2) * 100;
    }

    /**
     * 添加组件外壳
     * @param data 组件容器的数据
     * @param html  组件容器的html
     * @param single 是否选中
     */
    addSlice(data, html, single = false) {
        //增加一片
        let sliceDom = cp.createDom("div", {
            id: "slice_" + data.id,
            class: "slice slice-" + data.name
        });
        let index = cp.query(".slice", this.sceneDom, true).length + 1;
        data.index = index;
        //设置外壳配置
        cp.css(sliceDom, {
            top: data.position.top + "px",
            left: data.position.left + "px",
            width: data.size.width + "px",
            height: data.size.height + "px",
            zIndex: index,
            backgroundColor: data.background.color,
            fontSize: data.font.size + "px",
            fontFamily: data.font.family,
            color: data.font.color
        });

        //把html放到容器里
        cp.html(sliceDom, html);
        cp.append(this.sceneDom, sliceDom);
        //执行
        //console.log(cp.componentEntity.get(data.id));
        //图层
        MODULE("coverage").addLayer(data);
        single && this.toggleActive(sliceDom);
    }

    /**
     * 设置背景颜色
     */
    setBackgroundColor() {
        let pageData = this.APP.getPageData();
        cp.css(this.sceneDom, {
            backgroundColor: pageData.background.color
        });
    }

    /**
     * 切换激活状态
     * @param target
     */
    toggleActive(target) {
        let idstr = target.id;
        let id = idstr.split("_")[1];
        cp.toggleActive(target);
        MODULE("coverage").toggleActiveById(id);
        MODULE("edit").activeComponentEditById(id);
    }

    /**
     * 根据id切换激活状态
     * @param id
     */
    toggleActiveById(id) {
        let sliceDom = cp.query("#slice_" + id, this.sceneDom);
        cp.toggleActive(sliceDom)
    }

    /**
     * 根据id移除激活状态
     * @param id
     */
    removeActiveById(id) {
        let sliceDom = cp.query("#slice_" + id, this.sceneDom);
        cp.removeActive(sliceDom)
    }
}