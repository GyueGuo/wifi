<template>
	<view class="content">
    <text class="iconfont icon-wifi logo" />
    <text class="desc">免费wifi已准备好</text>
    <view class="button" v-if="connected">已连接</view>
    <view class="button" v-else-if="connecting">连接中...</view>
    <view class="button" v-else @click="handleConnect">一键连接</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
        readyStatus: false,
        connecting: false,
        connected: false,
      }
		},
		methods: {
      handleConnect() {},
		}
	}
</script>

<style lang="scss">
page {
  height: 100%;
}
.content{
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: $uni-color-primary;
  color: #fff;
  .logo {
    font-size: 300rpx;
    margin-top: 20%;
    margin-bottom: 10%;
  }
  .desc {
    margin-bottom: 1em;
    line-height: 2em;
    font-size: 28rpx;
  }
  .button {
    width: 90%;
    line-height: 100rpx;
    background-color: #fff;
    color: $uni-color-primary;
    border-radius: 50rpx;
    font-size: 36rpx;
    text-align: center;
  }
}
</style>
