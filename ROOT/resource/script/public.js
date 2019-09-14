const CONF = {
    //IxD的地址
    //IxDAddr: "http://192.168.10.252:19959"
    IxDAddr: "http://127.0.0.1:19959"
};

//ajax的额外处理器
//消息头处理
const ajaxHeadersInterceptor = url => {
    let arr = url.split("/");
    let l = arr.pop(),
        p = arr.pop();
    if (p + "/" + l === "auth/signinAndSignup") {
        return {
            "Content-type": "application/x-www-form-urlencoded"
        }
    }

    //验证token
    let token = localStorage.getItem("Authorization");
    if (!token) {
        cp.link("/login");
        return;
    }
    return {
        "Content-type": "application/x-www-form-urlencoded",
        "Authorization": token
    }
};
//消息体处理
const ajaxResponseInterceptor = res => {
    //是否正确
    if (res.code !== 0) {
        if (res.code === 1) {
            //登录失败
            localStorage.removeItem("Authorization");
            cp.link("/login");
        } else {
            alert(res.msg);
            return false;
        }
    }
    return res;
};