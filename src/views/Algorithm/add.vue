<template>
    <el-dialog v-model="dialogVisible" :title="titleName" width="600" :close-on-click-modal="false"
        :close-on-press-escape="false" :draggable="true" custom-class="dialog_box">
        <el-form :label-position="'top'" label-width="auto" :model="form" style="width: 100%;"
            @submit.prevent="onSubmit">
            <el-collapse v-model="activeNames" @change="handleChange">
                <el-collapse-item title="基础信息" name="1">
                    <el-row :gutter="20" style="margin-top: 10px;">
                        <el-col :span="12">
                            <el-form-item label="算法名称">
                                <el-input v-model="form.name" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="算法分类">
                                <el-select v-model="form.category" placeholder="" style="width:100%">
                                    <el-option v-for="item in param2" :key="item.value" :label="item.label"
                                        :value="item.value" />
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="版本号">
                                <el-input v-model="form.version" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="执行类型">
                                <el-select v-model="form.executionType" placeholder="" style="width:100%">
                                    <el-option v-for="item in param3" :key="item.value" :label="item.label"
                                        :value="item.value" />
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="24">
                            <el-form-item label="算法描述">
                                <el-input v-model="form.description" style="width: 100%" :rows="4" type="textarea"
                                    placeholder="请输入描述" />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="24">
                            <el-form-item label="执行路径/镜像名">
                                <el-input v-model="form.scriptOrImagePath" />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="24">
                            <el-form-item label="输出产品数据类型">
                                <el-select v-model="form.outputDataTypeId" placeholder="" style="width:100%" multiple
                                    collapse-tags collapse-tags-tooltip>
                                    <el-option v-for="item in dataTypeList" :key="item.id" :label="item.name"
                                        :value="item.id" />
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-collapse-item>
                <el-collapse-item title="参数配置" name="2">
                    <el-row :gutter="20" style="margin-bottom: 10px;margin-top: 10px;">
                        <el-col :span="24">
                            <el-button type="success" size="mini" @click="addparms">
                                <i class="iconfont icon-jia" style="margin-right: 5px;"></i>
                                添加参数
                            </el-button>
                        </el-col>
                    </el-row>
                    <el-scrollbar height="200px">
                        <div class="parmsitemsBox">
                            <div v-for="(rows, index) in form.paramMetas" :key="index">
                                <div class="parmsitems">
                                    <span style="color: #e5e7eb;">参数{{ index + 1 }}</span>
                                    <i class="iconfont icon-close" style="margin-right: 5px; color: red;"
                                        v-if="showColse" @click="deletParms(index)"></i>
                                </div>
                                <el-row :gutter="20">
                                    <el-col :span="12">
                                        <el-form-item label="参数键名">
                                            <el-input v-model="rows.param" />
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="12">
                                        <el-form-item label="参数类型">
                                            <el-select v-model="rows.paramType" placeholder="" style="width:100%">
                                                <el-option v-for="(item, index) in param1" :key="index"
                                                    :label="item.label" :value="item.value" />
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="20">
                                    <el-col :span="12">
                                        <el-form-item label="显示标签">
                                            <el-input v-model="rows.paramName" />
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="12">
                                        <el-form-item label="是否必填">
                                            <el-select v-model="rows.required" placeholder="" style="width:100%">
                                                <el-option :label="'是'" :value="'true'" />
                                                <el-option :label="'否'" :value="'false'" />
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                            </div>
                        </div>
                    </el-scrollbar>
                </el-collapse-item>
            </el-collapse>
        </el-form>
        <template #footer>
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="onSubmit">
                保存
            </el-button>
        </template>

    </el-dialog>
</template>
<script setup>
import { computed, inject, reactive, ref } from 'vue';
import {
    add as addApi,
    getParmsType as getParmsTypeApi,
    getAlgorith as getAlgorithApi,
    getExecutionType as getExecutionTypeApi
} from '@apis/algorithm.js'
import {
    dataMangerLists as dataMangerListsApi
} from '@apis/datamanger.js'

const dialogVisible = ref(false)
const form = reactive({
    id: undefined,
    category: '',
    version: '',
    executionType: '',
    scriptOrImagePath: 'https://loremflickr.com/400/400?lock=39557356805993',
    description: '',
    outputDataTypeId: '',
    paramMetas: [
        {
            param: "",
            paramType: '',
            paramName: '',
            required: ''
        }
    ],
    name:''
})
const activeNames = ref(['1', '2'])
const titleName = computed(() => {
    return form.id ? '编辑算法' : '注册新算法'
})
const showColse = computed(() => {
    return form.paramMetas.length == 1 ? false : true
})

const dataTypeList = inject('dataTypeList')
const param1 = ref([])
const param2 = ref([])
const param3 = ref([])
const param4 = ref([])

function openDialog() {
    dialogVisible.value = true
}

function addparms() {
    form.paramMetas.push({
        param: "",
        paramType: '',
        paramName: '',
        required: ''
    })
}

function deletParms(val) {
    form.paramMetas.splice(val, 1)
}

async function getAllTypes() {
    await Promise.allSettled([type1(), type2(), type3(), type4()])
}

async function onSubmit() {
    try {
        const { outputDataTypeId, ...options} = form
        await addApi({
            outputDataTypeId: outputDataTypeId.join(','),
            ...options
        })
    } catch (error) {

    }
}

getAllTypes();


async function type1() {
    try {
        const { data = [] } = await getParmsTypeApi()
        param1.value = data
    } catch (error) {
        throw error;
    }
}

async function type2() {
    try {
        const { data = [] } = await getAlgorithApi()
        param2.value = data
    } catch (error) {
        throw error;
    }
}

async function type3() {
    try {
        const { data = [] } = await getExecutionTypeApi()
        param3.value = data
    } catch (error) {
        throw error;
    }
}

async function type4(params) {
    try {
        const { data: { content = [] } = {} } = await dataMangerListsApi({
            page: 1,
            size: 1000
        })
        param4.value = content
    } catch (error) {

    }
}


defineExpose({
    openDialog
})
</script>

<style lang="scss" scoped>
:deep(.dialog_box) {}

.parmsitemsBox {
    padding: 0 10px;
    box-sizing: border-box;

    .parmsitems {
        display: flex;
        width: 100%;
        height: vh(20);
        justify-content: space-between;
        align-items: center;
        margin-bottom: vh(10);
    }
}
</style>