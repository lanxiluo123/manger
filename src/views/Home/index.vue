<template>
    <box-view>
        <div class="total-box">
            <el-row :gutter="30">
                <el-col :span="6" v-for="(row, index) in totalArr" :key="index">
                    <div class="grid-content ep-bg-purple">
                        <div class="left"></div>
                        <div class="right">
                            <span>{{ row.name }}</span>
                            <span>{{ row.num }}</span>
                        </div>
                    </div>
                </el-col>
            </el-row>
        </div>
    </box-view>
</template>
<script setup>
import boxView from '@components/BoxView/index.vue'

const totalArr = [
    {
        name: '流域总数',
        num: 12
    },
    {
        name: '数据总量',
        num: 12
    },
    {
        name: '算法模型',
        num: 12
    },
    {
        name: '运行中的任务',
        num: 12
    },
]

</script>

<style lang="scss" scoped>
.total-box {
    width: 100%;
    height: vh(80);

    .grid-content {
        width: 100%;
        border-radius: vw(10);
        background-color: $base-active;
        padding: vh(10);
        box-sizing: border-box;
        display: flex;
        align-items: center;
        color: white;
        .left {
            width: vw(50);
            height: vw(50);
            border-radius: 50%;
            margin-right: vw(20);
        }

        .right {
            display: flex;
            flex-direction: column;

            span:nth-child(1) {
                font-size: vh(14);
                font-weight: 400;
            }

            span:nth-child(2) {
                font-size: vh(20);
                font-weight: 400;
            }
        }
    }
}
</style>