<template>
  <div class="add-device" v-loading="loading">
    <div class="nav-bar">
      <el-button-group>
        <el-button :type="activeType == 1 ? 'primary' : ''" @click="changeType(1)">基本信息</el-button>
        <el-button :type="activeType == 2 ? 'primary' : ''" @click="changeType(2)">末端设备安装信息</el-button>
        <el-button
          v-if="deviceId"
          :type="activeType == 3 ? 'primary' : ''"
          @click="changeType(3)"
        >节点测试报告信息</el-button>
        <el-button :type="activeType == 4 ? 'primary' : ''" @click="changeType(4)">紧急联系人信息</el-button>
      </el-button-group>

      <div>
        <el-button type="primary" @click="saveDevice">保存</el-button>
        <el-button @click="goBack">返回</el-button>
      </div>
    </div>

    <div class="form-wrap">
      <div class="info-wrap base-info">
        <div class="title" id="base-info">基本信息</div>
        <el-form
          ref="baseForm"
          :model="baseFormData"
          label-width="120px"
          :label-position="left"
          :rules="baseFormRules"
        >
          <el-form-item label="设备序列号">{{ baseFormData.deviceNo }}</el-form-item>
          <el-form-item label="设备安装时间">
            <el-col :span="16">
              <!-- <el-input v-model="baseFormData.instTime"></el-input> -->
              <el-date-picker v-model="baseFormData.instTime" type="datetime" placeholder="选择日期时间"></el-date-picker>
            </el-col>
          </el-form-item>

          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item label="安装地址" prop="insProviceCode" label-width="120px">
                <el-select
                  v-model="baseFormData.insProviceCode"
                  placeholder="请选择省"
                  @change="changeProvice"
                >
                  <el-option
                    v-for="pItem in proviceData"
                    :key="pItem.value"
                    :label="pItem.label"
                    :value="pItem.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label prop="insCountryCode" label-width="0">
                <el-select v-model="baseFormData.insCountryCode" placeholder="请选择市"
                  @change="changeCountry">
                  <el-option
                    v-for="cItem in cityData"
                    :key="cItem.value"
                    :label="cItem.label"
                    :value="cItem.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- <el-row> -->
          <el-form-item label prop="insAddress" label-width="0" style="margin-left: 120px">
            <el-input type="textarea" v-model="baseFormData.insAddress" placeholder="详细地址"></el-input>
          </el-form-item>
          <!-- </el-row> -->

          <el-form-item label="客户名称">
            <el-input v-model="baseFormData.customerName"></el-input>
          </el-form-item>
          <el-form-item label="电脑ID" prop="computerID">
            <el-input v-model="baseFormData.computerID"></el-input>
          </el-form-item>
          <el-form-item label="控制码" prop="controlCode">
            <el-input v-model="baseFormData.controlCode"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <el-divider></el-divider>
      <div class="info-wrap install-info">
        <div class="title" id="install-info">末端设备安装信息</div>
        <div class="add-btn">
          <el-button type="primary" size="small" icon="el-icon-plus" @click="editInstall('add')">新增</el-button>
        </div>
        <el-form
          ref="installForm"
          :model="endDevice"
          label-width="0px"
          :label-position="left"
          :rules="installFormRules"
        >
          <el-form-item v-for="(item, index) in endDevice" :key="index">
            <el-row :gutter="10">
              <el-col :span="4">
                <el-input v-model="item.meterNum" placeholder="请填写设备编号"></el-input>
              </el-col>
              <el-col :span="4">
                <el-input v-model="item.deviceName" placeholder="请填写设备名称"></el-input>
              </el-col>
              <el-col :span="4">
                <el-select v-model="item.type" placeholder="请选择设备类型" style="width: 100%;">
                  <el-option
                    v-for="item in typeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-col>
              <el-col :span="4">
                <el-input-number v-model="item.floor" placeholder="楼层" style="width: 100%"></el-input-number>
              </el-col>
              <el-col :span="3">
                <el-input v-model="item.roomNo" placeholder="请填写房号"></el-input>
              </el-col>
              <el-col :span="2">
                <span class="del-text" v-if="index > 0" @click="editInstall('del', index)">删除</span>
              </el-col>
            </el-row>
          </el-form-item>
        </el-form>
      </div>
      <el-divider></el-divider>
      <div class="info-wrap report-info" v-if="deviceId">
        <div class="title" id="report-info">节点测试报告信息</div>
        <div class="overview">
          <ReportInfo :data="reportData" :endDevice="endDevice"></ReportInfo>
        </div>
        <el-divider v-if="deviceId"></el-divider>
      </div>
      <div class="info-wrap contact-info">
        <div class="title" id="contact-info">紧急联系人信息</div>
        <el-input type="textarea" v-model="remark"></el-input>
      </div>
    </div>
  </div>
</template>
<script>
import { onMounted, reactive, ref, toRefs, computed } from "vue";
import { ElMessage } from "element-plus";
import regionData from "/@/components/ProvincesCascader/region.json";
import { addDevice, updateDevice, getDeviceNo, getDeviceDetails } from "/@/api/admin";
import { useRouter, useRoute } from "vue-router";
import dayjs from "dayjs";
import ReportInfo from "./modules/report-info/Index.vue";

const linkIdMap = {
  1: "#base-info",
  2: "#install-info",
  3: "#report-info",
  4: "#contact-info"
};
export default {
  deviceName: "DeviceAdd",
  components: {
    ReportInfo
  },
  setup() {
    const state = reactive({
      loading: false,
      activeType: "1",
      //   base info
      baseFormData: {
        deviceNo: "", // 设备序列号
        instTime: "", // 安装时间
        insProviceCode: 0,
        insProvice: "",
        insCountryCode: 0,
        insCountry: "",
        insAddress: "",
        customerName: "", // 公司名称
        computerID: "", // 电脑id
        controlCode: "" // 控制号
        // validDay: 2, // 有效期
      },
      typeOptions: [
        {
          value: 1,
          label: "电量采集"
        },
        {
          value: 2,
          label: "温湿度采集"
        },
        {
          value: 3,
          label: "空调测试设备"
        }
      ],
      baseFormRules: {
        insProviceCode: [
          { required: true, message: "请选择省", trigger: "change" }
        ],
        insCountryCode: [
          { required: true, message: "请选择市", trigger: "change" }
        ],
        insAddress: [
          { required: true, message: "请输入详细地址", trigger: "blur" }
        ],
        computerID: [
          { required: true, message: "请选择活动区域", trigger: "blur" }
        ],
        controlCode: [
          { required: true, message: "请选择活动区域", trigger: "blur" }
        ]
      },
      proviceData: [],
      cityData: [],
      // install info11
      installFormRules: {
        deviceName: [
          { required: true, message: "请选择省", trigger: "change" }
        ],
        floor: [{ required: true, message: "请选择市", trigger: "change" }],
        roomNo: [{ required: true, message: "请选择市", trigger: "change" }]
      },
      endDevice: [
        {
          meterNum: "",
          deviceName: "",
          type: null,
          floor: 0,
          roomNo: ""
        }
      ],
      floorData: [-3, -2, -1, 0, 1, 2, 3, 4, 5],
      remark: "",
      isEdit: false,
      reportData: {
        allSave: 200,
        saveRate: 10,
        timeLength: 160,
        originSave: 2000,
        originBegin: 1000,
        originFinish: 3000,
        powerSave: 1800,
        powerBegin: 3000,
        powerFinish: 4800,
        originStart: "2021.08.08 06:30:10",
        originEnd: "2021.08.10 06:30:20",
        powerStart: "2021.08.11 06:30:10",
        powerEnd: "2021.08.13 06:30:10"
      },
      deviceId: ""
    });

    const baseForm = ref(null);
    const installForm = ref(null);
    const router = useRouter(),
      route = useRoute();
    state.deviceId = route.query.id;
    onMounted(() => {
      state.proviceData = regionData.map(x => {
        return {
          value: x.value,
          label: x.label
        };
      });
      if (state.deviceId) {
        state.isEdit = true;
        getDeviceDetails(state.deviceId)
          .then(res => {
            if (res.code == 0) {
              const {
                deviceNo,
                instTime,
                insProviceCode,
                insCountryCode,
                insProvice,
                insCountry,
                insAddress,
                customerName,
                computerID,
                controlCode,
                deviceID,
                report,
                remark
              } = res.data;
              const cityData = regionData.find(x => x.label == insProvice);
              // TODO: 
              state.cityData = (cityData && cityData.children) || [];
              state.baseFormData = {
                deviceNo,
                instTime: dayjs(instTime).valueOf(),
                insProviceCode,
                insCountryCode,
                insProvice,
                insCountry,
                insAddress,
                customerName,
                computerID,
                controlCode,
                deviceID
              };
              state.reportData = report || {};
              state.remark = remark || '';
              state.endDevice = res.data.endDevices.map(x => {
                x.floor = Number(x.floor);
                return x;
              }) || [
                {
                  meterNum: "",
                  deviceName: "",
                  type: null,
                  floor: 0,
                  roomNo: ""
                }
              ];
            }
          })
          .catch(err => {
            ElMessage.error({
              message: err,
              type: "error"
            });
          });
      } else {
        getDeviceNo()
          .then(res => {
            if (res.code == 0) {
              state.baseFormData.deviceNo = res.data;
            }
          })
          .catch(err => {
            ElMessage.error({
              message: err,
              type: "error"
            });
          });
      }
    });

    const changeType = type => {
      state.activeType = type;
      document.querySelector(linkIdMap[type]).scrollIntoView(true);
    };

    const changeProvice = val => {
      state.baseFormData.insCountryCode = "";
      const cityData = regionData.find(x => x.value == val);
      state.cityData = (cityData && cityData.children) || [];
      state.baseFormData.insProvice = cityData.label;
    };
    const changeCountry = val => {
      const countryInfo = state.cityData.find(x => x.value == val);
      state.baseFormData.insCountry = countryInfo.label;
    }

    const editInstall = (type, idx) => {
      if (type === "add") {
        state.endDevice.push({
          deviceName: "",
          floor: 0,
          roomNo: ""
        });
      } else if (type === "del") {
        state.endDevice.splice(idx, 1);
      }
    };

    const saveDevice = async () => {
      let validAll = true;
      let inValidType;
      // 校验到有没有填写的内容，重定位
      baseForm.value.validate(valid => {
        if (!valid) {
          validAll = false;
          inValidType = 1;
        }
      });

      installForm.value.validate(valid => {
        if (!valid) {
          validAll = false;
          if (!inValidType) inValidType = "2";
        }
      });

      if (!validAll) {
        ElMessage.error({
          message: "请完整填写信息！",
          type: "error"
        });
        state.loading = false;
        changeType(inValidType);
        return;
      }

      const instTime = new Date(state.baseFormData.instTime).toISOString();
      //   请求接口
      const params = {
        ...state.baseFormData,
        instTime,
        insProvice: state.proviceData.find(
          ele => ele.value === state.baseFormData.insProviceCode
        ).label,
        insCountry: state.cityData.find(
          ele => ele.value === state.baseFormData.insCountryCode
        ).label,
        endDevice: state.endDevice.map(x => {
          x.floor = String(x.floor);
          return x;
        })
      };

      state.loading = true;
      if (state.deviceId) {
        updateDevice(params).then(res => {
          state.loading = false;
          if (res.code == 0) {
            ElMessage.success({
              message: "修改成功",
              type: "success"
            });
            router.push({ path: "/device" });
          }
        }).catch(err => {
          state.loading = false;
          console.log(err);
        });
      } else {
        addDevice(params).then(res => {
          state.loading = false;
          if (res.code == 0) {
            ElMessage.success({
              message: "保存成功",
              type: "success"
            });
            router.push({ path: "/device" });
          }
        }).catch(err => {
          state.loading = false;
          console.log(err);
        });
      }

    };
    const goBack = () => {
      router.go(-1);
    };

    return {
      ...toRefs(state),
      baseForm,
      installForm,
      changeType,
      editInstall,
      changeProvice,
      changeCountry,
      saveDevice,
      goBack
    };
  }
};
</script>
<style lang="less" scoped>
.add-device {
  background: #fff;
  padding: 0 0 35px 0;
  position: relative;

  .nav-bar {
    padding: 20px;
    position: sticky;
    display: flex;
    align-items: center;
    justify-content: space-between;
    top: 0;
    z-index: 9;
    background-color: #fff;
    box-shadow: 0px 11px 10px 0px rgba(184, 184, 184, 0.1);
  }

  .form-wrap {
    padding: 0 20px;
  }

  .el-form-item {
    margin-bottom: 20px;
  }
  .base-info {
    max-width: 800px;
  }
  .install-info {
    width: 1000px;
  }
  .contact-info {
    max-width: 900px;
  }
  .report-info {
    max-width: 900px;
  }
  .title {
    margin: 20px 0;
    font-weight: bold;
  }
  .add-btn {
    margin-bottom: 20px;
  }
  .install-info {
    .del-text {
      color: #409eff;
      cursor: pointer;
    }
  }
}
</style>
