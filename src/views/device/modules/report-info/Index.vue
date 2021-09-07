<template>
  <div class="report-info">
    <TopOverview :data="data.overViewData"></TopOverview>
    <CompareChart :data="weatherChartData" :setting="weatherChartOption" @clickOrigin="weatherOriginClick(true)"></CompareChart>
    <CompareChart :data="temperatureChartData" :setting="temperatureChartOption" @clickOrigin="temperatureOriginClick(true)"></CompareChart>
    <CompareChart :data="humidityChartData" :setting="humidityChartOption" @clickOrigin="temperatureOriginClick(true)">></CompareChart>
    <div class="export-btn">
      <el-button type="primary" @click="exportReport">生成节点报告</el-button>
    </div>
    <WeatherDialog v-if="weatherVisble" @closeDialog="weatherOriginClick(false)"></WeatherDialog>
    <TemperatureDialog v-if="temperatureVisble" @closeDialog="temperatureOriginClick(false)"></TemperatureDialog>
  </div>
</template>

<script>
import { onMounted, reactive, ref, toRefs } from "vue";
import { getWeathCompare, getTempAndhum} from "/@/api/admin";
import TopOverview from './TopOverview.vue'
import CompareChart from './CompareChart.vue'
import WeatherDialog from './WeatherDialog.vue'
import TemperatureDialog from './TemperatureDialog.vue'
import { useRouter, useRoute } from "vue-router";

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
        }
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

      weatherChartData: {
        chartData: [],
        settingValue: 1,
        calcValue: 0.2,
        originKey: 'originTemp',
        powerKey: 'powerTemp'
      },
      temperatureChartData: {
        chartData: [],
        settingValue: 1,
        calcValue: 0.2,
        originKey: 'originTemp',
        powerKey: 'powerTemp'
      },
      humidityChartData: {
        chartData: [],
        settingValue: 1,
        calcValue: 0.2,
        originKey: 'originHumi',
        powerKey: 'powerHumi'
      },
    })
    const route = useRoute();

    onMounted(()=>{
        const deviceId = route.query.id;
        deviceId && getWeathCompare(deviceId)
          .then(res => {
            console.log(res,'getWeathCompare');
            if (res.code == 0) {
              state.weatherChartData.chartData = res.data;
            }
          })
          .catch(err => {
            ElMessage.error({
              message: err,
              type: "error"
            });
          });
        deviceId && getTempAndhum(deviceId)
          .then(res => {
            console.log(res,'getTempAndhum');
            if (res.code == 0) {
              state.temperatureChartData.chartData = res.data;
              state.humidityChartData.chartData = res.data;
            }
          })
          .catch(err => {
            ElMessage.error({
              message: err,
              type: "error"
            });
          });
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