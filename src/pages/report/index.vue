<template>
  <view class="content">
    <view class="top">
      <text class="title">昨日收益</text>
      <view class="income">
        <text class="income-number">{{ yesterdayAmount || 0 }}元</text>
      </view>
      <!-- <view class="income">
        <text class="totalAmount">余额:{{ totalAmount || 0 }}元</text>
      </view> -->
    </view>
    <view>
      <text class="middle">历史收益</text>
    </view>
    <view class="list">
      <view class="item">
        <text class="name">日期</text>
        <text class="date">收益</text>
      </view>
      <view class="item" v-for="(report, index ) in list" :key="index">
        <text class="name bold">{{ report.date }}</text>
        <text class="date">{{ report.amount }}元</text>
      </view>
    </view>
    <view v-if="list.length" class="loading-more">
      {{ isNoMore ? "暂无更多" : "加载中..." }}
    </view>
  </view>
</template>

<script>
import { getMyReport } from '../../services/report';

export default {
  data() {
    return {
      totalAmount: "*",
      yesterdayAmount: "*",
      isNoMore: false,
      list: [

      ]
    }
  },
  onLoad() {
    //加载当前登陆用户数据
    // uni.request({
    // 	url: '/wechat/statistics/getMyReport',
    // 	method: 'GET',
    // 	data: {
    // 		loginCode: code
    // 	},
    // 	success: (result) => {
    // 		if (result.code == 0) {
    // 			//请求成功
    // 		} else if (result.code == 401) {
    // 			//未登陆，所有数据展示*号
    // 		} else {

    // 		}
    // 	},
    // 	fail: (err) => {
    // 		//登陆失败
    // 	}
    // });
  },
  mounted() {
    getMyReport().then((res) => {
      if (res.code == 0) {
        this.list = res.data.rows;
        this.totalAmount = res.data.totalAmount;
        this.yesterdayAmount = res.data.yesterdayAmount;
      }
      console.log(res);
    }, (err) => {
      console.log(err);
    });
  },
  onReachBottom() {
    this.loadMore();
  },
  methods: {
    loadMore() {
      console.log('onReachBottom');
    }
  }
}
</script>

<style lang="scss" scoped>
.content {
  background-color: $uni-text-color-inverse;
}

.top {
  padding: 60rpx 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: $uni-color-primary;
  color: $uni-text-color-inverse;

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

.middle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 48rpx;
  background-color: rgba(0, 122, 255, 0.8);
  color: $uni-text-color-inverse;
  line-height: 80rpx;
  font-size: 36rpx;

  .date-show {
    font-weight: bold;
    font-size: 40rpx;
    padding: 24rpx 0 0 48rpx;
    color: $uni-color-primary;
  }
}

.list {
  .item {
    margin: 0 48rpx;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #f2f2f2;
    line-height: 104rpx;

    .name {
      width: 0;
      flex: 1;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;

      &.bold {
        font-weight: bold;
      }
    }

    .date {
      margin-left: 24rpx;
      flex-shrink: 0;
    }
  }
}

.loading-more {
  text-align: center;
  color: $uni-text-color-grey;
  line-height: 80rpx;
}
</style>
