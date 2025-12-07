<template>
    <box-view>
        <template #title>
            <h2>算法管理</h2>
        </template>
        <template #btn>
            <el-button type="primary" size="mini" @click="add({})"><i class="iconfont icon-jia"
                    style="margin-right: 5px;"></i>注册新算法</el-button>
        </template>
        <template #content>
            <el-scrollbar>
                <items-view>
                    <template #content>
                        <item-view v-for="(rows, index) in queryItems" :key="index" :items="rows">
                            <template #Floot>
                                <el-button type="success" @click="run(rows)" class="palys">
                                    <i class="iconfont icon-bofang" style="margin-right: 5px;font-size: 15px;"></i>
                                    运行
                                </el-button>
                                <el-button type="primary" @click="add(rows)" class="palys">
                                    <i class="iconfont icon-icon-test" style="margin-right: 5px;font-size: 20px;"></i>
                                    编辑
                                </el-button>

                                <el-popconfirm width="180" placement="top" title="确认删除?"
                                    @confirm="() => handleDelete(rows)">
                                    <template #reference>
                                        <el-button type="danger">
                                            <i class="iconfont icon-ashbin" style="font-size: 20px;"></i>
                                        </el-button>
                                    </template>
                                    <template #actions="{ confirm, cancel }">
                                        <el-button size="small" @click="cancel">取消</el-button>
                                        <el-button type="primary" size="small" @click="confirm">
                                            确认
                                        </el-button>
                                    </template>
                                </el-popconfirm>

                            </template>
                        </item-view>
                    </template>
                </items-view>
            </el-scrollbar>
        </template>
    </box-view>
    <add-dialog ref="addDialogRef" @success="handlerCallback"></add-dialog>
    <run-view ref="runViewRef"> </run-view>
</template>
<script setup>
import boxView from '@components/box/index.vue'
import { defineAsyncComponent, provide, useTemplateRef, ref, reactive } from 'vue';
const addDialog = defineAsyncComponent(() => import('@views/Algorithm/add.vue'))
const ItemsView = defineAsyncComponent(() => import('@components/items/index.vue'))
const itemView = defineAsyncComponent(() => import('@components/items/item.vue'))
const runView = defineAsyncComponent(() => import('@views/Algorithm/run.vue'))
import {
    dataMangerLists as dataMangerListsApi
} from '@apis/datamanger.js'

import {
    lists as listsApi,
    deletes as deletesApi,
} from '@apis/algorithm.js'
import { ElMessage } from 'element-plus';
const addDialogRef = useTemplateRef('addDialogRef')
const runViewRef = useTemplateRef('runViewRef')
const dataTypeList = ref([])
provide('dataTypeList', dataTypeList)
const queryItems = ref([])
const queryTotal = ref(0)
const queryParms = reactive({
    page: 1,
    pageSize: 1000
})
function add(row) {
    addDialogRef.value?.openDialog?.(row)
}

async function getDateTypeList() {
    try {
        const { data: { results = [] } = {} } = await dataMangerListsApi({
            page: 1,
            pageSize: 1000,
        })
        dataTypeList.value = results
    } catch (error) {

    }
}
getDateTypeList();


async function getItems() {
    try {
        const { data: { results = [], total = 0 } = {} } = await listsApi({ ...queryParms })
        console.log(results, 'resultsresultsresultsresultsresults')
        queryItems.value = results
        queryTotal.value = total
    } catch (error) {

    }
}
getItems()

async function handleDelete({ id }) {
    try {
        await deletesApi([id])
        ElMessage.success('删除成功')
        await getItems()
    } catch (error) {

    }
}

function run(rows){
    runViewRef.value?.openDialog?.(rows)
}

function handlerCallback(edit){
     getItems()
}

</script>

<style lang="scss" scoped>
:deep(.palys) {
    width: vw(200);
}
</style>