<template>
    <div class="items_box">
        <div class="items_box-title">
            {{ items?.name }}
            <!-- {{ items?. }} -->
        </div>
        <div class="items_box-version">
            <span class="type">灾害模拟</span> <span style="margin-left: 5px;">{{ items?.version }}</span>
        </div>
        <div class="items_box-version">
            {{ items?.description }}
        </div>
        <div class="items_box-version">
            {{ items?.scriptOrImagePath }}
        </div>
        <div class="items_box-version">
            <i class="iconfont icon-cut" style="margin-right: 5px;font-size: 15px;"></i> 
            输出类型:<span style="margin-left: 5px;">{{ items?.outputDataTypeId}}</span>
        </div>
        <div class="items_box-version">
            <i class="iconfont icon-icon-test1" style="margin-right: 5px;font-size: 15px;"></i>
            参数数量: <span style="margin-left: 5px;">{{ items?.paramMetas?.length }}</span>
        </div>
        <div class="items_box-footer">
            <slot name="Floot"></slot>
        </div>
    </div>
</template>
<script setup>
const props = defineProps({
    items: {
        type: Object,
    }
})
</script>

<style lang="scss" scoped>
.items_box {
    width: 100%;
    height: vh(300);
    border-radius: vw(10);
    background-color: $base-active;
    padding: vw(20);
    box-sizing: border-box;
    color: #e5e7eb;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    &-title {
        display: flex;
        justify-content: space-between;
        font-size: vh(25);
        font-weight: 600;
    }

    &-version {
        display: flex;
        align-items: center;
        font-size: vh(15);

        .type {
            padding: vw(2) vw(8);
            display: inline-block;
            background-color: #2563eb;
            border-radius: vw(5);
        }
    }

    &-path {
        font-size: vh(12);
    }

    &-footer {
        display: flex;
        justify-content: space-between;
    }
}
</style>