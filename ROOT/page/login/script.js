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
        let client = cp.getQueryVar().client;
        if (client) {
            localStorage.setItem("client", "true");
        } else {
            localStorage.removeItem("client");
            cp.show(this.supportInfoDom);
            cp.show(this.clientDownloadDom);
        }

        //检查token
        /*let token = localStorage.getItem("Authorization");
        if (token) {
            //跳转
            cp.link("/project")
        }*/
    }

    //添加事件
    EVENT() {
        cp.on('.submit', this.signinDom, 'click', () => this.submit());
    }

    doRestartTask(token) {
        external.invoke ? external.invoke(JSON.stringify({
            key: "restartTask",
            data: token
        })) : restartTask(token)
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
                    //检查未完成的上传任务
                    this.doRestartTask(res.data);
                    setTimeout(() => {
                        //这里暂时延时处理，因为后期可能会把网盘独立，不耦合，或者有其他松耦合的方式
                        cp.link("/project")
                    }, 1000);
                } else {
                    console.error(res)
                }
            }
        })
    }
}