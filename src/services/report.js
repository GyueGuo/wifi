import request from "../utils/request";

export const getMyReport = (data) => (
  request({
    url: '/wechat/statistics/getMyReport',
    method: 'GET',
    data,
  })
)