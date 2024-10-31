<template>
  <view class="container">
    <view class="list">
      <scroll-view class="scroll-view" scroll-y @refresherrefresh="loadMore" refresher-enabled
        :refresher-triggered="refresh">
        <view class="item" v-for="(wifi, index ) in list" :key="index">
          <view class="info">
            WIFI所属: {{ wifi.name }}
          </view>
          <view class="info">
            WIFI名称: {{ wifi.ssid }}
          </view>
          <view class="info">WIFI密码: {{ wifi.pwd }}</view>
          <view class="info">昨天连接: {{ wifi.yesterdaySuccessCount }}次</view>
          <view class="info">累计连接: {{ wifi.successCount }}次</view>
          <view class="operate">
            <button @click="updateWifi(wifi)" size="mini">编辑</button>
            <button @click="showQrcode(wifi)" size="mini">二维码</button>
            <button @click="deleteConfig(wifi)" size="mini" type="warn">删除</button>
          </view>
        </view>
      </scroll-view>
    </view>
    <view class="bottom">
      <button @click="updateWifi(undefined)" type="primary">新增WIFI</button>
      <view :style="safeBottom" />
    </view>
    <view class="popupView" v-if="popupView">
      <!-- 遮罩区域，点击隐藏弹出层 -->
      <view class="close" @click="previewCode"></view>
      <!-- 内容区 -->

      <view class="content">
        <view>
          <text>{{ wifiName }}</text>
        </view>
        <view>
          <image :src="`data:image/png;base64,${preQrcode}`" mode="aspectFit" :show-menu-by-longpress="true"></image>
        </view>
      </view>
      <!-- 遮罩区域，点击隐藏弹出层 -->
      <view class="close" @click="previewCode"></view>
    </view>
  </view>
</template>
<script>
import { onReady } from '@dcloudio/uni-app';
import { getWifiConfigList, getQrcode, deleteWifi } from '../../services/wifi';
export default {
  data() {
    return {
      safeBottom: `height: ${uni.getSystemInfoSync().safeAreaInsets.bottom}px`,
      list: [],
      preQrcode: '',
      wifiName: '',
      popupView: false,
      userId: '',
      nickName: '',
      refresh: false,
    }
  },
  computed: {

  },
  onShow() {
    // this.getConfigList();
  },
  onReady() {
    uni.setNavigationBarTitle({
      title: `${this.nickName}WIFI列表`
    });
  },
  onLoad({ userId, nickName }) {
    if (nickName) {
      this.nickName = nickName;
    } else {
      this.nickName = "";
    }
    if (userId) {
      this.userId = userId;
      this.getConfigList({ userId: userId });
    } else {
      this.getConfigList({});
    }
  },
  onPullDownRefresh() {
    // if (this.userId != '') {
    //   const userId = this.userId;
    //   this.getConfigList({ userId, userId });
    // } else {
    //   this.getConfigList({});
    // }
    // // 关闭刷新
    // uni.stopPullDownRefresh();
  },
  methods: {
    getConfigList(query) {
      getWifiConfigList(query).then((res) => {
        if (res.code == 0) {
          this.list = res.data;
        }
        setTimeout(() => {
          if (this.refresh) {
            this.refresh = false;
          }
        }, 50)
      })
      uni.showLoading({
        title: "保存中",
        mask: true,
      });
      uni.hideLoading();
    },
    previewCode(item) {
      this.preQrcode = item.qrcode;
      this.wifiName = item.ssid;
      this.popupView = !this.popupView;
    },
    updateWifi(wifi) {
      if (!wifi) {
        wifi = { ssid: '', password: '', name: this.nickName }
      } else {
        wifi = { id: wifi.id, ssid: wifi.ssid, pwd: wifi.pwd, name: this.nickName }
      }
      const url = `/pages/user-info/updateWifi?wifi=${JSON.stringify(wifi)}&userId=${this.userId}`
      uni.navigateTo({
        url: url
      })
    },
    showQrcode(wifi) {
      getQrcode({ id: wifi.id }).then((result) => {
        if (result.data) {
          this.wifiName = wifi.ssid
          this.preQrcode = result.data.qrcode;
          this.popupView = true;
        }
      })
    },
    deleteConfig(wifi) {
      const that = this;
      uni.showModal({
        title: '删除确认',
        content: `是否要删除[${wifi.ssid}]?`,
        success: function (res) {
          if (res.confirm) {
            deleteWifi({ id: wifi.id }).then((result) => {
              uni.showToast({
                title: `${result.code == 0 ? '删除成功' : '删除失败'}`,
                duration: 1000
              });
            })
            if (this.userId) {
              that.getConfigList({ userId: that.userId });
            } else {
              that.getConfigList({});
            }
          }
        }
      });
    },
    loadMore() {
      this.refresh = true;
      if (this.userId != '') {
        const userId = this.userId;
        this.getConfigList({ userId, userId });
      } else {
        this.getConfigList({});
      }
    }
  }
}
</script>
<style lang="scss">
page,
.container {
  height: 100%;
}

.container {
  display: flex;
  flex-direction: column;

  button[type="primary"] {
    background-color: $uni-color-primary !important;
  }

  .list {
    width: 100%;
    height: 0;
    flex: 1;

    .scroll-view {

      width: 100%;
      height: 100%;

      .item {
        padding: 24rpx;
        line-height: 60rpx;
        border-bottom: 1rpx solid $uni-border-color;

        .info,
        .operate {
          display: flex;
          align-items: center;

          button {
            width: 150rpx;
          }
        }
      }
    }
  }

  .bottom {
    width: 100%;
    padding: 12rpx 0;
    background-color: #fff;
    box-shadow: 0 0 12px $uni-border-color;

    button {
      margin: 0 24rpx;
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
  z-index: 999;
  flex-grow: 1;
  background-color: rgba(41, 41, 41, 0.699);
}

.popupView .content {
  background-color: #f5f5f5;
  padding: 15rpx;
  text-align: center;
}
</style>