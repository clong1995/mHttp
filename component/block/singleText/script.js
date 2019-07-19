class Module {
    DOM() {
        this.singleDom = cp.query(".single", DOMAIN);
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
                cp.html(this.singleDom, value);
                break;
            case "text-align":
                cp.css(this.singleDom, {
                    textAlign: value
                });
                break;
            case "font/size":
                cp.css(this.singleDom, {
                    fontSize: value + "px"
                });
                break;
            case "font/color":
                cp.css(this.singleDom, {
                    color: value
                });
                break;
            case "font/family":
                cp.css(this.singleDom, {
                    fontFamily: value
                });
                break;
            default:
        }
    }
}