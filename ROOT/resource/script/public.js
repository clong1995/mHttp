const CONF = {
    //IxD的地址
    //IxDAddr: "http://192.168.10.252:19959"
    IxDAddr: "http://127.0.0.1:50001",
    QiniuAddr: "http://storage.quickex.com.cn",
    QiniuThumbnail: "imageMogr2/thumbnail/100x100>/blur/1x0/quality/75"
};

//ajax的额外处理器
//消息头处理
const ajaxHeadersInterceptor = url => {
    let arr = url.split("/");
    let l = arr.pop(),
        p = arr.pop();
    if (p + "/" + l === "auth/signin") {
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
    if (res.code !== 0) {
        if (res.code === 2) { //认证错误
            localStorage.removeItem("Authorization");
            cp.link("/login");
        } else if (res.code === 3) {
            //请求异常
        } else if (res.code === 4) {
            //参数异常
        }
        console.error(res);
        //终止程序
        return false;
    }
    return res;
};