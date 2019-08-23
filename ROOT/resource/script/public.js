const CONF = {
    //IxD的地址
    IxDAddr: "http://127.0.0.1:19959"
};

const HEAD = () => {
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