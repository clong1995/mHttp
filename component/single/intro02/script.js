class Module {
    DOM() {
        this.contentDom = cp.query(".content", DOMAIN);
        this.t1Dom = cp.query(".t1", DOMAIN);
        this.t2Dom = cp.query(".t2", DOMAIN);
        this.t3Dom = cp.query(".t3", DOMAIN);
        this.textDom = cp.query(".text", DOMAIN);
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
            case "text1":
                cp.html(this.t1Dom, value);
                break;
            case "text2":
                cp.html(this.t2Dom, value);
                break;
            case "text3":
                cp.html(this.t3Dom, value);
                break;
            case "textarea":
                value = value.replace(/\r\n/g, "<br>");
                value = value.replace(/\n/g, "<br>");
                cp.html(this.textDom, value);
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