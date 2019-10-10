class App {
    DOM() {

    }

    //初始化函数
    INIT() {
        let E = window.wangEditor;
        let editor = new E('#editor');
        editor.customConfig.uploadImgShowBase64 = true;   // 使用 base64 保存图片
        editor.create();
        window.getValue = () => editor.txt.html();
        window.setValue = html => editor.txt.html(html)
    }

    //添加事件
    EVENT() {

    }
}