<template>
  <div class="navTitleName">
    <h3>灾害预警平台</h3>
  </div>
  <div class="navContent">
    <el-menu ref="elMenuRef"
     class="el-menu-vertical-demo"
     @open="handleMenuExpand"
     @close="handleMenuExpand"
     :style="`--active-offset-duration: ${menusOffsetDuration}s; --active-offset-y: ${menusOffsetY}px; --active-offset-color: ${menusOffsetColor};`"
     >
      <el-menu-item :index="0" @click="handleTo(items)">
        <template #title>
          <span>首页</span>
        </template>
      </el-menu-item>
      <meum-item v-for="(row, index) in navList" :items="row" :key="index"></meum-item>
    </el-menu>
  </div>
</template>
<script setup>
import { computed, defineAsyncComponent, useTemplateRef, watch, ref, nextTick } from 'vue';
import { arr } from '@config/config.js';
import { useRouter } from 'vue-router';
const meumItem = defineAsyncComponent(() => import("@views/Layout/MeunItem.vue"))
import { useDebounceFn } from '@vueuse/core';


const navList = computed(() => {
  return arr
})
const router = useRouter()
const activeMenu = computed(() => router.currentRoute.value?.meta?.activeName || router.currentRoute.value?.name)
const elMenuRef = useTemplateRef('elMenuRef')
const menusOffsetY = ref(-100);
const menusOffsetDuration = ref(0);
const menusOffsetColor = ref('#216ff6');
const openMenuItemsTimeOut = useDebounceFn(openMenuItems, 500);
const checkMenuActiveTimeOut = useDebounceFn(checkMenuActive, 500);
function handleMenuExpand() {

}

async function checkMenuActive(position = false) {
  await nextTick();
  const items = elMenuRef.value?.$el?.getElementsByClassName?.('is-active');
  const itemsLength = items?.length;
  let offsetTop = 0;

  if (itemsLength) {
    let h = 0;

    for (let i = 0; i < itemsLength; i++) {
      const currentDom = items?.[i];

      offsetTop += currentDom?.offsetTop || 0;
      h = currentDom?.clientHeight || 0;
      if (currentDom?.getAttribute?.('aria-expanded') !== null) {
        hideActive.value = currentDom.getAttribute('aria-expanded') === 'false';
      }
    }
    offsetTop += h;
  }
  menusOffsetY.value = offsetTop;
  position &&
    scrollbarRef.value?.scrollTo?.({
      top: offsetTop - (layoutAsideContentRef.value?.clientHeight || 0) / 2,
      behavior: 'smooth',
    });
  setTimeout(() => {
    menusOffsetColor.value = '#216ff6';
  }, 300);
}

async function openMenuItems(checkMenu = false) {
  await nextTick();
  elMenuRef.value?.updateActiveIndex?.(activeMenu.value);
  navList.value?.forEach?.(({ name } = {}) => {
    elMenuRef.value?.open?.(name);
  });
  checkMenu && checkMenuActiveTimeOut(true);
}

function handleMenuSelect() {
  menusOffsetDuration.value = 0.3;
  hideActive.value = false;
  menusOffsetColor.value = 'transparent';
  checkMenuActive();
}

function handleTo() {
  router.push('/home')
}

watch(activeMenu, async (v) => {
  await nextTick();
  elMenuRef.value?.updateActiveIndex?.(v);
  handleMenuSelect();
});

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

    .el-menu {
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