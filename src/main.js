import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/lib/theme-chalk/index.css'
import locale from 'element-plus/es/locale/lang/zh-cn'
import '/@/assets/css/common.less'
import router from '/@/router/index'
import commonFun from './utils/commonFun'
const app = createApp(App)
app.use(ElementPlus, { locale })
app.use(router)
app.use(commonFun)
app.mount('#app')
