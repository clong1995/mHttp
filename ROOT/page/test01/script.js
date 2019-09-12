class App {
    DOM() {

    }

    //初始化函数
    INIT() {
        setTimeout(() => {
            this.getModule("table").init(null, data => {
                console.log(data);
            });
        }, 1000)
    }

    //添加事件
    EVENT() {
        //cp.on('.guest', 'click', () => this.guestLogin());

    }
}