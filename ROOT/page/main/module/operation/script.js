class Module {
    DOM() {
        // sthis.addContentDom = coo.query('.addContent', this.domain);
    }

    EVENT() {
        //预览
        cp.on('.preview', DOMAIN, 'click', t => this.preview());
    }

    INIT() {
        this.initList();
    }

    initList() {

    }

    preview() {
        let id = this.APP.getSceneId();

        //浏览器内
        if (!this.APP.ipc) {
            window.open("/preview?id=" + id);
            return
        }

        //electron发送到后端
        this.APP.ipc.send('message', JSON.stringify({
            "key": "preview",
            "value": id
        }));
    }
}