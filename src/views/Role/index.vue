<template>
    <box-view>
        <template #title>
            <h2>角色权限管理</h2>
        </template>
        <template #btn>
            <el-button type="primary" size="mini" @click="add">
                <i class="iconfont icon-jia" style="margin-right: 5px;"></i>
                添加角色
            </el-button>
        </template>
        <template #content>
            <table-box ref="tableBoxRef" pagination v-model="queryParams" v-model:total="querytotal" @change="getItems"
                :data="queryItems">
                <el-table-column prop="code" label="角色名称" />
                <el-table-column prop="code" label="权限" />
                <el-table-column prop="code" label="操作" width="100" fixed="right">
                    <template #default="{ row }">
                        <el-button size="small" type="primary" text @click="handleEdit(row)">
                            编辑权限
                        </el-button>
                    </template>
                </el-table-column>
            </table-box>
        </template>
    </box-view>
</template>
<script setup>
import boxView from '@components/box/index.vue'
import tableBox from "@components/table/index.vue"
import { reactive, ref } from 'vue';
import {
    list as listApi
} from '@apis/user.js'
const queryParams = reactive({
    page: 1,
    pageSize: 10,
})
const querytotal = ref(0)
const queryItems = ref([])



async function getItems() {
    try {
        const { data = [] } = await listApi({ ...queryParams })
        const queryItems = data
    } catch (error) {

    }
}
</script>
<style lang="scss" scoped></style>