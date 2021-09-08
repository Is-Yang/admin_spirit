<template>
  <el-card class="device-container">
    <template #header>
      <div class="search-filter">
        <el-row type="flex" :gutter="10">
          <el-col :span="4">
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
          <el-col :span="4">
            <span class="search-lable">设备序列号</span>
            <el-input v-model="queryParams.device_no" placeholder="请输入序列号" size="small" />
          </el-col>
          <el-col :span="6">
            <span class="search-lable">安装时间</span>
            <el-date-picker
              v-model="queryParams.inst_time"
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
            <el-select
              v-model="queryParams.ins_provice_code"
              clearable
              placeholder="请选择省"
              @change="changeProvice"
              size="small"
            >
              <el-option
                v-for="pItem in proviceData"
                :key="pItem.value"
                :label="pItem.label"
                :value="pItem.value"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :span="3">
            <el-select
              v-model="queryParams.ins_country_code"
              clearable
              placeholder="请选择市"
              size="small"
            >
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
      <el-button @click="handleAdd()" type="primary" icon="el-icon-plus" size="small">新建</el-button>
      <el-button
        @click="querySearchData('export')"
        type="primary"
        icon="el-icon-download"
        size="small"
      >导出</el-button>
    </template>
    <el-table
      v-loading="loading"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <!-- <el-table-column type="selection" width="55"></el-table-column> -->
      <el-table-column prop="deviceNo" label="设备序列号" with="150"></el-table-column>
      <el-table-column prop="ValidTime" label="有效期">
        <template #default="scope">
          <span>{{formatDay(scope.row.ValidTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="orderStatus" label="状态" width="100">
        <template #default="scope">
          <span>{{scope.row.status === 1 ? '有效' : '无效'}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="instTime" label="安装时间">
        <template #default="scope">
          <span>{{formatDay(scope.row.instTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="customerName" label="公司名称"></el-table-column>
      <el-table-column label="地址">
        <template #default="scope">
          <span>{{getCompany(scope.row) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="140">
        <template #default="scope">
          <el-button
            type="text"
            size="small"
            @click.prevent="operation(scope.row)"
          >{{scope.row.status === 1 ? '注销' : '激活'}}</el-button>
          <el-button type="text" size="small" @click="handleAdd(scope.row)">编辑</el-button>
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
  </el-card>
</template>

<script>
import { onMounted, reactive, ref, toRefs } from "vue";
import dayjs from "dayjs";
import { useRouter } from "vue-router";
import ProvincesCascader from "/@/components/ProvincesCascader/Index.vue";
import * as Http from "/@/api/admin";
import { ElMessageBox, ElMessage } from "element-plus";
import regionData from "/@/components/ProvincesCascader/region.json";

export default {
  name: "DeviceManage",
  components: {
    ProvincesCascader
  },
  setup() {
    const state = reactive({
      loading: false,
      tableData: [], // 数据列表
      multipleSelection: [], // 选中项
      total: 0, // 总条数
      currentPage: 1, // 当前页
      pageSize: 10, // 分页大小
      queryParams: {
        status: "", // 设备状态
        device_no: "",
        inst_time: "", // 安装时间
        ins_provice: "",
        ins_provice_code: "",
        ins_country: "",
        ins_country_code: "",
     
      },
      proviceData: [],
      cityData: [],
      options: [
        {
          value: "",
          label: "全部"
        },
        {
          value: "1",
          label: "已激活"
        },
        {
          value: "2",
          label: "未激活"
        }
      ],
      isActive: false
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
      state.queryParams.ins_country_code = "";
      const cityData = regionData.find(x => x.value == val);
      state.cityData = (cityData && cityData.children) || [];
    };
    // 新增
    const handleAdd = item => {
      if (item?.deviceNo) {
        router.push(`/device/add?id=${item.deviceNo}`);
      } else {
        router.push("/device/add");
      }
    };
    // 表单搜索
    const querySearchData = key => {
      const filters = [];
      for (const key in state.queryParams) {
        if (state.queryParams[key]) {
          //TODO: 
          // if (key === "ins_provice_code") {
          //   filters.push({
          //     field: 'ins_provice',
          //     value: [state.proviceData.find(ele => ele.value === state.queryParams[key] ).label],
          //     condition:  "equal"
          //   });
          // }
          // if (key === "ins_country_code") {
          //   filters.push({
          //     field: 'ins_country',
          //     value: [state.cityData.find(ele => ele.value === state.queryParams[key] ).label],
          //     condition:  "equal"
          //   });
          // }
          filters.push({
            field: key,
            value:
              key === "inst_time"
                ? state.queryParams[key]
                : [state.queryParams[key]],
            condition: key === "inst_time" ? "time_between" : "equal"
          });
        }
      }
      if (key === "export") {
        exportFil({ filters });
      } else {
        queryData({ filters });
      }
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
      Http.getDeviceList(params)
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
    // 选择项
    const handleSelectionChange = val => {
      state.multipleSelection = val;
    };

    const formatDay = val => {
      return dayjs(val).format("YYYY-MM-DD HH:mm:ss");
    };

    const getCompany = item => {
      return item.insProvice + item.insCountry + item.insAddress;
    };
    // 操作
    const operation = item => {
      ElMessageBox({
        title: "提示",
        message: item.status === 1 ? "确定要注销嘛" : "确定要激活嘛",
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        showCancelButton: true,
        closeOnClickModal: true,
        type: "warning"
      })
        .then(() => {
          const params = {
            deviceNo: item.deviceNo,
            status: item.status === 1 ? 2 : 1
          };
          Http.changeDeviceStatus(params)
            .then(res => {
              if (res.code == 0) {
                queryData();
                ElMessage.success("更新成功!");
              }
            })
            .catch(err => {
              ElMessage.info("更新失败!");
            });
        })
        .catch(() => {});
    };
    // 导出
    const exportFil = filters => {
      const params = {
        page: state.currentPage,
        pageSize: state.pageSize,
        filters: [],
        ...filters
      };
      Http.getExportFile(params)
        .then(res => {
          if (res.code == 0) {
            let blob = new Blob([res]);
            let downloadElement = document.createElement("a");
            let href = window.URL.createObjectURL(blob);
            downloadElement.href = href;
            downloadElement.download = "设备管理.csv";
            document.body.appendChild(downloadElement);
            downloadElement.click();
            document.body.removeChild(downloadElement);
            window.URL.revokeObjectURL(href);
          }
        })
        .catch(err => {
          ElMessage.info("导出失败!");
        });
    };

    const handleReset = () => {
      state.queryParams = {};
      state.currentPage = 1;
      state.pageSize = 10;
      queryData();
    };

    return {
      ...toRefs(state),
      handleAdd,
      handleSelectionChange,
      queryData,
      formatDay,
      getCompany,
      operation,
      querySearchData,
      handleReset,
      changeProvice,
      exportFil
    };
  }
};
</script>

<style scoped>
.device-container {
  min-height: 100%;
}
.el-card.is-always-shadow {
  min-height: 100% !important;
}
</style>