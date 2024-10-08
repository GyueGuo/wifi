<template>
  <view class="wrap">
    <text class="iconfont icon-wifi logo" />
    <view v-if="connected" class="button">连接成功</view>

    <view v-else class="button" @click="showAd">一键连接</view>
    <view class="ad" v-if="ad2">
      <ad v-if="ad2" :unit-id="ad2" ad-theme="white"></ad>
    </view>

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
      rewardVideoAdId: '',
      ad1: undefined,
      ad2: undefined,
      ad3: undefined,
      ad4: undefined,
      adShow: false,
    }
  },
  onLoad(option) {
    console.log(option.q)
    const params = this.getUrlParams(decodeURIComponent(option.q));
    console.log(params);
    this.uid = params.userId;
    this.wifiId = params.wifiId;
    this.rewardedVideoAd = null;
    // this.getWifiConfig();
    getAdId({
      uid: this.uid,
    }).then(({ data }) => {
      console.log('获取广告数据', data)
      this.rewardVideoAdId = data.rewardVideoAdId;
      // this.ad1 = data.videoAdId1;
      this.ad2 = data.videoAdId2;
      // this.ad3 = data.videoAdId3;
      // this.ad4 = data.videoAdId4;
    })
  },
  methods: {
    getUrlParams(url) {
      let urlStr = url.split('?')[1];
      // 创建空对象存储参数
      let obj = {};
      // 再通过 & 将每一个参数单独分割出来
      let paramsArr = urlStr.split('&');
      for (let i = 0, len = paramsArr.length; i < len; i++) {
        // 再通过 = 将每一个参数分割为 key:value 的形式
        let arr = paramsArr[i].split('=');
        obj[arr[0]] = arr[1];
      }
      return obj;
    },
    showAd() {
      wx.showLoading({
        title: "获取中...",
        mask: true,
      });
      if (wx.createRewardedVideoAd) {
        const rewardedVideoAd = wx.createRewardedVideoAd({ adUnitId: this.rewardVideoAdId });
        this.rewardedVideoAd = rewardedVideoAd;
        rewardedVideoAd.load().then(() => {
          wx.hideLoading();
          rewardedVideoAd.show()
        });
        rewardedVideoAd.onError((err) => {
          wx.hideLoading();
          // sendWifiLog({ adUnitId: data.adUnitId, userId: this.uid, ...err })
        });
        rewardedVideoAd.onClose((res) => {
          res && res.isEnded && this.showWifi();
        })
      } else {
        wx.hideLoading();
      }
    },
    handleConnect() {
      const { rewardedVideoAd } = this
      rewardedVideoAd && rewardedVideoAd.load().then(() => rewardedVideoAd.show());
    },
    showWifi() {
      wx.showLoading({
        title: "获取中...",
        mask: true,
      });
      this.wifiAvailable = true;
      console.log(this.wifiId)
      getWifiConfig({
        uid: this.uid,
        wifiId: this.wifiId,
      }).then(({ data }) => {
        console.log('获取wifi配置', data)
        wx.hideLoading();
        this.wifiInfo = data;
        this.connect();
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
      console.log('开启wifi')
      return new Promise((resolve, reject) => {
        wx.startWifi({
          success: resolve,
          fail: reject
        });
      });
    },
    connectWifi() {
      console.log('连接wifi')
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
    connect() {
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
          this.adShow = true;
          sendWifiLog({ wifiId: this.wifiId, status: 1 })
          console.log("连接成功")
        }).catch((e) => {
          console.log("连接失败", e)
          sendWifiLog({ wifiId: this.wifiId, status: 0, failMsg: JSON.stringify(e) })
          this.adShow = true;
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
    },
  }
}
</script>

<style lang="scss">
page {
  height: 100%;
}

.ad-top {
  margin-top: 160rpx;
}

.ad {
  margin-top: 22rpx;
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
    margin-top: 24rpx;
    color: #fff;
    font-size: 60rpx;
  }
}
</style>
