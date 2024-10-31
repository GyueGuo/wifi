<template>
    <view class="container">
        <view class="list">
            <scroll-view class="scroll-view" scroll-y refresher-enabled :refresher-triggered="refresh">
                <view class="item" v-for="(pay, index ) in list" :key="index">
                    <view class="info">
                        提现日期: {{ pay.createDate }}
                    </view>
                    <view class="info">
                        提现金额: {{ pay.amount }}
                    </view>
                    <view class="info">提现状态:{{ pay.statusName }}</view>
                    <view class="info" v-if="pay.status == 'pay_fail'">失败原因:{{ pay.failReason }}</view>
                </view>
            </scroll-view>
        </view>
    </view>
</template>
<script>
import { onReady } from '@dcloudio/uni-app';
import { getPayDetailList } from '../../services/report';
export default {
    data() {
        return {
            refresh = true,
            safeBottom: `height: ${uni.getSystemInfoSync().safeAreaInsets.bottom}px`,
            list: []
        }
    },

    onLoad() {

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
        getList() {
            getPayDetailList({}).then((res) => {
                if (res.code == 0) {
                    this.list = res.data
                } else {
                    wx.showToast({
                        title: '获取提现列表失败，请稍候重试',
                        icon: 'error',
                        duration: 2000,
                    });
                }
            })
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