<template>
  <el-card>
    <div class="add-device" v-loading="loading">
      <div class="top">
        <el-button-group>
          <el-button
            :type="activeType == 1 ? 'primary' : ''"
            @click="changeType(1)"
            >基本信息</el-button
          >
          <el-button
            :type="activeType == 2 ? 'primary' : ''"
            @click="changeType(2)"
            >末端设备安装信息</el-button
          >
          <el-button
            :type="activeType == 3 ? 'primary' : ''"
            @click="changeType(3)"
            >节点测试报告信息</el-button
          >
          <el-button
            :type="activeType == 4 ? 'primary' : ''"
            @click="changeType(4)"
            >紧急联系人信息</el-button
          >
        </el-button-group>
      </div>
      <div class="info-wrap base-info">
        <div class="title" id="base-info">基本信息</div>
        <el-form
          ref="baseForm"
          :model="baseFormData"
          label-width="120px"
          :label-position="left"
          :rules="baseFormRules"
        >
          <el-form-item label="设备序列号">
            {{ baseFormData.deviceNo }}
          </el-form-item>
          <el-form-item label="设备安装时间">
            <el-col :span="16">
              <!-- <el-input v-model="baseFormData.instTime"></el-input> -->
              <el-date-picker
                v-model="baseFormData.instTime"
                type="datetime"
                placeholder="选择日期时间"
              >
              </el-date-picker>
            </el-col>
          </el-form-item>

          <el-row :gutter="10">
            <el-col :span="10">
              <el-form-item
                label="安装地址"
                prop="insProvice"
                label-width="120px"
              >
                <el-select
                  v-model="baseFormData.insProvice"
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
            <el-col :span="6">
              <el-form-item label="" prop="insCountry" label-width="0">
                <el-select
                  v-model="baseFormData.insCountry"
                  placeholder="请选择市"
                >
                  <el-option
                    v-for="cItem in cityData"
                    :key="cItem.value"
                    :label="cItem.label"
                    :value="cItem.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="" prop="insAddress" label-width="0">
                <el-input
                  v-model="baseFormData.insAddress"
                  placeholder="详细地址"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>

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
      <div class="info-wrap install-info">
        <div class="title" id="install-info">末端设备安装信息</div>
        <div class="add-btn">
          <el-button
            type="primary"
            icon="el-icon-plus"
            @click="editInstall('add')"
            >新增</el-button
          >
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
              <el-col :span="7">
                <el-input
                  v-model="item.deviceName"
                  placeholder="请填写设备"
                ></el-input>
              </el-col>
              <el-input-number
                v-model="item.floor"
                placeholder="楼层"
              ></el-input-number>
              <el-col :span="7">
                <el-input
                  v-model="item.roomNo"
                  placeholder="请填写房号"
                ></el-input>
              </el-col>
              <el-col :span="2">
                <span
                  class="del-text"
                  v-if="index > 0"
                  @click="editInstall('del', index)"
                  >删除</span
                >
              </el-col>
            </el-row>
          </el-form-item>
        </el-form>
      </div>
      <div class="info-wrap report-info">
        <div class="title" id="report-info">节点测试报告信息</div>
        <div class="overview"></div>
      </div>
      <div class="info-wrap contact-info">
        <div class="title" id="contact-info">紧急联系人信息</div>
        <el-input type="textarea" v-model="contactInfo"></el-input>
      </div>
      <div class="save-btn">
        <el-button type="primary" v-if="isEdit" @click="toPrePage"
          >返回</el-button
        >
        <el-button type="primary" v-else @click="saveDevice">保存</el-button>
      </div>
    </div>
  </el-card>
</template>
<script>
import { onMounted, reactive, ref, toRefs } from "vue";
import { ElMessage } from "element-plus";
import regionData from "/@/components/ProvincesCascader/region.json";
import { addDevice, getDeviceNo, getDeviceDetails } from "/@/api/admin";
import { useRouter, useRoute } from "vue-router";
import dayjs from "dayjs";

const linkIdMap = {
  1: "#base-info",
  2: "#install-info",
  3: "#report-info",
  4: "#contact-info",
};
export default {
  deviceName: "DeviceAdd",
  setup() {
    const state = reactive({
      loading: false,
      activeType: "1",
      //   base info
      baseFormData: {
        deviceNo: "", // 设备序列号
        instTime: "", // 安装时间
        insProvice: "",
        insCountry: "",
        insAddress: "",
        customerName: "", // 公司名称
        computerID: "", // 电脑id
        controlCode: "", // 控制号
        // validDay: 2, // 有效期
      },
      baseFormRules: {
        insProvice: [
          { required: true, message: "请选择省", trigger: "change" },
        ],
        insCountry: [
          { required: true, message: "请选择市", trigger: "change" },
        ],
        insAddress: [
          { required: true, message: "请输入详细地址", trigger: "blur" },
        ],
        computerID: [
          { required: true, message: "请选择活动区域", trigger: "blur" },
        ],
        controlCode: [
          { required: true, message: "请选择活动区域", trigger: "blur" },
        ],
      },
      proviceData: [],
      cityData: [],
      // install info
      installFormRules: {
        deviceName: [
          { required: true, message: "请选择省", trigger: "change" },
        ],
        floor: [{ required: true, message: "请选择市", trigger: "change" }],
        roomNo: [{ required: true, message: "请选择市", trigger: "change" }],
      },
      endDevice: [
        {
          deviceName: "",
          floor: "",
          roomNo: "",
        },
      ],
      floorData: [-3, -2, -1, 0, 1, 2, 3, 4, 5],
      contactInfo: "",
      isEdit: false,
    });

    const baseForm = ref(null);
    const installForm = ref(null);
    const router = useRouter(),
      route = useRoute();
    onMounted(() => {
      state.proviceData = regionData.map((x) => {
        return {
          value: x.value,
          label: x.label,
        };
      });
      const deviceId = route.query.id;
      if (deviceId) {
        state.isEdit = true;
        getDeviceDetails(deviceId)
          .then((res) => {
            if (res.code == 0) {
              const {
                deviceNo,
                instTime,
                insProvice,
                insCountry,
                insAddress,
                customerName,
                computerID,
                controlCode,
              } = res.data;
              const cityData = regionData.find((x) => x.label == insProvice);
              state.cityData = (cityData && cityData.children) || [];
              state.baseFormData = {
                deviceNo,
                instTime: dayjs(instTime).valueOf(),
                insProvice,
                insCountry,
                insAddress,
                customerName,
                computerID,
                controlCode,
              };
              state.endDevice = res.data.endDevice || [
                {
                  deviceName: "",
                  floor: "",
                  roomNo: "",
                },
              ];
            }
          })
          .catch((err) => {
            ElMessage.error({
              message: err,
              type: "error",
            });
          });
      } else {
        getDeviceNo()
          .then((res) => {
            if (res.code == 0) {
              state.baseFormData.deviceNo = res.data;
            }
          })
          .catch((err) => {
            ElMessage.error({
              message: err,
              type: "error",
            });
          });
      }
    });

    const changeType = (type) => {
      state.activeType = type;
      document.querySelector(linkIdMap[type]).scrollIntoView(true);
    };

    const changeProvice = (val) => {
      state.baseFormData.insCountry = "";
      const cityData = regionData.find((x) => x.value == val);
      state.cityData = (cityData && cityData.children) || [];
    };

    const editInstall = (type, idx) => {
      if (type === "add") {
        state.endDevice.push({
          deviceName: "",
          floor: "",
          roomNo: "",
        });
      } else if (type === "del") {
        state.endDevice.splice(idx, 1);
      }
    };

    const saveDevice = async () => {
      let validAll = true;
      let inValidType;
      const instTime1 = new Date(state.baseFormData.instTime).toISOString();
      console.log(instTime1);
      // 校验到有没有填写的内容，重定位
      baseForm.value.validate((valid) => {
        if (!valid) {
          validAll = false;
          inValidType = 1;
        }
      });

      installForm.value.validate((valid) => {
        if (!valid) {
          validAll = false;
          if (!inValidType) inValidType = "2";
        }
      });

      if (!validAll) {
        ElMessage.error({
          message: "请完整填写信息！",
          type: "error",
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
        endDevice: state.endDevice.map((x) => {
          x.floor = String(x.floor);
          return x;
        }),
      };

      state.loading = true;

      addDevice(params)
        .then((res) => {
          state.loading = false;
          if (res.code == 0) {
            ElMessage.success({
              message: "保存成功",
              type: "success",
            });
            router.push({ path: "/device" });
          }
        })
        .catch((err) => {
          state.loading = false;
          console.log(err);
        });
    };
    const toPrePage = () => {
      router.go(-1);
    };

    return {
      ...toRefs(state),
      baseForm,
      installForm,
      changeType,
      editInstall,
      changeProvice,
      saveDevice,
      toPrePage,
    };
  },
};
</script>
<style lang="less" scoped>
.add-device {
  max-width: 700px;
  margin: 0 auto;
  .el-form-item {
    margin-bottom: 20px;
  }
  .info-wrap {
    // max-width: 700px;
  }
  .title {
    margin: 20px 0;
  }
  .add-btn {
    margin-bottom: 20px;
  }
  .save-btn {
    margin-top: 20px;
    text-align: center;
  }
  .install-info {
    .del-text {
      color: #409eff;
      cursor: pointer;
    }
  }
}
</style>
