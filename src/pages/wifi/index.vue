<template>
  <view class="content">
    <text class="iconfont icon-wifi logo" />
    <text class="desc">wifi已准备好</text>
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
    handleConnect() {
      wx.startWifi({
        success: function () {
          wx.connectWifi({
            SSID: 'aaaaa',
            password: 'bbbb',
            success() {
              console.log('连接成功')
              this.connecting = false;
              this.connected = true;
            },
            fail(e) {
              console.log(e)
              //连接失败，需要把e.errCode枚举值转换为中文提示
              //https://developers.weixin.qq.com/miniprogram/dev/api/device/wifi/wx.connectWifi.html
              uni.showModal({
                title: '连接失败',
                content: e.errMsg,
                success: function (res) {
                  if (res.confirm) {
                    console.log('用户点击确定');
                  } else if (res.cancel) {
                    console.log('用户点击取消');
                  }
                }
              });
              this.connecting = false;
            }
          });
        },
        fail: function (e) {
          console.log(e)
          //连接失败，需要把e.errCode枚举值转换为中文提示
          //https://developers.weixin.qq.com/miniprogram/dev/api/device/wifi/wx.connectWifi.html
          uni.showModal({
            title: '连接失败',
            content: e.errMsg,
            success: function (res) {
              if (res.confirm) {
                console.log('');
              } else if (res.cancel) {
                console.log('用户点击取消');
              }
            }
          });
          this.connecting = false;
        }
      })
      this.connecting = true;

    },
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
</style>
