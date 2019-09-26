class Module {
    DOM() {
        this.menuDom = cp.query('.menu', DOMAIN);
    }

    EVENT() {
        cp.on('.file-item', this.menuDom, 'click', t => this.selectFileItem(t));
    }

    INIT() {
        this.topList();
    }

    topList() {
        let taskDom = "";
        if (localStorage.getItem("client")) {
            taskDom = `<div class="file-item" data-type="taskBucket">传输列表</div>`;
        }
        cp.ajax(CONF.ServerAddr + "/file/listTopFolder", {
            success: res => {
                if (res.code === 0) {
                    let html = '';
                    res.data.forEach((v, i) => {
                        if (!i) {
                            //记录顶级目录
                            MODULE("option").initNavigate(v.id, v.name, v.type);
                            //加载列表
                            !i && MODULE("list").loadFileList();
                        }
                        html += `<div class="file-item ${i ? "" : "active"}" data-id="${v.id}" data-type="${v.type}">${v.name}</div>`
                    });
                    cp.html(this.menuDom, html + taskDom);
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
        let type = cp.getData(target, "type");
        MODULE("option").initNavigate(id, name, type);
        //加载列表
        MODULE("list").loadFileList();
    }
}