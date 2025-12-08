<template>
    <box-view>
        <template #title>
            <h2>流域管理</h2>
        </template>
        <template #btn>
            <el-button type="primary" size="mini" @click="add({})">
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
    <add-view ref="addViewRef" @sucesss="handlerCallback"></add-view>
</template>
<script setup>
import boxView from '@components/box/index.vue'
const addView = defineAsyncComponent(() => import('@views/Watershed/add.vue'))
import {
    list as listApi
} from '@apis/Watershed.js'
import { defineAsyncComponent, ref, useTemplateRef } from 'vue'

const TreeOptions = ref([])
const addViewRef = useTemplateRef('addViewRef')
function add(row) {
    addViewRef.value?.openDialog?.(row)
}

async function getItems() {
    try {
        const { data = [] } = await listApi()
        TreeOptions.value = data
    } catch (error) {

    }
}

function handlerCallback(edits) {
    !edits && getItems()
    edits && getItems()
}

getItems();

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