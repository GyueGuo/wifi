import request from "../utils/request";

export const getAdId = (data) => (
  request({
    url: '/client/wifi/getAdId',
    method: 'GET',
    data,
  })
)

export const getWifiConfig = () => (
  request({
    url: '/client/wifi/config',
    method: 'GET',
  })
)
export const getWifiConfigList = () => (
  request({
    url: '/client/wifi/configList',
    method: 'GET',
  })
)
export const sendWifiLog = (data) => (
  request({
    url: '/client/wifi/log',
    method: 'POST',
    data,
  })
)
export const updateWifiConfig = (data) => (
  request({
    url: '/client/wifi/updateWifiConfig',
    method: 'POST',
    data,
  })
)