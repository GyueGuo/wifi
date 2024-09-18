<template>
	<scroll-view class="container" scroll-y refresher-enabled @scrolltolower="loadMore" @refresherrefresh="refresh" :refresher-triggered="triggered" @refresherrestore="onRestore">
		<!-- <view class="item" v-for="item in list" :key="item.id" @click="click">
			<div class="name">{{ item.name }}</div>
			<div class="date">{{ item.date }}</div>
		</view> -->
		<view class="" v-if="list.length > 0">
			{{ isNoMore ? "暂无更多": "加载中" }}
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
				triggered: true,
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
					this.triggered = false;
					this.isLoading = false;
				}, 1000)
			},
			refresh(e) {
				this.getList(1);
			},
			onRestore() {
				this.triggered = 'restore';
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
page, .container {
	height: 100%;
}
.container {
	.item {
		margin: 0 48rpx;
		display: flex;
		align-items: center;
		border-bottom: 1px solid #f2f2f2;
		line-height: 104rpx;
		&:last-child {
			border-bottom: none;
		}
		.name {
			width: 0;
			flex: 1;
			white-space: nowrap;
			text-overflow: ellipsis;
			overflow: hidden;
			font-weight: bold;
		}
		.date {
			margin-left: 24rpx;
			flex-shrink: 0;
		}
	}
}
</style>