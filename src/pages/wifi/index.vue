<template>
  <view class="content">

    <text class="iconfont icon-wifi logo" />
    <view>
      <input style="background-color: white;color: black;" type="text" v-model="ssid" placeholder="请输入wifi名称">
    </view>
    <view style="margin-top: 50rpx;"></view>
    <view>
      <input style="background-color: white;color: black;" type="text" v-model="pwd" placeholder="请输入wifi密码">
    </view>
    <view>
      <text class="desc">连接前请将已连接的wifi删除，并且打开GPS定位开关</text>
    </view>
    <template v-if="wifiAvailable">
      <view>
        <text class="desc">{{ connected ? '连接成功' : '连接失败' }}</text>
      </view>
      <view v-if="!connected" class="button" @click="handleConnect">一键连接</view>
    </template>
    <template v-else>
      <view>
        <text class="desc">请先观看10-30秒的广告视频</text>
      </view>
      <view v-if="!connected" class="button" @click="handlePlayAd">观看广告</view>
    </template>
    <!-- <text class="desc">wifi已准备好</text> -->
    <uni-popup ref="popup" type="center" background-color="#fff">
      <view class="error-modal">
        <text>连接失败</text>
        <text>请复制密码，打开手机设置手动连接</text>
        <view>
          <text>名称：</text>
          <text>{{wifiInfo.ssid}}</text>
        </view>
        <view>
          <text>密码：</text>
          <text>{{wifiInfo.pwd}}</text>
        </view>
        <view @click="handleCopy">复制密码</view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
import { getAdId, getWifiConfig, sendWifiLog } from '../../services/wifi';
export default {
  data() {
    return {
      readyStatus: false,
      connecting: false,
      connected: false,
      ssid: '',
      pwd: '',
      adInfo: null,
      wifiInfo: null,
      wifiAvailable: false,
    }
  },
  onLoad({ uid }) {
    this.uid = uid;
    // this.getAdId();
  },
  mounted() {
    this.$refs.popup.open();
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
        wx.hideLoading();
        if(wx.createRewardedVideoAd){
          const rewardedVideoAd = wx.createRewardedVideoAd({ adUnitId: data.adUnitId });
          this.createRewardedVideoAd = rewardedVideoAd;
          rewardedVideoAd.load().then(() => rewardedVideoAd.show());
          
          rewardedVideoAd.onError((err) => {
            sendWifiLog({ adUnitId: data.adUnitId, userId: this.uid, ...err })
          });
          rewardedVideoAd.onClose((res) => {
            res && res.isEnded && this.getWifiConfig();
          })
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
    handlePlayAd() {
      rewardedVideoAd.load().then(() => rewardedVideoAd.show());
    },
    getWifiConfig() {
      wx.showLoading({
        title: "获取中...",
        mask: true,
      });
      getWifiConfig({
        uid: this.uid,
      }).then(({ data }) => {
        wx.hideLoading();
        this.wifiInfo = data;
        this.handleConnect();
      }, () => {
        wx.hideLoading();
        wx.showModal({
          // title: '连接失败',
          content: "wifi信息获取失败，请重试",
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
    handleConnect() {
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
        }).catch(() => {
          wx.hideLoading();
          this.connecting = false;
          if (this.wifiInfo) {
            this.$refs.popup.open();
          } else {
            wx.showModal({
              title: '连接失败',
              content: e.errMsg,
            });
          }
        });
    },
    handleCopy() {
      wx.setClipboardData({
        data: this.wifiInfo.pwd,
        success (res) {
          wx.showToast({
            title: '复制失败',
            icon: 'success',
            duration: 2000
          });
        },
        fail () {
          wx.showModal({
            content: '复制失败，请手动输入',
            showCancel: false,
          });
        },
      });
    }
    // handleConnect() {
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

.content {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: $uni-color-primary;
  color: $uni-text-color-inverse;

  .logo {
    font-size: 260rpx;
    margin: 20% auto;
  }

  .desc {
    margin-bottom: 1em;
    line-height: 2em;
    font-size: 28rpx;
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
  z-index: 1;
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
.error-modal {
  border-radius: 18rpx;
  padding: 48rpx;
  background-color: #fff;
}
</style>
