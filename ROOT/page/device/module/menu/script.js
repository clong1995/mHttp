class Module {
    DOM() {
        this.addDeviceDom = cp.query('.add-device', DOMAIN);
        setTimeout(() => {
            MODULE("window").show(this.addDeviceDom)
        }, 500)
    }

    EVENT() {
        cp.on('.sort', DOMAIN, 'click', t => this.window(t));
        // coo.on('.close', this.domain, 'click', t => this.hideStory());
    }

    INIT() {

    }

    window(target) {
        let id = cp.getData(target);

    }
}