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
        MODULE("canvas").addSlice()
    }
}