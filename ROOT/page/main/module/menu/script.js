class Module {
    DOM() {
        // this.addContentDom = coo.query('.addContent', this.domain);
    }

    INIT() {

    }

    EVENT() {
        cp.on('.slice', DOMAIN, 'click', t => this.addSlice(t));
    }

    addSlice(target) {
        //组件类型
        let name = cp.attr(target, "data-name");
        //获取组件
        this.getComponent(name);
        cp.parent(target, ".item").blur();
    }

    //添加一个新的组件
    getComponent(name) {
        let xhr = new XMLHttpRequest();
        xhr.onload = () => {
            let dataArr = xhr.responseText.split("--- IxD component ---");

            let defaultData;
            try {
                defaultData = JSON.parse(dataArr[0]);
            } catch (e) {
                console.error(e);
                return
            }

            //生成id
            defaultData.id = cp.randomNum() + cp.randomChar() + new Date().getTime();
            //追加定位
            //获取页面尺寸
            let pageData = this.APP.getPageData();

            defaultData.position.top = parseInt((pageData.size.height - defaultData.size.height) / 2);
            defaultData.position.left = parseInt((pageData.size.width - defaultData.size.width) / 2);
            //保存数据
            this.APP.scene.components.push(defaultData);
            //生成右侧编辑器
            MODULE("edit").initComponentPanel(defaultData);

            //加载组件dom
            let htmlStr = dataArr[1];
            //识别里面的库文件

            MODULE("canvas").addSlice(defaultData, htmlStr, true)
        };
        xhr.open("GET", "/component/" + name, true);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.send(null);
    }
}