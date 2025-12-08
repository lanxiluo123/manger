<template>
    <el-dialog v-model="dialogVisible" :title="titleName" width="500" :close-on-click-modal="false"
        :close-on-press-escape="false" :draggable="true" custom-class="dialog_box">
        <el-form :label-position="'top'" label-width="auto" :model="form" style="width: 100%;"
            @submit.prevent="onSubmit">
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="流域名称">
                        <el-input v-model="form.name" placeholder="流域名称" maxlength="10" show-word-limit />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="流域编码">
                        <el-input v-model="form.code" placeholder="流域编码" maxlength="10" show-word-limit />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="24">
                    <el-form-item label="父流域">
                        <el-select v-model="form.parentCode" placeholder="" style="width:100%">
                            <el-option label="顶级流域" value="all"></el-option>
                            <el-option v-for="item in treeList" :key="item.code" :label="item.name"
                                :value="item.code" />
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="24">
                    <el-form-item label="负责人">
                        <el-input v-model="form.manager" placeholder="负责人" maxlength="10" show-word-limit />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="24">
                    <el-form-item label="流域边界文件">
                        <el-upload class="upload-demo" :show-file-list="false" :http-request="(e) => handleSelete(e)"
                            accept=".zip">
                            <el-button type="primary">选择文件</el-button>
                        </el-upload>
                        <span style="margin-left: 10px;color: white;">{{ originalFileNames }}</span>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-form-item label="外包矩形 (BBOX)">
                    <el-col :span="6">
                        <el-input v-model="form.minX" placeholder="minX" />
                    </el-col>
                    <el-col :span="6">
                        <el-input v-model="form.minY" placeholder="minY" />
                    </el-col>
                    <el-col :span="6">
                        <el-input v-model="form.maxX" placeholder="maxX" />
                    </el-col>
                    <el-col :span="6">
                        <el-input v-model="form.maxY" placeholder="maxY" />
                    </el-col>
                </el-form-item>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="24">
                    <el-form-item label="描述">
                        <el-input v-model="form.remark" style="width: 100%" :rows="4" type="textarea"
                            placeholder="请输入描述" maxlength="50" show-word-limit />
                    </el-form-item>
                </el-col>
            </el-row>
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
import { computed, reactive, ref } from 'vue';
import {
    add as addApi,
    edit as editApi
} from '@apis/Watershed.js'

import {
    fileUpdata as fileUpdataApi,
} from '@apis/datamanger.js'

import { ElMessage } from 'element-plus';
const dialogVisible = ref(false)
const originalFileNames = ref('')
const form = reactive({
    id: undefined,
    name: '',
    code: '',
    manager: '',
    boundaryUrl: '',
    minX: '',
    minY: '',
    maxX: '',
    maxY: '',
    remark: '',
    parentCode: 'all'
})
const titleName = computed(() => {
    return form.id ? '编辑流域' : '新建流域'
})

const emits = defineEmits(['sucesss'])
const treeList = ref([])
async function openDialog({
    id = undefined,
    name = '',
    code = '',
    manager = '',
    boundaryUrl = '',
    minX = '',
    minY = '',
    maxX = '',
    maxY = '',
    remark = '',
    parentCode = 'all'
}, list) {
    treeList.value = []
    form.id = id
    form.name = name
    form.code = code
    form.manager = manager
    form.boundaryUrl = boundaryUrl
    form.minX = minX
    form.minY = minY
    form.maxX = maxX
    form.maxY = maxY
    form.remark = remark
    form.parentCode = parentCode ? parentCode : 'all'
    originalFileNames.value = ''
    const arr = dealList(list)
    if (form.id) {
        treeList.value = arr.filter(({ code }) => code != form.code)
    }else{
         treeList.value = arr
    }
    dialogVisible.value = true
}

function dealList(arr) {
    if (!arr) return
    const result = []
    arr.forEach(item => {
        result.push(item)
        if (item.children && item.children.length > 0) {
            const childrenResult = dealList(item.children)
            result.push(...childrenResult)
        }
    });
    return result
}


async function handleSelete({ file }) {
    try {
        const formData = new FormData()
        formData.append('file', file);
        formData.append('bizType', 'SLD');
        const { data: { path = '', originalFileName = '' } = {} } = await fileUpdataApi(formData)
        ElMessage.success('上传成功')
        form.boundaryUrl = path
        originalFileNames.value = originalFileName
    } catch (error) {
    }

}

async function onSubmit() {
    if (!form.id) {
        try {
            const { parentCode, minX, minY, maxX, maxY, ...options } = form
            await addApi({
                parentCode: parentCode == 'all' ? undefined : getCode(parentCode),
                minX: Number(minX),
                minY: Number(minY),
                maxX: Number(maxX),
                maxY: Number(maxY),
                ...options,
                level: parentCode === 'all' ? '1' : getNuber(parentCode)
            })

            ElMessage.success('新增成功')
            emits('sucesss', !!form.id)
            dialogVisible.value = false
        } catch (error) {

        }
    } else {
        try {
            const { parentCode, minX, minY, maxX, maxY, ...options } = form
            await editApi({
                minX: Number(minX),
                minY: Number(minY),
                maxX: Number(maxX),
                maxY: Number(maxY),
                parentCode: parentCode == 'all' ? undefined : getCode(parentCode),
                level: parentCode === 'all' ? '1' : getNuber(parentCode),
                ...options
            })
            ElMessage.success('编辑成功')
            emits('sucesss', !!form.id)
            dialogVisible.value = false
        } catch (error) {

        }
    }
}

function getCode(parentCode) {
    return treeList.value.find(({ code }) => code == parentCode)?.code
}

function getNuber(parentCode) {
    const Num = treeList.value.find(({ code }) => code == parentCode)?.level
    return Number(Num) + 1
}

defineExpose({
    openDialog
})

</script>
<style lang="scss" scoped></style>