<template>
    <box-view>
        <template #title>
            <h2>用户管理</h2>
        </template>
        <template #btn>
            <el-button type="primary" size="mini" @click="add">
                <i class="iconfont icon-jia" style="margin-right: 5px;"></i>
                添加用户
            </el-button>
        </template>
    </box-view>
</template>
<script setup>
import boxView from '@components/box/index.vue'
</script>
<style lang="scss" scoped></style>