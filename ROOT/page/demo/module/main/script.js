class Module {
    DOM() {
        //this.btnDom = coo.query('.btn', DOMAIN);
    }

    EVENT() {
        cp.on('.btn', DOMAIN, 'click', t => this.massage(t));
    }

    INIT() {

    }

    massage(target) {
        alert(111);
    }
}