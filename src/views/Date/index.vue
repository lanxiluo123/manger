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
            <table-box ref="tableBoxRef" pagination v-model="queryParams" v-model:total="querytotal" @change="getItems"
                :data="queryItems">
                <el-table-column prop="code" label="类型编码" />
                <el-table-column prop="name" label="类型名称" />
                <el-table-column prop="category" label="数据分类" />
                <el-table-column prop="fileExtensions" label="文件扩展名" />
                <el-table-column prop="iconClass" label="图标" />
                <el-table-column prop="sldStyle" label="SLD样式">
                    <template #default ='{row}'>
                        <span style="color: #4ade80;">{{ row.sldStyle ? '已配置' : '' }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="description" label="描述" />
                <el-table-column label="操作">
                    <template #default="{ row }">
                        <el-button size="small" type="primary" text @click="handleEdit(row)">
                            编辑
                        </el-button>
                        <el-popconfirm width="180" placement="top" title="确认删除?" @confirm="() => handleDelete(row)">
                            <template #reference>
                                <el-button size="small" text type="danger">
                                    删除
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
                </el-table-column>
            </table-box>
        </template>
    </box-view>
    <add-view ref="addViewRef" @success='handlerReact'></add-view>
</template>
<script setup>
import boxView from '@components/box/index.vue'
import tableBox from "@components/table/index.vue"
import { defineAsyncComponent, onMounted, provide, reactive, ref, useTemplateRef } from 'vue';
const addView = defineAsyncComponent(() => import('@/views/Date/add.vue'))
import {
    dataMangerLists as dataMangerListsApi,
    dataType as dataTypeApi,
    handlerDelete as handlerDeleteApi,
} from '@apis/datamanger.js'
import { ElMessage } from 'element-plus';

const addViewRef = useTemplateRef('addViewRef')
const tableBoxRef = useTemplateRef('tableBoxRef')
const queryItems = ref([])
const querytotal = ref(0)
const queryParams = reactive({
    page: 1,        
    pageSize: 10,
})
const dataType = ref([])
provide('dataType', dataType)
async function getItems() {
    try {
        const { data: { results = [], total = 0 } = {} } = await dataMangerListsApi({ ...queryParams })
        queryItems.value = results  
        querytotal.value = total
    } catch (error) {

    }
}
function add() {
    addViewRef.value?.openDialog?.({})
}

async function getDataType() {
    try {
        const { data = [] } = await dataTypeApi()
        dataType.value = data
    } catch (error) {

    }
}
getDataType();

function handlerReact(edits) {
    edits && getItems()
    !edits && tableBoxRef.value?.resetPageChange?.()
}

async function handleEdit(row) {
    addViewRef.value?.openDialog?.(row)
}

async function handleDelete({ id }) {
    try {
        await handlerDeleteApi(id)
        ElMessage.success('删除成功')
        await getItems();
    } catch (error) {

    }
}

onMounted(() => {
    tableBoxRef.value?.init?.();
})
</script>

<style lang="scss" scoped></style>