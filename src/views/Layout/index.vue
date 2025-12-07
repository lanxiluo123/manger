<template>
  <div class="layout">
    <div class="layout-left">
      <Nav />
    </div>
    <div class="layout-content">
      <Title></Title>
      <div class="layout-content-routerConten" ref="layoutContentRef">
        <router-view />
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, useTemplateRef, computed } from 'vue';
import Title from '@views/Layout/title.vue'
import Nav from '@views/Layout/nav.vue'
import { useElementSize } from '@vueuse/core';
import { layoutSize } from '@views/utils/common';
import { OFFSET_LARGE_BASE } from '@config/config.js';
const layoutContentRef = useTemplateRef('layoutContentRef')
const { width, height } = useElementSize(layoutContentRef);

layoutSize.width = width;
layoutSize.height = height;
layoutSize.innerWidth = computed(() => width.value - OFFSET_LARGE_BASE * 2);
layoutSize.innerHeight = computed(() => height.value - OFFSET_LARGE_BASE * 2);

</script>
<style lang="scss" scoped>
.layout {
  width: 100vw;
  height: 100vh;
  background-color: $base-bg;
  display: flex;

  &-left {
    width: $nav-width;
    height: 100%;
    background-color: $base-bg;
    padding: 0 10px;
    box-sizing: border-box;
  }

  &-content {
    width: calc(100vw - $nav-width);
    height: 100%;

    &-routerConten {
      width: 100%;
      height: calc(100vh - 60px);
      padding: $paddingwidth;
      box-sizing: border-box;

      :deep(.el-dialog) {
        --el-dialog-bg-color: #1f2937;
      }

      :deep(.el-dialog__title) {
        color: white;
      }

      :deep(.el-form-item__label) {
        color: #e5e7eb;
      }

      :deep(.el-select__wrapper) {
        background-color: #374151;
        box-shadow: 0 0 0 1px #374151 inset;
        color: #e5e7eb;
      }



      :deep(.el-input__wrapper) {
        background-color: #374151;
        box-shadow: 0 0 0 1px #374151 inset;
      }


      :deep(.el-input__inner) {
        color: #e5e7eb;
      }

      :deep(.el-select__placeholder) {
        color: #e5e7eb;
      }

      :deep(.el-textarea__inner) {
        background-color: #374151;
        box-shadow: 0 0 0 1px #374151 inset;
        color: #e5e7eb;
      }

      :deep(.el-collapse) {
        --el-collapse-header-bg-color: #374151;
        --el-collapse-border-color:#1f2937;
        --el-collapse-content-bg-color:#1f2937;
        --el-collapse-header-text-color:#e5e7eb;
      }

      :deep(.el-collapse-item__title){
        padding: 0 vw(10);
        box-sizing: border-box;
        font-size: vh(18);
      }

    }
  }
}
</style>