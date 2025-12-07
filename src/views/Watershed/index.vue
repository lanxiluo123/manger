<template>
    <box-view>
        <template #title>
            <h2>流域管理</h2>
        </template>
        <template #btn>
            <el-button type="primary" size="mini" @click="add">
                <i class="iconfont icon-jia" style="margin-right: 5px;"></i>
                添加流域
            </el-button>
        </template>
        <template #content>
            <el-row :gutter="20">
                <el-col :span="8">
                    <div class="left box"></div>
                </el-col>
                <el-col :span="16">
                    <div class="right box"></div>
                </el-col>
            </el-row>
        </template>
    </box-view>
</template>
<script setup>
import boxView from '@components/box/index.vue'



function add() {

}
</script>

<style lang="scss" scoped>
.box {
    min-height: vh(400);
    width: 100%;
    background-color: $base-active;
    border-radius: vw(10);
    padding: vw(20);
    box-sizing: border-box;
}
</style>