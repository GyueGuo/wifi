<template>
  <view class="wrap">
    <text class="iconfont icon-wifi logo" />
    <view v-if="connected" class="button">连接成功</view>

    <view v-else class="button" @click="showAd">一键连接</view>
    <!-- <view class="tips">
      <view>温馨提示: </view>
      <view>请确保手机已开启定位功能、WIFI处于开启状态</view>
    </view> -->
    <view class="ad-modal" v-if="ad1">
      <ad v-if="ad1" :unit-id="ad1" ad-theme="white"></ad>
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
import { getAdId, getWifiConfig, sendWifiLog, sendWifiLog2 } from '../../services/wifi';
import { uuidv4 } from '../../utils/uuid'
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
      rewardVideo: undefined,
      nextAd: false,
      osName: '',
      uuid: '',
    }
  },
  onReady() {
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userLocation']) {
          // 申请获取地理位置权限
          wx.authorize({
            scope: 'scope.userLocation',
            success: (res) => {
              console.log('authorize succ', res)

            },
            fail: (e) => {
              console.log('authorize fail', e)
            }
          })
        } else {
          // 开始wifi模块使用
        }
      }
    })
  },
  onLoad({ q }) {
    const params = this.getUrlParams(decodeURIComponent(q));
    this.uid = params.userId;
    this.wifiId = params.wifiId;
    getAdId({
      uid: this.uid,
    }).then(({ data }) => {
      this.rewardVideoAdId = data.rewardVideoAdId;
      this.ad1 = data.videoAdId1;
    })
    wx.getSystemInfo({
      success: (result) => {
        this.osName = result.platform
      }
    })
    const uuid = uuidv4(32, 32)
    this.uuid = uuid;
    this.sendLog(params.wifiId, 0, {}, uuid)
  },
  methods: {
    sendLog(wifiId, type, body, uuid) {
      sendWifiLog2({ wifiId: wifiId, type: type, body: JSON.stringify(body), openId: uuid })
    },
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
      const systemSetting = wx.getSystemSetting();
      if (!systemSetting.wifiEnabled || !systemSetting.locationEnabled) {
        wx.showModal({
          content: !systemSetting.locationEnabled ? "请开启手机定位" : "请开启手机WIFI功能"
        });
        return;
      }
      this.sendLog(this.wifiId, 10, {}, this.uuid);
      wx.showLoading({
        title: "获取中...",
        mask: true,
      });
      if (!this.rewardVideo) {
        if (wx.createRewardedVideoAd) {
          const rewardedVideoAd = wx.createRewardedVideoAd({ adUnitId: this.rewardVideoAdId });
          rewardedVideoAd.load().then(() => {
            wx.hideLoading();
            this.sendLog(this.wifiId, 20, { loadType: 'first' }, this.uuid);
            rewardedVideoAd.show();
          });
          rewardedVideoAd.onError((err) => {
            wx.hideLoading();
          });
          rewardedVideoAd.onClose((res) => {
            this.sendLog(this.wifiId, 30, { adStatus: res && res.isEnded }, this.uuid);
            res && res.isEnded && this.showWifi();
          })
          this.rewardVideo = rewardedVideoAd;
        }
      } else {
        this.rewardVideo.load().then(() => {
          wx.hideLoading();
          this.sendLog(this.wifiId, 20, { loadType: 'second' }, this.uuid);
          this.rewardVideo.show();
        });
      }
    },
    showWifi() {
      wx.showLoading({
        title: "获取中...",
        mask: true,
      });
      this.wifiAvailable = true;
      this.sendLog(this.wifiId, 40, {}, this.uuid);
      getWifiConfig({
        uid: this.uid,
        wifiId: this.wifiId,
      }).then(({ data }) => {
        console.log('获取wifi配置', data)
        this.sendLog(this.wifiId, 50, data, this.uuid);
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
            res.confirm && this.showWifi();
          }
        });
      });
    },
    startWifi() {
      return new Promise((resolve, reject) => {
        wx.startWifi({
          success: resolve,
          fail: (error) => {
            console.log('开启wifi失败')
            reject({ type: 'startWifi', ...error })
          }
        });
      });
    },
    getWifiList() {
      return new Promise((resolve, reject) => {
        wx.getWifiList({
          success: resolve,
          fail: reject
        })
      })
    },
    connectWifi(res) {
      console.log('连接wifi', res)
      return new Promise((resolve, reject) => {
        const { wifiInfo } = this;
        let connectStatus = false;
        for (const index in res.wifiList) {
          const wifi = res.wifiList[index];
          if (wifi.SSID == this.wifiInfo.ssid) {
            this.wifiInfo.bssid = wifi.BSSID;
            wx.connectWifi({
              SSID: wifi.SSID,
              BSSID: wifi.BSSID,
              password: wifiInfo.pwd,
              forceNewApi: true,
              success: () => {
                connectStatus = true;
                resolve();
              },
              fail: (error) => {
                reject({ ...error, type: 'connectWifi' });
              },
            });
            return;
          }
        }
        if (connectStatus) {
          resolve();
        } else {
          reject({ errCode: '-99999', errMsg: '未找到合适的wifi信息', type: 'connectWifi' })
        }
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
      if (this.osName == 'ios') {
        this.startWifi()
          .then(() => this.connectWifi({ wifiList: [{ SSID: this.wifiInfo.ssid, BSSID: '', PASSWORD: this.wifiInfo.pwd }] }))
          .then(() => {
            console.log("外层的连接成功")
            sendWifiLog({ uuid: this.uuid, wifiId: this.wifiId, status: 1 });
            this.sendLog(this.wifiId, 70, { status: 'success' }, this.uuid);
            this.connecting = false;
            this.connected = true;
            wx.hideLoading();
          }).catch((e) => {
            console.log(e)
            wx.hideLoading();
            this.sendLog(this.wifiId, 70, { status: 'fail' }, this.uuid);
            if (e.errCode == '12004') {
              console.log('重复连接')
              this.connecting = false;
              this.connected = true;
              setTimeout(() => {
                sendWifiLog({ uuid: this.uuid, wifiId: this.wifiId, status: 2, failMsg: JSON.stringify(e) })
              }, 2000);
              return;
            }
            sendWifiLog({ uuid: this.uuid, wifiId: this.wifiId, status: 0, failMsg: JSON.stringify(e) })
            this.adShow = true;
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
      } else {
        this.startWifi()
          .then(() => this.onWifiList())
          .then(() => this.getWifiList())
          .catch((e) => {
            console.log('连接失败', e)
            sendWifiLog({ uuid: this.uuid, wifiId: this.wifiId, status: 0, failMsg: JSON.stringify(e) })
            wx.hideLoading()
          });
      }
    },
    onWifiList() {
      return new Promise((resolve, reject) => {
        wx.onGetWifiList(res1 => {
          console.log(res1)
          this.sendLog(this.wifiId, 60, JSON.stringify(res1), this.uuid);
          if (res1.wifiList.length !== 0) {
            this.connectWifi(res1).then(() => {
              this.connecting = false;
              this.connected = true;
              wx.hideLoading();
              sendWifiLog({ uuid: this.uuid, wifiId: this.wifiId, status: 1 })
            }).catch((e) => {
              console.log(e)
              wx.hideLoading();
              if (e.errCode == '12004') {
                console.log('重复连接')
                this.connecting = false;
                this.connected = true;
                sendWifiLog({ uuid: this.uuid, wifiId: this.wifiId, status: 2, failMsg: JSON.stringify(e) })
                return;
              }
              sendWifiLog({ uuid: this.uuid, wifiId: this.wifiId, status: 0, failMsg: JSON.stringify(e) })
              this.adShow = true;
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
          } else {
            wx.showToast({
              title: '暂无可连接wifi,请重试',
              icon: 'none'
            })
          }
        })
        resolve();
      })
    },
    handleCloseModal() {
      this.isModalVisible = false;
    },
    handleCopy() {
      const that = this;
      wx.setClipboardData({
        data: this.wifiInfo.pwd,
        success(res) {
          wx.showToast({
            title: '复制成功',
            icon: 'success',
            duration: 2000,
            success: () => {
              setTimeout(() => {
                wx.connectWifi({
                  SSID: that.wifiInfo.ssid,
                  BSSID: that.wifiInfo.bssid,
                  password: that.wifiInfo.pwd,
                  forceNewApi: true,
                  maunal: true,
                  fail: (error) => {
                    console.log('跳转失败')
                  }
                });
              }, 1000);
            }
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

.wrap {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: $uni-color-primary;
  color: $uni-text-color-inverse;

  .logo {
    font-size: 260rpx;
    margin: 50% auto 20%;
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
  .tips {
    margin: 60rpx 48rpx;
  }
}

.ad-modal {
  margin-top: 200rpx;

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
