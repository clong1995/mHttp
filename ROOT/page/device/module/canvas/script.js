class Module {
    DOM() {
        this.tooBarDom = cp.query('.tool-bar', DOMAIN);
        this.rangeBoxDom = cp.query('.range-box', this.tooBarDom);
        this.rangeBomNumberDom = cp.query('.number', this.rangeBoxDom);
        this.rangeBomRangeDom = cp.query('.range', this.rangeBoxDom);
        this.axisBoxDom = cp.query('.axis-box', this.tooBarDom);
        this.gridBoxDom = cp.query('.grid-box', this.tooBarDom);

        this.axisLineDoms = cp.query('.axis-line', DOMAIN, true);
    }

    EVENT() {
        /*coo.on('.box1', this.domain, 'drag', t => {
        });

        coo.on('.box2', this.domain, 'resize', t => {
        });

        coo.on('.box3', this.domain, 'drag', t => {
        });
        coo.on('.box3', this.domain, 'resize', t => {
        });*/
        //标尺线
        cp.on('.checkbox', this.axisBoxDom, 'click', t => this.toggleAxisLine(t));
        //网格子
        cp.on('.checkbox', this.gridBoxDom, 'click', t => this.toggleGrid(t));
        //缩放
        cp.on('.number', this.rangeBoxDom, 'change', t => this.changeRange(t));
        cp.on('.range', this.rangeBoxDom, 'change', t => this.changeRange(t));
        cp.on('.button', this.rangeBoxDom, 'click', t => this.changeScale(t));
    }

    INIT() {
        this.sceneDom = null;
        this.width = 1920;
        this.height = 1080;
        this.scale = 0;
        this.autoScale = true;
        this.toolBarHeight = 20;
        this.rulerWidth = 15;
        this.gridDom = null;

        this.loadScene();
        this.loadGridDom();
        this.loadRange();
    }

    changeScale(target) {
        if (cp.hasClass(target, 'active')) {
            //手动
            cp.removeClass(target, 'active');
            cp.removeClass([this.rangeBomNumberDom, this.rangeBomRangeDom], 'disable');
            this.autoScale = false;
        } else {
            //自动
            cp.addClass(target, 'active');
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

    toggleAxisLine(target) {
        let checked = target.checked;
        if (checked) {
            cp.show(this.axisLineDoms);
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

    loadScene() {
        //加载场景
        this.sceneDom = cp.createDom();
        cp.addClass(this.sceneDom, 'scene');
        cp.css(this.sceneDom, {
            width: this.width + 'px',
            height: this.height + 'px',
        });
        this.sceneSize(this.autoScale ? null : this.scale);
        cp.append(DOMAIN, this.sceneDom);
        //重新计算大小
        window.onresize = () => this.sceneSize(this.autoScale ? null : this.scale);
    }

    loadGridDom() {
        this.gridDom = cp.createDom();
        cp.addClass(this.gridDom, ['grid', 'hide']);
        cp.css(this.gridDom, {
            backgroundSize: (20 * (1 / this.scale)) + 'px ' + (20 * (1 / this.scale)) + 'px'
        });
        cp.append(this.sceneDom, this.gridDom);
    }

    sceneSize(scale = null) {
        //获取容器大小
        let {width, height} = cp.domSize(DOMAIN);
        let cWidth = width - (this.rulerWidth + 1) * 2,
            cHeight = height - (this.rulerWidth + this.toolBarHeight + 1) * 2;
        let size = {};
        //不指定缩放大小
        if (!scale && this.autoScale) {
            size = cp.autoSize({
                w: cWidth, h: cHeight
            }, {
                w: this.width, h: this.height
            })
        } else {
            //指定缩放大小
            size.scale = scale;
            //缩放后的感官大小
            let sWidth = this.width * scale,
                sHeight = this.height * scale;
            size.l = (cWidth - sWidth) / 2;
            size.t = (cHeight - sHeight) / 2;
        }

        this.scale = size.scale;

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
        })
    }
}