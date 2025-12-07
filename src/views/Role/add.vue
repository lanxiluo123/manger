<template>
    <el-dialog v-model="dialogVisible" :title="titleName" width="500" :close-on-click-modal="false"
        :close-on-press-escape="false" :draggable="true" custom-class="dialog_box">

    </el-dialog>
</template>
<script setup>
import { computed, reactive, ref } from 'vue';

const dialogVisible = ref(false)
const form = reactive({
    id: undefined
})
const titleName = computed(() => {
   return form.id ? '编辑角色' : '添加角色'
})
</script>
<style lang="scss" scoped></style>