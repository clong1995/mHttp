class Module {
    DOM() {
        this.bodyDom = cp.query('.body', DOMAIN);
    }

    EVENT() {
        cp.on('.info-btn', this.bodyDom, 'click', t => this.bugInfo(t));
    }

    INIT() {
        this.getList();
        this.color = ["", "red", "orange", "blue", "green"];
        this.type = ["", "缺陷", "异常", "建议", "吐槽"];
        this.severity = ["", "高", "中", "低", "无"];
        this.priority = ["", "插队处理", "参与排期", "空档期处理", "无需处理"];
        this.state = ["", "未处理", "设计如此", "不予解决", "已解决"]
    }

    getList() {
        cp.ajax(CONF.ServerAddr + "/bug/list", {
            success: res => {
                if (res.code === 0) {
                    let html = "";
                    res.data.forEach(v => {
                        html += `<div class="line" data-id="${v.id}">
                            <div class="item id">
                                ${v.email}
                            </div>
                            <div class="item title">
                                ${v.title}
                            </div>
                            <div class="item type" style="color:${this.color[v.type]}">
                                ${this.type[v.type]}
                            </div>
                            <div class="item severity" style="color:${this.color[v.severity]}">
                                ${this.severity[v.severity]}
                            </div>
                            <div class="item priority" style="color:${this.color[v.priority]}">
                                 ${this.priority[v.priority]}
                            </div>
                            <div class="item state" style="color:${this.color[v.state]}">
                                 ${this.state[v.state]}
                            </div>
                            <div class="item info">
                                <button class="button info-btn">查看</button>
                            </div>
                        </div>`;
                    });
                    cp.html(this.bodyDom, html)
                } else {
                    console.error(res)
                }
            }
        });
    }

    bugInfo(target) {
        let id = cp.getData(cp.parent(target, "line"));
        MODULE("operation").infoBug(id);
    }
}