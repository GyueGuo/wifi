<template>
	<view class="container">
		<div class="top">
			<text class="iconfont icon-1USER avatar"></text>
			<text class="welcome">欢迎注册</text>
		</div>
		<div class="form">
			<view class="item">
				<view class="label">商户类型</view>
				<view class="content">
					{{ type }}
				</view>
			</view>
			<view class="item">
				<view class="label">商户名称</view>
				<view class="content">
					<input v-model.trim="name" placeholder="请填写" :maxlength="40"/>
				</view>
			</view>
			<Button class="button" type="primary" @click="submit" :disabled="isDisabled">点击注册</Button>
		</div>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				type: '渠道商户',
				isDisabled: false,
				name: '',
			}
		},
		methods: {
			submit: function(e) {
				// console.log('form发生了submit事件，携带数据为：' + JSON.stringify(e.detail.value))
				// var formdata = e.detail.value
				// uni.showModal({
				// 	content: '表单数据内容：' + JSON.stringify(formdata),
				// 	showCancel: false
				// });
			}
		}
	}
</script>
<style lang="scss">
page {
	height: 100%;
}
.container {
	.top {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 60rpx 0;
		background-color: $uni-color-primary;
		color: #fff;
		.avatar {
			font-size: 200rpx;
			
		}

		.welcome {
			line-height: 80rpx;
			font-size: 32rpx;
		}
	}
	.form {
		overflow: hidden;
		border-radius: 12rpx;
		margin: -40rpx 32rpx 0;
		padding: 0 20rpx;
		background-color: #fff;
	.item {
		margin-top: 32rpx;
		display: flex;
		line-height: 100rpx;
		box-shadow: 0 16rpx 16rpx $uni-bg-color-hover;
		.label {
			width: 200rpx;
			text-indent: 32rpx;
			color: $uni-text-color-grey;
		}
		.content {
			width: 0;
			flex: 1;
			input {
				height:100rpx;
			}
		}
	}
	
.button {
	margin-top: 100rpx;
  display: block;
  border-radius: 16rpx;
  padding: 0;
  width: 100%;
  height: 100rpx;
  line-height: 100rpx;
  font-size: 32rpx;
  text-align: center;
	color: #fff !important;
	background-color: $uni-color-primary !important;
}
	}
}
</style>