import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/lib/theme-chalk/index.css'
import '/@/assets/css/common.less'
import router from '/@/router/index'
import commonFun from './utils/commonFun'
const app = createApp(App)
app.use(ElementPlus)
app.use(router)
app.use(commonFun)
app.mount('#app')
