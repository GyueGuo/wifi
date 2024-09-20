<template>
	<view class="container">
		<image src="/static/wifi.jpeg" class="logo" />
		<Button class="button plain" plain type="primary" :disabled="isDisabled" @getuserinfo="getUserCode">微信授权登录</Button>
		<Button class="button primary" type="primary" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber"
			:disabled="isDisabled">微信手机号登录</Button>
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
			let that = this;
			wx.login({
				success: function (loginRes) {
					const code = loginRes.code; // 微信返回的code
					// 发送code到你的后台服务器
					that.sendCodeToEnd(code, '');
				},
				fail(err) {
					console.log('登录失败', err);
				}
			});
		},
		getPhoneNumber({ detail }) {
			if (detail) {
				console.log(detail);
			}
		},
		sendCodeToEnd(code, phoneCode) {
			let that = this;
			let url = "/app/login/wechatLogin";
			uni.request({
				url: url,
				method: 'GET',
				data: {
					loginCode: code
				},
				success: (result) => {
					if (result.code == 0) {
						//登陆成功 跳转到首页
						uni.navigateTo({
							url: '/pages/merchant/report'
						});
					} else {
						//登陆失败
					}
				},
				fail: (err) => {
					//登陆失败
				}
			});
		}
	}
}
</script>

<style lang="scss">
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
	align-items: center;

	.logo {
		margin-top: 200rpx;
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

		&.plain {
			border-color: $uni-color-primary !important;
			color: $uni-color-primary !important;
		}

		&.primary {
			color: $uni-text-color-inverse !important;
			background-color: $uni-color-primary !important;
		}

		&:last-child {
			margin-top: 48rpx;
		}
	}
}
</style>
