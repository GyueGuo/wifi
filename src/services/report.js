import request from "../utils/request";

export const getMyReport = (data) => (
  request({
    url: '/wechat/statistics/getMyReport',
    method: 'GET',
    data,
  })
)
export const getWalletAccount = (data) => (
  request({
    url: '/withdrawal/getWalletAccount',
    method: 'GET',
    data,
  })
)
export const updateAccount = (data) => (
  request({
    url: '/withdrawal/updateWalletAccount',
    method: 'POST',
    data,
  })
)

export const getPayDetailList = (data) => (
  request({
    url: '/withdrawal/getPayDetailList',
    method: 'GET',
    data,
  })
)