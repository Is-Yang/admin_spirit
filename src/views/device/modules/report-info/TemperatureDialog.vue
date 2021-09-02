<template>
  <el-dialog
    custom-class="temperature-dialog"
    title="查看原始数据"
    v-model="visible"
    width="1000px"
    @close="closeDialog"
  >
    <!-- <VerticalTable :tableHead="column" :tableData="tableData" ></VerticalTable> -->
    <div class="title">原始模式测试天气温度平均值：</div>
    <div class="top mt20">
        <AverageChart class="left" :data="chartData1" title="设备1"></AverageChart>
        <AverageChart class="right" :data="chartData2" title="设备2"></AverageChart>
    </div>
    <div class="title mt20">节电模式测试天气温度平均值：</div>
    <div class="bottom mt20">
      <AverageChart class="left" :data="chartData3" title="设备3"></AverageChart>
      <AverageChart class="right" :data="chartData4" title="设备4"></AverageChart>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button size="middle" type="primary" @click="closeDialog">关 闭</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import { onMounted, reactive, ref, toRefs } from 'vue'
import * as Http from '/@/api/admin'
import AverageChart from './AverageChart.vue';

export default {
  name: 'weathDialog',
  props: {
  },
  components: {
    AverageChart
  },
  emits: ["closeDialog"],
  setup(props, {emit}) {
    const state = reactive({
        visible: false,
        chartData1: [],
        chartData2: [],
        chartData3: [],
        chartData4: [],
    })

    // 获取序列号
    const getData = () => {
      // Http.getTemperatureOriginData().then(res => {
      //   if (res.code == 0) {
      //     state.tableData = res.data;
      //   }
      // })
      const data = []
      state.tableData1 = data;
      state.tableData2 = data;
      state.tableData3 = data;
      state.tableData4 = data;
      state.visible = true;
    }
    const closeDialog = () => {
      emit('closeDialog')
    }
    onMounted(()=>{
      getData()
    })

    return {
      ...toRefs(state),
      getData,
      closeDialog
    }
  }
}
</script>

<style lang="less" scoped>
.temperature-dialog {
  .el-dialog__body {
    padding-right: 40px;
    padding-top: 0;
  }
  .el-input.is-disabled .el-input__inner {
    color: #666;
  }
  .mt20 {
    margin-top: 20px;
  }
  .title {
    font-weight: bold;
  }
  .dialog-footer {
    text-align: center;
  }
  .top, .bottom {
    display: flex;
    width: 100%;
    .left, .right {
      width: 450px;
      height: 300px;
    }
    .right {
      margin-left: 20px;
    }
  }
}
</style>