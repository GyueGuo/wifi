<template>
	<view class="content">
		<view class="top">
			<text class="title">昨日收益</text>
			<view class="income">
				<text class="income-number">30000</text>
				<text class="iconfont icon-ascending1 up"></text>
				<text class="iconfont icon-a-Descendingorder-outlined down"></text>
			</view>
		</view>
		<view class="middle">
			<text>历史收益</text>
			<picker @change="bindPickerChange" :value="date" :start="startDate" :end="endDate" fields="month" mode="date">
				<view class="date-show">{{dateShow}}</view>
			</picker>
		</view>
		<view class="list">
			<view class="item">
				<text class="name">日期</text>
				<text class="date">收益</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			const _t = new Date();
			let _m = _t.getMonth() + 1;
			if (_m < 9) {
				_m = "0" + _m;
			}
			const date = `${_t.getFullYear()}-${_t.getMonth() + 1}`
			return {
				title: 'Hello',
				date,
				startDate: "2024-09",
				endDate: date,
			}
		},
		computed: {
			dateShow() {
				let date = this.date;
				if (!date) {
					return "";
				}
				date = date.split('-');
				return `${date[0]}年${date[1] - 0}月`;
			}
		},
		onLoad() {

		},
		onReachBottom() {
			console.log('onReachBottom');
		},
		methods: {
			bindPickerChange(e) {
				const { value } = e.detail;
				if (this.date !== value){
					this.date = value;
				}
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
			font-size: 48rpx;
		}
		.income {
			display: flex;
			align-items: center;
			justify-content: center;
			.income-number {
				font-size: 100rpx;
			}
		}
	}
	.up {
		color: red;
	}
	.down {
		color: green;
	}
	.middle {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 48rpx;
		background-color: rgba(0,122,255, 0.5);
		color: $uni-text-color-inverse;
		line-height: 60rpx;
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
