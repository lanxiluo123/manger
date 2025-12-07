<template>
    <div class="grid-layout" :class="customClass" :style="gridStyle">
        <slot name="content"></slot>
    </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    // 列数
    columns: {
        type: [Number, String],
        default: 3
    },
    // 间距
    gap: {
        type: [Number, String],
        default: 16
    },
    // 自适应列宽（设为true时会忽略columns）
    autoFit: {
        type: Boolean,
        default: false
    },
    // 最小列宽（autoFit为true时生效）
    minWidth: {
        type: [Number, String],
        default: '250px'
    },
    // 自定义类名
    customClass: {
        type: String,
        default: ''
    }
})

// 计算网格样式
const gridStyle = computed(() => {
    const style = {}
    
    if (props.autoFit) {
        // 自适应布局：自动填充，最小列宽为 minWidth
        style.gridTemplateColumns = `repeat(auto-fill, minmax(${props.minWidth}, 1fr))`
    } else {
        // 固定列数布局
        style.gridTemplateColumns = `repeat(${props.columns}, 1fr)`
    }
    
    // 间距
    style.gap = typeof props.gap === 'number' ? `${props.gap}px` : props.gap
    
    return style
})
</script>

<style lang="scss" scoped>
.grid-layout {
    display: grid;
    width: 100%;
    padding: 0 vw(20);
    box-sizing: border-box;
    
    // 子项通用样式
    & > * {
        min-width: 0; // 防止内容溢出
    }
}

// 响应式：小屏幕自动调整
@media (max-width: 768px) {
    .grid-layout:not(.no-responsive) {
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)) !important;
        gap: 12px !important;
    }
}

@media (max-width: 480px) {
    .grid-layout:not(.no-responsive) {
        grid-template-columns: 1fr !important;
        gap: 8px !important;
    }
}
</style>