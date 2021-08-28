<template>
  <el-cascader :options="options" v-bind="$attrs" @change="handleChange">
  </el-cascader>
</template>

<script>
import { reactive, ref, toRefs } from 'vue' 
import region from './region'
export default {
  name: 'ProvincesCascader',
  setup(props) {
    const state = reactive({
      options: region
    })

    const handleChange = (data) => {
      console.log(data)
    }

    return {
      ...toRefs(state),
      handleChange
    }
  }
}
</script>

