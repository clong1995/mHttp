class Module {
    DOM() {
        this.addFolderDom = cp.query('.add-folder', DOMAIN);
        this.addrListDom = cp.query(".addr-list", DOMAIN);
        this.downloadClientDom = cp.query(".download-client", DOMAIN);
        this.infoDom = cp.query(".info", DOMAIN);

        this.backDom = cp.query(".back", DOMAIN);
        this.addDom = cp.query(".add", DOMAIN);
        this.uploadDom = cp.query(".upload", this.addDom);
        this.uploadClientDom = cp.query(".upload-client", this.addDom);
        this.newFolderDom = cp.query(".new-folder", DOMAIN);
        this.addrDom = cp.query(".addr", DOMAIN);
        this.uploadProgressDom = cp.query(".upload-progress", DOMAIN);
        this.downloadProgressDom = cp.query(".download-progress", DOMAIN);
        this.optionItemDoms = cp.query(".option-item", DOMAIN, true);
        this.uploadClientWindowDom = cp.query(".upload-client-window", DOMAIN);
    }

    EVENT() {
        cp.on('.new-folder', DOMAIN, 'click', () => this.showNewFolderWinodw());
        cp.on('.back', DOMAIN, 'click', () => this.goBack());
        cp.on('.refresh', DOMAIN, 'click', () => this.refresh());
        cp.on('.client', DOMAIN, 'click', () => this.showDownloadClient());
        cp.on('.confirm', this.addFolderDom, 'click', () => this.confirmNewFolder());
        cp.on('.addr-list-item', this.addrListDom, 'click', t => this.goToFolder(t));

        //浏览器上传
        cp.on('.upload', this.addDom, 'change', t => this.doUploadWeb(t));

        //客户端上传弹窗
        cp.on('.upload-client', this.addDom, 'click', () => this.clientUploadWindow());
        //客户端上传文件会话框
        cp.on('.file', this.uploadClientWindowDom, 'click', () => this.clientUploadDialog());

        //点击上传进度
        cp.on('.upload-progress', DOMAIN, 'click', t => this.uploadProgress(t));
        cp.on('.download-progress', DOMAIN, 'click', t => this.downloadProgress(t));
    }

    INIT() {
        if (window.global) {//客户端
            //隐藏提示下载客户端
            cp.hide(this.infoDom);
            //隐藏通过浏览器上传
            cp.hide(this.uploadDom);
            //显示客户端上传
            cp.show(this.uploadClientDom)
        } else {
            //隐藏客户端上传
            cp.hide(this.uploadClientDom)
        }
        //导航
        this.navigate = [];
        /*//相应go回调
        window.externalInvokeOpen = res => this.doUploadClientFile(res);
        window.externalInvokeOpenDir = res => this.doUploadClientFolder(res);
        window.externalInvokeClientUploadOne = res => this.cbClientUploadOne(res);*/
        this.currProgress = "upload";
    }

    uploadProgress(target) {
        this.currProgress = "upload";
        cp.removeActive(this.downloadProgressDom);

        cp.addActive(target);
        MODULE("list").loadFileList();
    }

    downloadProgress(target) {
        this.currProgress = "download";
        cp.removeActive(this.uploadProgressDom);

        cp.addActive(target);
        MODULE("list").loadFileList();
    }

    clientUploadDialog() {
        //打开文件选择器
        let file = ipc.sendSync("ShowOpenDialogMessageSync", this.currNavigate().key, localStorage.getItem("Authorization"));
        if (file) {
            MODULE("list").loadFileList();
            MODULE("window").hide(this.uploadClientWindowDom);
        }
    }


    /**
     * 浏览器上传
     * @param target
     */
    doUploadWeb(target) {
        MODULE("upload").upload(target, res => {
            //保存文件信息
            cp.ajax(CONF.ServerAddr + "/file/addFile", {
                data: {
                    etag: res.hash,
                    name: res.name,
                    size: res.size,
                    type: res.type,
                    pid: this.currNavigate().key,
                    inQiniu: 1
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

    clientUploadWindow() {
        MODULE("window").show(this.uploadClientWindowDom);
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

    setNavigate(key, name, type) {
        let len = this.navigate.length;
        this.navigate[len] = {
            key: key,
            name: name,
            type: type
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

    showNewFolderWinodw() {
        MODULE("window").show(this.addFolderDom);
    }

    confirmNewFolder() {
        let name = cp.query(".name", this.addFolderDom).value;
        let {key} = this.currNavigate();
        if (!name || !key) return;
        cp.ajax(CONF.ServerAddr + "/file/addFolder", {
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

    hideForBucket(key) {
        cp.show(this.optionItemDoms);
        if(!window.global){
            cp.hide(this.uploadProgressDom);
            cp.hide(this.downloadProgressDom);
        }
        switch (key) {
            case "myBucket":
            case "exhibitionBucket":
            case "shareBucket":
            case "departmentBucket":
                cp.hide(this.uploadProgressDom);
                cp.hide(this.downloadProgressDom);
                break;
            case "folder-department":
                cp.hide(this.addDom);
                cp.hide(this.newFolderDom);
                cp.hide(this.uploadProgressDom);
                cp.hide(this.downloadProgressDom);
                break;
            case "taskBucket":
                cp.hide(this.backDom);
                cp.hide(this.addDom);
                cp.hide(this.newFolderDom);
                cp.hide(this.addrDom);
                break;
            case "recycleBucket":
                cp.hide(this.addDom);
                cp.hide(this.newFolderDom);
                cp.hide(this.uploadProgressDom);
                cp.hide(this.downloadProgressDom);
                break;
        }
    }
}