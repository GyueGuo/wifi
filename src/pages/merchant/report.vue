<template>
	<view class="content">
		<view class="section top">
			<text class="title">昨日收益</text>
			<view class="income">
				<text>30000</text>
				<text class="iconfont icon-wind-ascending up"></text>
				<text class="iconfont icon-wind-descending down"></text>
			</view>
		</view>

		<picker @change="bindPickerChange" :value="date" :start="startDate" :end="endDate" fields="month" mode="date">
			<view class="date-show">{{dateShow}}</view>
		</picker>
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
		padding: 32rpx;
	}
	.section {
		border-radius: 16rpx;
		background-color: $uni-text-color-inverse;
	}
	.top {
		
	}
	.title {
		line-height: 80rpx;
		text-indent: 32rpx;
		font-weight: bold;
		font-size: 48rpx;
	}
	.up {
		color: red;
	}
	.down {
		color: green;
	}
	.date-show {
		font-weight: bold;
		font-size: 40rpx;
		padding: 24rpx 0 0 48rpx;
		color: $uni-color-primary;
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
