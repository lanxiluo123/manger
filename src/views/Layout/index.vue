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
import { ref, useTemplateRef,computed } from 'vue';
import Title from '@views/Layout/title.vue'
import Nav from '@views/Layout/nav.vue'
import { useElementSize } from '@vueuse/core';
import { layoutSize } from '@views/utils/common';
import { OFFSET_LARGE_BASE } from '@config';
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
    }
  }
}
</style>