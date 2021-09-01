<template>
  <div class="overview">
    <ul class="top-overview">
        <li>
          <p>节电额：</p>
          <p>{{data.power}}hkw</p>
        </li>
        <li>
          <p>节电率：</p>
          <p>{{data.powerRadio}}%</p>
        </li>
        <li>
          <p>测试周期：</p>
          <p>{{data.period}}小时</p>
        </li>
    </ul>
    <ul class="overview-list">
      <li class="left">
          <p>原始模式测试电量：{{data.originPower}}hkw(起{{data.originPowerFrom}}-止{{data.originPowerTo}})</p>
          <p>节能模式测试电量：{{data.enegyPower}}hkw(起{{data.enegyPowerFrom}}-止{{data.enegyPowerTo}})</p>
      </li>
      <li class="right">
          <p>原始模式采集时间：{{data.originTimeFrom}}-{{data.originTimeTo}})</p>
          <p>节能模式采集时间：{{data.enegyTimeFrom}}-{{data.enegyTimeTo}})</p>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'DeviceDialog',
  props: {
    data: {
      type: Option,
      defalut: {
        power: 200,
        powerRadio: 10,
        period: 160,
        originPower: 2000,
        originPowerFrom: 1000,
        originPowerTo: 3000,
        enegyPower: 1800,
        enegyPowerFrom: 3000,
        enegyPowerTo: 4800,
        originTimeFrom: '2021.08.08 06:30:10',
        originTimeTo: '2021.08.10 06:30:20',
        enegyTimeFrom: '2021.08.11 06:30:10',
        enegyTimeTo: '2021.08.13 06:30:10'
      }
    }
  },
  setup(props) {
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