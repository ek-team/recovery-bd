var symptomName = last_month_day();
var lineChart = null
var lineChart1 = null
var histogramChart = null
var pieChart1 = null
var collectedDayData = []
var patientNumDayData = []
var recoveryBillData = []
var areaCollectedData = []
var pieLegendData = []
var collectedDayLegend = []
var patientNumLegend = []
var recoveryBillLegend = []
var colorPalette = ["#87cefa", "#ff7f50", "#32cd32", "#da70d6", '#3498DB', '#27AE60', '#E74C3C', '#9B59B6', '#F39C12', '#C0392B'];

$(function () {
    init();
    init2();
    $("#el-dialog").addClass("hide");
    $(".close").click(function (event) {
        $("#el-dialog").addClass("hide");
    });

    var date = new Date();
    var numble = date.getDate();
    var today = getFormatMonth(new Date());
    $("#date1").html(today);
    $("#date2").html(today);
    $("#date3").html(today);
    $("#date4").html(today);


    lay('.demo-input').each(function () {
        laydate.render({
            type: 'month',
            elem: this,
            trigger: 'click',
            theme: '#95d7fb',
            calendar: true,
            showBottom: true,
            done: function () {
                console.log($("#startDate").val())

            }
        })
    });

})
function init() {
    lineChart = echarts.init(document.getElementById('lineChart'));
    lineChart1 = echarts.init(document.getElementById('lineChart2'));
    histogramChart = echarts.init(document.getElementById('histogramChart'));
    pieChart1 = echarts.init(document.getElementById('pieChart1'));
    getChartsData(1)
    getChartsData(2)
    getChartsData(3)
    fetch('https://pharos3.ewj100.com/dataCount/get', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    }).then(response => {
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.status}`);
        }
        return response.json(); // 解析JSON响应
    })
        .then(data => {
            const totalCollectedElement = document.getElementById('totalCollected');
            const monthlyCollectedElement = document.getElementById('monthlyCollected');
            const totalRecoveryNumElement = document.getElementById('totalRecoveryNum');
            const monthlyRecoveryNumElement = document.getElementById('monthlyRecoveryNum');
            const totalHomeRecoveryNumElement = document.getElementById('totalHomeRecoveryNum');
            const monthlyHomeRecoveryNumElement = document.getElementById('monthlyHomeRecoveryNum');
            if (data.code == 0) {
                let resData = data.data
                totalCollectedElement.textContent = resData.totalCollected
                monthlyCollectedElement.textContent = resData.monthlyCollected
                totalRecoveryNumElement.textContent = resData.totalRecoveryNum
                monthlyRecoveryNumElement.textContent = resData.monthlyRecoveryNum
                totalHomeRecoveryNumElement.textContent = resData.totalHomeRecoveryNum
                monthlyHomeRecoveryNumElement.textContent = resData.monthlyHomeRecoveryNum
            }
            console.log('Response data topic:', data);
        })
        .catch(error => {
            console.error('Fetch error:', error);
        });


    //地图
    var mapChart = echarts.init(document.getElementById('mapChart'));
    mapChart.setOption({
        bmap: {
            center: [120.595287, 31.303565],
            zoom: 12,
            roam: true,

        },
        tooltip: {
            trigger: 'item',
            formatter: function (params, ticket, callback) {
                return params.value[2]
            }
        },
        series: [{
            type: 'scatter',
            coordinateSystem: 'bmap',
            roam: true,
            itemStyle: {
                emphasis: {
                    areaColor: '#F39C12', // 高亮时的区域颜色
                },
            },
            // markPoint: {
            //     symbol: 'pin', // 标记点样式为图钉
            //     data: [
            //         { name: '西8病区', value: [120.590726, 31.301557] },
            //         { name: '东17病区', value: [120.520274, 31.381822] },
            //         { name: '卒中单元', value: [120.590726, 31.301559] },
            //         { name: '重症病区', value: [120.590726, 31.301555] },
            //         { name: '浒关院区', value: [120.520242, 31.381879] },

            //     ],
            // },
            data: [
                [120.595287, 31.303565, '苏州市'],
                [120.590726, 31.301557, '西8病区'],
                [120.520274, 31.381822, '东17病区'],
                [120.590726, 31.301559, '卒中单元'],
                [120.590726, 31.301555, '重症病区'],
                [120.520242, 31.381879, '浒关院区'],
            ]
        }]
    });
    mapChart.on('click', function (params) {
        $("#el-dialog").removeClass('hide');
        $("#reportTitle").html(params.value[2]);
    });

    var bmap = mapChart.getModel().getComponent('bmap').getBMap()
    bmap.addControl(new BMap.MapTypeControl({ mapTypes: [BMAP_NORMAL_MAP, BMAP_SATELLITE_MAP] }));
    bmap.setMapStyle({ style: 'midnight' })
}
function getChartsData(type) {
    const apiUrl = 'https://pharos3.ewj100.com/dataArea/get';
    const params = new URLSearchParams({
        type: type,
    });

    // 将参数拼接在URL的末尾
    const urlWithParams = `${apiUrl}?${params.toString()}`;
    fetch(urlWithParams, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            // 可以添加其他头部信息
        },
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // console.log('Response data:', JSON.stringify(data.data));
            if (data.code == 0) {
                const today = new Date();
                today.setDate(today.getDate() + 1);  // 向前推算一天
                if (type == 1) {
                    collectedDayData = data.data.map(area => {
                        const sumData = area.timeData.reduce((total, timeData) => total + parseInt(timeData.data), 0);
                        return {
                            name: area.name,
                            time: area.timeData.map(timeData => timeData.time),
                            data: area.timeData.map(timeData => parseInt(timeData.data)),
                            // timeData: area.timeData.map(timeData => [timeData.time, parseInt(timeData.data)]),//组成一个二维数组
                            timeData: area.timeData.map(timeData => {
                                const baseTime = new Date(today);  // 使用当天的时间作为基准
                                baseTime.setHours(0, 0, 0, 0);  // 将时、分、秒、毫秒置为0
                                baseTime.setDate(baseTime.getDate() - parseInt(timeData.time));  // 向前推算时间
                                const month = baseTime.getMonth() + 1;  // 月份从0开始，所以需要+1
                                const day = baseTime.getDate();
                                return [`${month}/${day}`, parseInt(timeData.data)];
                            }),
                            sumData: sumData
                        };
                    });
                    console.log("Transform data", collectedDayData)
                    collectedDayLegend = collectedDayData.map(area => area.name);
                    areaCollectedData = collectedDayData.map(area => {
                        return {
                            name: area.name,
                            value: area.sumData
                        };
                    });
                    initPie(pieChart1, areaCollectedData, collectedDayLegend)
                    initLineChart(lineChart, collectedDayData, collectedDayLegend, 1)
                } else if (type == 2) {
                    patientNumDayData = data.data.map(area => {
                        return {
                            name: area.name,
                            time: area.timeData.map(timeData => timeData.time),
                            data: area.timeData.map(timeData => parseInt(timeData.data)),
                            timeData: area.timeData.map(timeData => {
                                const baseTime = new Date(today);  // 使用当天的时间作为基准
                                baseTime.setHours(0, 0, 0, 0);  // 将时、分、秒、毫秒置为0
                                baseTime.setDate(baseTime.getDate() - parseInt(timeData.time));  // 向前推算时间
                                const month = baseTime.getMonth() + 1;  // 月份从0开始，所以需要+1
                                const day = baseTime.getDate();
                                return [`${month}/${day}`, parseInt(timeData.data)];
                            }),
                        };
                    });
                    patientNumLegend = patientNumDayData.map(area => area.name);
                    initLineChart(lineChart1, patientNumDayData, patientNumLegend, 2)
                } else if (type == 3) {
                    recoveryBillData = data.data.map(area => {
                        return {
                            name: area.name,
                            time: area.timeData.map(timeData => timeData.time),
                            data: area.timeData.map(timeData => parseInt(timeData.data)),
                            timeData: area.timeData.map(timeData => [timeData.time, parseInt(timeData.data)]),//组成一个二维数组
                        };
                    });
                    recoveryBillLegend = recoveryBillData.map(area => area.name);
                    initBar(histogramChart, recoveryBillData, recoveryBillLegend)
                    // initLineChart(lineChart1, recoveryBillData, recoveryBillLegend)
                }
            }

            // console.log("Transform data", recoveryBillData)
            // console.log("Transform name", recoveryBillLegend)
        })
        .catch(error => {
            console.error('Fetch error:', error);
        });
}
function initLineChart(lineChart, dataSet, legend, lineType) {
    var option = {
        // color: ["#87cefa", "#ff7f50", "#32cd32", "#da70d6",],
        legend: {
            y: '260',
            x: 'center',
            textStyle: {
                color: '#ffffff',

            },
            // data: ['西8病区', '东17病区', '卒中单元', '重症病区',],
            data: legend,
        },
        calculable: false,
        tooltip: {
            trigger: 'item',
            formatter: lineType == 1 ? "{a}<br/>{b}<br/>{c}k" : "{a}<br/>{b}<br/>{c}"
        },
        yAxis: [
            {
                type: 'value',
                axisLine: { onZero: false },
                axisLine: {
                    lineStyle: {
                        color: '#034c6a'
                    },
                },

                axisLabel: {
                    textStyle: {
                        color: '#fff'
                    },
                    formatter: function (value) {
                        return value + (lineType == 1 ? "k" : '')
                    },
                },
                splitLine: {
                    lineStyle: {
                        width: 0,
                        type: 'solid'
                    }
                }
            }
        ],
        xAxis: [
            {
                type: 'category',
                // data: ['8:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'],
                axisLine: {
                    lineStyle: {
                        color: '#034c6a'
                    },
                },
                splitLine: {
                    "show": false
                },
                axisLabel: {
                    textStyle: {
                        color: '#fff'
                    },
                    formatter: function (value) {
                        return value + ""
                    },
                },
                splitLine: {
                    lineStyle: {
                        width: 0,
                        type: 'solid'
                    }
                },
            }
        ],
        grid: {
            left: '5%',
            right: '5%',
            bottom: '20%',
            containLabel: true
        },
        series: [

        ]
    }


    dataSet.forEach(function (series, index) {
        var seriesItem = {
            name: series.name,
            type: 'line',
            smooth: true,
            data: series.timeData.reverse(),
            color: colorPalette[index % colorPalette.length], // 使用颜色调色板
            lineStyle: {
                normal: {
                    lineStyle: {
                        shadowColor: 'rgba(0,0,0,0.4)'
                    }
                },

            },
        };
        option.series.push(seriesItem);
    });
    lineChart.setOption(option);
}
function initBar(histogramChart, dataSet, legend) {
    var option = {
        // color: ["#87cefa", "#ff7f50", "#32cd32", "#da70d6",],
        legend: {
            y: '250',
            x: 'center',
            data: legend,
            textStyle: {
                color: '#ffffff',

            }
        },

        calculable: false,

        grid: {
            left: '5%',
            right: '5%',
            bottom: '20%',
            containLabel: true
        },

        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },

        xAxis: [
            {
                type: 'value',
                axisLabel: {
                    show: true,
                    textStyle: {
                        color: '#fff'
                    }
                },
                splitLine: {
                    lineStyle: {
                        color: ['#f2f2f2'],
                        width: 0,
                        type: 'solid'
                    }
                }

            }
        ],

        yAxis: [
            {
                type: 'category',
                data: ['早康人数(人)', '住院人次(人)', '人均费用(元)'],
                axisLabel: {
                    show: true,
                    textStyle: {
                        color: '#fff'
                    }
                },
                splitLine: {
                    lineStyle: {
                        width: 0,
                        type: 'solid'
                    }
                }
            }
        ],

        series: [
            // {
            //     name: dataSet[0].name,
            //     type: 'bar',
            //     stack: '总量',
            //     itemStyle: { normal: { label: { show: true, position: 'insideRight' } } },
            //     data: dataSet[0].data
            // },
            // {
            //     name: dataSet[1].name,
            //     type: 'bar',
            //     stack: '总量',
            //     itemStyle: { normal: { label: { show: true, position: 'insideRight' } } },
            //     data: dataSet[1].data
            // },
            // {
            //     name: dataSet[2].name,
            //     type: 'bar',
            //     stack: '总量',
            //     itemStyle: { normal: { label: { show: true, position: 'insideRight' } } },
            //     data: dataSet[2].data
            // },
            // {
            //     name: dataSet[3].name,
            //     type: 'bar',
            //     stack: '总量',
            //     itemStyle: { normal: { label: { show: true, position: 'insideRight' } } },
            //     data: dataSet[3].data
            // }

        ]
    }

    dataSet.forEach(function (series, index) {
        var seriesItem = {
            name: series.name,
            type: 'bar',
            stack: '总量',
            data: series.data.reverse(),
            color: colorPalette[index % colorPalette.length], // 使用颜色调色板
            // lineStyle: {
            //     normal: { label: { show: true, position: 'insideRight' } }
            // },
            label: { show: true, position: 'insideRight' }
        };
        option.series.push(seriesItem);
    });
    histogramChart.setOption(option);
}
function initPie(pieChart1, dataSet, legend) {
    var option = {
        // color: ["#87cefa", "#ff7f50", "#32cd32", "#da70d6",],
        color: [],
        legend: {
            y: '260',
            x: 'center',
            textStyle: {
                color: '#ffffff',
            },
            data: legend,
        },
        tooltip: {
            trigger: 'item',
            formatter: "{a}<br/>{b}<br/>{c}G ({d}%)"
        },
        calculable: false,
        series: [
            {
                name: '采集数据量',
                type: 'pie',
                radius: ['40%', '70%'],
                center: ['50%', '45%'],
                itemStyle: {
                    normal: {
                        label: {
                            show: false
                        },
                        labelLine: {
                            show: false
                        }
                    },
                    emphasis: {
                        label: {
                            show: true,
                            position: 'center',
                            textStyle: {
                                fontSize: '20',
                                fontWeight: 'bold'
                            }
                        }
                    }
                },
                data: [
                    // { value: dataSet[0].value, name: dataSet[0].name },
                    // { value: dataSet[1].value, name: dataSet[1].name },
                    // { value: dataSet[2].value, name: dataSet[2].name },
                    // { value: dataSet[3].value, name: dataSet[3].name }

                ]
            }
        ]
    }
    dataSet.forEach(function (series, index) {
        var seriesItem = {
            value: series.value,
            name: series.name,
            itemStyle: {
                color: colorPalette[index % colorPalette.length], // 设置扇区颜色
            },
        };
        option.series[0].data.push(seriesItem);
    });
    pieChart1.setOption(option);
}
function init2() {
    var lineChart3 = echarts.init(document.getElementById('lineChart3'));
    lineChart3.setOption({

        color: ["#87cefa", "#ff7f50",],
        legend: {
            y: 'top',
            x: 'center',
            textStyle: {
                color: '#ffffff',

            },
            data: ['早康人次', '住院人次'],
        },
        calculable: false,
        tooltip: {
            trigger: 'item',
            formatter: "{a}<br/>{b}<br/>{c}人"
        },
        dataZoom: {
            show: true,
            realtime: true,
            start: 0,
            end: 18,
            height: 20,
            backgroundColor: '#f8f8f8',
            dataBackgroundColor: '#e4e4e4',
            fillerColor: '#87cefa',
            handleColor: '#87cefa',
        },
        yAxis: [
            {
                type: 'value',
                axisLine: { onZero: false },
                axisLine: {
                    lineStyle: {
                        color: '#034c6a'
                    },
                },

                axisLabel: {
                    textStyle: {
                        color: '#fff'
                    },
                    formatter: function (value) {
                        return value + "人"
                    },
                },
                splitLine: {
                    lineStyle: {
                        width: 0,
                        type: 'solid'
                    }
                }
            }
        ],
        xAxis: [
            {
                type: 'category',
                data: symptomName,
                boundaryGap: false,
                axisLine: {
                    lineStyle: {
                        color: '#034c6a'
                    },
                },
                splitLine: {
                    "show": false
                },
                axisLabel: {
                    textStyle: {
                        color: '#fff'
                    },
                    formatter: function (value) {
                        return value + ""
                    },
                },
                splitLine: {
                    lineStyle: {
                        width: 0,
                        type: 'solid'
                    }
                },
            }
        ],
        grid: {
            left: '5%',
            right: '5%',
            bottom: '20%',
            containLabel: true
        },
        series: [
            {
                name: '早康费用',
                type: 'line',
                smooth: true,
                itemStyle: {
                    normal: {
                        lineStyle: {
                            shadowColor: 'rgba(0,0,0,0.4)'
                        }
                    }
                },
                data: [1150, 180, 2100, 2415, 1212.1, 3125, 1510, 810, 2100, 2415, 1122.1, 3215, 1510, 801, 2001, 2245, 1232.1, 3245, 1520, 830, 2200, 2145, 1223.1, 3225, 150, 80, 200, 245, 122.1, 325]
            },
            {
                name: '住院费用',
                type: 'line',
                smooth: true,
                itemStyle: {
                    normal: {
                        lineStyle: {
                            shadowColor: 'rgba(0,0,0,0.4)'
                        }
                    }
                },
                data: [2500, 1000, 3000, 5005, 3200.1, 3005, 2500, 1000, 3000, 5005, 3200.1, 3005, 2500, 1000, 3000, 5005, 3200.1, 3005, 2500, 1000, 3000, 5005, 3200.1, 3005, 2500, 1000, 3000, 5005, 3200.1, 3005, 2500, 1000, 3000, 5005, 3200.1, 3005,]
            },
        ]
    });


    var lineChart4 = echarts.init(document.getElementById('lineChart4'));
    lineChart4.setOption({

        color: ["#87cefa", "#ff7f50",],
        calculable: false,
        tooltip: {
            trigger: 'item',
            formatter: "{a}<br/>{b}<br/>{c}元"
        },
        dataZoom: {
            show: true,
            realtime: true,
            start: 0,
            end: 18,
            height: 20,
            backgroundColor: '#f8f8f8',
            dataBackgroundColor: '#e4e4e4',
            fillerColor: '#87cefa',
            handleColor: '#87cefa',
        },
        yAxis: [
            {
                type: 'value',
                axisLine: { onZero: false },
                axisLine: {
                    lineStyle: {
                        color: '#034c6a'
                    },
                },

                axisLabel: {
                    textStyle: {
                        color: '#fff'
                    },
                    formatter: function (value) {
                        return value + "元"
                    },
                },
                splitLine: {
                    lineStyle: {
                        width: 0,
                        type: 'solid'
                    }
                }
            }
        ],
        xAxis: [
            {
                type: 'category',
                data: symptomName,
                boundaryGap: false,
                axisLine: {
                    lineStyle: {
                        color: '#034c6a'
                    },
                },
                splitLine: {
                    "show": false
                },
                axisLabel: {
                    textStyle: {
                        color: '#fff'
                    },
                    formatter: function (value) {
                        return value + ""
                    },
                },
                splitLine: {
                    lineStyle: {
                        width: 0,
                        type: 'solid'
                    }
                },
            }
        ],
        grid: {
            left: '5%',
            right: '5%',
            bottom: '20%',
            containLabel: true
        },
        series: [
            {
                name: '医疗费用',
                type: 'line',
                smooth: true,
                itemStyle: {
                    normal: {
                        lineStyle: {
                            shadowColor: 'rgba(0,0,0,0.4)'
                        }
                    }
                },
                data: [1500, 800, 1200, 2450, 1122.1, 1325, 1150, 180, 1200, 1245, 1122.1, 1325, 150, 180, 1200, 2145, 1212.1, 3215, 1510, 180, 2100, 2415, 122.1, 325, 150, 80, 200, 245, 122.1, 325].reverse()
            },
        ]
    });

    //年龄分布
    var pieChart2 = echarts.init(document.getElementById('pieChart2'));
    pieChart2.setOption({
        color: ["#32cd32", "#ff7f50", "#87cefa", "#FD6C88", "#4b5cc4", "#faff72"],
        tooltip: {
            trigger: 'item',
            formatter: "{a}<br/>{b}<br/>{c}人"
        },
        calculable: true,
        series: [
            {
                name: '发病人数',
                type: 'pie',
                radius: [30, 110],
                center: ['50%', '50%'],
                roseType: 'area',
                x: '50%',



                sort: 'ascending',
                data: [
                    { value: 10, name: '婴儿(1-3岁)' },
                    { value: 5, name: '少儿(4-10岁)' },
                    { value: 15, name: '少年(10-18岁)' },
                    { value: 25, name: '青年(18-45岁)' },
                    { value: 125, name: '中年(45-60岁)' },
                    { value: 175, name: '老年(60岁以上)' },
                ]
            }
        ]
    })

    //医疗费用组成
    var pieChart3 = echarts.init(document.getElementById('pieChart3'));
    pieChart3.setOption({
        color: ["#32cd32", "#ff7f50", "#87cefa", "#FD6C88", "#4b5cc4", "#faff72"],
        tooltip: {
            trigger: 'item',
            formatter: "{a}<br/>{b}<br/>{c}元"
        },
        calculable: true,
        series: [
            {
                name: '发病人数',
                type: 'pie',
                radius: [30, 110],
                center: ['50%', '50%'],
                roseType: 'area',
                x: '50%',



                sort: 'ascending',
                data: [
                    { value: 10, name: '诊察费用' },
                    { value: 500, name: '检查费用' },
                    { value: 150, name: '检验费用' },
                    { value: 250, name: '西药费用' },
                    { value: 125, name: '中药费用' },
                    { value: 1750, name: '早康费用' },
                ]
            }
        ]
    })
}
