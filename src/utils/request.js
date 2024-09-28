import { getUserToken, logout } from "./user";
const BASE_URL = 'http://182.92.67.132';

export default function ({ url, method = 'post', data = {} }) {
  return new Promise((resolve, reject) => {
    uni.request({
      url: url.match(/^http?s:\/\//) ? url : `${BASE_URL}${url}`,
      method,
      data,
      header: {
        Authorization: `Bearer ${getUserToken()}`,
      },
      timeout: 5000,
      success(res) {
        const code = res?.data?.code;
        if (code === 401) {
          logout();
          wx.showToast({
            icon: "none",
            title: '登录失效，请重新登录',
          });
          setTimeout(() => {
            const pages = getCurrentPages();
            const page = pages[pages.length - 1];
            wx.redirectTo({
              url: '/pages/login/index?backurl=' + encodeURIComponent(page.$page.fullPath)
            });
          }, 1000);
          reject(res.data);
        } else if (code === 0) {
          resolve(res.data)
        } else {
          reject(res.data);
        }
      },
      fail(err) {
        reject(err);
      }
    })
  })
}