<template>
  <el-dialog
    :title="type == 'add' ? '添加设备' : '修改设备'"
    v-model="visible"
    width="1000px"
    @close="$emit('cancel')"
  >
    <el-form :model="deviceForm" :rules="rules" ref="formRef" label-width="100px">
      <el-form-item label="设备序列号" prop="deviceNo">
        <el-input v-model="deviceForm.deviceNo" placeholder="请输入" disabled>
          <template #append>
          <el-button @click="getDeviceNo">获取序列号</el-button>
        </template>
        </el-input>
      </el-form-item>
      <el-form-item label="电脑ID" prop="computerID">
        <el-input v-model="deviceForm.computerID" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="控制码" prop="controlCode">
        <el-input v-model="deviceForm.controlCode" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="公司名称" prop="customerName">
        <el-input type="text" v-model="deviceForm.customerName" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="安装时间">
        <el-date-picker v-model="value1" type="datetime" placeholder="请选择"></el-date-picker>
      </el-form-item>
      <el-form-item label="安装地址">
        <ProvincesCascader style="width: 100%;" />
        <div class="m-t-10">
          <el-input type="textarea" :rows="3" placeholder="请输入详细地址" />
        </div>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="$emit('cancel')">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { reactive, ref, toRefs } from 'vue'
import * as Http from '/@/api/admin'
import ProvincesCascader from '/@/components/ProvincesCascader/Index.vue'

export default {
  name: 'DeviceDialog',
  props: {
    type: String
  },
  components: {
    ProvincesCascader
  },
  setup(props) {
    const formRef = ref(null)
    const state = reactive({
      visible: true,
      deviceForm: {
        deviceNo: ''
      },
      rules: {
        deviceNo: [
          { required: 'true', message: '序列号不能为空，请获取', trigger: ['change'] }
        ],
        computerID: [
          { required: 'true', message: '电脑ID不能为空', trigger: ['change'] }
        ],
        controlCode: [
          { required: 'true', message: '控制码不能为空', trigger: ['change'] }
        ]
      },
      id: ''
    })

    // 获取序列号
    const getDeviceNo = () => {
      Http.getDeviceNo().then(res => {
        if (res.code == 0) {
          state.deviceForm.deviceNo = res.data;
        }
      })
    }
    
    const submitForm = () => {
      formRef.value.validate((valid) => {
        if (valid) {
          
        }
      })
    }
    return {
      ...toRefs(state),
      formRef,
      submitForm,
      getDeviceNo
    }
  }
}
</script>

<style style="less">
 .el-dialog__body {
  padding-right: 40px;
}
.el-input.is-disabled .el-input__inner {
  color: #666;
}
</style>