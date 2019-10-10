class Module {
    DOM() {
        this.bodyDom = cp.query('.body', DOMAIN);
    }

    EVENT() {
        cp.on('.delete', this.bodyDom, 'click', t => this.deleteUser(t));
    }

    INIT() {
        this.getList();
    }

    deleteUser(t) {
        let p = cp.parent(t, ".line");
        let id = cp.getData(p);
        MODULE("dialog").show({
            type: "warn",
            text: "确定要删除?",
            confirm: close => {
                cp.ajax(CONF.ServerAddr + "/user/delete", {
                    data: {
                        uid: id
                    },
                    success: res => {
                        if (res.code === 0) {
                            cp.remove(p);
                            close();
                        } else {
                            console.error(res)
                        }
                    }
                })
            },
            cancel: close => close()
        });
    }

    getList() {
        cp.ajax(CONF.ServerAddr + "/user/list", {
            success: res => {
                if (res.code === 0) {
                    let html = "";
                    res.data.forEach(v => {
                        html += `<div class="line" data-id="${v.id}">
                            <div class="item id">
                                ${v.email}
                            </div>
                            <div class="item name">
                                ${v.name ? v.name : "暂无"}
                            </div>
                            <div class="item company">
                                ${v.company ? v.company : "暂无"}
                            </div>
                            <div class="item auth">
                                <button class="button">配置</button>
                            </div>
                            <div class="item setting">
                                 <button class="button">重置密码</button>
                                 <button class="button">停用</button>
                                 <button class="button delete">删除</button>
                            </div>
                            <div class="item info">
                                <button class="button">查看</button>
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
}