<template>
  <view class="container">
    <div class="top">
      <text class="iconfont icon-1USER avatar"></text>
      <text>{{ name }}</text>
    </div>
    <div class="form">
      <!-- <view>
        <Button class="button" type="primary" @click="submit">我的商户</Button>
      </view>
      <view>
        <Button class="button" type="primary" @click="goSetting">个人设置</Button>
      </view> -->
    </div>
  </view>
</template>
<script>
export default {
  data() {
    return {
      name: '欢迎回来'
    }
  },
  onLoad() {
    //通过store获取商户信息
  },
  methods: {
    goSetting() {
      uni.navigateTo({
        url: '/pages/merchant/setting'
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
  .top {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 60rpx 0;
    background-color: $uni-color-primary;
    color: $uni-text-color-inverse;

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
    background-color: $uni-text-color-inverse;

    .item {
      margin-top: 32rpx;
      display: flex;
      line-height: 100rpx;
      box-shadow: 0 6rpx 16rpx $uni-bg-color-hover;

      .label {
        width: 200rpx;
        text-indent: 32rpx;
        color: $uni-text-color-grey;
      }

      .content {
        width: 0;
        flex: 1;

        input {
          height: 100rpx;
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
      color: $uni-text-color-inverse !important;
      background-color: $uni-color-primary !important;

      &[disabled] {
        background-color: $uni-text-color-disable !important;
      }
    }
  }
}
</style>