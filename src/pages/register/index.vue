<template>
  <view class="container">
    <div class="top">
      <text class="iconfont icon-1USER avatar"></text>
      <text class="welcome">欢迎注册</text>
    </div>
    <div class="form">
      <!-- <view class="item">
				<view class="label">商户类型</view>
				<view class="content">
					{{ type }}
				</view>
			</view> -->
      <view class="item">
        <view class="label">商户名称</view>
        <view class="content">
          <input v-model.trim="nickName" placeholder="请填写" :maxlength="20" />
        </view>
      </view>
      <!-- <view class="item">
        <view class="label">手机号码</view>
        <view class="content">
          <input v-model.trim="phone" placeholder="请填写" :maxlength="20" />
        </view>
      </view> -->
      <Button class="button" type="primary" @click="submit">点击注册</Button>
    </div>
  </view>
</template>
<script>
import { register } from '../../services/user';
export default {
  data() {
    return {
      parentUserId: '',
      nickName: '',
      phone: '',
    }
  },
  computed: {
  },
  onLoad(option) {
    const params = this.getUrlParams(decodeURIComponent(option.q));
    this.parentUserId = params.parentId;
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
    submit(e) {
      uni.showLoading({
        title: "注册中",
        mask: true,
      });
      wx.login({
        success: (res) => {
          console.log(this.parentUserId)
          register({
            parentUserId: this.parentUserId,
            nickName: this.nickName,
            phone: this.phone,
            openId: res?.code || '',
          }).then(() => {
            uni.hideLoading();
            wx.showToast({
              title: '注册成功',
              icon: 'success',
              duration: 2000,
            });
            setTimeout(() => {
              wx.redirectTo({
                url: '/pages/login/index'
              })
            }, 1000);
          }, (err) => {
            uni.hideLoading();
            wx.showModal({
              content: err?.msg || '注册失败',
              showCancel: false,
            });
          })
        },
        fail: () => {
          uni.hideLoading();
          wx.showModal({
            content: '注册失败',
            showCancel: false,
          });
        }
      });
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
  .top {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 240rpx 0 60rpx;
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