class App {
    DOM() {

    }

    //初始化函数
    INIT() {
        let token = localStorage.getItem("Authorization");
        //重启任务列表
        (function sendMessage() {
            try {
                ipc.sendSync("uploadRestartTaskMessageSync", token);
                ipc.sendSync("downloadRestartTaskMessageSync", token);
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