<template>
  <el-config-provider :locale="locale">
    <div id="app">
      <el-container v-if="state.showMenu" class="layout">
        <Header />
        <el-main class="main-wrapper" :style="{ 'height': state.minHeight + 'px' }">
          <div class="main-content">
          <router-view />
          </div>
        </el-main>
      </el-container>
      <template v-else>
        <router-view />
      </template>
    </div>
  </el-config-provider>
</template>

<script>
import { onUnmounted, onMounted, reactive, defineComponent } from 'vue'
import Header from '/@/components/Header.vue'
import { useRoute, useRouter } from 'vue-router'
import { localGet } from '/@/utils'
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'

export default {
  name: 'App',
  components: {
    ElConfigProvider,
    Header
  },
  setup() {
    const noMenu = ['/login']
    const route = useRoute()
    const router = useRouter()
    const state = reactive({
      showMenu: false,
      minHeight: 600
    })

    const unwatch = router.beforeEach((to, from, next) => {
      state.showMenu = to.meta.showMenu;
      let token = localGet('token')
      
      if (to.path == '/login') {
        // 如果路径是 /login 则正常执行
        next()
      } else {
        // 如果不是 /login，判断是否有 token
        if (!token) {
          // 如果没有，则跳至登录页面
          next({ path: '/login' })
        } else {
          // 否则继续执行
          next()
        }
      }
    })

    const resetHeight = () => {
      state.minHeight = `${document.documentElement.clientHeight}` - 60;
      // if (state.minHeight < 550) state.minHeight = 550;
    }

    onMounted(() => {
      resetHeight();
      window.onresize = () => {
        resetHeight(); // 窗口改变执行
      };
    })

    onUnmounted(() => {
      unwatch()
    })

    return {
      state,
      locale: zhCn,
    }
  }
}
</script>

<style lang="less">
  #app {
    width: 100%;
    height: 100vh;
    min-width: 1200px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;

    .main-wrapper {
      margin-top: 60px;
      overflow: hidden;

      .main-content {
        overflow-y: auto;
        height: 100%;
      }
    }

    .layout {
      height: 100%;
    }
  }
</style>
