<template>
  <view class="container">
    <view class="list">
      <scroll-view class="scroll-view" scroll-y @scrolltolower="loadMore">
        <view class="item" v-for="(wifi, index ) in list" :key="index">
          <view class="info">
            WIFI名称: {{ wifi.ssid }}
          </view>
          <view class="info">WIFI密码: {{ wifi.pwd }}</view>
          <view class="operate">
            <button @click="updateWifi(wifi)" size="mini" type="primary">编辑</button>
            <button @click="previewCode(wifi)" size="mini">生成二维码</button>
          </view>
        </view>
      </scroll-view>
    </view>
    <view class="bottom">
      <button @click="updateWifi(undefined)" type="primary">新增WIFI</button>
      <view :style="safeBottom"/>
    </view>
  </view>
</template>
<script>
import { getWifiConfigList } from '../../services/wifi';
export default {
  data() {
    return {
      safeBottom: `height: ${uni.getSystemInfoSync().safeAreaInsets.bottom}px`,
      list: [],
    }
  },
  computed: {

  },
  onShow() {
    this.getConfigList();
  },
  methods: {
    getConfigList (e) {
      getWifiConfigList().then((res) => {
        if (res.code == 0) {
          this.list = res.data;
        }
      })
      uni.showLoading({
        title: "保存中",
        mask: true,
      });
      uni.hideLoading();
    },
    previewCode(item) {
      wx.previewImage({
        urls: [item.qrCode]
      })
    },
    updateWifi(wifi) {
      if (!wifi) {
        wifi = { ssid: '', password: '' }
      }
      const url = `/pages/user-info/updateWifi?wifi=${JSON.stringify(wifi)}`
      uni.navigateTo({
        url: url
      })
    }
  }
}
</script>
<style lang="scss">
page, .container {
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
        .info, .operate {
          display: flex;
          align-items: center;
          button {
            width: 260rpx;
          }
        }
      }
    }
  }
  .bottom {
    width: 100%;
    padding: 12rpx 0;
    background-color: #fff;
    box-shadow: 0 0  12px $uni-border-color;
    button {
      margin: 0 24rpx;
    }
  }
}
// .list {
//     .item {
//         margin: 0 48rpx;
//         display: flex;
//         align-items: center;
//         border-bottom: 1px solid #f2f2f2;
//         line-height: 104rpx;

//         .name {
//             width: 0;
//             flex: 1;
//             white-space: nowrap;
//             text-overflow: ellipsis;
//             overflow: hidden;

//             &.bold {
//                 font-weight: bold;
//             }
//         }

//         .date {
//             margin-left: 24rpx;
//             flex-shrink: 0;
//         }
//     }
// }
</style>