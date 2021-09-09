<template>
  <el-dialog
    custom-class="temperature-dialog"
    title="查看原始数据"
    v-model="visible"
    width="1000px"
    @close="closeDialog"
  >
    <div class="tag-group">
      <el-tag v-for="item in tempHumDevice" :key="item.meterNum"
        class="tag-item"
        :effect="item.meterNum === activeDevice.meterNum ? 'dark' : 'light'"
        @click="changeDevice(item)"
      >
        {{ item.deviceName }}
      </el-tag>
    </div>
    <!-- <VerticalTable :tableHead="column" :tableData="tableData" ></VerticalTable> -->
    <div class="title">原始模式测试天气{{type === 'hum'?'湿度': '温度'}}平均值：</div>
    <div class="top mt20">
      <!-- <OriginTable v-for="item in endDevice" :key="item.meterNum" meterNum="3774S5J34WTC7MPA"/> -->
      <OriginTable :meterNum="activeDevice.meterNum" model="1"/>
    </div>
    <div class="title mt20">节电模式测试天气{{type === 'hum'?'湿度': '温度'}}平均值：</div>
    <div class="bottom mt20">
      <OriginTable :meterNum="activeDevice.meterNum" model="2"/>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button size="middle" type="primary" @click="closeDialog">关 闭</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import { onMounted, reactive, watch, toRefs } from 'vue'
import OriginTable from './OriginTable.vue';
import { useRoute } from "vue-router";
import { ElMessage } from 'element-plus'

export default {
  name: 'weathDialog',
  props: {
    endDevice:[],
    type: ''
  },
  components: {
    OriginTable
  },
  emits: ["closeDialog"],
  setup(props, {emit}) {
    const route = useRoute();
    const state = reactive({
        visible: false,
        deviceNo: route.query.id || '',
        activeDevice: '',
        tempHumDevice: []
    })

    const closeDialog = () => {
      emit('closeDialog')
    }

    const changeDevice = (item) => {
      state.activeDevice = item;
    }

    onMounted(()=>{
      state.tempHumDevice = props.endDevice.filter(x=>x.type == 2);

      if (state.tempHumDevice.length) {
        state.visible = true;
        state.activeDevice = state.tempHumDevice[0];
      }else {
        ElMessage.error({
          message: '暂无温湿度设备数据',
          type: "error"
        });
      }
    })

    return {
      ...toRefs(state),
      closeDialog,
      changeDevice
    }
  }
}
</script>

<style lang="less" scoped>
.temperature-dialog {
  .tag-group {
    .tag-item {
      margin: 0 20px 20px 0;
    }
  }
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
    // display: flex;
    // width: 100%;
    // flex-wrap: wrap;
    // >div {
    //   width: calc(50% - 10px) !important;
    //   margin-right: 10px;
    //   &:last-child {
    //     margin-right: 0;
    //   }
    // }
    // .left, .right {
    //   width: 450px;
    //   height: 300px;
    // }
    // .right {
    //   margin-left: 20px;
    // }
  }
}
</style>