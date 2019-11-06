class Module {
    DOM() {

    }

    EVENT() {
        cp.on('.item', DOMAIN, 'click', t => this.into(t));
    }

    INIT() {

    }
}