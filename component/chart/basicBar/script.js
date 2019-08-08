class Module {
    DOM() {
        this.echartsDom = cp.query(".echarts", DOMAIN);
    }

    EVENT() {

    }

    INIT() {
        cp.loadScriptAsync("/resource/lib/echarts/echarts.min.js");
        this.myChart = echarts.init(this.echartsDom);
        this.option = {
            title: {
                text: '基础柱状图'
            },
            tooltip: {},
            legend: {
                data: []
            },
            xAxis: {
                data: []
            },
            yAxis: {},
            series: []
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
                this.option.xAxis.data = [];
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
                });
                this.myChart.setOption(this.option);
                break
        }
    }
}