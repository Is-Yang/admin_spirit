<template>
  <div class="report-info">
    <TopOverview :data="data.overViewData"></TopOverview>
    <CompareChart :data="data.weatherChartData" :setting="weatherChartOption" @clickOrigin="weatherOriginClick(true)"></CompareChart>
    <CompareChart :data="data.temperatureChartData" :setting="temperatureChartOption" @clickOrigin="temperatureOriginClick(true)"></CompareChart>
    <CompareChart :data="data.humidityChartData" :setting="humidityChartOption" @clickOrigin="temperatureOriginClick(true)">></CompareChart>
    <div class="export-btn">
      <el-button type="primary" size="small" @click="exportReport">生成节点报告</el-button>
    </div>
    <WeatherDialog v-if="weatherVisble" @closeDialog="weatherOriginClick(false)"></WeatherDialog>
    <TemperatureDialog v-if="temperatureVisble" @closeDialog="temperatureOriginClick(false)"></TemperatureDialog>
  </div>
</template>

<script>
import { onMounted, reactive, ref, toRefs } from "vue";
import * as Http from '/@/api/admin'
import TopOverview from './TopOverview.vue'
import CompareChart from './CompareChart.vue'
import WeatherDialog from './WeatherDialog.vue'
import TemperatureDialog from './TemperatureDialog.vue'

export default {
  name: 'DeviceDialog',
  props: {
    data: {
      type: Option,
      defalut: {
        overViewData: {
          power: 200,
          powerRadio: 10,
          period: 160,
          originPower: 2000,
          originPowerFrom: 1000,
          originPowerTo: 3000,
          enegyPower: 1800,
          enegyPowerFrom: 3000,
          enegyPowerTo: 4800,
          originTimeFrom: '2021.08.08 06:30:10',
          originTimeTo: '2021.08.10 06:30:20',
          enegyTimeFrom: '2021.08.11 06:30:10',
          enegyTimeTo: '2021.08.13 06:30:10',
        },
        weatherChartData: {
          chartData: [],
          settingValue: 1,
          calcValue: 0.2
        },
        temperatureChartData: {
          chartData: [],
          settingValue: 1,
          calcValue: 0.2
        },
        humidityChartData: {
          chartData: [],
          settingValue: 1,
          calcValue: 0.2
        },
      }
    }
  },
  components: {
    TopOverview,
    CompareChart,
    WeatherDialog,
    TemperatureDialog,
  },
  setup(props) {
    const state = reactive({
      weatherChartOption: {
        title: '原始模式/节点模式天气对比',
        settingLabel: '天气气温偏差值设置:',
        calcLabel: '计算得出偏差值:',
      },
      temperatureChartOption: {
        title: '原始模式/节电模式末端温度比对',
        settingLabel: '末端温度偏差值设置:',
        calcLabel: '计算得出偏差值:',
      },
      humidityChartOption: {
        title: '原始模式/节电模式末端湿度比对',
        settingLabel: '末端湿度偏差值设置:',
        calcLabel: '计算得出偏差值:',
      },
      weatherVisble: false,
      temperatureVisble: false,
      humidityVisble: false,

    })
    
    // 导出节电报告
    const exportReport = () => {
      
    }
    // 天气点击原始数据查看详情
    const weatherOriginClick = (type) => {
        state.weatherVisble = type;
    }
    // 温度点击原始数据查看详情
    const temperatureOriginClick = (type) => {
        state.temperatureVisble = type;
    }
    // 湿度点击原始数据查看详情
    const humidityOriginClick = (type) => {
      state.humidityVisble = type;
    }
    
  
    return {
      ...toRefs(state),
      exportReport,
      weatherOriginClick,
      temperatureOriginClick,
      humidityOriginClick,
    }
  }
}
</script>

<style lang="less" scoped>
.report-info {
  .export-btn {
    text-align: center;
    margin-top: 20px;
  }
}
</style>