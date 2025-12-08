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
                    <div class="left box">
                        <el-tree :data="TreeOptions" :props="defaultProps" @node-click="handleNodeClick"
                            highlight-current :expand-on-click-node="false" :default-expand-all='true'
                            v-if="Array.isArray(TreeOptions) && TreeOptions.length != 0">
                            <template #default="{ node, data }">
                                <div class="nodeItems">
                                    <i class="iconfont icon-liuyu"></i>
                                    <span>{{ node.label }}</span>
                                </div>
                            </template>
                        </el-tree>
                        <el-empty v-else description="暂无数据" />
                    </div>
                </el-col>
                <el-col :span="16">
                    <div class="right box">
                        <box-view v-if="deatilsParms">
                            <template #title>
                                <h2>{{ deatilsParms?.name }}</h2>
                            </template>
                            <template #btn>
                                <div>
                                    <el-button type="primary" size="mini" @click="add(deatilsParms)">
                                        <i class="iconfont icon-icon-test" style="margin-right: 5px;"></i>
                                        编辑
                                    </el-button>
                                    <el-popconfirm width="180" placement="top" title="确认删除?"
                                        @confirm="() => handleDelete(deatilsParms)">
                                        <template #reference>
                                            <el-button type="danger" size="mini" v-if="!deatilsParms?.children">
                                                <i class="iconfont icon-ashbin" style="margin-right: 5px;"></i>
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
                                </div>
                            </template>
                            <template #content>
                                <el-row :gutter="20">
                                    <el-col :span="12">
                                        <deatils-box>
                                            <template #title>
                                                <span>基本信息</span>
                                            </template>
                                            <template #box>
                                                <span class="infor">负责人：{{ deatilsParms?.manager }}</span>
                                                <span class="infor">父流域：{{
                                                    getCodeOfName(deatilsParms?.parentCode, TreeOptions) || '--'
                                                }}</span>
                                                <span class="infor">子流域数：{{
                                                    deatilsParms?.children?.length || '--'
                                                }}</span>
                                            </template>
                                        </deatils-box>
                                    </el-col>
                                    <el-col :span="12">
                                        <deatils-box>
                                            <template #title>
                                                <span>空间范围 (BBOX)</span>
                                            </template>
                                            <template #box>
                                                <span class="infor">MinX：{{ deatilsParms?.minX }}</span>
                                                <span class="infor">MinY：{{ deatilsParms?.minY }}</span>
                                                <span class="infor">MaxX：{{ deatilsParms?.maxX }}</span>
                                                <span class="infor">MaxY：{{ deatilsParms?.maxY }}</span>
                                            </template>
                                        </deatils-box>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="20">
                                    <el-col :span="24">
                                        <deatils-box>
                                            <template #title>
                                                <span>备注</span>
                                            </template>
                                            <template #box>
                                                <span class="infor">{{ deatilsParms?.remark }}</span>
                                            </template>
                                        </deatils-box>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="20" style="margin-top: 10px;">
                                    <el-col :span="24">
                                        <deatils-box v-if="deatilsParms?.children && deatilsParms?.children.length > 0">
                                            <template #title>
                                                <span>子流域列表</span>
                                            </template>
                                            <template #box>
                                                <!-- <span class="infor">{{}}</span> -->
                                                <div v-for="(row, index) in deatilsParms?.children" :key="index"
                                                    class="childBox">
                                                    <i class="iconfont icon-liuyu"></i>
                                                    <span>{{ row.name }}</span>
                                                </div>
                                            </template>
                                        </deatils-box>
                                    </el-col>
                                </el-row>
                            </template>
                        </box-view>
                        <el-empty v-else description="暂无数据" />
                    </div>
                </el-col>
            </el-row>
        </template>
    </box-view>
    <add-view ref="addViewRef" @sucesss="handlerCallback"></add-view>
</template>
<script setup>
import boxView from '@components/box/index.vue'
import deatilsBox from '@components/deatils/index.vue'
const addView = defineAsyncComponent(() => import('@views/Watershed/add.vue'))
import {
    list as listApi,
    deatils as deatilsApi,
    deletes as deletesApi
} from '@apis/Watershed.js'
import { defineAsyncComponent, ref, useTemplateRef } from 'vue'
import { ElMessage } from 'element-plus'

const TreeOptions = ref([])

const defaultProps = {
    children: 'children',
    label: 'name',
}

const deatilsParms = ref(null)

const addViewRef = useTemplateRef('addViewRef')
function add(row) {
    addViewRef.value?.openDialog?.(row, TreeOptions.value)
}

async function getItems() {
    try {
        const { data = [] } = await listApi()
        TreeOptions.value = data
    } catch (error) {

    }
}
getItems();

function getCodeOfName(value, arr) {
    if (!value) return ''
    // 遍历数组
    for (const item of arr) {
        // 如果找到匹配的code，直接返回name
        if (item.code === value) {
            return item.name
        }

        // 如果有子节点，递归查找
        if (item.children && item.children.length > 0) {
            const result = getCodeOfName(value, item.children)
            if (result !== undefined) {
                return result
            }
        }
    }

    // 如果没找到，返回 undefined
    return undefined
}

function handlerCallback(edits) {
    !edits && getItems()
    edits && getItems()
}

async function handleNodeClick({ id }) {
    try {
        const { data = {} } = await deatilsApi(id)
        console.log(data, 'data')
        deatilsParms.value = data
    } catch (error) {

    }
}

async function handleDelete({ id }) {
    try {
        await deletesApi(id)
        ElMessage.success('删除成功')
        deatilsParms.value = null
        await getItems();
    } catch (error) {

    }
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

.left {
    .nodeItems {

        .iconfont {
            font-size: vh(12);
            margin-right: vw(5);
            color: rgb(0, 208, 255);
        }
    }

    :deep(.el-tree) {
        background: $base-active;
        color: #e5e7eb;
        --el-tree-node-hover-bg-color: #e5e7eb11;

        & .el-tree-node.is-current {
            background: $base-active;
        }
    }

    :deep(.el-tree-node__content) {
        height: vh(36);
    }

    :deep(.el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content) {
        background: #e5e7eb11;
    }


}

.right {
    padding: vw(20);
    box-sizing: border-box;

    .infor {
        margin-bottom: vh(5);
    }

    .childBox {
        width: 100%;
        padding: vh(10);
        display: flex;
        align-items: center;
        justify-content: flex-start;

        .iconfont {
            font-size: vh(12);
            margin-right: vw(5);
            color: rgb(0, 208, 255);
        }
    }

}
</style>