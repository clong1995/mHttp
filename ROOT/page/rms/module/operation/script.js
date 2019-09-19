class Module {
    DOM() {
        this.addUserDom = cp.query('.add-user', DOMAIN);
    }

    EVENT() {
        cp.on('.user-btn', DOMAIN, 'click', t => this.showAddUser(t));
        cp.on('.confirm', this.addUserDom, 'click', t => this.addUser(t));
    }

    INIT() {
    }

    showAddUser() {
        MODULE("window").show(this.addUserDom);
    }

    addUser() {
        let email = cp.query(".email", this.addUserDom).value;
        if (!email) {
            //确认
            MODULE("dialog").show({
                type: "info",
                text: "信息不完善！"
            });
            return
        }
        cp.ajax(CONF.IxDAddr + "/user/add", {
            data: {
                email: email
            },
            success: () => {
                MODULE("window").hide(this.addUserDom);
                MODULE("list").getList();
            }
        });
    }
}