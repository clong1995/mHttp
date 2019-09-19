class Module {
    DOM() {
        this.bodyDom = cp.query('.body', DOMAIN);
    }

    EVENT() {
        //cp.on('.item', DOMAIN, 'click', t => this.enter(t));
    }

    INIT() {
        this.getList();
    }

    getList() {
        cp.ajax(CONF.IxDAddr + "/user/list", {
            success: res => {
                let html = "";
                res.data.forEach(v => {
                    html += `<div class="line">
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
                                 <button class="button">删除</button>
                            </div>
                            <div class="item info">
                                <button class="button">查看</button>
                            </div>
                        </div>`;
                });
                cp.html(this.bodyDom, html)
            }
        });
    }
}