<template>
  <el-card class="feedback-container">
    <template #header>
      <div class="search-filter">
        <el-row type="flex" :gutter="10">
          <el-col :span="5">
            <span class="search-lable">设备序列号</span>
            <el-input v-model="queryParams.device_no" placeholder="请输入序列号" size="small" />
          </el-col>
          <el-col :span="6">
            <span class="search-lable">反馈时间</span>
            <el-date-picker
              v-model="queryParams.create_time"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              size="small"
              style="width: 100%;"
            ></el-date-picker>
          </el-col>
          <el-col :span="4">
            <span class="search-lable">地区</span>
            <el-select v-model="queryParams.ins_provice" clearable placeholder="请选择省" @change="changeProvice" size="small">
              <el-option
                v-for="pItem in proviceData"
                :key="pItem.value"
                :label="pItem.label"
                :value="pItem.value"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :span="3">
            <el-select v-model="queryParams.ins_country" clearable placeholder="请选择市" size="small">
              <el-option
                v-for="cItem in cityData"
                :key="cItem.value"
                :label="cItem.label"
                :value="cItem.value"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :span="3">
            <el-button type="primary" @click="querySearchData()" size="small">查询</el-button>
            <el-button @click="handleReset()" size="small">重置</el-button>
          </el-col>
        </el-row>
      </div>
    </template>
    <el-table
      v-loading="loading"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
    >
      <el-table-column prop="deviceNum" label="设备序列号" width="150"></el-table-column>
      <el-table-column label="反馈内容" show-overflow-tooltip>
        <template #default="scope">
          <span >{{ scope.row.content }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" label="反馈时间" width="150">
        <template #default="scope">
          <span>{{formatDay(scope.row.createdAt) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="company" label="公司名称" width="200"></el-table-column>
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

  </el-card>
</template>

<script>
import { onMounted, reactive, ref, toRefs } from "vue";
import dayjs from "dayjs";
import { useRouter } from "vue-router";
import * as Http from "/@/api/admin";
import { ElMessageBox, ElMessage } from "element-plus";
import regionData from "/@/components/ProvincesCascader/region.json";

export default {
  name: "DeviceManage",
  components: {
  },
  setup() {
    const state = reactive({
      loading: false,
      tableData: [], // 数据列表
      total: 0, // 总条数
      currentPage: 1, // 当前页
      pageSize: 10, // 分页大小
      queryParams: {
        status: "", // 设备状态
        device_no: "",
        create_time: "", // 反馈时间
        ins_provice: "",
        ins_country: "",
        ins_address: ""
      },
      proviceData: [],
      cityData: []
    });
    const router = useRouter();

    onMounted(() => {
      state.proviceData = regionData.map(x => {
        return {
          value: x.value,
          label: x.label
        };
      });
      queryData();
    });
    const changeProvice = val => {
      state.queryParams.ins_country = "";
      const cityData = regionData.find(x => x.value == val);
      state.cityData = (cityData && cityData.children) || [];
    };
    // 表单搜索
    const querySearchData = () => {
      const filters = [];
      for (const key in state.queryParams) {
        if (state.queryParams[key]) {
          filters.push({
            field: key,
            value:
              key === "create_time"
                ? state.queryParams[key]
                : [state.queryParams[key]],
            condition: key === "create_time" ? "time_between" : "equal"
          });
        }
      }
      queryData({ filters });
    };

    // 获取列表
    const queryData = filters => {
      const params = {
        page: state.currentPage,
        pageSize: state.pageSize,
        filters: [],
        ...filters
      };
      state.loading = true;
      Http.getFeedback(params)
        .then(res => {
          state.loading = false;
          if (res.code == 0) {
            const { list, page, total, per_page } = res.data;
            state.tableData = list;
            state.total = total;
            state.page = page;
          }
        })
        .catch(err => {
          state.loading = false;
        });
    };

    const formatDay = val => {
      return dayjs(val).format("YYYY-MM-DD HH:mm:ss");
    };

    const getCompany = item => {
      return item.insProvice + item.insCountry + item.insAddress;
    };

    return {
      ...toRefs(state),
      queryData,
      formatDay,
      getCompany,
      querySearchData,
      changeProvice
    };
  }
};
</script>

<style lang="less" scoped>
.device-container {
  min-height: 100%;
}
.el-card.is-always-shadow {
  min-height: 100% !important;
}
</style>