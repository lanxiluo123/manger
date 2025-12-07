<template>
    <div class="table-container">
        <el-table v-bind="tableAttrs" class="table-container-table theme-table" ref="tableRef" :data="tableData"
            @selection-change="handleSelectionChange">
            <slot :tableHeight="tableHeight" />
            <template #empty>
                <span>暂无数据</span>
            </template>
        </el-table>
        <div class="table-container-footer" v-if="pagination && total > 0" ref="tableContainerFooterRef">
            <el-pagination v-model:current-page="model.page" v-model:page-size="model.pageSize"
                :page-sizes="PAGE_SIZE_OPTIONS" background layout="total, sizes, prev, pager, next, jumper"
                :total="total" @size-change="handleSizeChange" @current-change="handlePageChange" />
        </div>
    </div>
</template>

<script setup>
import { useElementSize } from '@vueuse/core';
import { PAGE_SIZE_OPTIONS, OFFSET_BASE, OFFSET_MIDDLE_BASE, OFFSET_LARGE_BASE } from '@config/config.js';
import { layoutSize } from '@views/utils/common';
import { computed, onMounted, ref, watch, useAttrs } from 'vue';

const props = defineProps({
    pagination: {
        type: Boolean, // 修正拼写错误
        default: false,
    },
    offsetHeight: {
        type: Number,
        default: 0,
    },
    // 添加其他可能的 props
    autoHeight: {
        type: Boolean,
        default: true,
    },
    // 添加默认的表格属性
    tableProps: {
        type: Object,
        default: () => ({})
    },
    data: {
        type: Array,
        default: () => []
    }
});

// 合并 attrs 和自定义的 tableProps
const attrs = useAttrs();
const tableData = computed(() => props.data);
const tableAttrs = computed(() => ({
    ...attrs,
    ...props.tableProps,
    // 如果设置了高度，使用计算的高度
    height: props.autoHeight ? tableHeight.value : attrs.height,
}));

const model = defineModel('model', {
    default: () => ({ page: 1, pageSize: PAGE_SIZE_OPTIONS[0] })
});

const emits = defineEmits(['selectionChange', 'change', 'reset']);

const total = defineModel('total', {
    type: Number,
    default: 0
});

const tableRef = ref(null);
const tableContainerFooterRef = ref(null);
const { height: tableFooterHeight } = useElementSize(tableContainerFooterRef);

// 计算表格高度
const tableHeight = computed(() => {
    if (!props.autoHeight) return undefined;

    // 获取基础高度
    let baseHeight = layoutSize.innerHeight - OFFSET_LARGE_BASE * 2;

    // 添加 offsetHeight（允许负值）
    if (props.offsetHeight) {
        baseHeight += props.offsetHeight;
    }


    // 减去分页区域高度
    if (props.pagination && total.value > 0) {
        baseHeight -= (tableFooterHeight.value + OFFSET_MIDDLE_BASE);
    }

    // 确保最小高度
    return Math.max(baseHeight, 200); // 降低最小高度，允许更小的表格
});


// 初始化模型
function initModel() {
    if (props.pagination) {
        if (!model.value.page) model.value.page = 1;
        if (!model.value.pageSize) model.value.pageSize = PAGE_SIZE_OPTIONS[0];
    }
}

function init(immediate = true) {
    initModel();
    if (immediate) {
        change();
    }
}

// 初始化
// onMounted(() => {
//     initModel();
// });

// 重置表单
function handleReset() {
    if (props.pagination) {
        model.value.page = 1;
        model.value.pageSize = PAGE_SIZE_OPTIONS[0];
    }

    // 重置其他字段
    const keys = Object.keys(model.value);
    keys.forEach(key => {
        if (!['page', 'pageSize'].includes(key)) {
            if (Array.isArray(model.value[key])) {
                model.value[key] = [];
            } else if (typeof model.value[key] === 'object') {
                model.value[key] = {};
            } else {
                model.value[key] = '';
            }
        }
    });

    change();
    emits('reset', model.value);
}

// 触发变化事件
function change() {
    emits('change', model.value);
}

// 处理选择变化
function handleSelectionChange(val) {
    emits('selectionChange', val);
}

// 处理每页大小变化
function handleSizeChange(size) {
    model.value.pageSize = size;
    model.value.page = 1; // 重置到第一页
    change();
}

// 处理页码变化
function handlePageChange(page) {
    model.value.page = page;
    change();
}

// 重置滚动到顶部
function resetScrollTop() {
    tableRef.value?.setScrollTop?.(0);
}

// 重置分页
function resetPageChange() {
    model.value.page = 1;
    change();
}

// 清空选择
function clearSelection() {
    tableRef.value?.clearSelection?.();
}

// 获取表格实例
function getTableInstance() {
    return tableRef.value;
}

// 监听数据变化重置滚动
watch(() => attrs.data, () => {
    if (props.autoHeight) {
        resetScrollTop();
    }
});

// 监听分页变化重置滚动
watch(() => model.value.page, resetScrollTop);

// 导出方法
defineExpose({
    handleReset,
    handleSizeChange,
    handlePageChange,
    tableHeight,
    resetScrollTop,
    resetPageChange,
    clearSelection,
    getTableInstance,
    tableRef,
    init
});
</script>

<style lang="scss" scoped>
.table-container {
    display: flex;
    flex-direction: column;
    height: 100%; // 关键：确保占满父容器高度
    min-height: 200px; // 设置最小高度

    .table-container-table {
        flex: 1;
        overflow: hidden;

        // 确保表格在弹性布局中正确显示
        :deep(.el-table__body-wrapper) {
            height: 100% !important;
            max-height: none !important;
        }
    }

    :deep(.el-table) {
        --el-table-header-text-color: #ffffff;
        --el-table-text-color: #d1d5db;
        --el-table-header-bg-color: #374151;
        --el-table-bg-color: #1f2937;
        --el-table-tr-bg-color: #1f2937;
        --el-table-row-hover-bg-color: #374151;
        --el-table-border: 1px solid #52525238;
        --el-table-border-color: #52525238;
        border-radius: vw(10);
    }


    :deep(.el-pagination__total) {
        color: white;
    }

    :deep(.el-pagination__goto) {
        color: white;
    }

    .table-container-footer {
        display: flex;
        justify-content: flex-end;
        padding: 16px 0;
        background-color: #ffffff00;

        :deep(.el-pagination) {
            padding: 0;
        }
    }
}
</style>