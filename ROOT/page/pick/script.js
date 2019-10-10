class App {
    DOM() {
        this.userDom = cp.query(".user");
        this.nameDom = cp.query(".name");
        this.sizeDom = cp.query(".size");
        this.pickBtnDom = cp.query(".pick-btn");
    }

    //初始化函数
    INIT() {
        this.pickFile();
        this.etag = "";
        this.name = "";
        this.size = 0;
        this.type = "";
    }

    //添加事件
    EVENT() {
        cp.on('.pick-btn', 'click', () => this.download());
    }

    download() {
        if (this.size > 20) {
            this.getModule("dialog").show({
                text: "请使用客户端下载大于20M的文件"
            });
            return;
        }
        this.getModule("dialog").show({
            type: "loading",
            text: "正在下载"
        });
        window.saveAs(CONF.QiniuAddr + "/" + this.etag, this.name, {
            success: () => {
                this.getModule("dialog").hide()
            }
        });
    }

    pickFile() {
        let token = localStorage.getItem("Authorization");
        if (!token) {
            this.getModule("dialog").show({
                text: "请登陆后访问分享链接",
                confirm: () => cp.link("/login")
            });
            return;
        }
        let id = cp.getQueryVar().f;
        cp.ajax(CONF.ServerAddr + "/file/info", {
            data: {
                id: id
            },
            success: res => {
                if (res.code === 0) {
                    cp.text(this.userDom, res.data.email + " 给您分享了：");
                    cp.text(this.nameDom, res.data.name);
                    cp.text(this.sizeDom, res.data.size + "M");
                    this.etag = res.data.etag;
                    this.name = res.data.name;
                    this.size = res.data.size;
                    this.type = res.data.type;
                } else {
                    console.error(res)
                }
            }
        })
    }
}