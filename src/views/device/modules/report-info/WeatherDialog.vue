<template>
  <el-dialog
    custom-class="weather-dialog"
    title="查看原始数据"
    v-model="visible"
    width="1000px"
    @close="closeDialog"
  >
    <!-- <VerticalTable :tableHead="column" :tableData="tableData" ></VerticalTable> -->
    <div class="title">原始模式测试天气温度平均值：</div>
    <el-table
      :data="tableData1"
      :max-height="300"
      style="width: 100%">
      <el-table-column prop="value" label="气温值"></el-table-column>
      <el-table-column prop="hightValue" label="最高气温"></el-table-column>
      <el-table-column prop="lowValue" label="最低气温"></el-table-column>
      <el-table-column prop="averageValue" label="平均气温"></el-table-column>
    </el-table>
    <div class="title mt20">节电模式测试天气温度平均值：</div>
    <el-table :data="tableData2" :max-height="300" style="width: 100%">
      <el-table-column prop="value" label="气温值"></el-table-column>
      <el-table-column prop="hightValue" label="最高气温"></el-table-column>
      <el-table-column prop="lowValue" label="最低气温"></el-table-column>
      <el-table-column prop="averageValue" label="平均气温"></el-table-column>
    </el-table>
    <template #footer>
      <div class="dialog-footer">
        <el-button size="middle" type="primary" @click="closeDialog">关 闭</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import { onMounted, reactive, ref, toRefs } from 'vue';
import { getWeathDetails } from "/@/api/admin";
import { useRouter, useRoute } from "vue-router";
import VerticalTable from './VerticalTable.vue';

export default {
  name: 'weatherDialog',
  props: {
  },
  components: {
    VerticalTable
  },
  emits: ["closeDialog"],
  setup(props, {emit}) {
    const formRef = ref(null)
    const state = reactive({
        visible: false,
        tableData1: [],
        tableData2: [],
        column: [{
            label: '气温值',
            prop: 'value'
        },
        {
            label: '最高气温',
            prop: 'hightValue'
        },
        {
            label: '最低气温',
            prop: 'lowValue'
        },
        {
            label: '平均气温',
            prop: 'averageValue'
        }]
    })

    const route = useRoute();
    // 获取序列号
    const getData = () => {
        const deviceId = route.query.id;
        deviceId && getWeathDetails(deviceId)
          .then(res => {
            console.log(res,'getWeathDetails');
            if (res.code == 0) {
              // state.tableData1 = res.data;
              // state.tableData2 = res.data;
            }
          })
          .catch(err => {
            ElMessage.error({
              message: err,
              type: "error"
            });
          });

      const list = [{
          value: 8.8,
          hightValue: 8.8,
          lowValue: 8.8,
          averageValue: 8.8,
        },{
          value: 8.8,
          hightValue: 8.8,
          lowValue: 8.8,
          averageValue: 8.8,
        },{
          value: 8.8,
          hightValue: 8.8,
          lowValue: 8.8,
          averageValue: 8.8,
        },{
          value: 8.8,
          hightValue: 8.8,
          lowValue: 8.8,
          averageValue: 8.8,
        }]
      state.tableData1 = list
      state.tableData2 = list
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
.weather-dialog {
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
}
</style>