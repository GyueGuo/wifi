<template>
  <scroll-view class="container" scroll-y refresher-enabled @scrolltolower="loadMore"
    @refresherrefresh="onRefresherrefresh" :refresher-triggered="refresh">
    <view class="item">
      <div class="name">名称</div>
      <div class="date">分成比例</div>
      <div class="date">WIFI</div>
    </view>
    <!-- <view class="item" v-for="(row, index) in list" :key="index">
      <view class="name">{{ row.nickName }}</view>
      <view class="date" @click="edit">
        <text>{{ row.separateIntoRate }}</text>
        <text class="iconfont icon-edit" />
      </view>
    </view> -->
    <view class="item" v-for="item in list" :key="item.userId">
      <view class="name">{{ item.nickName }}</view>
      <view class="date" @click="edit(item)">
        <text>{{ item.separateIntoRate }}</text>
        <text class="iconfont icon-edit" />
      </view>
      <view class="date">
        <button size="mini" @click="goWifiList(item)">打印</button>
      </view>
    </view>
    <view class="loading-more" v-if="list.length > 0">
      {{ isNoMore ? "暂无更多" : "加载中" }}
    </view>
  </scroll-view>
</template>
<script>
import { getMyUserList, setRate } from '../../services/user';
export default {
  data() {
    return {
      list: [],
      isLoading: false,
      isNoMore: false,
      pageNo: 0,
      refresh: undefined,
    }
  },
  created() {
    this.listMap = {};
  },
  onLoad() {
    this.getList(1);
  },
  onPullDownRefresh() {
    this.isLoading = false;
    this.getList(1)
    // 关闭刷新
    uni.stopPullDownRefresh();
  },
  methods: {
    goWifiList(item) {
      uni.navigateTo({
        url: `/pages/user-info/wifiList?userId=${item.userId}&nickName=${item.nickName}`,
      });
    },
    getList(pageNo) {
      if (this.isLoading) {
        return;
      }
      this.isLoading = true;
      this.pageNo = pageNo;
      getMyUserList({ pageNum: pageNo, pageSize: 20 }).then((res) => {
        if (res.code != 0) {
          wx.showToast(res.msg);
          return;
        }
        const page = res.data;
        if (page.rows.length > 0) {

          if (pageNo == 1) {
            this.list = page.rows;
          } else {
            this.list = this.list.concat(page.rows);
          }
        }
        if (page.pages <= pageNo) {
          this.isNoMore = true;
        }
        setTimeout(() => {
          console.log("123")
          if (this.refresh) {
            this.refresh = false;
          }
        }, 100);
      })
    },
    edit(item) {
      wx.showModal({
        title: "设置分成比例（百分比）",
        editable: true,
        content: "0",
        placeholderText: "请输入",
        success(res) {
          if (res.confirm) {
            if (!res.content.match(/(^(\d|[0-9]\d)(\.\d{1,2})?$)|(^100$)/)) {
              wx.showToast({
                title: "请输入1-100的数字, 支持两位小数",
                icon: "none",
              })
              return;
            }
            const r = res.content - 0;
            if (r < 0 || r > 100) {
              wx.showToast({
                title: "请输入0-100的数字, 支持两位小数",
                icon: "none",
              })
              return;
            }
            setRate({ userId: item.userId, separateIntoRate: res.content })
              .then((res) => {
                console.log(res)
              })
          }
        }
      })
    },
    onRefresherrefresh() {
      this.refresh = true;
      this.isLoading = false;
      this.getList(1);
    },
    loadMore() {
      if (this.isNoMore) {
        return
      }
      this.getList(this.pageNo + 1);
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
  .item {
    margin: 0 48rpx;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #f2f2f2;
    line-height: 104rpx;
    text-align: center;

    &:last-child {
      border-bottom: none;
    }

    .name {
      width: 50%;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      font-weight: bold;
    }

    .date {
      width: 50%;
      margin-left: 24rpx;
      display: flex;
      align-items: center;
      justify-content: center;

      .iconfont {
        color: $uni-text-color-grey;
        margin-left: 10rpx;
      }
    }
  }

  .loading-more {
    text-align: center;
    color: $uni-text-color-grey;
    line-height: 80rpx;
  }
}
</style>