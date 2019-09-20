class Module {
    DOM() {
        this.menuDom = cp.query('.menu', DOMAIN);
    }

    EVENT() {
        cp.on('.file-item', this.menuDom, 'click', t => this.selectFileItem(t));
    }

    INIT() {
        this.bucketList();
    }

    bucketList() {
        cp.ajax(CONF.IxDAddr + "/file/listTopFolder", {
            success: res => {
                if (res.code === 0) {
                    let html = '';
                    res.data.forEach((v, i) => {
                        if (!i) {
                            //记录顶级目录
                            MODULE("option").initNavigate(v.id, v.name);
                            //加载列表
                            !i && MODULE("list").loadFileList();
                        }
                        html += `<div class="file-item ${i ? "" : "active"}" data-id="${v.id}">${v.name}</div>`
                    });
                    cp.html(this.menuDom, html);
                } else {
                    console.error(res)
                }
            }
        })
    }

    selectFileItem(target) {
        cp.toggleActive(target);
        let id = cp.getData(target);
        let name = cp.text(target);
        MODULE("option").initNavigate(id, name);
        //加载列表
        MODULE("list").loadFileList();
    }
}