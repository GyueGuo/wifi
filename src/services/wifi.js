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
      data,
    })
  )
