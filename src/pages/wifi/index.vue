<template>
  <view class="wrap">
    <text class="iconfont icon-wifi logo" />
    <!-- <view>
      <input style="background-color: white;color: black;" type="text" v-model="ssid" placeholder="请输入wifi名称">
    </view>
    <view style="margin-top: 50rpx;"></view>
    <view>
      <input style="background-color: white;color: black;" type="text" v-model="pwd" placeholder="请输入wifi密码">
    </view> -->
    <!-- <view class="desc">连接前请将已连接的wifi删除，并且打开GPS定位开关</view> -->
    <view class="desc">请先观看6-30秒的广告视频</view>
    <view v-if="connected" class="button">连接成功</view>
    <view v-else class="button" @click="handleConnect">一键连接</view>
    <view class="error-modal-wrap" v-show="isModalVisible">
      <view class="error-modal">
        <view class="h1">连接失败</view>
        <view class="p">请复制密码，打开手机设置手动连接</view>
        <view class="item">
          <text class="label">名称：</text>
          <text class="content">{{ wifiInfo.ssid }}</text>
        </view>
        <view class="item">
          <text class="label">密码：</text>
          <text class="content">{{ wifiInfo.pwd }}</text>
        </view>
        <Button type="primary" @click="handleCopy" class="btn-copy">复制密码</Button>
      </view>
      <text @click="handleCloseModal" class="iconfont icon-close" />
    </view>
  </view>
</template>

<script>
import { getAdId, getWifiConfig, sendWifiLog } from '../../services/wifi';
export default {
  data() {
    return {
      uid: '',
      wifi: '',
      readyStatus: false,
      connecting: false,
      connected: false,
      ssid: '',
      pwd: '',
      adInfo: null,
      wifiInfo: null,
      wifiAvailable: false,
      isModalVisible: false,
    }
  },
  onLoad({ uid, wifiId }) {
    this.uid = uid;
    this.wifiId = wifiId;
    this.rewardedVideoAd = null;
    this.getAdId();
    // this.getWifiConfig();
  },
  methods: {
    getAdId() {
      wx.showLoading({
        title: "获取中...",
        mask: true,
      });
      getAdId({
        uid: this.uid,
      }).then(({ data }) => {
        if (wx.createRewardedVideoAd) {
          const rewardedVideoAd = wx.createRewardedVideoAd({ adUnitId: data.adUnitId });
          this.rewardedVideoAd = rewardedVideoAd;
          rewardedVideoAd.load().then(() => {
            wx.hideLoading();
            rewardedVideoAd.show()
          });

          rewardedVideoAd.onError((err) => {
            wx.hideLoading();
            sendWifiLog({ adUnitId: data.adUnitId, userId: this.uid, ...err })
          });
          rewardedVideoAd.onClose((res) => {
            res && res.isEnded && this.getWifiConfig();
          })
        } else {
          wx.hideLoading();
        }
      }, (err) => {
        wx.hideLoading();
        wx.showModal({
          content: "广告信息初始化失败，请重试",
          confirmText: "重试",
          success: (res) => {
            res.confirm && this.getAdId();
          }
        });
      });
    },
    handleConnect() {
      const { rewardedVideoAd } = this
      rewardedVideoAd && rewardedVideoAd.load().then(() => rewardedVideoAd.show());
    },
    getWifiConfig() {
      wx.showLoading({
        title: "获取中...",
        mask: true,
      });
      this.wifiAvailable = true;
      getWifiConfig({
        uid: this.uid,
      }).then(({ data }) => {
        wx.hideLoading();
        this.wifiInfo = data;
        this.connectWifi();
      }, (err) => {
        wx.hideLoading();
        wx.showModal({
          // title: '连接失败',
          content: err?.msg || "wifi信息获取失败，请重试",
          confirmText: "重试",
          success: (res) => {
            res.confirm && this.getWifiConfig();
          }
        });
      });
    },
    getLocation() {
      return new Promise((resolve, reject) => {
        wx.getLocation({
          success: resolve,
          fail: reject
        });
      });
    },
    startWifi() {
      return new Promise((resolve, reject) => {
        wx.startWifi({
          success: resolve,
          fail: reject
        });
      });
    },
    connectWifi() {
      return new Promise((resolve, reject) => {
        const { wifiInfo } = this;
        wx.connectWifi({
          SSID: wifiInfo.ssid,
          password: wifiInfo.pwd,
          forceNewApi: true,
          success: resolve,
          fail: reject
        });
      });
    },
    connectWifi() {
      if (this.connecting) {
        return;
      }
      this.connecting = true;
      wx.showLoading({
        title: "连接中...",
        mask: true,
      });
      this.getLocation()
        .then(() => this.startWifi())
        .then(() => (this.connectWifi()))
        .then(() => {
          this.connecting = false;
          this.connected = true;
          wx.hideLoading();
        }).catch((e) => {
          wx.hideLoading();
          this.connecting = false;
          if (this.wifiInfo) {
            this.isModalVisible = true;
          } else {
            wx.showModal({
              title: '连接失败',
              content: e?.errMsg || '',
            });
          }
        });
    },
    handleCloseModal() {
      this.isModalVisible = false;
    },
    handleCopy() {
      wx.setClipboardData({
        data: this.wifiInfo.pwd,
        success(res) {
          wx.showToast({
            title: '复制失败',
            icon: 'success',
            duration: 2000
          });
        },
        fail() {
          wx.showModal({
            content: '复制失败，请手动输入',
            showCancel: false,
          });
        },
      });
    }
    // connectWifi() {
    //   let that = this;
    //   wx.getLocation({
    //     success: function () {
    //       wx.startWifi({
    //         success: function () {
    //           wx.connectWifi({
    //             SSID: that.ssid,
    //             password: that.pwd,
    //             forceNewApi: true,
    //             success() {
    //               console.log('连接成功')
    //               that.connecting = false;
    //               that.connected = true;
    //             },
    //             fail(e) {
    //               console.log(e)
    //               that.connecting = false;
    //             }
    //           });
    //         },
    //         fail: function (e) {
    //           console.log(e)
    //           //连接失败，需要把e.errCode枚举值转换为中文提示
    //           //https://developers.weixin.qq.com/miniprogram/dev/api/device/wifi/wx.connectWifi.html
    //           wx.showModal({
    //             title: '连接失败',
    //             content: e.errMsg,
    //             success: function (res) {
    //               if (res.confirm) {
    //                 console.log('');
    //               } else if (res.cancel) {
    //                 console.log('用户点击取消');
    //               }
    //             }
    //           });
    //           this.connecting = false;
    //         }
    //       })
    //     }
    //   })
    //   this.connecting = true;
    // },
  }
}
</script>

<style lang="scss">
page {
  height: 100%;
}

.wrap {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: $uni-color-primary;
  color: $uni-text-color-inverse;

  .logo {
    font-size: 260rpx;
    margin: 40% auto 20%;
  }

  .desc {
    margin-bottom: 1em;
    line-height: 2em;
    font-size: 32rpx;
  }

  .button {
    width: 90%;
    line-height: 100rpx;
    background-color: $uni-text-color-inverse;
    color: $uni-color-primary;
    border-radius: 50rpx;
    font-size: 36rpx;
    text-align: center;
  }
}

.ad-modal {
  z-index: 100;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: white;

  ad {
    width: 100%;
    height: 100%;
  }
}

.error-modal-wrap {
  z-index: 1;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  ;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.7);

  .error-modal {
    padding: 48rpx;
    background-color: #fff;
    color: $uni-text-color;
    border-radius: 18rpx;

    .h1 {
      font-size: 1.2em;
      text-align: center;
      font-weight: bold;
    }

    .p {
      margin: 24rpx 0;
      text-align: center;
      color: $uni-text-color-grey;
    }

    .item {
      display: flex;
      margin: 36rpx 0;
      font-size: 36rpx;
      line-height: 1.5em;

      .label {
        width: 120rpx;
      }

      .content {
        width: 0;
        flex: 1;
      }
    }

    .btn-copy {
      background-color: $uni-color-primary;
    }
  }

  .iconfont {
    margin-top: 48rpx;
    color: #fff;
    font-size: 60rpx;
  }
}
</style>
