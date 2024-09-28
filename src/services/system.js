import request from "../utils/request";

export const getLoginConfig = (data) => (
  request({
    url: '/system/config/getWechatLoginConfig',
    method: 'GET',
    data,
  })
)
