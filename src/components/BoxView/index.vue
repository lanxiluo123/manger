<template>
    <div class="box_container">
        <slot></slot>
    </div>
</template>
<script setup>

</script>
<style lang="scss" scoped>
.box_container {
    width: 100%;
    height: 100%;
    padding: $offset-large-base;
    @include box;
    box-sizing: border-box;
}
</style>