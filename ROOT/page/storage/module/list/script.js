class Module {
    DOM() {
        this.listDom = cp.query('.list', DOMAIN);
        this.shareWindowDom = cp.query('.share-window', DOMAIN);
        this.shareLikDom = cp.query('.link', this.shareWindowDom);
        this.shareNameDom = cp.query('.name', this.shareWindowDom);

        //文件右键
        this.fileRightMenuDom = cp.query('.file-right-menu', DOMAIN);
        this.renameWindowDom = cp.query('.rename-window', DOMAIN);
        this.renameWindowNameDom = cp.query('.name', this.renameWindowDom);

        //右键
        this.rightMenuDom = cp.query('.right-menu', DOMAIN);

        //预览
        this.previewWindowDom = cp.query('.preview-window', DOMAIN);
        this.previewIframe = cp.query('iframe', this.previewWindowDom);
    }

    EVENT() {
        cp.on('.enter', DOMAIN, 'dblclick', t => this.enter(t));
        cp.on('.item', DOMAIN, 'click', t => this.checked(t));
        cp.on('.delete', DOMAIN, 'click', t => this.delete(t));
        cp.on('.download', DOMAIN, 'click', t => this.download(t));
        cp.on('.preview', DOMAIN, 'click', t => this.preview(t));
        cp.on('.share', DOMAIN, 'click', t => this.share(t));
        cp.on('.copy', this.shareWindowDom, 'click', () => this.copyLink());

        //文件右键
        cp.on(".file-right-menu", DOMAIN, 'blur', () => this.hideFileRightMenu());
        cp.on(".item", this.listDom, 'mousedown', (t, _, e) => this.showFileRightMenu(t, _, e));
        cp.on(".rename", this.fileRightMenuDom, 'click', () => this.showRenameWindow());
        cp.on(".copy", this.fileRightMenuDom, 'click', () => this.copyFile());
        cp.on(".cut", this.fileRightMenuDom, 'click', () => this.cutFile());

        //拖拽
        cp.on(".item", this.listDom, 'dragstart', (t) => this.fileDragstart(t));
        cp.on(".item", this.listDom, 'drop', (t) => this.fileDrop(t));
        cp.on(".item", this.listDom, 'dragover', (t, t1, e) => this.fileDragover(t, t1, e));


        cp.on(".list", this.listDom, 'click', (t, t1) => this.removeChecked(t, t1));

        //右键
        cp.on(".list", this.listDom, 'mousedown', (t, t1, e) => this.showRightMenu(t, t1, e));
        cp.on(".right-menu", DOMAIN, 'blur', () => this.hideRightMenu());
        cp.on(".paste", this.rightMenuDom, 'click', () => this.pasteFile());
        cp.on(".select-all", this.rightMenuDom, 'click', () => this.checkedAll());
        cp.on(".no-select-all", this.rightMenuDom, 'click', () => this.noCheckedAll());
        cp.on(".refresh", this.rightMenuDom, 'click', () => this.refresh());
        cp.on(".new-folder", this.rightMenuDom, 'click', () => this.newFolder());


        cp.on(".confirm", this.renameWindowDom, 'click', () => this.confirmRename());
    }

    INIT() {
        this.icon = {
            js: "&#xe64d;",
            css: "&#xe64c;",
            zip: "&#xe7b4;",
            html: "&#xe64b;",
            psd: "&#xe649;",
            excel: "&#xe648;",
            json: "&#xe641;",
            word: "&#xe92b;",
            file: "&#xe674;",
            exe: "&#xe651;",
            txt: "&#xe63d;",
            ppt: "&#xe7a2;",
            video: "&#xe63c;",
            folder: "&#xe63b;",
            "folder-company": "&#xe66c;",
            "folder-department": "&#xe652;",
            "folder-user": "&#xe666;",
            "folder-template": "&#xe66e;",
            image: "&#xe643;",
            richText: "&#xe650;",
            audio: "&#xe623;",
            database: "&#xe659;",
            dmg: "&#xe69c;",
            pkg: "&#xe65b;",
            apk: "&#xe65a;",
            pdf: "&#xe740;",
            jar: "&#xe662;"
        };
        this.defaultSize = 125;
        this.autoSize();
        window.onresize = () => this.autoSize();
        app.fileRightClickId = [];
        app.rightAction = null;
        app.copyCutFile = [];
        app.originFile = null;
    }

    checked(target) {
        cp.toggleActiveSelf(target,
            () => this.fileRightIdPush(cp.getData(target)),
            () => this.fileRightIdDelete(cp.getData(target)))
    }

    fileDragover(target, target1, e) {
        e.preventDefault();
    }

    fileDragstart(target) {
        let fileId = cp.getData(target);
        //清空其数组
        app.fileRightClickId = [fileId];
        //还原选中
        cp.toggleActive(target);
        app.rightAction = "cut";
        app.copyCutFile = [fileId];
    }

    fileDrop(target) {
        if (cp.getData(target, "type").indexOf("folder") !== 0) {
            return
        }
        let fileId = cp.getData(target);
        app.originFile = MODULE("option").currNavigate().key;
        this.pasteFile(fileId);
    }

    refresh() {
        this.loadFileList();
        this.hideRightMenu();
    }

    newFolder() {
        MODULE("option").showNewFolderWinodw();
        this.hideRightMenu();
    }

    checkedAll() {
        cp.addActive(cp.query(".item", this.listDom, true));
        this.hideRightMenu();
    }

    noCheckedAll() {
        cp.removeActive(cp.query(".active", this.listDom, true));
        this.hideRightMenu();
    }

    removeChecked(target, target1) {
        if (target === target1) {
            cp.removeActive(cp.query(".active", target, true))
        }
    }

    copyLink() {
        cp.setClipboard(this.shareLikDom)
    }

    share(target) {
        let p = cp.parent(target, ".item");
        let fid = cp.getData(p);
        let name = cp.text(cp.query(".name", p));
        this.shareLikDom.value = CONF.WebAddr + "/pick?f=" + fid;
        this.shareNameDom.value = name;
        MODULE("window").show(this.shareWindowDom);
    }

    delete(target) {
        MODULE("dialog").show({
            type: "warn",
            text: "确定要删除?",
            confirm: close => {
                let p = cp.parent(target, ".item");
                let id = cp.getData(p);
                let url = CONF.ServerAddr + "/file/delete";
                if (MODULE("option").currNavigate().type === "recycleBucket") {
                    url = CONF.ServerAddr + "/file/remove";
                }
                cp.ajax(url, {
                    data: {
                        id: id
                    },
                    success: res => {
                        if (res.code === 0) {
                            cp.remove(p);
                            close()
                        } else {
                            console.error(res)
                        }
                    }
                });
            },
            cancel: close => close()
        });

    }

    download(target) {
        let p = cp.parent(target, ".item");
        let etag = cp.attr(p, "data-etag");
        let name = cp.text(cp.query(".name", p));
        let type = cp.attr(p, "data-type");
        if (window.global) {
            if (type === "folder") {
                MODULE("dialog").show({
                    text: "暂不支持下载目录"
                });
                return;
            }
            MODULE("dialog").show({
                text: "下载详情查看传输列表",
                confirm: hide => {
                    //后台下载
                    let res = ipc.sendSync("downloadFileMessageSync", etag, name);
                    console.log(res);
                    hide()
                }
            });
        } else {
            if (type === "folder") {
                MODULE("dialog").show({
                    text: "请使用客户端下载文件夹"
                });
                return
            }
            window.saveAs(CONF.QiniuAddr + "/" + etag, name);
        }
    }

    preview(target) {
        let p = cp.parent(target, ".item");
        let etag = cp.attr(p, "data-etag");
        let name = cp.text(cp.query(".name", p));
        let type = cp.attr(p, "data-type");
        let mime = cp.attr(p, "data-mime");

        if (type !== "image" && (type !== "video" && mime !== "video/mp4")) {
            MODULE("dialog").show({
                type: "warn",
                text: "此文件不支持预览"
            });
            return;
        }
        window.open(CONF.QiniuAddr + "/" + etag, "newwindow")
        //启用iframe预览
        /*MODULE("window").show(this.previewWindowDom, () => {
            console.log(111);
            this.previewIframe.src = CONF.QiniuAddr + "/" + etag;
        }, () => {
            this.previewIframe.src = "";
        });*/
    }

    loadFileList() {
        cp.empty(this.listDom);
        //清理所有进度
        this.cleanAllProgressSTO();
        let {key, type} = MODULE("option").currNavigate();
        let rType = MODULE("option").currRootNavigate().type;
        //console.log(rType);
        //隐藏不必要的菜单
        MODULE("option").hideForBucket(rType);
        //console.log(key, type);
        //自己所处的部门
        if (type === "departmentBucket") {
            let url = CONF.ServerAddr + "/file/departmentList";
            let postData = {};
            //加载列表
            this.showFileList(url, postData, () => {
                //并上公共的
                let url = CONF.ServerAddr + "/file/departmentPublic";
                //加载列表
                this.showFileList(url, {}, null, true)
            })
        }
        //回收站
        else if (type === "recycleBucket") {
            let url = CONF.ServerAddr + "/file/deleteList";
            let postData = {};
            //加载列表
            this.showFileList(url, postData)
        }
        //任务列表
        else if (type === "taskBucket" && window.global) {
            let progress = MODULE("option").currProgress;
            if (progress === "upload" || !progress) {//上传进度
                //默认打开上传列表
                this.uploadTaskList();
            } else if (progress === "download") {//下载进度
                //下载进度列表
                this.downloadTaskList();
            }
        }
        //TODO 我的文件
        else if (type === "myBucket") {
            let url = CONF.ServerAddr + "/file/myList";
            let postData = {
                pid: key
            };
            //加载列表
            this.showFileList(url, postData)
        }
        //TODO 展厅
        else if (type === "exhibitionBucket") {
            let url = CONF.ServerAddr + "/file/list";
            let postData = {
                pid: key
            };
            //加载列表
            this.showFileList(url, postData)
        }
        //TODO 分享
        else if (type === "shareBucket") {
            let url = CONF.ServerAddr + "/file/list";
            let postData = {
                pid: key
            };
            //加载列表
            this.showFileList(url, postData)
        }
        //TODO 这里有风险，只要有pid，就能进入任何文件，进入普通文件
        else {
            let url = CONF.ServerAddr + "/file/list";
            let postData = {
                pid: key
            };
            //加载列表
            this.showFileList(url, postData)
        }
    }

    showFileList(url, data, cb, retain = false) {
        cp.ajax(url, {
            data: data,
            success: res => {
                if (res.code === 0) {
                    this.drawList(res.data, retain);
                    if (window.global) {//客户端检查完成状态
                        let {type} = MODULE("option").currNavigate();
                        if (type !== "taskBucket" && type !== "recycleBucket") { //在非任务列表，非回收站，查询上传完成状态
                            this.checkUploadFinish();
                        }
                    }
                    if (cb && typeof cb === "function") {
                        cb();
                    }
                } else {
                    console.error(res)
                }
            }
        });
    }

    drawList(data, retain = false) {
        let html = "";
        let type = MODULE("option").currNavigate().type;
        let rType = MODULE("option").currRootNavigate().type;
        data.forEach(v => {
            html += `<div class="item ${v.state ? "loading" : ""} ${v.user}" 
                            draggable='true' 
                            
                            data-id="${v.id}" 
                            data-etag="${v.etag}" 
                            data-type="${v.type}" 
                            data-mime="${v.mime}">
                            <div class="inner">
                                <!-- icon -->
                                <div class="img enter centerWrap">
                                    ${v.type === "image" && v.state !== 2 //图片&&(正常||删除)
                ? `<div class="image centerBg" style="background-image:url(${CONF.QiniuAddr}/${v.etag}?${CONF.QiniuThumbnail})"></div>`
                : `${v.state === 2 //未传输完成
                    ? `<i class='iconfont animation_rotate'>&#xe6ab;</i><i class='iconfont hide'>${this.icon[v.type]}</i>`
                    : `<i class='iconfont'>${this.icon[v.type]}</i>`
                }`
            }       
                                </div>
                                
                                <!-- option -->
                                <div class="option ${v.state === 2 ? 'hide' : ''}">
                                    
                                    <!-- 预览按钮 -->
                                    ${(v.type === "image" || v.type === "video" || v.type === "richText" || v.type === "text")
                ? `<i class="preview iconfont icon alt" data-type="${v.type}">&#xe611;</i>`
                : ''
            }
                                    
                                    <!-- 分享按钮 -->
                                    ${type === "recycleBucket"
                ? ""
                : '<i class="share iconfont icon alt">&#xe602;</i>'
            }
                                    
                                    <!-- 下载按钮 -->
                                    <i class="download iconfont icon alt">&#xe635;</i>
                                    
                                    <!-- 删除按钮 -->
                                    ${(v.user === "own" && v.type !== "folder-user")
                ? '<i class="delete iconfont icon alt">&#xe624;</i>'
                : ""
            }
                                </div>
                                
                                <!-- name -->
                                <div class="name ellipsis">${v.name}</div>
                                
                            </div>
                        </div>`;
        });
        cp.html(this.listDom, html, retain ? "beforeend" : null);
    }

    //查询上传进度
    uploadProgress() {
        let res = ipc.sendSync("getUploadProgressMessageSync");
        let data = res.data;
        let uploadingDoms = cp.query(".loading", this.listDom, true);
        for (let key in data) {
            [...uploadingDoms].some(v => {
                if (cp.getData(v, "etag") === key) {
                    let imgDom = cp.query(".img", v);
                    let progressDom = cp.query(".progress", imgDom);
                    if (!progressDom) {
                        //移除旋转
                        cp.remove(".animation_rotate", v);
                        //创建progress
                        progressDom = cp.createDom("span", {
                            "class": "progress"
                        });
                        cp.append(imgDom, progressDom)
                    }
                    cp.text(progressDom, data[key] + "%");
                    if (parseInt(data[key]) >= 100) {
                        cp.remove(v);
                    }
                    return true
                }
            })
        }
        this.uploadProgressSTO = setTimeout(() => this.uploadProgress(), 1000)
    }

    autoSize() {
        let {width} = cp.domSize(this.listDom);
        /*
        //取模:不定长和基数取模
        let mod = width % this.defaultSize;
        //取商:不定长和基数取商
        let div = Math.floor(width / this.defaultSize);
        //取模的商
        let modDiv = mod / div;
        //基数加模的商
        let autoWidth = width + modDiv;
        */
        //自动适应的宽度
        let autoWidth = Math.floor(width % this.defaultSize / Math.floor(width / this.defaultSize) + this.defaultSize);

        //移除尺寸
        cp.removeClass(this.listDom, /^auto-/g);
        //目标类名
        let clazz = 'auto-' + autoWidth + '' + autoWidth;
        let selectorText = '#' + NAME + '> .list.' + clazz + ' > .item';
        //判断是否存在样式
        !cp.hasSheet(selectorText) && cp.setSheet(selectorText, {
            width: autoWidth + 'px',
            height: autoWidth + 'px'
        });
        cp.addClass(this.listDom, clazz);
    }

    enter(target) {
        let p = cp.parent(target, ".item");
        let type = cp.attr(p, "data-type");
        let folder = type.split("-");
        if (folder[0] === "folder") {//文件夹才可以进入
            let id = cp.getData(p);
            let name = cp.text(cp.query(".name", p));
            MODULE("option").setNavigate(id, name, type);
            this.loadFileList();
        }
    }

    uploadTaskList() {
        cp.empty(this.listDom);
        //上传的文件进度
        let res = ipc.sendSync("uploadListMessageSync");
        if (res.err === "") {
            if (res.data.length > 0) {
                let etags = res.data[0].split(",");
                //获取未完成的文件列表
                this.showFileList(CONF.ServerAddr + "/file/uploading", {
                    etags: etags
                }, () => this.uploadProgress()); //查询进度
            }
        } else {
            console.log(res)
        }
    }

    downloadTaskList() {
        cp.empty(this.listDom);
        //下载的文件进度
        let res = ipc.sendSync("downloadProgressMessageSync");
        if (res.err !== "") {
            return
        }
        res.data.forEach(v => {
            //size,progress
            v.id = "";
            v.type = "file";
            v.mime = "";
            v.state = 2
        });
        //画出页面
        this.drawList(res.data);


        let _this = this;
        (function downloadProgress() {
            let res = ipc.sendSync("downloadProgressMessageSync");
            let data = res.data;

            //找出界面上的loading
            let uploadingDoms = cp.query(".loading", _this.listDom, true);
            data.forEach(vd => {
                [...uploadingDoms].some(v => {
                    if (cp.getData(v, "etag") === vd.etag) {
                        let imgDom = cp.query(".img", v);
                        let progressDom = cp.query(".progress", imgDom);
                        if (!progressDom) {
                            //移除旋转
                            cp.remove(".animation_rotate", v);
                            //创建progress
                            progressDom = cp.createDom("span", {
                                "class": "progress"
                            });
                            cp.append(imgDom, progressDom)
                        }
                        cp.text(progressDom, vd.progress + "%");
                        if (parseInt(vd.progress) >= 100) {
                            cp.remove(v);
                        }
                        return true
                    }
                })
            });
            if (uploadingDoms.length) {
                _this.downloadProgressSTO = setTimeout(() => downloadProgress(), 1000)
            }
        })()
    }

    //检查上传完成
    checkUploadFinish() {
        let ids = [];
        cp.query(".own", this.listDom, true).forEach(v =>
            cp.hasClass(v, "loading") && ids.push(cp.getData(v)));
        //未完成的
        if (ids.length) {
            cp.ajax(CONF.ServerAddr + "/file/checkFinish", {
                data: {
                    ids: ids
                },
                success: res => {
                    if (res.code === 0) {
                        res.data.forEach(v => this.uploadFinish(v.id))
                    } else {
                        console.error(res)
                    }
                }
            });
        }
        //持续监听未完成的界面
        this.checkUploadFinishSTO = setTimeout(() => this.checkUploadFinish(), 2000)
    }

    //上传完成
    uploadFinish(id) {
        cp.query(".loading", this.listDom, true).forEach(v => {
            if (cp.getData(v) === id) {
                let imgDom = cp.query(".img", v);
                cp.removeClass(v, "loading");
                cp.remove(".animation_rotate", imgDom);
                cp.remove(".progress", imgDom);
                cp.show(cp.query(".hide", imgDom));
                return true
            }
        })
    }

    cleanAllProgressSTO() {
        clearTimeout(this.uploadProgressSTO);
        clearTimeout(this.downloadProgressSTO);
        clearTimeout(this.checkUploadFinishSTO);
    }

    showFileRightMenu(target, _, evt) {
        if (evt.button === 2) {
            let x = evt.clientX,
                y = evt.clientY;
            cp.css(this.fileRightMenuDom, {
                top: y + "px",
                left: x + "px"
            });
            cp.show(this.fileRightMenuDom);
            setTimeout(() => this.fileRightMenuDom.focus(), 100);
            cp.addActive(target);
            //记录到数组
            this.fileRightIdPush(cp.getData(target))
        }
    }

    fileRightIdPush(id) {
        //去掉前面的重复项
        this.fileRightIdDelete(id);
        //再加到后面
        app.fileRightClickId.push(id);
    }

    fileRightIdDelete(id) {
        app.fileRightClickId.forEach((v, i) => v === id && app.fileRightClickId.splice(i, 1));
    }

    showRightMenu(target, target1, evt) {
        if (target !== target1) {
            return
        }
        if (evt.button === 2) {
            let x = evt.clientX,
                y = evt.clientY;
            cp.css(this.rightMenuDom, {
                top: y + "px",
                left: x + "px"
            });
            cp.show(this.rightMenuDom);
            setTimeout(() => this.rightMenuDom.focus(), 100);
        }
    }

    hideFileRightMenu() {
        cp.hide(this.fileRightMenuDom)
    }

    hideRightMenu() {
        cp.hide(this.rightMenuDom)
    }

    showRenameWindow() {
        //取出最后一个元素
        let fileId = app.fileRightClickId.pop();
        if (!fileId) {
            return
        }
        //清空其数组
        app.fileRightClickId = [fileId];
        //选中对象
        let target = this.findFileDomByDataId(fileId);
        //还原选中
        cp.toggleActive(target);

        app.rightAction = "rename";
        MODULE("window").show(this.renameWindowDom, () => {
            this.renameWindowNameDom.value = cp.text(cp.query(".name", target));
        });
        this.hideFileRightMenu();
    }

    confirmRename() {
        if (!(app.rightAction === "rename" && app.fileRightClickId[0])) {
            return
        }
        let target = this.findFileDomByDataId(app.fileRightClickId[0]);
        let newName = this.renameWindowNameDom.value;
        let fileId = cp.getData(target);
        cp.ajax(CONF.ServerAddr + "/file/rename", {
            data: {
                id: fileId,
                name: newName
            },
            success: res => {
                if (res.code === 0) {
                    cp.text(cp.query(".name", target), newName);
                    app.rightAction = null;
                    app.fileRightClickId = [];
                    app.originFile = null;
                    MODULE("window").hide(this.renameWindowDom);
                } else {
                    console.error(res)
                }
            }
        });
    }

    copyFile() {
        app.rightAction = "copy";
        app.copyCutFile = app.fileRightClickId;
        app.fileRightClickId = [];
        app.originFile = MODULE("option").currNavigate().key;
        this.hideFileRightMenu();
    }

    cutFile() {
        app.rightAction = "cut";
        app.copyCutFile = app.fileRightClickId;
        app.fileRightClickId = [];
        app.originFile = MODULE("option").currNavigate().key;
        this.hideFileRightMenu();
    }

    pasteFile(dist = null) {
        //当前文件夹
        let currKey = dist || MODULE("option").currNavigate().key;
        let url = "";
        if (!app.copyCutFile.length) {
            this.hideRightMenu();
            return;
        }

        if (app.rightAction === "copy") {
            url = "/file/copy";
        } else if (app.rightAction === "cut") {
            //检查是否是同一个文件夹
            if (currKey === app.originFile) {
                this.hideRightMenu();
                app.copyCutFile = [];
                return;
            }
            url = "/file/cut";
        } else {
            return;
        }

        cp.ajax(CONF.ServerAddr + url, {
            data: {
                dist: currKey,
                file: app.copyCutFile
            },
            success: res => {
                if (res.code === 0) {
                    app.rightAction = null;
                    app.fileRightClickId = [];
                    app.originFile = null;
                    app.copyCutFile = [];
                    this.hideRightMenu();
                    this.loadFileList();
                } else {
                    console.error(res)
                }
            }
        });
    }

    findFileDomByDataId(dataId) {
        return [...cp.query(".item", this.listDom, true)].find(v => cp.getData(v) === dataId)
    }
}