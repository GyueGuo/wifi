<template>
  <scroll-view class="container" scroll-y @scrolltolower="loadMore">
    <view class="item">
      <div class="name">名称</div>
      <div class="date">分成比例</div>
    </view>
    <view class="item">
      <view class="name">123</view>
      <view class="date" @click="edit">
        <text>111</text>
        <text class="iconfont icon-edit" />
      </view>
    </view>
    <view class="item" v-for="item in list" :key="item.id" @click="click(item)">
      <view class="name">{{ item.name }}</view>
      <view class="date" @click="edit(item)">
        <text>{{ item.date }}</text>
        <text class="iconfont icon-edit" />
      </view>
    </view>
    <view class="loading-more" v-if="list.length > 0">
      {{ isNoMore ? "暂无更多" : "加载中" }}
    </view>
  </scroll-view>
</template>
<script>
export default {
  data() {
    return {
      list: [],
      isLoading: false,
      isNoMore: false,
      pageNo: 0,
    }
  },
  created() {
    this.listMap = {};
  },
  methods: {
    click(item) {
      uni.navigateTo({
        url: "",
      });
    },
    getList(pageNo) {
      if (this.isLoading) {
        return;
      }
      this.isLoading = true;
      setTimeout(() => {
        this.pageNo = pageNo;
        this.isLoading = false;
      }, 1000)
    },
    edit(item) {
      wx.showModal({
        title: "设置分成比例",
        editable: true,
        content: "1",
        placeholderText: "请输入",
        success(res) {
          if (res.confirm) {
            if (!res.content.match(/(^(\d|[1-9]\d)(\.\d{1,2})?$)|(^100$)/)) {
              wx.showToast({
                title: "请输入1-100的数字, 支持两位小数",
                icon: "none",
              })
              return;
            }
            const r = res.content - 0;
            if (r < 0 || r > 100) {
              wx.showToast({
                title: "请输入1-100的数字, 支持两位小数",
                icon: "none",
              })
              return;
            }
          }
        }
      })
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
}</style>