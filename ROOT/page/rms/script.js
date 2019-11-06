class App {
    DOM() {

    }

    //初始化函数
    INIT() {
        //TODO 暂时这么处理，后端也会有统一的鉴权机制
    }

    //添加事件
    EVENT() {
        //cp.on('.guest', 'click', () => this.guestLogin());
    }

    //ready
    READY() {
        this.getModule("category").selectItem("rms");
    }
}