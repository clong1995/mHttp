class App {
    DOM() {

    }

    //初始化函数
    INIT() {
        let token = localStorage.getItem("Authorization");

        //重启上传列表
        (function sendMessage() {
            try {
                let res = ipc.sendSync("uploadRestartTaskMessageSync", token);
                console.log(res);
            } catch (e) {
                setTimeout(() => sendMessage(), 100);
            }
        })()
    }

    //添加事件
    EVENT() {
        //cp.on('.guest', 'click', () => this.guestLogin());
    }

    //ready
    READY() {
        this.getModule("category").selectItem("storage");
    }
}