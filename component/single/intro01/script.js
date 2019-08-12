class Module {
    DOM() {
        this.titleDom = cp.query(".title", DOMAIN);
        this.contentDom = cp.query(".content", DOMAIN);
    }

    EVENT() {

    }

    INIT() {

    }

    /**
     * 当右侧的配置改变的时候，就会自动调用这个方法，给你返回修改的数据
     * @param key
     * @param value
     * @constructor
     */
    OPTION(key, value) {
        console.log(key, value);
        switch (key) {
            case "text":
                cp.html(this.titleDom, value);
                break;
            case "file":
                if (value === "") {
                    return
                }
                let arr = value.split("||");
                if (arr.length !== 2) {
                    return
                }
                let mediaDom = null;
                if (arr[0].startsWith("image")) {
                    mediaDom = new Image();
                    mediaDom.src = arr[1];
                } else {
                    //TODO 视频
                }
                cp.empty(this.contentDom);
                cp.addClass(mediaDom, "media");
                cp.append(this.contentDom, mediaDom);
                break;
            default:
        }
    }
}