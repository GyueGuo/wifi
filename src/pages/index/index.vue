<template>
	<view class="container">
		<image src="/static/wifi.jpeg" class="logo"/>
		<Button class="button" plain type="primary" :disabled="isDisabled" @getuserinfo="getUserCode">微信授权登录</Button>
  <Button class="button" type="primary" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber" :disabled="isDisabled">微信手机号登录</Button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isDisabled: false,
				code: '',
			}
		},
		onLoad() {

		},
		onShow() {
			wx.login({
				success(res) {
					this.code = res?.code || '';
				}
			})
		},
		methods: {
			getUserCode() {

			},
			getPhoneNumber(e) {

			}
		}
	}
</script>

<style>
page {
  height: 100%;
}
.container {
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  padding: 0 48rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
  .logo {
	width: 300rpx;
	height: 300rpx;
  }
.button {
  display: block;
  border-radius: 16rpx;
  padding: 0;
  width: 100%;
  height: 100rpx;
  line-height: 100rpx;
  font-size: 32rpx;
  text-align: center;
  color: #fff;
  background-color: #039bfb;
}
.button:first-child {
  margin-bottom: 48rpx;
}

</style>
