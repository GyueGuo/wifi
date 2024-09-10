<template>
	<view class="content">
		<view class="page-wifi">
			<view class="top">
        <text class="iconfont icon-wifi" />
				<text class="title">点击下方按钮连接wifi</text>
				<text class="iconfont icon-xiangxiazhanhang" />
			</view>
			<view class="bottom">
				<text class="iconfont icon-wifi" />
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {}
		},
		onLoad() {

		},
		methods: {

		}
	}
</script>

<style>
page, .content {
  height: 100%;
}
.page-wifi {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #039bfb;
}
.top {
  height: 50%;
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.top .icon-wifi {
  font-size: 200rpx;
}
</style>
