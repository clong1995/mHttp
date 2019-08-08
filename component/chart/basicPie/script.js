class Module {
    DOM() {
        this.echartsDom = cp.query(".echarts", DOMAIN);
    }

    EVENT() {

    }

    INIT() {
        cp.loadScriptAsync("/resource/lib/echarts/echarts.js");
        this.myChart = echarts.init(this.echartsDom);
        this.option = {
            title: {
                text: '基础饼状图'
            },
            legend: {
                data: []
            },
            series: [
                {
                    type: 'pie',
                    data: []
                }
            ]
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
                this.option.series[0].data = [];
                this.option.legend.data = [];
                value.forEach((v, i) => {
                    if (!i) {
                        //表头
                        v.forEach((vv, ii) => {
                            if (ii) {
                                this.option.legend.data.push(vv);
                                this.option.series[0].data.push({
                                    name: vv
                                })
                            }
                        })
                    } else {
                        //数据
                        v.forEach((vv, ii) => {
                            if (ii) this.option.series[0].data[--ii]["value"] = vv
                        });
                    }
                });
                this.myChart.setOption(this.option);
                break
        }
    }
}