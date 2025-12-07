<template>
    <el-dialog v-model="dialogVisible" :title="titleName" width="600" :close-on-click-modal="false">

    </el-dialog>
</template>
<script setup>
import { computed, reactive, ref } from 'vue';


const dialogVisible = ref(false)

const titleName = computed(() => {
    return `运行算法 - ${form.name}`
})

const form = reactive({
    id: undefined,
    name: ''
})


async function openDialog({ id, name }) {
    form.id = id
    form.name = name
    dialogVisible.value = true
}

defineExpose({
    openDialog
})

</script>
<style lang="scss" scoped></style>