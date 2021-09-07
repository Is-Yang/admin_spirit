<template>
  <el-table
    :data="tableData"
    :max-height="300"
    style="width: 100%">
    <el-table-column prop="day" label="日期"></el-table-column>
    <el-table-column prop="originHum" label="湿度"></el-table-column>
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
    dialogType: 'hum'
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
        model: 1,
      }
      getTempAndHumDetails(params)
      .then(res => {
        console.log(res,'getTempAndhum');
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