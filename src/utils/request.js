import axios from 'axios';
import qs from 'qs';
import { ElMessageBox, ElMessage } from 'element-plus'
import router from '/@/router/index'
import { localGet, localSet } from './index'
import config from '/@/config'

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
axios.defaults.timeout = 120000; // 设置两分钟
axios.defaults.baseURL = config[import.meta.env.MODE].baseUrl;

const http = axios.create();
// 添加一个请求拦截器
http.interceptors.request.use(
  config => {
    config.headers['Authorization'] =  'Bearer ' + localGet('token');
    return config;
  },
  error => {
    // 请求出错
    console.log('发送错误', error);
  }
);

// 添加一个响应拦截器
http.interceptors.response.use(
  response => {
    const { code, message} = response.data;
    if (code == 4200) {
      ElMessageBox.confirm('登录已失效，需重新登录', '提示', { 
        type: 'warning',
        confirmButtonText: '确定',
      }).then(() => {
        localStorage.removeItem('token');
        router.push('/login');
      })
    } else if (code != 0) {
      ElMessage({
        type: 'error',
        message: message
      })
    }
    return response.data;
  },
  error => {
    return Promise.reject(error.response.data);
  }
);

// get请求
http.getAjax = function(url, params) {
  return http.get(url, { params: params });
 }
// post 请求
http.postAjax = function (url, params, isJson=false, options) {
  return isJson ? http.post(url, params, options) : http.post(url, qs.stringify(params), options);
}
// 删除接口
http.deleteAjax = function (url) {
  return http.delete(url);
}

// 上传 formData格式
http.postFormData = function(url, formData) { 
  return http.post(url, formData);
}

export default http;
