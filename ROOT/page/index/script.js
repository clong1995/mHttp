class App {
    DOM() {
        this.loginBoxDom = cp.query(".login-box");
        this.signinDom = cp.query(".signin", this.loginBoxDom);
        this.idDom = cp.query(".id > input", this.signinDom);
        this.pwdDom = cp.query(".pwd > input", this.signinDom);
        this.supportInfoDom = cp.query(".support-info", this.loginBoxDom);
        this.clientDownloadDom = cp.query(".client-download", this.loginBoxDom);
    }

    //初始化函数
    INIT() {
        if (!window.global) {
            cp.show(this.supportInfoDom);
            cp.show(this.clientDownloadDom);
        }

        let urlParam = cp.getQueryVar();
        if (urlParam["logout"]) {
            //清除token
            localStorage.clear();
        } else {
            //检查token
            let token = localStorage.getItem("Authorization");
            if (token) {
                //通知nodejs登录成功
                if (window.global) {
                    (function sendMessage() {
                        try {
                            ipc.sendSync("loginSuccessMessageSync", token);
                            cp.link("/project")
                        } catch (e) {
                            setTimeout(() => sendMessage(), 100)
                        }
                    })()
                } else {
                    cp.link("/project")
                }
            }
        }
    }

    //添加事件
    EVENT() {
        cp.on('.submit', this.signinDom, 'click', () => this.submit());
    }

    //提交
    submit() {
        let id = this.idDom.value,
            pwd = this.pwdDom.value;

        if (id === "" || pwd === "") {
            this.getModule("dialog").show({
                type: "warn",
                text: "请填写完整账号密码"
            });
        }
        cp.ajax(CONF.ServerAddr + "/auth/signin", {
            data: {
                email: id,
                password: pwd
            },
            success: res => {
                if (res.code === 0) {
                    localStorage.setItem("Authorization", res.data);
                    if (window.global) {
                        (function sendMessage() {
                            setTimeout(() => {
                                try {
                                    //告诉客户端登录成功了
                                    ipc.sendSync("loginSuccessMessageSync", res.data);
                                    //默认首页
                                    cp.link("/project")
                                } catch (e) {
                                    sendMessage();
                                }
                            }, 100)
                        })()
                    } else {
                        cp.link("/project")
                    }


                    //检查未完成的上传任务
                    //this.doRestartTask(res.data);
                    //setTimeout(() => {
                    //这里暂时延时处理，因为后期可能会把网盘独立，不耦合，或者有其他松耦合的方式
                    //}, 1000);
                } else {
                    console.error(res)
                }
            }
        })
    }
}