<template>
  <div class="chart-box" ref="myCharts"></div>
</template>

<script>
import { getCurrentInstance, onMounted, reactive, ref, toRefs } from "vue";
import echartOption from './echart.js';
export default {
  name: 'DeviceDialog',
  props: {
    data: {
      type: Array,
      defalut: []
    },
    title: {
      type: String,
      defalut: '设备'
    }
  },
  setup(props, context) {
     const { proxy } = getCurrentInstance();
     const myCharts = ref(null);
     const state = reactive({
       chartOption: echartOption.lineBarOption,
     })
    onMounted(() => {
      myCharts.value = proxy.$echarts.init(myCharts.value);
      // myCharts.value.setOption(state.chartOption);
      const option = echartOption.getLineBarOption([], props.title);
      myCharts.value.setOption(option);
    })

    return {
      ...toRefs(state),
      myCharts,
    }
  },
}
</script>

<style lang="less" scoped>
.chart-box {
  // width: 100%;
  // height: 100%;
  // &:deep(div) {
  //   width: 100% !important;
  //   height: 100% !important;
  // }
  // &:deep(canvas) {
  //   width: 100% !important;
  //   height: 100% !important;
  // }
}
</style>