<template>
  <div class="compare-chart">
    <div class="chart-title">
      {{setting.title}}
      <el-button class="text-btn" type="text" @click="viewOriginData">查看原始数据</el-button>
    </div>
    <div class="chart-box" ref="myCharts"></div>
    <div class="chart-setting">
        <span>{{setting.settingLabel}}</span>
        <el-input type="text" size="small" v-model="data.settingValue" style="width:100px" ></el-input>
        <el-button :loading="loading" type="primary" size="mini" @click="clickCheck" round>确定</el-button>
        <span>{{setting.calcLabel}}</span>
        <el-input type="text" size="small" v-model="data.calcValue" style="width:100px"></el-input>
    </div>
  </div>
</template>

<script>
import { getCurrentInstance, onMounted, reactive, ref, toRefs, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import echartOption from './echart.js';
import {
  addDiviation
} from "/@/api/admin";

export default {
  name: 'DeviceDialog',
  props: {
    // 设备类型
    type: {
      type: [String, Number],
      default: null
    },
    data: {
      type: Option,
      defalut: {
        chartData: [],
        settingValue: 1,
        calcValue: 0.2,
        originKey: 'originTemp',
        powerKey: 'powerTemp'
      }
    },
    setting: {
      type: Option,
      defalut: {
        title: '',
        settingLabel: '',
        calcLabel: '',
      }
    }
  },
  emits: ["clickOrigin"],
  setup(props, context) {
    const {proxy} = getCurrentInstance();
    const state = reactive({
      loading: false
      // chartOption: lineOption
    })
    const myCharts = ref(null);
    const route = useRoute();

    watch(
      () => props.data.chartData,
      (data, prevData) => {
        // 绘制图表
        const option = echartOption.getLineOption(data, props.data.originKey, props.data.powerKey);
        myCharts.value.setOption(option)
      }
    )
    const viewOriginData = () => {
      context.emit("clickOrigin")
    }
    const clickCheck = () => {
      const params = {
        deviceNo: route.query.id,
        type: props.type,
        deviation: props.data.settingValue && Number(props.data.settingValue)
      }
      state.loading = true;
      addDiviation(params).then(res => {
        state.loading = false;
        if (res.code == 0) {
          props.data.calcValue = res.data;
        }
      }).catch(err => {
        state.loading = false;
        console.log(err);
      });
    }
    onMounted(() => {
      myCharts.value = proxy.$echarts.init(myCharts.value);
      // 绘制图表
      const option = echartOption.getLineOption();
      // myCharts.value.setOption(state.chartOption)
      myCharts.value.setOption(option)
    })

    return {
      ...toRefs(state),
      myCharts,
      viewOriginData,
      clickCheck,
    }
  },
}
</script>

<style lang="less" scoped>
.compare-chart {
  .chart-title {
    margin: 20px 0;
    // font-weight: bold;
    .text-btn {
      float: right;
    }
  }
  .chart-box {
    width: 100%;
    height: 400px;
  }
  .chart-setting {
    margin-top: 10px;
    padding: 20px;
    text-align: center;
    background-color: #f2f2f2;
    .el-button {
      margin: 0 10px;
    }
    >span {
      margin-right: 10px;
    }
  }
}
</style>