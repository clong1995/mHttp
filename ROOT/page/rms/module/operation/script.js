class Module {
    DOM() {
        this.addUserDom = cp.query('.add-user', DOMAIN);
        this.addCompanyUserWindowDom = cp.query('.company-user-window', DOMAIN);
        this.addDepartmentUserWindowDom = cp.query('.department-user-window', DOMAIN);
        this.companyUserBtnDom = cp.query('.company-user-btn', DOMAIN);
        this.departmentUserBtnDom = cp.query('.department-user-btn', DOMAIN);
        this.userBtnDom = cp.query('.user-btn', DOMAIN);
    }

    EVENT() {
        cp.on('.user-btn', DOMAIN, 'click', t => this.showAddUserWindow(t));
        cp.on('.company-user-btn', DOMAIN, 'click', t => this.showAddCompanyUserWindow(t));
        cp.on('.department-user-btn', DOMAIN, 'click', t => this.showAddDepartmentUserWindow(t));

        cp.on('.confirm', this.addUserDom, 'click', t => this.addUser(t));
        cp.on('.confirm', this.addCompanyUserWindowDom, 'click', t => this.addCompanyUser(t));
        cp.on('.confirm', this.addDepartmentUserWindowDom, 'click', t => this.addDepartmentUser(t));
    }

    INIT() {
        //TODO 检查权限
        cp.ajax(CONF.ServerAddr + "/user/info", {
            success: res => {
                if (res.code === 0) {
                    let rank = res.data["rank"];
                    console.log(rank);
                    switch (rank) {
                        case 0:
                            cp.show(this.companyUserBtnDom);
                            break;
                        case 1:
                            cp.show(this.departmentUserBtnDom);
                            break;
                        case 2:
                            cp.show(this.userBtnDom);
                            break;
                    }
                } else {
                    console.error(res)
                }
            }
        });
    }

    showAddUserWindow() {
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
        cp.ajax(CONF.ServerAddr + "/user/add", {
            data: {
                email: email
            },
            success: res => {
                if (res.code === 0) {
                    MODULE("window").hide(this.addUserDom);
                    MODULE("list").getList();
                } else {
                    console.error(res)
                }
            }
        });
    }

    showAddDepartmentUserWindow() {
        MODULE("window").show(this.addDepartmentUserWindowDom);
    }

    addDepartmentUser() {
        let email = cp.query(".email", this.addDepartmentUserWindowDom).value;
        let department = cp.query(".department", this.addDepartmentUserWindowDom).value;
        if (!email || !department) {
            //确认
            MODULE("dialog").show({
                type: "info",
                text: "信息不完善！"
            });
            return
        }
        cp.ajax(CONF.ServerAddr + "/user/addDepartmentUser", {
            data: {
                email: email,
                department: department
            },
            success: res => {
                if (res.code === 0) {
                    MODULE("window").hide(this.addDepartmentUserWindowDom);
                    MODULE("list").getList();
                } else {
                    console.error(res)
                }
            }
        });
    }

    showAddCompanyUserWindow() {
        MODULE("window").show(this.addCompanyUserWindowDom);
    }

    addCompanyUser() {
        let email = cp.query(".email", this.addCompanyUserWindowDom).value;
        let company = cp.query(".company", this.addCompanyUserWindowDom).value;
        if (!email || !company) {
            //确认
            MODULE("dialog").show({
                type: "info",
                text: "信息不完善！"
            });
            return
        }
        cp.ajax(CONF.ServerAddr + "/user/addCompanyUser", {
            data: {
                email: email,
                company: company
            },
            success: res => {
                if (res.code === 0) {
                    MODULE("window").hide(this.addCompanyUserWindowDom);
                    MODULE("list").getList();
                } else {
                    console.error(res)
                }
            }
        });
    }
}