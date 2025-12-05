<template>
    <div class="table-container">
        <el-table size="large" class="table-container-table" ref="tableRef" @selection-change="handleSelectionChange">
            <slot :tableHeight="tableHeight" />
            <template #empty>
                <span>暂无数据</span>
            </template>
        </el-table>
        <div class="table-container-footer" v-if="pagination && total" ref="tableContainerFooterRef">
            <el-pagination v-model:current-page="model.page" v-model:page-size="model.pageSize"
                :page-sizes="PAGE_SIZE_OPTIONS" background layout="total, sizes, prev, pager, next, jumper"
                :total="total" @size-change="handleSizeChange" @current-change="handlePageChange" />
        </div>
    </div>
</template>
<script setup>
import { useElementSize } from '@vueuse/core';
import { PAGE_SIZE_OPTIONS, OFFSET_BASE, OFFSET_MIDDLE_BASE, OFFSET_LARGE_BASE } from '@config';
import { layoutSize } from '@views/utils/common';
import {computed, getCurrentInstance, h, useAttrs, useTemplateRef, watch } from 'vue';
const props = defineProps({
    pagination: {
        tyep: Boolean,
        default: false,
    },
    offsetHeight: {
        type: Number,
        default: 0,
    },
})

const attrs = useAttrs();
const model = defineModel();
const emits = defineEmits(['selectionChange', 'change'])
const total = defineModel('total', { type: Number, default: 0 });
const tableContainerFooterRef = useTemplateRef('tableContainerFooterRef');
const { height: tableFooterHeight } = useElementSize(tableContainerFooterRef)

const tableHeight = computed(
    () =>
        layoutSize.innerHeight -
        (props.pagination && total.value ? tableFooterHeight.value + OFFSET_MIDDLE_BASE : 0) -
        OFFSET_LARGE_BASE * 2 +
        (props.offsetHeight || 0),
);

function init() {
    if (props.pagination) {
        model.value.page = 1;
        model.value.pageSize = PAGE_SIZE_OPTIONS[0];
    }
    change();
}
init();

function handleReset() {
    const keys = Object.keys(model.value);
    const tempModel = JSON.parse(tempModelStr);

    keys.forEach((key) => {
        if (key === 'page') model.value.page = 1;
        else if (key === 'pageSize') model.value.pageSize = PAGE_SIZE_OPTIONS[0];
        else model.value[key] = tempModel[key] ?? '';
    });
    change();
}

function change() {
    emits('change', model.value);
}

function handleSelectionChange(val) {
    emits('selectionChange', val);
}

function handleSizeChange(size) {
    model.value.pageSize = size;
    change();
}
function handlePageChange(page) {
    model.value.page = page;
    change();
}

function resetScrollTop() {
    tableRef.value?.setScrollTop?.(0);
}
function resetPageChange() {
    handlePageChange(1);
}

function clearnSelection() {
    tableRef.value?.clearSelection?.();
}

watch(() => attrs.data, resetScrollTop);

defineExpose({
    handleReset,
    handleSizeChange,
    handlePageChange,
    tableHeight,
    resetScrollTop,
    resetPageChange,
    clearnSelection,
});

</script>

<style lang="scss" scoped></style>