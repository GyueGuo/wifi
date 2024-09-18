<template>
	<view class="content">
		<view class="section top">
			<text class="title">昨日收益</text>
			<view class="income">
				<text>30000</text>
				<text class="iconfont wind-ascending"></text>
				<text class="iconfont wind-descending"></text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: 'Hello'
			}
		},
		onLoad() {

		},
		methods: {

		}
	}
</script>

<style lang="scss" scoped>

	.content {
		padding: 32rpx;
	}
	.section {
		border-radius: 16rpx;
		background-color: $uni-text-color-inverse;
	}
	.top {
		
	}
	.title {
		line-height: 80rpx;
		text-indent: 32rpx;
		font-weight: bold;
		font-size: 48rpx;
	}
</style>
