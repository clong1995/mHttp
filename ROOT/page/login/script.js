class App {
    DOM() {
        this.signinDom = cp.query(".signin");
        this.idDom = cp.query(".id > input", this.signinDom);
        this.pwdDom = cp.query(".pwd > input", this.signinDom);
    }

    //初始化函数
    INIT() {
        //检查token
        let token = localStorage.getItem("Authorization");
        if (token) {
            //跳转
            cp.link("/project")
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
        cp.ajax(CONF.IxDAddr + "/auth/signinAndSignup", {
            data: {
                email: id,
                password: pwd
            },
            success: res => {
                if (res.code === 0) {
                    localStorage.setItem("Authorization", res.data);
                    cp.link("/project")
                } else {
                    this.getModule("dialog").show({
                        type: "warn",
                        text: "账号密码错误！"
                    });
                }
            }
        })
    }
}