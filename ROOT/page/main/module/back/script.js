class Module {
    DOM() {
        // this.addContentDom = coo.query('.addContent', this.domain);
    }

    EVENT() {
        cp.on('.back', DOMAIN, 'click', t => this.back());
        cp.on('.save', DOMAIN, 'click', t => this.save());
    }

    INIT() {
        //this.initList();
    }

    back() {
        localStorage.removeItem("pid");
        cp.link('/content')
    }

    /**
     * 更新和保存
     */
    save() {
        let name = this.APP.scene.page.name;
        let data = JSON.stringify(this.APP.scene);

        cp.ajax(CONF.IxDAddr + "/scene/add", {
            headers: HEAD(),
            data: {
                sceneId: this.APP.getSceneId() || "",
                projectId: localStorage.getItem("pid"),
                name: name,
                data: data
            },
            success: res => {
                if (res.code === 0) {
                    this.APP.setSceneId(res.data);
                } else {
                    alert(res.msg);
                }

            }
        })
    }
}