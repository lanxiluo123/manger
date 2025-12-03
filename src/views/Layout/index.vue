<template>
  <div class="layout">
    <div class="layout-left">
      <Nav />
    </div>
    <div class="layout-content">
      <Title></Title>
      <div class="layout-content-routerConten">
        <router-view />
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue';
import Title from '@views/Layout/title.vue'
import Nav from '@views/Layout/nav.vue'
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