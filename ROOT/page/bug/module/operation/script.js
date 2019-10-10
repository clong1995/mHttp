class Module {
    DOM() {
        this.addBugDom = cp.query('.add-bug', DOMAIN);
    }

    EVENT() {
        cp.on('.bug-btn', DOMAIN, 'click', t => this.showAddBug(t));
        cp.on('.back-btn', DOMAIN, 'click', t => this.back(t));
        cp.on('.confirm', this.addBugDom, 'click', t => this.addBug(t));
    }

    INIT() {

    }

    back() {
        cp.link("/task")
    }

    showAddBug() {
        //清空
        this.setValue({
            title: "",
            position: "",
            expect: "",
            type: 1,
            severity: 1,
            priority: 1
        });
        editor.window.location.reload();
        MODULE("window").show(this.addBugDom);
    }

    infoBug(id) {
        cp.ajax(CONF.ServerAddr + "/bug/info", {
            data: {
                id: id
            },
            success: res => {
                if (res.code === 0) {
                    this.setValue(res.data);
                    MODULE("window").show(this.addBugDom);
                } else {
                    console.error(res)
                }
            }
        })
    }

    setValue(data) {
        cp.query(".title-value", this.addBugDom).value = data.title;
        [...cp.query("OPTION", cp.query(".type-value", this.addBugDom), true)][data.type - 1].selected = true;
        [...cp.query("OPTION", cp.query(".severity-value", this.addBugDom), true)][data.severity - 1].selected = true;
        [...cp.query("OPTION", cp.query(".priority-value", this.addBugDom), true)][data.priority - 1].selected = true;
        cp.query(".position-value", this.addBugDom).value = data.position;
        cp.query(".expect-value", this.addBugDom).value = data.expect;
        editor.window.setValue(data.reappear);
    }

    addBug() {
        //值
        let title = cp.query(".title-value", this.addBugDom).value;
        let type = cp.query(".type-value", this.addBugDom).value;
        let severity = cp.query(".severity-value", this.addBugDom).value;
        let priority = cp.query(".priority-value", this.addBugDom).value;
        let position = cp.query(".position-value", this.addBugDom).value;
        let expect = cp.query(".expect-value", this.addBugDom).value;
        let reappear = editor.window.getValue();
        //校验
        if (!title || !type || !severity || !priority || !position || !expect || !reappear) {
            //确认
            MODULE("dialog").show({
                type: "info",
                text: "信息不完善！"
            });
            return
        }
        //发送数据
        let data = {
            title: title,
            type: parseInt(type),
            severity: parseInt(severity),
            priority: parseInt(priority),
            position: position,
            reappear: reappear,
            expect: expect
        };
        cp.ajax(CONF.ServerAddr + "/bug/add", {
            data: data,
            success: res => {
                if (res.code === 0) {
                    MODULE("window").hide(this.addBugDom);
                    MODULE("list").getList();
                } else {
                    console.error(res)
                }
            }
        });
    }
}