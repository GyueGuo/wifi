<template>
    <view class="container">
        <div class="form">
            <view class="list">
                <view class="item">
                    <button @click="updateWifi(undefined)">新增WIFI</button>
                </view>
                <view class="item" v-for="(wifi, index ) in list" :key="index">
                    <view>
                        <text class="name">WIFI名称:{{ wifi.ssid }}</text>
                    </view>
                    <view>
                        <text class="date">WIFI密码{{ wifi.pwd }}</text>
                    </view>
                    <view>
                        <button @click="updateWifi(wifi)">编辑</button>
                        <button @click="updateWifi(wifi)">一键生成二维码</button>
                    </view>

                </view>
            </view>
        </div>
    </view>
</template>
<script>
import { getWifiConfigList } from '../../services/wifi';
export default {
    data() {
        return {
            list: [

            ],
        }
    },
    computed: {

    },
    onLoad() {
        this.getConfigList();
    },
    methods: {
        getConfigList: function (e) {
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
page {
    height: 100%;
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
// }</style>