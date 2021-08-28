<template>
  <div id="app">
    <el-container v-if="state.showMenu" class="layout">
      <Header />
      <el-main style="padding-top: 80px;">
        <router-view />
      </el-main>
    </el-container>
    <template v-else>
     <router-view />
    </template>
  </div>
</template>

<script>
import { onUnmounted, reactive } from 'vue'
import Header from '/@/components/Header.vue'
import { useRoute, useRouter } from 'vue-router'
import { localGet } from '/@/utils'
export default {
  name: 'App',
  components: {
    Header
  },
  setup() {
    const noMenu = ['/login']
    const route = useRoute()
    const router = useRouter()
    const state = reactive({
      showMenu: false
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
          console.log(to)
          // 否则继续执行
          next()
        }
      }
    })

    onUnmounted(() => {
      unwatch()
    })

    return {
      state
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

    .layout {
      height: 100%;
    }
  }
</style>
