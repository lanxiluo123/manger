<template>
    <box-view>
        <template #title>
            <h2>数据类型管理</h2>
        </template>
        <template #btn>
            <el-button type="primary" size="mini" @click="add">
                <i class="iconfont icon-jia" style="margin-right: 5px;"></i>
                添加数据类型
            </el-button>
        </template>
        <template #content>

        </template>
    </box-view>
    <add-view ref="addViewRef"></add-view>
</template>
<script setup>
import boxView from '@components/box/index.vue'
import { defineAsyncComponent, useTemplateRef } from 'vue';
const addView = defineAsyncComponent(() => import('@/views/DateP/add.vue'))


const addViewRef = useTemplateRef('addViewRef')


function add() {
    addViewRef.value?.openDialog?.()
}
</script>

<style lang="scss" scoped></style>