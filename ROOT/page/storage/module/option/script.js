class Module {
    DOM() {
        this.addFolderDom = cp.query('.add-folder', DOMAIN);
        this.addrListDom = cp.query(".addr-list", DOMAIN);
        this.downloadClientDom = cp.query(".download-client", DOMAIN);
    }

    EVENT() {
        cp.on('.new-folder', DOMAIN, 'click', () => this.newFolder());
        cp.on('.back', DOMAIN, 'click', () => this.goBack());
        cp.on('.refresh', DOMAIN, 'click', () => this.refresh());
        cp.on('.client', DOMAIN, 'click', () => this.showDownloadClient());
        cp.on('.confirm', this.addFolderDom, 'click', () => this.confirmNewFolder());
        cp.on('.addr-list-item', this.addrListDom, 'click', t => this.goToFolder(t));
        cp.on('.upload', DOMAIN, 'change', t => this.upload(t));
    }

    INIT() {
        //导航
        this.navigate = [];
    }

    upload(target) {
        MODULE("upload").upload(target, res => {
            //保存文件信息
            cp.ajax(CONF.IxDAddr + "/file/addFile", {
                data: {
                    etag: res.hash,
                    name: res.name,
                    size: res.size,
                    type: res.type,
                    pid: this.currNavigate().key
                },
                success: res => {
                    if (res.code === 0) {
                        MODULE("list").loadFileList();
                        MODULE("window").hide(this.addFolderDom);
                    } else {
                        console.error(res)
                    }
                }
            })
        });
    }

    showDownloadClient() {
        MODULE("window").show(this.downloadClientDom);
    }

    refresh() {
        MODULE("list").loadFileList();
    }

    goToFolder(target) {
        let index = cp.domIndex(target);
        this.navigate.splice(index + 1, this.navigate.length - index + 1);
        MODULE("list").loadFileList();
        this.changeAddr();
    }

    goBack() {
        let index = this.navigate.length - 2;
        if (index < 0) {
            index = 0;
        }
        this.navigate.splice(index + 1, this.navigate.length - index + 1);
        MODULE("list").loadFileList();
        this.changeAddr();
    }

    initNavigate(key, name, type) {
        this.navigate = [{
            key: key,
            name: name,
            type: type
        }];
        this.changeAddr();
    }

    setNavigate(key, name) {
        let len = this.navigate.length;
        this.navigate[len] = {
            key: key,
            name: name
        };
        this.changeAddr();
    }

    getNavigate() {
        return this.navigate;
    }

    currNavigate() {
        let len = this.navigate.length;
        return this.navigate[len - 1];
    }

    changeAddr() {
        let html = "";
        this.navigate.forEach(v => {
            html += `<span class="addr-list-item" data-id="${v.key}">${v.name}/</span>`;
        });
        cp.html(this.addrListDom, html)
    }

    newFolder() {
        MODULE("window").show(this.addFolderDom);
    }

    confirmNewFolder() {
        let name = cp.query(".name", this.addFolderDom).value;
        let {key} = this.currNavigate();
        if (!name || !key) return;
        cp.ajax(CONF.IxDAddr + "/file/addFolder", {
            data: {
                name: name,
                pid: key
            },
            success: res => {
                if (res.code === 0) {
                    MODULE("list").loadFileList();
                    MODULE("window").hide(this.addFolderDom);
                } else {
                    console.error(res)
                }
            }
        })
    }
}