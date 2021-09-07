import request from '/@/utils/request'

// 获取产品序列号
export function getDeviceNo(params) {
  return request.postAjax('/admin/device/deviceNo', params, true)
}

// 新增设备
export function addDevice (params) {
  return request.postAjax('/admin/device', params, true)
}

// 获取设备详情
export function getDeviceDetails (params) {
  return request.getAjax('/admin/device/' + params)
}

// 更改设备状态
export function changeDeviceStatus (params) {
  return request.postAjax('/admin/device/update', params, true)
}

// 获取设备列表
export function getDeviceList(params) {
  return request.postAjax('/admin/search/devices', params, true)
}

// 导出
export function getExportFile(params) {
  return request.postAjax('/admin/export/devices', params, true)
}

export function getWeathCompare(params) {
  return request.getAjax(`/admin/weath/compare/${params}`)
}

export function getWeathDetails(params) {
  return request.getAjax(`/admin/weather/${params}`)
}

export function getTempAndhum(params) {
  return request.getAjax(`/admin/tempre/all/${params}`)
}
