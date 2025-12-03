<template>
  <div class="navTitleName">
    <h3>灾害预警平台</h3>
  </div>
  <div class="navContent">
    <el-menu ref="elMenuRef" class="el-menu-vertical-demo" @open="handleMenuExpand" @close="handleMenuExpand">
      <el-menu-item :index="0" @click="handleTo(items)">
        <template #title>
          <span>首页</span>
        </template>
      </el-menu-item>
      <meum-item v-for="(row,index) in navList" :items=" row" :key="index"></meum-item>
    </el-menu>
  </div>
</template>
<script setup>
import { computed, defineAsyncComponent, useTemplateRef } from 'vue';
import { arr } from '@config/config.js';
const meumItem = defineAsyncComponent(() => import("@views/Layout/MeunItem.vue"))
const navList = computed(() => {
  return arr
})

const elMenuRef = useTemplateRef('elMenuRef')

function handleMenuExpand() {

}
</script>
<style lang="scss" scoped>
$shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
$shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
$shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
$shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
$shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
.navTitleName {
  width: 100%;
  height: 60px;
  color: $white;
  display: flex;
  align-items: center;
  justify-content: center;
}
.navContent {
  width: 100%;
  height: calc(100% - 60px);
  box-shadow: $shadow-md;
  :deep(.el-menu-vertical-demo) {
    background-color: $base-bg !important;
    border-right: none;
    padding: 0 10px;
    box-sizing: border-box;
    border-radius: 10px;
    .el-menu{
      background-color: $base-bg !important;
    }
    .el-menu-item {
      background-color: $base-bg !important;
      color: $white !important;
      height: 50px;
      &:hover {
        background-color: $base-active !important;
        border-radius: 10px;
      }
    }
  }
}
</style>