<template>
    <box-view>
        <template #title>
            <h2>算法管理</h2>
        </template>
        <template #btn>
            <el-button type="primary" size="mini" @click="add"><i class="iconfont icon-jia"
                    style="margin-right: 5px;"></i>注册新算法</el-button>
        </template>
        <template #content>
            <el-scrollbar>
                <items-view>
                    <template #content>
                        <item-view v-for="(rows, index) in queryItems" :key="index" :items="rows">
                            <template #Floot>
                                <el-button type="success" @click="add" class="palys">
                                    <i class="iconfont icon-bofang" style="margin-right: 5px;font-size: 15px;"></i>
                                    运行
                                </el-button>
                                <el-button type="primary" @click="add" class="palys">
                                    <i class="iconfont icon-icon-test" style="margin-right: 5px;font-size: 20px;"></i>
                                    编辑
                                </el-button>

                                <el-popconfirm width="180" placement="top" title="确认删除?"
                                    @confirm="() => handleDelete(row)">
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
    <add-dialog ref="addDialogRef"></add-dialog>
</template>
<script setup>
import boxView from '@components/box/index.vue'
import { defineAsyncComponent, provide, useTemplateRef, ref, reactive } from 'vue';
const addDialog = defineAsyncComponent(() => import('@views/Algorithm/add.vue'))
const ItemsView = defineAsyncComponent(() => import('@components/items/index.vue'))
const itemView = defineAsyncComponent(() => import('@components/items/item.vue'))
import {
    dataMangerLists as dataMangerListsApi
} from '@apis/datamanger.js'

import {
    lists as listsApi,
    deletes as deletesApi,
} from '@apis/algorithm.js'
import { ElMessage } from 'element-plus';
const addDialogRef = useTemplateRef('addDialogRef')
const dataTypeList = ref([])
provide('dataTypeList', dataTypeList)
const queryItems = ref([])
const queryTotal = ref(0)
const queryParms = reactive({
    page: 1,
    pageSize: 1000
})
function add() {
    addDialogRef.value?.openDialog?.()
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
        // queryItems.value = results
        queryItems.value = [{
            "id": "4028d8819ad2a543019ad2a5fa780000",
            "name": "算法测试4.2v",
            "category": "hydrology",
            "version": "1.0.2",
            "executionType": "py",
            "scriptOrImagePath": "https://loremflickr.com/400/400?lock=39557356805993",
            "description": "劳已题县问按由报成院。内本率还果。你总拉技段使口写道。",
            "outputDataTypeId": "95",
            "paramMetas": [
                {
                    "param": "test1",
                    "paramType": "enum",
                    "paramName": "test1",
                    "required": false
                },
                {
                    "param": "et",
                    "paramType": "datetime",
                    "paramName": "et",
                    "required": false
                }
            ],
            "createdDate": null,
            "lastModifiedDate": null
        }]
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

</script>

<style lang="scss" scoped>
:deep(.palys) {
    width: vw(200);
}
</style>