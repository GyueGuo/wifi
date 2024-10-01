<template>
  <view class="container">
    <!-- <div class="top"> -->
    <!-- <text class="iconfont icon-1USER avatar"></text> -->
    <!-- <text class="welcome">欢迎注册</text> -->
    <!-- </div> -->
    <div class="form">
      <view class="item">
        <view class="label">wifi名称</view>
        <view class="content">
          <input v-model.trim="wifi.ssid" placeholder="请填写WIFI名称" :maxlength="20" />
        </view>
      </view>
      <view class="item">
        <view class="label">wifi密码</view>
        <view class="content">
          <input v-model.trim="wifi.pwd" placeholder="请填写WIFI密码" :maxlength="20" />
        </view>
      </view>
      <Button class="button" type="primary" @click="submit" :disabled="isDisabled">保存</Button>
    </div>
  </view>
</template>
<script>
import { updateWifiConfig } from '../../services/wifi';
export default {
  data() {
    return {
      wifi: {
        id: null,
        ssid: '',
        pwd: '',
      }
    }
  },
  computed: {

  },
  onLoad({ wifi }) {

    this.wifi = JSON.parse(wifi)
  },
  methods: {
    submit: function (e) {
      uni.showLoading({
        title: "保存中",
        mask: true,
      });
      updateWifiConfig(this.wifi).then((res) => {
        console.log(res)
        uni.hideLoading();
        if (res.code == 0) {
          uni.navigateBack();
        }
      })

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
  padding-top: 160rpx;

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