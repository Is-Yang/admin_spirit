export const lineOption = {
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
    },{
        name: '节能模式',
        data: [50, 130, 254, 118, 55, 247, 80],
        type: 'line',
        lineStyle: {
            type: 'dotted'
        },
        symbol: 'none'
    }]
};