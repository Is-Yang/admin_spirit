<template>
  <el-table
    :data="tableData"
    :max-height="300"
    style="width: 100%">
    <el-table-column prop="CreatedDay" label="创建日期"></el-table-column>
    <el-table-column prop="DeviceNo" label="设备号"></el-table-column>
    <el-table-column prop="DeviceName" label="设备名称"></el-table-column>
    <el-table-column prop="Humility" label="湿度"></el-table-column>
    <el-table-column prop="Tempreture" label="温度"></el-table-column>
  </el-table>
</template>

<script>
import { onMounted, reactive, ref, toRefs } from 'vue'
import { getTempAndHumDetails } from '/@/api/admin'
import { useRouter, useRoute } from "vue-router";

export default {
  name: 'weathDialog',
  props: {
    meterNum: '',
    model: '',
  },
  emits: ["closeDialog"],
  setup(props) {
    const route = useRoute();
    const state = reactive({
        deviceNo: route.query.id || '',
        tableData: []
    })
    // 获取序列号
    const getData = () => {
      const params = {
        deviceNo: state.deviceNo,
        meterNum: props.meterNum,
        model: props.model,
      }
      getTempAndHumDetails(params)
      .then(res => {
        if (res.code == 0) {
          state.tableData = res.data;
        }
      })
      .catch(err => {
        ElMessage.error({
          message: err,
          type: "error"
        });
      });
    }
    onMounted(()=>{
      getData()
    })

    return {
      ...toRefs(state),
      getData
    }
  }
}
</script>

<style lang="less" scoped>
</style>