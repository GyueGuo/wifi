<template>
	<view class="container">
		<image src="/static/wifi.jpeg" class="logo" />
		<view v-if="loginConfig">
			<text>该系统仅供内部注册人员使用</text>
		</view>
		<view style="margin-top: 50rpx;"></view>
		<view v-if="loginConfig">
			<view>
				<input style="background-color: white;color: black;" type="text" v-model="loginKey" placeholder="请输入登陆key">
			</view>
			<view>
				<Button class="button plain" plain type="primary" :disabled="!code" @click="getUserNameLogin">登陆</Button>
			</view>
		</view>
		<Button v-else class="button plain" plain type="primary" :disabled="!code" @click="getUserCode">微信授权登录</Button>
		<!-- <Button class="button primary" type="primary" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber"
			:disabled="!code">微信手机号登录</Button> -->
	</view>
</template>

<script>
import { wechatLogin, getUserInfo, userNameLogin } from '../../services/user';
import { setUserToken, setUserInfo } from '../../utils/user';
import { getLoginConfig } from '../../services/system';
export default {
	data() {
		return {
			code: '',
			loginConfig: false,
			version: '1.0.4',
			loginKey: ''
		}
	},
	onLoad({ backurl }) {
		//这个是为了审核时审核员登陆使用
		getLoginConfig().then((res) => {
			if (res.code == 0) {
				if (this.version == res.data) {
					this.loginConfig = true;
				}
			}
		})
		this.backurl = backurl ? decodeURIComponent(backurl) : '/pages/report/index';
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
		getUserNameLogin() {
			userNameLogin({ loginKey: this.loginKey }).then(({ data }) => {
				setUserToken(data.token);
				return getUserInfo();
			}).then((res) => {
				console.log(res);
				setUserInfo(res.data)
				uni.reLaunch({
					url: this.backurl
				})
			}).catch((err) => {
				uni.showToast({
					icon: 'error',
					title: err?.data?.msg || '登录失败',
				});
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
			wechatLogin(params)
				.then(({ data }) => {
					setUserToken(data.token);
					return getUserInfo();
				}).then((res) => {
					console.log(res);
					setUserInfo(res.data)
					uni.reLaunch({
						url: this.backurl
					})
				}).catch((err) => {
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
		margin-top: 300rpx;
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
