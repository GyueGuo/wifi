const storageKey = "USER_AUTH_TOKEN";
const userInfoKey = "USER_INFO";
export const isUserLogin = () => (
    !!uni.getStorageSync(storageKey)
)

export const setUserToken = (data) => {
    uni.setStorageSync(storageKey, data)
}

export const logout = (data) => {
    uni.setStorageSync(storageKey, data)
}

export const getUserToken = () => {
    return uni.getStorageSync(storageKey)
}

export const setUserInfo = (data) => {
    uni.setStorageSync(userInfoKey, data)
}
export const getUserInfo = () => {
    return uni.getStorageSync(userInfoKey)
}
export const updateUserNickName = (nickName) => {
    const userInfo = uni.getStorageSync(userInfoKey)
    userInfo.nickName = nickName;
    uni.setStorageSync(userInfoKey, userInfo)
}