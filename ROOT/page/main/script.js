class App {
    DOM() {

    }

    //初始化函数
    INIT() {
        let project_scene = cp.getLocTempData();
        if (!project_scene) {
            cp.link('/content')
        } else {
            let arr = project_scene.split("_");
            //下面的请求同步
            if (arr.length === 1) {
                //获取当前项目下第一个
                this.scene = {
                    project: "xxx",
                    page: {
                        name: "xxxx",
                        size: {
                            width: 1920,
                            height: 1080,
                        },
                        background: {
                            color: "#cccccc",
                            image: "xxxx",
                        },
                        fill: 1,
                        flipOver: 1,
                        cover: "xxx",
                        comment: "xxx"
                    },
                    //场景列表，用于渲染切换场景的列表
                    scenes: [
                        {id: 1, name: "xxx", index: 1},
                        {id: 2, name: "aaa", index: 2}
                    ],
                    //当前的场景的组件
                    components: [
                        {
                            id: "xxxxxx",
                            index: "1",
                            "name": "幻灯片",
                            "size": {
                                "width": 640,
                                "height": 360
                            },
                            position: {
                                top: 700,
                                left: 700
                            },
                            "background": {
                                "color": "#000000",
                                "image": "xxxx.jpg"
                            },
                            "data": [
                                {
                                    "type": "xxx",
                                    "key": "xxx",
                                    "name": "xxx",
                                    "value": "xxxx"
                                },
                                {
                                    "type": "xxx",
                                    "key": "xxx",
                                    "name": "xxx",
                                    "value": "xxxx.png",
                                    "constraint": "xxx"
                                }
                            ]
                        }, {
                            id: "dddddd",
                            index: "2",
                            "name": "静态图片",
                            "size": {
                                "width": 840,
                                "height": 960
                            },
                            position: {
                                top: 0,
                                left: 0
                            },
                            "background": {
                                "color": "#ff0000",
                                "image": "xxxx.png"
                            },
                            "data": [
                                {
                                    "type": "xxx",
                                    "key": "xxx",
                                    "name": "xxx",
                                    "value": "xxxx"
                                },
                                {
                                    "type": "xxx",
                                    "key": "xxx",
                                    "name": "xxx",
                                    "value": "xxxx.png",
                                    "constraint": "xxx"
                                }
                            ]
                        },
                    ]
                }
            } else {
                //获取指定的场景
                this.scene = {
                    //场景所属的项目
                    project: "xxx",
                    //场景的页面设置
                    page: {
                        name: "xxxx",
                        size: {
                            width: 1920,
                            height: 1080,
                        },
                        background: {
                            color: "#cccccc",
                            image: "xxxx",
                        },
                        fill: 1,
                        flipOver: 1,
                        cover: "xxx",
                        comment: "xxx"
                    },
                    //场景列表，用于渲染切换场景的列表
                    scenes: [
                        {id: 1, name: "xxx"},
                        {id: 2, name: "aaa"}
                    ],
                    //当前的场景的组件
                    components: [
                        {
                            id: "xxxxxxx",
                            index: "1",
                            "name": "幻灯片",
                            "size": {
                                "width": 640,
                                "height": 360
                            },
                            position: {
                                top: 700,
                                left: 700
                            },
                            "background": {
                                "color": "#000000",
                                "image": "xxxx.jpg"
                            },
                            "data": [
                                {
                                    "type": "xxx",
                                    "key": "xxx",
                                    "name": "xxx",
                                    "value": "xxxx"
                                },
                                {
                                    "type": "xxx",
                                    "key": "xxx",
                                    "name": "xxx",
                                    "value": "xxxx.png",
                                    "constraint": "xxx"
                                }
                            ]
                        }, {
                            id: "dddddd",
                            index: "2",
                            "name": "静态图片",
                            "size": {
                                "width": 840,
                                "height": 960
                            },
                            position: {
                                top: 0,
                                left: 0
                            },
                            "background": {
                                "color": "#ff0000",
                                "image": "xxxx.png"
                            },
                            "data": [
                                {
                                    "type": "xxx",
                                    "key": "xxx",
                                    "name": "xxx",
                                    "value": "xxxx"
                                },
                                {
                                    "type": "xxx",
                                    "key": "xxx",
                                    "name": "xxx",
                                    "value": "xxxx.png",
                                    "constraint": "xxx"
                                }
                            ]
                        },
                    ]
                }
            }
        }
    }

    //添加事件
    EVENT() {

    }

    getPageData() {
        return this.scene.page
    }

    //获取配置数据
    getComponentData(id) {
        let compontent = null;
        this.scene.components.some(v => {
            if (v.id === id) {
                compontent = v;
                return true
            }
        });
        return compontent
    }
}