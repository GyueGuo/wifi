<template>
  <view class="content">
    <view class="top">
      <text class="title">当前可提余额：</text>
      <view class="income">
        <text class="income-number">{{ totalAmount || 0 }}元</text>
      </view>
    </view>
    <view class="btn">
      <button @click="goPayList">提现记录</button>
    </view>
    <view class="btn">
      <button @click="showUpdatePayAccount">维护提现账户</button>
    </view>
    <view class="desc">
      <text class="title">提现说明</text>
      <text>1.由于账号限制，暂提现只支持支付宝提现，需要提供支付宝实名制账号，非实名制用户账号无法支持提现，请务必将提现的支付宝账号进行实名认证。</text>
      <text>2.余额可每日提现一次，最低提限额度50元起。</text>
      <text>3.提现时您需要上传支付宝的收款码，并填写您支付宝绑定的真实姓名和手机号码。</text>
      <text>4.提现申请当日提现，次日晚0点前到账(法定节假日顺延)，请留意本页"提现记录"里的提现状态。</text>
      <text>5.我司保留对本后台上述提现说明的最终解释权。</text>
    </view>
    <view class="bottom">
      <button @click="showPayFormModel">申请提现</button>
    </view>
    <view class="popupView" v-if="showPayForm">
      <!-- 遮罩区域，点击隐藏弹出层 -->
      <view class="close" @click="closePayFormModel"></view>
      <!-- 内容区 -->

      <view class="content">
        <view style="margin-bottom: 30rpx;margin-top: 100rpx;">
          提现金额:
        </view>
        <view>
          <input v-model="payAmount" class="input" placeholder="请输入提现金额" type="digit" :focus="true" />
        </view>
        <view class="btn-view">
          <button @click="submitPay" class="primary-btn">确定</button>
          <button @click="closePayFormModel">关闭</button>
        </view>
      </view>
      <!-- 遮罩区域，点击隐藏弹出层 -->
      <view class="close" @click="closePayFormModel"></view>
    </view>
    <!-- 维护提现账户 -->
    <view class="popupView" v-if="payAccountModel">
      <!-- 遮罩区域，点击隐藏弹出层 -->
      <view class="close" @click="closeUpdatePayAccount"></view>
      <!-- 内容区 -->
      <view class="content">
        <div class="form">
          <view class="item">
            <view class="label">账户名称</view>
            <view class="content">
              <input v-model.trim="account.accountUserName" placeholder="支付宝真实姓名" :maxlength="20" />
            </view>
          </view>
          <view class="item">
            <view class="label">账户号</view>
            <view class="content">
              <input v-model.trim="account.account" placeholder="支付宝邮箱或手机号" :maxlength="20" />
            </view>
          </view>
          <view class="item">
            <view class="label">支付二维码</view>
            <view class="content">
              <Button type="default" size="mini" @click="selectPayImage" :disabled="isDisabled">选择支付二维码</Button>
            </view>
          </view>
          <view class="item" v-if="payImage || account.accountQrcode">
            <view class="content">
              <image style="width: 200px; height: 200px; background-color: #eeeeee;" mode="aspectFit"
                :src="payImage || account.accountQrcode" />
            </view>
          </view>
          <view class="btn-view">
            <Button class="primary-btn" type="primary" @click="updateAccount" :disabled="isDisabled">提交</Button>
            <Button @click="closeUpdatePayAccount" :disabled="isDisabled">关闭</Button>
          </view>

        </div>
      </view>
      <!-- 遮罩区域，点击隐藏弹出层 -->
      <view class="close" @click="closeUpdatePayAccount"></view>
    </view>
  </view>
</template>

<script>
import { getWalletAccount, updateAccount } from '../../services/report';
import { submitPay } from '../../services/user';
import { getUserToken, logout } from "../../utils/user";

export default {
  data() {
    return {
      totalAmount: "*",
      yesterdayAmount: "*",
      withdrawalAmount: "*",
      payAmount: '',
      isNoMore: false,
      pageNo: 1,
      pageSize: 20,
      showPayForm: false,
      payAccountModel: false,
      payImage: null,
      account: {
        account: '',
        accountUserName: '',
        accountQrcode: null,
      },
      list: [

      ]
    }
  },
  onLoad() {
  },
  mounted() {
    this.loadData('index');
  },
  onReachBottom() {
    if (this.isNoMore) {
      return;
    }
    this.pageNo++
    this.loadData('index');
  },
  methods: {
    loadData(type) {
      getWalletAccount({ type: type }).then((res) => {
        if (res.code == 0) {
          this.totalAmount = res.data.balanceAmount;
          this.withdrawalAmount = res.data.withdrawalAmount;
          this.account.account = res.data.account;
          this.account.accountUserName = res.data.accountUserName;
          console.log(res.data.accountQrcode)
          if (res.data.accountQrcode) {
            console.log('图片赋值')
            this.account.accountQrcode = 'data:image/png;base64,' + res.data.accountQrcode;
          }
        } else {
          uni.showToast({
            icon: 'error',
            title: '查询账户余额失败，请稍候重试',
          });
        }
      }, (err) => {
        uni.showToast({
          icon: 'error',
          title: '查询账户余额失败，请稍候重试',
        });
      });
    },
    updateAccount() {
      //如果选择了图片则走文件上传，否则就只更新两个字段
      const that = this;
      if (this.payImage) {
        const fs = wx.getFileSystemManager()
        const img = fs.readFileSync(this.payImage, 'base64');
        this.account.file = img;
      }
      updateAccount(this.account).then((res) => {
        if (res.code == 0) {
          uni.showToast({
            icon: 'success',
            title: '更新成功',
            duration: 2000,
            success: () => {
              that.payAccountModel = false;
            }
          })
        } else {
          uni.showToast({
            icon: 'error',
            title: '更新失败:' + res.msg,
          })
        }
      }).catch((err) => {
        console.log(err)
        uni.showToast({
          icon: 'error',
          title: '更新失败，请稍候重试',
        })
      });
    },
    selectPayImage() {
      const that = this;
      wx.chooseMedia({
        count: 9,
        mediaType: ['image'],
        sourceType: ['album'],
        camera: 'back',
        success(res) {
          console.log(res)
          that.payImage = res.tempFiles[0].tempFilePath
        }
      })
    },
    submitPay() {
      const that = this;
      wx.showModal({
        title: "提现确认",
        content: `请确认是否提现${this.payAmount}元？`,
        cancelText: '取消',
        confirmText: '确认',
        success: (res) => {
          if (!res.confirm) {
            return
          }
          submitPay({ amount: this.payAmount })
            .then((res) => {
              if (res.code == 0) {
                uni.showToast({
                  icon: 'success',
                  title: '申请成功',
                  success: () => {
                    that.showPayForm = false;
                    that.loadData('index');
                  }
                });
              } else {
                uni.showToast({
                  icon: 'error',
                  title: res.msg,
                  success: () => {
                    that.loadData('index');
                  }
                });
              }
            })
            .catch(() => {
              uni.showToast({
                icon: 'error',
                title: '申请失败',
                success: () => {
                  that.loadData('index');
                }
              });
            });
        }
      })
    },
    goPayList() {
      uni.navigateTo({ url: '/pages/pay/pay-list' })
    },
    tixian() {
      uni.navigateTo({
        url: '/pages/pay/index'
      })
    },
    showPayFormModel() {
      if (!this.account.account || !this.account.accountUserName) {
        wx.showToast({
          title: '请维护提现账户',
          icon: 'error',
        })
        return;
      }
      this.showPayForm = !this.showPayForm;
    },
    closePayFormModel() {
      this.showPayForm = !this.showPayForm;
    },
    showUpdatePayAccount() {
      this.loadData("qrcode")
      this.payAccountModel = !this.payAccountModel;
    },
    closeUpdatePayAccount() {
      this.payAccountModel = !this.payAccountModel;
    }
  }
}
</script>

<style lang="scss" scoped>
.content {
  background-color: whitesmoke;
  height: 100%;
  padding: 0rpx 20rpx 0rpx 20rpx;

  .btn {
    button::after {
      border: none;
    }

    button {
      margin-top: 30rpx;
      background-color: black;
      width: 95%;
      // height: 60rpx;
      font-size: 30rpx;
      background-color: rgba(255, 255, 255, 1);
      border-radius: 20rpx;
      box-shadow: 5rpx 5rpx 15rpx 0rpx rgba(71, 71, 71, 0.4);
    }
  }

  .desc {
    margin-top: 30rpx;
    border-radius: 30rpx;
    background-color: #fff;
    box-shadow: 5rpx 5rpx 15rpx 0rpx rgba(71, 71, 71, 0.4);

    .title {
      text-align: center;
      font-size: 30rpx;
    }

    text {
      padding: 0rpx 30rpx 0rpx 30rpx;
      display: block;
      font-size: 25rpx;
      line-height: 50rpx;
    }

  }
}

.top {
  padding: 60rpx 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: $uni-color-primary;
  color: $uni-text-color-inverse;
  border-radius: 30rpx;

  .title {
    line-height: 80rpx;
    text-indent: 24rpx;
    font-weight: bold;
    font-size: 32rpx;
  }

  .income {
    display: flex;
    align-items: center;
    justify-content: center;

    .income-number {
      font-size: 80rpx;
    }

    .totalAmount {
      font-size: 40rpx;
    }
  }
}


.bottom {
  position: fixed;
  bottom: 0;
  margin-bottom: 50rpx;
  width: 95%;

  button {
    font-size: 35rpx;
    background-color: $uni-color-primary;
    box-shadow: 0 0 12px $uni-border-color;
    color: #fff;
    border-radius: 20rpx;
  }
}

.popupView {
  width: 95vw;
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
  background-color: #ffffff;
  padding: 15rpx;
  text-align: center;
}

.btn-view {
  display: flex;
  margin-top: 20rpx;

  button {
    width: 200rpx;
  }
}

.primary-btn {
  background-color: $uni-color-primary;
}


.form {
  overflow: hidden;
  border-radius: 12rpx;
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
}

.input {
  border: 1px solid #d2d2d2;
  background-color: transparent;
  background-color: #fff;
  height: 100rpx;
}
</style>
