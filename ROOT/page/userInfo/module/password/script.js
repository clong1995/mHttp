class Module {
    DOM() {
        this.tableDom = cp.query("table", DOMAIN);
        this.oldPasswordDom = cp.query(".old", DOMAIN);
        this.newPasswordDom = cp.query(".new", DOMAIN);
        this.repeatPasswordDom = cp.query(".repeat", DOMAIN);
    }

    EVENT() {
        cp.on('.confirm', this.tableDom, 'click', () => this.confirm());
    }

    INIT() {

    }

    confirm() {
        let oldPassword = this.oldPasswordDom.value;
        let newPassword = this.newPasswordDom.value;
        let repeatPassword = this.repeatPasswordDom.value;
        if (!oldPassword || !newPassword || !repeatPassword) {
            MODULE("dialog").show({
                type: "warn",
                text: "不得为空"
            });
            return
        }
        if (oldPassword === newPassword) {
            MODULE("dialog").show({
                type: "warn",
                text: "新密码 不得和 原始密码 相同"
            });
            return
        }
        if (newPassword !== repeatPassword) {
            MODULE("dialog").show({
                type: "warn",
                text: "新密码 和 确认密码 不一致"
            });
            return
        }
        cp.ajax(CONF.ServerAddr + "/auth/resetPassword", {
            data: {
                oldPassword: oldPassword,
                newPassword: newPassword
            },
            success: res => {
                if (res.code === 0) {
                    MODULE("dialog").show({
                        text: "修改成功，即将自动退出！",
                        confirm() {
                            cp.link("/login?logout=true")
                        }
                    });
                } else {
                    MODULE("dialog").show({
                        type: "error",
                        text: "修改失败"
                    });
                }
            }
        });

    }
}