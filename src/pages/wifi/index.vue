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
    <view>
      <text class="desc">{{ connected ? '连接成功' : '连接失败' }}</text>
    </view>
    <!-- <text class="desc">wifi已准备好</text> -->
    <view v-if="!connected" class="button" @click="handleConnect">一键连接</view>

    <view v-if="adInfo" class="ad-modal">
      <ad :unit-id="adInfo.adUnitId" ad-type="video" @load="onadload" @close="onadclose" @error="onaderror" />
    </view>
  </view>
</template>

<script>
import { getAdId, getWifiConfig } from '../../services/wifi';
export default {
  data() {
    return {
      readyStatus: false,
      connecting: false,
      connected: false,
      ssid: '',
      pwd: '',
      adInfo: null,
      wifiInfo: null
    }
  },
  onLoad({ uid }) {
    this.uid = uid;
    this.getAdId();
    this.getWifiConfig();
  },
  methods: {
    getAdId() {
      getAdId({
        uid: this.uid,
      }).then(({ data }) => {
        this.adInfo = data;
      }, (err) => {
        uni.showModal({
          // title: '连接失败',
          content: "广告信息初始化失败，请重试",
          confirmText: "重试",
          success: (res) => {
            res.confirm && this.getAdId();
          }
        });
      })
    },
    getWifiConfig() {
      getWifiConfig({
        uid: this.uid,
      }).then(({ data }) => {
        // console.log(data);
        this.wifiInfo = data;
      }, () => {
        uni.showModal({
          // title: '连接失败',
          content: "wifi信息获取失败，请重试",
          confirmText: "重试",
          success: (res) => {
            res.confirm && this.getWifiConfig();
          }
        });
      })
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
          fail: (e) => {
            reject();
            uni.showModal({
              title: '连接失败',
              content: e.errMsg,
            });
          }
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
      this.getLocation()
        .then(() => this.startWifi())
        .then(() => (this.connectWifi()))
        .then(() => {
          this.connecting = false;
          this.connected = true;
        }, () => {
          this.connecting = false;
        });
    },
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
    //           uni.showModal({
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
    onadload(e) {
      console.log('lll', e);
    },
    onadclose(e) {
      console.log('ccc', e);
    },
    onaderror(e) {
      console.log('rrr', e);
    }
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
</style>
