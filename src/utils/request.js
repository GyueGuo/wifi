const BASE_URL = 'http://182.92.67.132';
export default function ({ url, method = 'post', data = {}}) {
    return new Promise((resolve, reject) => {
        uni.request({
            url: url.match(/^http?s:\/\//) ? url : `${BASE_URL}${url}`,
            method,
            data,
            timeout: 5000,
            success(res) {
                res?.code === 0 ? resolve(res) : reject(res);;
            },
            fail(err) {
                reject(err);
            }
        })
    })
}