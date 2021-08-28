import request from '/@/utils/request'

// 帐号登录
export function accountSign (params) {
  return request.postAjax('/account/accounts/sign', params, true)
}

