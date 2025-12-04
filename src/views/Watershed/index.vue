<template>
    <box-view>
        <template #title>
            <h2>流域管理</h2>
        </template>
        <template #btn>
            <el-button type="primary" size="mini" @click="add"><i class="iconfont icon-jia"
                    style="margin-right: 5px;"></i>添加流域</el-button>
        </template>
        <template #content>

        </template>
    </box-view>
</template>
<script setup>
import boxView from '@components/box/index.vue'



function add() {

}
</script>