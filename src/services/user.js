import request from "../utils/request";

export const wechatLogin = (data) => (
  request({
    url: '/app/login/wechatLogin',
    method: 'GET',
    data,
  })
)

export const userNameLogin = (data) => (
  request({
    url: '/app/login/userNameLogin',
    method: 'GET',
    data,
  })
)

export const register = (data) =>
  request({
    url: '/app/login/register',
    method: 'POST',
    data,
  })

export const updateUserInfo = (data) =>
  request({
    url: '/app/login/updateInfo',
    method: 'POST',
    data,
  })
export const getUserInfo = (data) =>
  request({
    url: '/app/login/getInfo',
    method: 'GET',
    data,
  })
export const resetPwd = (data) =>
  request({
    url: '/app/login/resetPwd ',
    method: 'POST',
    data,
  })