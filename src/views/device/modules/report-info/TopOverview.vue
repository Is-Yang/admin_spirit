<template>
  <div class="overview">
    <ul class="top-overview">
        <li>
          <p>节电额：</p>
          <p>{{data.allSave}}hkw</p>
        </li>
        <li>
          <p>节电率：</p>
          <p>{{data.saveRate}}%</p>
        </li>
        <li>
          <p>测试周期：</p>
          <p>{{data.timeLength}}小时</p>
        </li>
    </ul>
    <ul class="overview-list">
      <li class="left">
          <p>原始模式测试电量：{{data.originSave}}hkw(起{{data.originBegin}}~止{{data.originFinish}})</p>
          <p>节能模式测试电量：{{data.powerSave}}hkw(起{{data.powerBegin}}~止{{data.powerFinish}})</p>
      </li>
      <li class="right">
          <p>原始模式采集时间：{{dateFomate(data.originStart)}}~{{dateFomate(data.originEnd)}}</p>
          <p>节能模式采集时间：{{dateFomate(data.powerStart)}}~{{dateFomate(data.powerEnd)}}</p>
      </li>
    </ul>
  </div>
</template>

<script>
import dayjs from "dayjs";
export default {
  name: 'DeviceDialog',
  props: {
    data: {
      type: Option,
      defalut: {
        allSave: 200,
        saveRate: 10,
        timeLength: 160,
        originSave: 2000,
        originBegin: 1000,
        originFinish: 3000,
        powerSave: 1800,
        powerBegin: 3000,
        powerFinish: 4800,
        originStart: '2021.08.08 06:30:10',
        originEnd: '2021.08.10 06:30:20',
        powerStart: '2021.08.11 06:30:10',
        powerEnd: '2021.08.13 06:30:10'
      }
    }
  },
  setup(props) {
    const dateFomate = (date) =>{
      return dayjs(date).format('YYYY.MM.DD hh:mm:ss')
    }
    return {
      dateFomate
    }
  }
}
</script>

<style lang="less" scoped>
.overview {
  ul.top-overview {
    width: 50%;
    display: flex;
    li {
      flex: 1;
    }
  }
  ul.overview-list {
    margin-top: 10px;
    padding: 20px 0px;
    background-color: #f2f2f2;
    display: flex;
    justify-content: space-around;
  }
}
</style>