<template>
    <box-view>
        <template #title>
            <h2>数据中心 - 数据查询</h2>
        </template>
        <template #btn>
            <el-button type="primary" size="mini" @click="add">
                <i class="iconfont icon-jia" style="margin-right: 5px;"></i>
                上传数据
            </el-button>
        </template>
        <template #content>
            <table-box ref="tableBoxRef" pagination v-model="queryParams" v-model:total="querytotal" @change="getItems" :offset-height="-100"
                :data="queryItems">
                <el-table-column prop="code" label="数据名称" />
                <el-table-column prop="name" label="类型" />
                <el-table-column prop="category" label="数据来源" />
                <el-table-column prop="fileExtensions" label="所属流域" />
                <el-table-column prop="iconClass" label="文件大小" /> 
                 <el-table-column prop="iconClass" label="上传时间" />
                  <el-table-column prop="iconClass" label="状态" />
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
    <!-- <add-view ref="addViewRef"></add-view> -->
</template>
<script setup>
import boxView from '@components/box/index.vue'
import tableBox from "@components/table/index.vue"
import { defineAsyncComponent, reactive, ref, useTemplateRef } from 'vue';
// const tableBox = defineAsyncComponent(()=>import(''))
// const addView = defineAsyncComponent(() => import('@/views/Date/add.vue'))


const addViewRef = useTemplateRef('addViewRef')
const queryParams = reactive({

})
const querytotal = ref(1)
const queryItems = ref([{}])

function add() {
    addViewRef.value?.openDialog?.()
}

function getItems(){

}
</script>

<style lang="scss" scoped></style>