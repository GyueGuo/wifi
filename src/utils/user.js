const storageKey = "USER_AUTH_TOKEN";
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
   return  uni.getStorageSync(storageKey)
}