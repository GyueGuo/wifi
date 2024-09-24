const storageKey = "USER_AUTH_TOKEN";
export const isUserLogin = () => (
    !!uni.getStorageSync(storageKey)
)

export const setUserToken = (data) => {
    uni.setStorageSync(storageKey, data)
}

export const getUserToken = () => {
    uni.getStorageSync(storageKey)
}