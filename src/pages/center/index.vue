<template>
  <view class="container">
    <div class="top">
      <text class="iconfont icon-1USER avatar"></text>
      <text class="welcome">{{ userInfo ? userInfo.nickName : '' }} 欢迎回来</text>
    </div>
    <div class="form">
      <view>
        <Button v-if="userInfo.userType != '05'" class="button" type="primary" @click="goMyUser">我的商户</Button>
      </view>
      <view>
        <Button v-if="userInfo.userType != '05'" class="button" type="primary" @click="previewCode">推广注册</Button>
      </view>
      <view>
        <Button class="button" type="primary" @click="goWifiConfig">WIFI配置</Button>
      </view>
      <view>
        <Button class="button" type="primary" @click="goSetting">个人设置</Button>
      </view>
    </div>
    <view class="popupView" v-if="popupView">
      <!-- 遮罩区域，点击隐藏弹出层 -->
      <view class="close" @click="previewCode"></view>
      <!-- 内容区 -->
      <view class="content">
        <view>我的推广码</view>
        <view>
          <image :src="`data:image/png;base64,${userInfo.registerToken}`" mode="aspectFit"
            :show-menu-by-longpress="true">
          </image>
        </view>
      </view>
      <!-- 遮罩区域，点击隐藏弹出层 -->
      <view class="close" @click="previewCode"></view>
    </view>
  </view>
</template>
<script>
import { getUserInfo } from '../../services/user';
export default {
  data() {
    return {
      userInfo: null,
      popupView: false,
    }
  },
  onLoad() {
    //通过store获取商户信息
  },
  onShow() {
    getUserInfo().then(({ data }) => {
      this.userInfo = data;
    })
  },
  methods: {
    previewCode() {
      this.popupView = !this.popupView;
    },
    goMyUser() {
      uni.navigateTo({
        url: '/pages/platform/index'
      });
    },
    goSetting() {
      uni.navigateTo({
        url: '/pages/user-info/index'
      });
    },
    goWifiConfig() {
      uni.navigateTo({
        url: '/pages/user-info/wifiList'
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
    padding: 0 20rpx 32rpx;
    background-color: $uni-text-color-inverse;
    box-shadow: 0 6rpx 16rpx $uni-bg-color-hover;

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
      margin-top: 50rpx;
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

.popupView {
  width: 100vw;
  height: calc(100vh - 0px);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  overflow: hidden;
}

.popupView .close {
  flex-grow: 1;
  background-color: rgba(41, 41, 41, 0.699);
}

.popupView .content {
  background-color: #f5f5f5;
  padding: 15rpx;
  text-align: center;
}
</style>