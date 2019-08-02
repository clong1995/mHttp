class Module {
    DOM() {
        // this.addContentDom = coo.query('.addContent', DOMAIN);
    }

    EVENT() {
        // coo.on('.close', this.domain, 'click', t => this.hideStory());
    }

    INIT() {
        this.authUrl = "http://quickex.com.cn:10104/auth/qiniu";
        this.downloadUrl = "http://img.quickex.com.cn";
        this.status = null;
        //加载七牛sdk
        cp.loadScript("https://unpkg.com/qiniu-js/dist/qiniu.min.js", () => {
        })
    }

    upload(fileDom, cb) {
        let files = fileDom.files;

        //多文件
        if (files.length !== 1) {
            MODULE("dialog").show({
                text: "一次只允许上传一个文件"
            });
            return
        }

        //超大文件
        let file = files[0];
        let size = file.size / Math.pow(1024, 2);
        if (size > 10) {
            MODULE("dialog").show({
                text: "文件超大，请使用上传器上传"
            });
            return;
        }

        //获取七牛的token，七牛的凭证只有1小时，保险起见，这里每次都请求新的
        let xhr = new XMLHttpRequest();
        xhr.onload = () => {
            //七牛返回的token和本次文件的key
            let res = JSON.parse(xhr.responseText).data;

            //上传
            let putExtra = {
                fname: file.name
            };

            let observable = qiniu.upload(file, res.upKey, res.upToken, putExtra, {
                useCdnDomain: true
            });

            //TODO 七牛内方法的的指向改不了呢，回头再研究
            let _this = this;
            // 上传开始
            observable.subscribe({
                next(res) {
                    //出现等待窗
                    if (_this.status === null) {
                        _this.status = "loading";
                        _this.APP.getModule("dialog").show({
                            type: "loading",
                            text: "完成" + res.total.percent + "%"
                        });
                    } else {
                        _this.APP.getModule("dialog").text("完成" + res.total.percent.toFixed(2) + "%");
                    }
                },
                error(err) {
                    console.error(err);
                    _this.APP.getModule("dialog").hide().show({
                        type: "error",
                        text: "未知错误"
                    });
                },
                complete(res) {
                    res.name = file.name;
                    res.url = _this.downloadUrl + "/" + res.key;
                    res.size = size;
                    //TODO 记录文件
                    cb && typeof cb === 'function' && cb(res);
                    _this.APP.getModule("dialog").text("上传完成");
                    setTimeout(() => {
                        this.status = null;
                        _this.APP.getModule("dialog").hide();
                    }, 500)
                }
            })

        };
        xhr.open("GET", this.authUrl, false);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.setRequestHeader("Authorization", localStorage.getItem("Authorization"));
        xhr.send(null);
    }
}