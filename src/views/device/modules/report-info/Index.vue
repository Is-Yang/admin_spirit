<template>
  <div class="report-info">
    <TopOverview :data="data"></TopOverview>
    <CompareChart :type="1" :data="weatherChartData" :setting="weatherChartOption" @clickOrigin="weatherOriginClick(true)"></CompareChart>
    <CompareChart :type="2" :data="temperatureChartData" :setting="temperatureChartOption" @clickOrigin="temperatureOriginClick(true, 'temp')"></CompareChart>
    <CompareChart :type="3" :data="humidityChartData" :setting="humidityChartOption" @clickOrigin="temperatureOriginClick(true, 'hum')">></CompareChart>
    <div class="export-btn">
      <el-button type="primary" @click="exportReport">生成节电报告</el-button>
    </div>
    <WeatherDialog v-if="weatherVisble" @closeDialog="weatherOriginClick(false)"></WeatherDialog>
    <!-- <TemperatureDialog v-if="temperatureVisble" @closeDialog="temperatureOriginClick(false)"></TemperatureDialog> -->
    <HumidityDialog v-if="temperatureVisble" :type="detailType" :endDevice="endDevice" @closeDialog="temperatureOriginClick(false)"></HumidityDialog>
  </div>
</template>

<script>
import { onMounted, reactive, ref, toRefs } from "vue";
import { getWeathCompare, getTempAndhum, getReportFile} from "/@/api/admin";
import TopOverview from './TopOverview.vue'
import CompareChart from './CompareChart.vue'
import WeatherDialog from './WeatherDialog.vue'
import TemperatureDialog from './TemperatureDialog.vue'
import HumidityDialog from './HumidityDialog.vue'
import { useRouter, useRoute } from "vue-router";
import { ElMessage } from "element-plus";

export default {
  name: 'DeviceDialog',
  props: {
    data: {
      type: Object,
      defalut: {
        allSave: 200,
        saveRate: 10,
        timeLength: 160,
        originSave: 2000,
        originBegin: 1000,
        originFinish: 3000,
        powerSave: 1800,
        powerBegin: 3000,
        powerFinish: 4800,
        originStart: '2021.08.08 06:30:10',
        originEnd: '2021.08.10 06:30:20',
        powerStart: '2021.08.11 06:30:10',
        powerEnd: '2021.08.13 06:30:10',
        weatherDeviation: 0,
        weatherRate: 0,
        tempretureDeviation: 0,
        tempretureRate: 0,
        humilityDeviation: 0,
        humilityRate: 0
      }
    },
    endDevice: {
      type: Array,
      defalut: []
    }
  },
  components: {
    TopOverview,
    CompareChart,
    WeatherDialog,
    TemperatureDialog,
    HumidityDialog,
  },
  setup(props) {
    const state = reactive({
      detailType: 'hum',
      weatherChartOption: {
        title: '原始模式/节电模式天气对比',
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
        settingValue: props.data.weatherDeviation || 0,
        calcValue: props.data.weatherRate || 0,
        originKey: 'originTemp',
        powerKey: 'powerTemp'
      },
      temperatureChartData: {
        chartData: [],
        settingValue: props.data.tempretureDeviation || 0,
        calcValue: props.data.tempretureRate || 0,
        originKey: 'originTemp',
        powerKey: 'powerTemp'
      },
      humidityChartData: {
        chartData: [],
        settingValue: props.data.humilityDeviation || 0,
        calcValue: props.data.humilityRate || 0,
        originKey: 'originHumi',
        powerKey: 'powerHumi'
      }
    })
    const route = useRoute();

    onMounted(()=>{
        const deviceId = route.query.id;
        deviceId && getWeathCompare(deviceId)
          .then(res => {
            console.log(res,'getWeathCompare');
            if (res.code == 0) {
              state.weatherChartData.chartData = res.data || [];
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
              state.temperatureChartData.chartData = res.data || [];
              state.humidityChartData.chartData = res.data || [];
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
      props.data.weatherDeviation = state.weatherChartData.settingValue && Number(state.weatherChartData.settingValue);
      props.data.weatherRate = state.weatherChartData.calcValue && Number(state.weatherChartData.calcValue);
      props.data.tempretureDeviation = state.temperatureChartData.settingValue && Number(state.temperatureChartData.settingValue);
      props.data.tempretureRate = state.temperatureChartData.calcValue && Number(state.temperatureChartData.calcValue);
      props.data.humilityDeviation = state.humidityChartData.settingValue && Number(state.humidityChartData.settingValue);
      props.data.humilityRate = state.humidityChartData.calcValue && Number(state.humidityChartData.calcValue);

      const params = {
        ...props.data,
        deviceNo: route.query.id
      };
      getReportFile(params)
        .then(res => {
          if (res.code == 0) {
            ElMessage.success('生成节电报告成功!')
          }
        })
        .catch(err => {
          ElMessage.info("生成节电报告失败!");
        });
    }
    // 天气点击原始数据查看详情
    const weatherOriginClick = (type) => {
        state.weatherVisble = type;
    }
    // 温度点击原始数据查看详情
    const temperatureOriginClick = (type, detailType) => {
        state.temperatureVisble = type;
        if (detailType) state.detailType = detailType;
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