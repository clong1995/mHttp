class Module {
    DOM() {
        this.listDom = cp.query('.list', DOMAIN);
    }

    EVENT() {
        cp.on('.item', DOMAIN, 'click', t => this.clickItem(t));
    }

    INIT() {

    }

    clickItem(target) {
        if (cp.hasActive(target)) {
            return;
        }
        cp.link("/" + cp.getData(target))
    }

    selectItem(name) {
        cp.addActive(cp.query("." + name, this.listDom))
    }
}