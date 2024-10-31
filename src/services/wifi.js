import request from "../utils/request";

export const getAdId = (data) => (
  request({
    url: '/client/wifi/getAdId',
    method: 'GET',
    data,
  })
)

export const getWifiConfig = (data) => (
  request({
    url: '/client/wifi/config',
    method: 'GET',
    data
  })
)
export const getWifiConfigList = (data) => (
  request({
    url: '/client/wifi/configList',
    method: 'GET',
    data
  })
)
export const sendWifiLog = (data) => {
  console.log('上报连接日志')
  request({
    url: '/client/wifi/log',
    method: 'POST',
    data,
  })
}
export const sendWifiLog2 = (data) => {
  console.log('上报连接日志')
  request({
    url: '/client/wifi/log2',
    method: 'POST',
    data,
  })
}
export const updateWifiConfig = (data) => (
  request({
    url: '/client/wifi/updateWifiConfig',
    method: 'POST',
    data,
  })
)
export const getQrcode = (data) => (
  request({
    url: '/client/wifi/getQrcode',
    method: 'GET',
    data
  })
)

export const deleteWifi = (data) => (
  request({
    url: '/client/wifi/deleteWifiConfig',
    method: 'GET',
    data
  })
)