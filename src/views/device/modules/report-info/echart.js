const lineOption = {
    color: ['#d9001b', '#70b603'],
    legend: {
        data: ['原始模式', '节能模式'],
        icon: 'rect',
        top: '3%',
        right: '10%'
    },
    tooltip: {
        show: true,
        trigger: 'axis',
        // backgroundColor: '#fff',
        // textStyle: {
        //     color: '#5c6c7c'
        // },
        // padding: [10, 10],
    },
    xAxis: {
        type: 'category',
        data: ['1天', '2天', '3天', '4天', '5天', '6天'],
        axisTick: {
            show: false
        }
    },
    yAxis: {
        type: 'value'
    },
    series: [{
        name: '原始模式',
        data: [150, 230, 224, 218, 135, 147, 260],
        type: 'line',
        lineStyle: {
            type: 'dotted'
        },
        symbol: 'none'
    }, {
        name: '节能模式',
        data: [50, 130, 254, 118, 55, 247, 80],
        type: 'line',
        lineStyle: {
            type: 'dotted'
        },
        symbol: 'none'
    }]
};

const lineBarOption = {
    title: {
        show: true,
        text: '设备',
        bottom: 10,
        left: 'center'
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'cross',
            crossStyle: {
                color: '#999'
            }
        }
    },
    legend: {
        data: ['降水量', '温度']
    },
    grid: {
        right: '16%',
        left: '16%',
        top: '15%',
        bottom: '10%'
    },
    xAxis: [{
        type: 'category',
        data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
        axisPointer: {
            type: 'shadow'
        }
    }],
    yAxis: [{
            type: 'value',
            name: '温度',
            min: 0,
            max: 25,
            interval: 5,
            axisLabel: {
                formatter: '{value} °C'
            }
        },
        {
            type: 'value',
            name: '湿度',
            min: 0,
            max: 250,
            interval: 50,
            axisLabel: {
                formatter: '{value} %rh'
            }
        },
    ],
    series: [{
            color: '#fad686',
            name: '温度',
            type: 'line',
            symbol: 'circle',
            data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
        },
        {
            color: '#91cc75',
            name: '降水量',
            type: 'bar',
            yAxisIndex: 1,
            data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
        },

    ]
};

const getLineOption = (data = [], originKey = 'originTemp', powerKey = 'powerTemp') => {
    return {
        color: ['#d9001b', '#70b603'],
        legend: {
            data: ['原始模式', '节能模式'],
            icon: 'rect',
            top: '3%',
            right: '10%'
        },
        tooltip: {
            show: true,
            trigger: 'axis',
            // backgroundColor: '#fff',
            // textStyle: {
            //     color: '#5c6c7c'
            // },
            // padding: [10, 10],
        },
        xAxis: {
            type: 'category',
            // data: ['1天', '2天', '3天', '4天', '5天', '6天'],
            data: Array.isArray(data) && data.map(x => x.day + '天'),
            axisTick: {
                show: false
            }
        },
        yAxis: {
            type: 'value'
        },
        series: [{
            name: '原始模式',
            // data: [150, 230, 224, 218, 135, 147, 260],
            data: Array.isArray(data) && data.map(x => x[originKey]),
            type: 'line',
            lineStyle: {
                type: 'dotted'
            },
            symbol: 'circle'
        }, {
            name: '节能模式',
            // data: [50, 130, 254, 118, 55, 247, 80],
            data: Array.isArray(data) && data.map(x => x[powerKey]),
            type: 'line',
            lineStyle: {
                type: 'dotted'
            },
            symbol: 'circle'
        }]
    };
}
const getLineBarOption = (data, title) => {
    return {
        title: {
            show: true,
            text: title,
            bottom: 0,
            left: 'center'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                crossStyle: {
                    color: '#999'
                }
            }
        },
        legend: {
            data: ['降水量', '温度']
        },
        grid: {
            right: '16%',
            left: '16%',
            top: '15%',
            bottom: '18%'
        },
        xAxis: [{
            type: 'category',
            data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
            axisPointer: {
                type: 'shadow'
            }
        }],
        yAxis: [{
                type: 'value',
                name: '温度',
                min: 0,
                max: 25,
                interval: 5,
                axisLabel: {
                    formatter: '{value} °C'
                }
            },
            {
                type: 'value',
                name: '湿度',
                min: 0,
                max: 250,
                interval: 50,
                axisLabel: {
                    formatter: '{value} %rh'
                }
            },
        ],
        series: [{
                color: '#fad686',
                name: '温度',
                type: 'line',
                symbol: 'circle',
                data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
            },
            {
                color: '#91cc75',
                name: '降水量',
                type: 'bar',
                yAxisIndex: 1,
                data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
            },

        ]
    };
}

export default {
    lineOption,
    lineBarOption,
    getLineOption,
    getLineBarOption,
}