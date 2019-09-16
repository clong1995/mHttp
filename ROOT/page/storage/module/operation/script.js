class Module {
    DOM() {
        this.menuDom = cp.query('.menu', DOMAIN);
    }

    EVENT() {
        cp.on('.myFile', this.menuDom, 'click', t => this.myFile(t));
        cp.on('.companyFile', this.menuDom, 'click', t => this.companyFile(t));
        cp.on('.shareFile', this.menuDom, 'click', t => this.shareFile(t));
    }

    INIT() {
    }

    myFile(target) {
        cp.toggleActive(target);
        MODULE("list").loadMyFile();
    }

    companyFile(target) {
        cp.toggleActive(target);
        MODULE("list").loadCompanyFile();
    }

    shareFile(target) {
        cp.toggleActive(target);
        MODULE("list").loadShareFile();
    }
}