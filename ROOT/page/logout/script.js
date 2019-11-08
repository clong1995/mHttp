class App {
    DOM() {
    }
    //初始化函数
    INIT() {
        localStorage.clear();
        sessionStorage.clear();
        (function sendMessage() {
            try {
                ipc.sendSync("logoutMessageSync");
            } catch (e) {
                setTimeout(() => sendMessage(), 100)
            }
        })()
    }
    //添加事件
    EVENT() {
    }
}