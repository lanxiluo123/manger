<template>
    <div class="itemDeatilsBox">
        <div class="name">
            <slot name="title"></slot>
        </div>
        <div class="content">
            <slot name="box"></slot>
        </div>
    </div>
</template>
<script setup>

</script>
<style lang="scss" scoped>
.itemDeatilsBox {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;

    .name {
        margin-bottom: vh(5);
        color: #e5e7eb;
    }

    .content {
        padding: vh(15);
        background-color: #374151;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        color: #e5e7eb;
        border-radius: vw(10);
    }
}
</style>