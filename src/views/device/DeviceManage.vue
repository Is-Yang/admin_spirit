<template>
  <el-card class="order-container">
    <template #header>
      <div class="search-filter">
        <el-row type="flex" :gutter="30">
          <el-col :span="5">
            <span class="search-lable">设备状态</span>
            <el-select v-model="queryParams.status" size="small" style="width: 100%;">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-col>
          <el-col :span="6">
            <span class="search-lable">关键字</span>
            <el-input placeholder="请输入序列号/公司名称" size="small" />
          </el-col>
          <el-col :span="6">
            <span class="search-lable">安装时间</span>
            <el-date-picker v-model="queryParams.instTime"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              size="small"
              style="width: 100%;"
             >
            </el-date-picker>
          </el-col>
          <el-col :span="6">
            <span class="search-lable">省市区</span>
            <ProvincesCascader style="width: 100%;" size="small" />
          </el-col>
          <el-col :span="4" class="m-t-15">
            <el-button type="primary" @click="queryData()" size="small">查询</el-button>
            <el-button @click="handleReset()" size="small">重置</el-button>
          </el-col>
        </el-row>
      </div>
    
      <el-button @click="handleAdd()" type="primary" icon="el-icon-plus" size="small">新建</el-button>
      <el-button @click="handleExpory()" type="primary" icon="el-icon-download" size="small">导出</el-button>
    </template>
    <el-table
      v-loading="loading"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        prop="orderNo"
        label="设备序列号"
      >
      </el-table-column>
      <el-table-column
        prop="totalPrice"
        label="有效期"
      >
      </el-table-column>
      <el-table-column
        prop="orderStatus"
        label="状态"
      >
        <template #default="scope">
        </template>
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="安装时间"
      >
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="公司名称"
      >
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="地址"
      >
      </el-table-column>
      <el-table-column
        label="操作"
      >
        <template #default="scope">
        </template>
      </el-table-column>
    </el-table>
    <div class="text-right m-t-15">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        :page-size="pageSize"
        :current-page="currentPage"
        @current-change="changePage"
      />
    </div>

    <DeviceDialog v-if="dialog.show" :type="dialog.type" @cancel="dialog.show = false"></DeviceDialog>
  </el-card>
</template>

<script>
import { onMounted, reactive, ref, toRefs } from 'vue'
import DeviceDialog from './modules/DeviceDialog.vue'
import ProvincesCascader from '/@/components/ProvincesCascader/Index.vue'

import * as Http from '/@/api/admin'

export default {
  name: 'DeviceManage',
  components: {
    DeviceDialog,
    ProvincesCascader
  },
  setup() {
    const state = reactive({
      loading: false,
      dialog: {
        show: false,
        type: 'add'
      },
      tableData: [], // 数据列表
      multipleSelection: [], // 选中项
      total: 0, // 总条数
      currentPage: 1, // 当前页
      pageSize: 10, // 分页大小
      queryParams: {
        status: '', // 设备状态
        instTime: null, // 安装时间
      },
      options: [{
        value: '',
        label: '全部'
      }, {
        value: 0,
        label: '未激活'
      }, {
        value: 1,
        label: '已激活'
      }]
    })

    onMounted(() => {
      queryData()
    })

    // 新增
    const handleAdd = () => {
      state.dialog.type = 'add'
      state.dialog.show = true;
    }

    // 获取列表
    const queryData = () => {
      const params = {
        page: state.currentPage,
        per_page: state.pageSize
      };
      state.loading = true;
      Http.getDeviceList(params).then(res => {
        state.loading = false;
        if (res.code == 0) {
          const { list, page, total, per_page } = res.data
          state.tableData = list;
          state.total = total;
          state.page = page;
        }
      }).catch(err => {
        state.loading = false;
        console.log(err);
      })
    }
    // 选择项
    const handleSelectionChange = (val) => {
      state.multipleSelection = val
    }
    return {
      ...toRefs(state),
      handleAdd,
      handleSelectionChange,
      queryData
    }
  }
}
</script>

<style scoped>
  .order-container {
    min-height: 100%;
  }
  .el-card.is-always-shadow {
    min-height: 100%!important;
  }
</style>