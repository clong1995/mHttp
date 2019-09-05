class Module {
    DOM() {
        this.echartsDom = cp.query(".echarts", DOMAIN);
    }

    EVENT() {

    }

    INIT() {
        cp.loadScriptAsync("/resource/lib/echarts/echarts.min.js");
        cp.loadScriptAsync("/resource/lib/echarts/echarts-wordcloud.min.js");
        this.myChart = echarts.init(this.echartsDom);
        this.option = {
            series: [{
                type: 'wordCloud',
                //sizeRange: [0, 200],
                textStyle: {
                    normal: {
                        color: cp.randomColor
                    }
                },
                data: [
                    {
                        name: 'Sam S Club',
                        value: 100
                    },
                    {
                        name: 'Macys',
                        value: 60
                    },
                    {
                        name: 'Amy Schumer',
                        value: 40
                    },
                    {
                        name: 'Jurassic World',
                        value: 40
                    },
                    {
                        name: 'Charter Communications',
                        value: 20
                    },
                    {
                        name: 'Chick Fil A',
                        value: 20
                    },
                    {
                        name: 'Planet Fitness',
                        value: 10
                    },
                    {
                        name: 'Pitch Perfect',
                        value: 10
                    },
                    {
                        name: 'Express',
                        value: 10
                    },
                    {
                        name: 'Home',
                        value: 10
                    },
                    {
                        name: 'Johnny Depp',
                        value: 10
                    },
                    {
                        name: 'Lena Dunham',
                        value: 10
                    },
                    {
                        name: 'Lewis Hamilton',
                        value: 10
                    },
                    {
                        name: 'KXAN',
                        value: 10
                    },
                    {
                        name: 'Mary Ellen Mark',
                        value: 10
                    },
                    {
                        name: 'Farrah Abraham',
                        value: 10
                    },
                    {
                        name: 'Rita Ora',
                        value: 10
                    },
                    {
                        name: 'Serena Williams',
                        value: 10
                    },
                    {
                        name: 'NCAA baseball tournament',
                        value: 1
                    },
                    {
                        name: 'Point Break',
                        value: 10
                    }
                ]
            }]
        };
    }

    /**
     * 当右侧的配置改变的时候，就会自动调用这个方法，给你返回修改的数据
     * @param key
     * @param value
     * @constructor
     */
    OPTION(key, value) {
        console.log(key, "=>", value);
        //相应大小变化
        switch (key) {
            //改变大小
            case "width":
            case "height":
                this.myChart.resize();
                break;
            //改变数据
            case "data":
                /*this.option.xAxis.data = [];
                this.option.legend.data = [];
                this.option.series = [];
                value.forEach((v, i) => {
                    if (!i) {
                        //表头
                        v.forEach((vv, ii) => {
                            if (ii) {
                                this.option.xAxis.data.push(vv);
                            }
                        })
                    } else {
                        //数据
                        v.forEach((vv, ii) => {
                            if (!ii) {
                                this.option.legend.data.push(vv);
                                this.option.series.push({
                                    name: vv,
                                    type: 'bar',
                                    data: []
                                });
                            } else {
                                this.option.series[i - 1].data.push(vv)
                            }
                        });
                    }
                });*/
                this.myChart.setOption(this.option);
                break
        }
    }
}