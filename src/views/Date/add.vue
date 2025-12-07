<template>
    <el-dialog v-model="dialogVisible" :title="titleName" width="500" :close-on-click-modal="false"
        :close-on-press-escape="false" :draggable="true" custom-class="dialog_box">
        <el-form :label-position="'top'" label-width="auto" :model="form" style="width: 100%;"
            @submit.prevent="onSubmit">
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="类型编码">
                        <!-- <el-input v-model="form.code" /> -->
                        <el-select v-model="form.code" placeholder="" style="width:100%">
                            <el-option v-for="item in dataType" :key="item.value" :label="item.label"
                                :value="item.value" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="类型名称">
                        <el-input v-model="form.name" />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <!-- <el-col :span="12">
                    <el-form-item label="数据分类">
                        <el-select v-model="form.category" placeholder="" style="width:100%">
                            <el-option v-for="item in dataType" :key="item.value" :label="item.label"
                                :value="item.value" />
                        </el-select>
                    </el-form-item>
                </el-col> -->
                <el-col :span="24">
                    <el-form-item label="文件扩展名">
                        <el-input v-model="form.fileExtensions" />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="24">
                    <el-form-item label="图标类名">
                        <el-input v-model="form.iconClass" />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="24">
                    <el-form-item label="默认SLD样式文件 (矢量和栅格数据需要)">
                        <el-upload class="upload-demo" :show-file-list="false" :http-request="(e) => handleSelete(e)"
                            accept=".sld">
                            <el-button type="primary">选择文件</el-button>
                        </el-upload>
                        <span style="margin-left: 10px;color: white;">{{ form.originalFileName }}</span>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="24">
                    <el-form-item label="描述">
                        <el-input v-model="form.description" style="width: 100%" :rows="4" type="textarea"
                            placeholder="请输入描述" />
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
import { computed, inject, reactive, ref } from 'vue';
import {
    add as addApi,
    fileUpdata as fileUpdataApi,
    handlerEdit as handlerEditApi
} from '@apis/datamanger.js'
import { ElMessage } from 'element-plus';

const dialogVisible = ref(false)
const dataType = inject('dataType')
const form = reactive({
    id: undefined,
    code: "",
    name: "",
    fileExtensions: "",
    description: '',
    sldStyleFilePath: "",
    originalFileName: '',
    iconClass: "ICON-NAME"
})
const titleName = computed(() => {
    return form.id ? '编辑数据类型' : '添加数据类型'
})

const emits = defineEmits(['success'])


async function openDialog({ id = undefined, code = '', description = '', fileExtensions = '', iconClass = '', name = '' }) {
    form.id = id
    form.name = name
    form.code = code
    form.description = description
    form.fileExtensions = fileExtensions
    form.iconClass = iconClass ? iconClass : 'ICON-NAME'
    form.originalFileName = ''
    dialogVisible.value = true
}

async function onSubmit() {
    const { code, name, fileExtensions, description, sldStyleFilePath, iconClass } = form
    if (!form.id) {
        try {
            await addApi({
                code,
                name,
                fileExtensions,
                description,
                sldStyleFilePath,
                iconClass
            })
            ElMessage.success('新增成功')
            emits('success', !!form.id)
            dialogVisible.value = false
        } catch (error) {

        }
    } else {
        await handlerEditApi(form.id, {
            code,
            name,
            fileExtensions,
            description,
            sldStyleFilePath,
            iconClass
        })
        ElMessage.success('编辑成功')
        emits('success', !!form.id)
        dialogVisible.value = false
    }

}

async function handleSelete({ file }) {
    try {
        const formData = new FormData()
        formData.append('file', file);
        formData.append('bizType', 'SLD');
        const { data: { path = '', originalFileName = '' } = {} } = await fileUpdataApi(formData)
        form.sldStyleFilePath = path
        form.originalFileName = originalFileName
        ElMessage.success('上传成功')
    } catch (error) {
    }

}

defineExpose({
    openDialog
}) 
</script>
<style lang="scss" scoped></style>