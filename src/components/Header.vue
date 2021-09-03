<template> 
   <div class="header-wrapper">
    <div class="header-container display-flex">
      <div class="header-menu display-flex">
        <div class="logo-name">
          预略科技
        </div>

        <el-menu class="menu-nav"
          mode="horizontal"
          background-color="#21262b"
          :router="true"
          :default-active="currentPath"
        >
          <el-menu-item index="/device">设备管理</el-menu-item>
          <el-menu-item index="/feedback">意见反馈</el-menu-item>
        </el-menu>
      </div>

      <div class="avatar-container display-flex">
        <el-dropdown @command="handleDropdown">
          <div class="avatar-wrapper">
            <span class="user-avatar">
              <i class="el-icon-user-solid"></i>
            </span>
            <span class="user-name">{{ userName }}</span>
            <i class="el-icon-arrow-down el-icon--right"></i>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, toRefs, watch, reactive } from 'vue';
import { useRouter, useRoute } from 'vue-router'
import { localRemove, localGet } from '/@/utils'

export default defineComponent({
  name: 'Header',
  setup() {
    const router = useRouter();
    const route = useRoute();
    const userName = localGet('username') || '';

    const state = reactive({
      currentPath: '/device'
    })
    
    const handleDropdown = (command) => {
      switch (command) {
        case 'logout':
          localRemove('token')
           window.location.reload()
          break;
        default:
          break;
      }
    };

    console.log(route.path)

    watch(() => route.path, () => {
      let index = route.path.lastIndexOf('/');
      if (index > 0) {
        state.currentPath = route.path.substr(0, index);
      } else {
        state.currentPath = route.path;
      }
    })

    return {
      ...toRefs(state),
      userName,
      handleDropdown
    };
  },
})
</script>


<style lang="less" scoped>
  .header-wrapper {
    position: fixed;
    top: 0;
    z-index: 101;
    width: 100%;
    height: 60px;
    background-color: #21262b;

    .header-container {
      padding: 0 40px 0 60px;
    }
    .header-menu {
      flex: 1;
      align-items: center;
      font-size: 17px;
      font-weight: 500;
      color: #fff;
      img {
        width: 48px;
        height: 48px;
        vertical-align: middle;
        margin-right: 12px;
      }
      .logo-name {
        font-size: 24px;
        padding-right: 35px;
      }
      .menu-nav {
        .el-menu-item {
          padding: 0;
          padding: 0 18px;
          color: #bfcbd9;

          &.is-active, &:hover, &:focus {
            border-bottom: 4px solid #409EFF !important;
            color: #fff;
            background: #1b1e23;
          }
        }
      }
    }
    .avatar-container {
      outline: none;
      min-width: 200px;
      align-items: center;
      justify-content: flex-end;
      .icon {
        margin-right: 15px;
        display: inline-block;
        [class*="el-icon-"] {
          font-size: 20px;
          color: #9595ad;
        }
      }
      .avatar-wrapper {
        height: 60px;
        line-height: 60px;
        cursor: pointer;
        position: relative;
        color: #bfcbd9;
        .user-avatar {
          width: 40px;
          height: 40px;
          display: inline-block;
          vertical-align: middle;
          border-radius: 50%;
          background-color: #fff;
          font-size: 28px;
          line-height: 1.5;
          text-align: center;
        }
        .user-name {
          margin: 0 12px;
        }
      }
    }
  }
</style>
