class Module {
    DOM() {
        this.menuDom = cp.query('.menu', DOMAIN);
    }

    EVENT() {
        cp.on('.myFile', this.menuDom, 'click', t => this.myFile(t));
        cp.on('.projectFile', this.menuDom, 'click', t => this.projectFile(t));
        cp.on('.departmentFile', this.menuDom, 'click', t => this.departmentFile(t));
        cp.on('.shareFile', this.menuDom, 'click', t => this.shareFile(t));
    }

    INIT() {
    }

    myFile(target) {
        cp.toggleActive(target);
        MODULE("list").loadMyFile();
    }

    projectFile(target) {
        cp.toggleActive(target);
        MODULE("list").loadProjectFile();
    }

    departmentFile(target) {
        cp.toggleActive(target);
        MODULE("list").loadDepartmentFile();
    }

    shareFile(target) {
        cp.toggleActive(target);
        MODULE("list").loadShareFile();
    }
}