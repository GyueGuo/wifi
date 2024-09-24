import request from "../utils/request";

export const wechatLogin = (data) => (
  request({
    url: '/app/login/wechatLogin',
    method: 'GET',
    data,
  })
)
