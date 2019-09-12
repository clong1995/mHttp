class Module {
    DOM() {
        // this.addContentDom = coo.query('.addContent', DOMAIN);
    }

    EVENT() {
        cp.on('.item', DOMAIN, 'click', t => this.selectedItem(t));
        // coo.on('.close', this.domain, 'click', t => this.hideStory());
    }

    INIT() {

    }

    selectedItem(target) {
        if (cp.hasActive(target)) {
            return;
        }
        cp.toggleActive(target);

        this.APP.hideLeft();

        if (cp.hasClass(target, "project")) {
            //工程管理
            MODULE("list").show();
        } else if (cp.hasClass(target, "userCenter")) {
            //用户中心
            MODULE("userCenter").show();
        }
    }
}