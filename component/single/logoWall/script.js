class Module {
    DOM() {
        this.innerDom = cp.query(".inner", DOMAIN);
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
            case "textarea":
                value = value.replace(/\r\n/g, "<br>");
                value = value.replace(/\n/g, "<br>");
                cp.html(this.innerDom, value);
                break;
            default:
        }
    }
}