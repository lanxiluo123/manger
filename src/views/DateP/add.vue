<template>
     <el-dialog v-model="dialogVisible" :title="titleName" width="900" :close-on-click-modal="false"
      :close-on-press-escape="false" :draggable="true" custom-class="dialog_box"
     >

     </el-dialog>
</template>
<script setup>
import { computed, reactive, ref } from 'vue';


const dialogVisible = ref(false)
const form = reactive({
    id:undefined
})
const titleName = computed(()=>{
    return form.id ? '编辑' : '新增'
})


async function openDialog(){
    dialogVisible.value = true
}
 
defineExpose({
    openDialog
}) 
</script>
<style lang="scss" scoped>

</style>