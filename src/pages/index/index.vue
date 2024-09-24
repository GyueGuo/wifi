<template>
	<view class="container">
		<image src="/static/wifi.jpeg" class="logo" />
		<Button class="button plain" plain type="primary" :disabled="!code" @click="getUserCode">微信授权登录</Button>
		<Button class="button primary" type="primary" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber"
			:disabled="!code">微信手机号登录</Button>
	</view>
</template>

<script>
import { wechatLogin } from '../../services/user';
import { setUserToken } from '../../utils/user';
export default {
	data() {
		return {
			code: '',
		}
	},
	onShow() {
		wx.login({
			success: (res) => {
				this.code = res?.code || '';
			}
		});
	},
	methods: {
		getUserCode() {
			wx.login({
				success: (res) => {
					// 发送code到你的后台服务器
					this.code = res?.code || '';
					this.sendCodeToEnd(res.code, '');
				},
				fail() {
					uni.showToast({
						icon: 'error',
						title: '登录失败',
					});
				}
			});
		},
		getPhoneNumber({ detail }) {
			if (!detail.iv) {
				uni.showToast({
					icon: 'error',
					title: '获取手机号失败',
				});
			}
			if (detail.errMsg.indexOf("user deny") > -1) {
				return;
			}
			this.checkCode(this.code).then((code) => {
        this.sendCodeToEnd(code, detail.code)
      }, () => {
				uni.showToast({
					icon: 'error',
					title: '获取手机号失败',
				});
      });
		},
		sendCodeToEnd(code, phoneCode) {
			const params = {
				loginCode: code
			};
			if (phoneCode) {
				params.phoneCode = phoneCode;
			}
			wechatLogin(params).then(({ data }) => {
        setUserToken(data.token);
				uni.navigateTo({
					url: '/pages/merchant/report'
				});
			}, (err) => {
        debugger;
				uni.showToast({
					icon: 'error',
					title: err?.data?.msg || '登录失败',
				});
			});
		},
		checkCode(code) {
			return new Promise((resolve, reject) => {
				uni.checkSession({
					success(val) {
						if (val.errMsg == 'checkSession:ok') {
							resolve(code);
						} else {
							uni.login({
								provider: 'weixin',
								success(res) {
									resolve(res.code)
								},
								fail(res) {
									reject();
								}
							});
						}
					},
					fail(err) {
						uni.login({
							provider: 'weixin',
							success(res) {
								resolve(e.target.code);
							},
							fail() {
								reject();
							}
						});
					}
				});

			})
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
