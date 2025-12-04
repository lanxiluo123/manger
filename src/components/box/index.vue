<template>
    <div class="boxView">
        <div class="boxView-title">
            <slot name="title"></slot>
            <slot name="btn"></slot>
        </div>
        <div class="boxView-content">
            <slot name="content">
                
            </slot>
        </div>
    </div>
</template>

<script setup>

</script>
<style lang="scss" scoped>
.boxView{
    width: 100%;
    height: 100%;
    &-title{
        width: 100%;
        height: vh(50);
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: white;
    }
    &-content{
        width: 100%;
        margin-top: vh(10);
        height: calc(100% - vh(60));
    }
}
</style>