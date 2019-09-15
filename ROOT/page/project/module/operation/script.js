class Module {
    DOM() {
        this.addProjectDom = cp.query('.add-project', DOMAIN);
        this.projectNameDom = cp.query('.name', DOMAIN);
    }

    EVENT() {
        cp.on('.project', DOMAIN, 'click', t => this.showAddProject());
        cp.on('.confirm', this.addProjectDom, 'click', t => this.addProject());
    }

    INIT() {
    }

    showAddProject() {
        MODULE("window").show(this.addProjectDom);
    }

    addProject() {
        let name = this.projectNameDom.value;
        if (name !== "") {
            cp.ajax(CONF.IxDAddr + "/project/add", {
                data: {
                    name: name
                },
                success: res => {
                    MODULE("list").loadItem();
                    cp.hide(this.addProjectDom);
                }
            });
        }
    }


}