<template>
  <div class="navTitleName">
    <h3>灾害预警平台</h3>
  </div>
  <div class="navContent" ref="navContentRef">
    <el-scrollbar ref="scrollbarRef" height="calc(100% - 60px)">
      <el-menu ref="elMenuRef"
        :class="['el-menu-vertical-demo', hideActive ? 'hide-active' : '']" 
        @open="handleMenuExpand"
        @close="handleMenuExpand" 
        :default-active="activeMenu" 
        :default-openeds="openedMenus"
        :style="`--active-offset-duration: ${menusOffsetDuration}s; --active-offset-y: ${menusOffsetY}px; --active-offset-color: ${menusOffsetColor};`">
        <meum-item v-for="(row, index) in navList" :items="row" :key="index" @sendName="handleChildMenuClick" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script setup>
import { computed, defineAsyncComponent, useTemplateRef, watch, ref, nextTick } from 'vue';
import { arr } from '@config/config.js';
import { useRouter, useRoute } from 'vue-router';
import { useDebounceFn } from '@vueuse/core';

const meumItem = defineAsyncComponent(() => import("@views/Layout/MeunItem.vue"))

const router = useRouter()
const route = useRoute()
const navList = computed(() => arr)

// ref引用
const elMenuRef = useTemplateRef('elMenuRef')
const scrollbarRef = useTemplateRef('scrollbarRef')
const navContentRef = useTemplateRef('navContentRef')

// 状态
const menusOffsetY = ref(-100)
const menusOffsetDuration = ref(0)
const menusOffsetColor = ref('#216ff6')
const hideActive = ref(false)

// 计算属性
const activeMenu = computed(() => {
  return route.meta?.title
})

const openedMenus = computed(() => {
  return navList.value?.map(item => item.name) || []
})

// 防抖函数
const openMenuItemsTimeOut = useDebounceFn(openMenuItems, 300)
const checkMenuActiveTimeOut = useDebounceFn(checkMenuActive, 300)

// 菜单展开/折叠处理
function handleMenuExpand() {
  menusOffsetDuration.value = 0
  hideActive.value = true
  checkMenuActiveTimeOut()
}

// 菜单选择处理
function handleMenuSelect() {
  menusOffsetDuration.value = 0.3
  hideActive.value = false
  menusOffsetColor.value = 'transparent'
  checkMenuActiveTimeOut()
}

// 子菜单点击处理
function handleChildMenuClick() {
  nextTick(() => {
    handleMenuSelect()
  })
}

// 检查激活菜单位置
async function checkMenuActive(position = false) {
  await nextTick()
  const items = elMenuRef.value?.$el?.getElementsByClassName?.('is-active')
  const itemsLength = items?.length
  let offsetTop = 0

  if (itemsLength) {
    let h = 0
    for (let i = 0; i < itemsLength; i++) {
      const currentDom = items?.[i]
      offsetTop += currentDom?.offsetTop || 0
      h = currentDom?.clientHeight || 0
    }
    offsetTop += h
  }

  menusOffsetY.value = offsetTop

  // 如果需要定位且滚动容器存在
  if (position && scrollbarRef.value && navContentRef.value) {
    const containerHeight = navContentRef.value.clientHeight
    scrollbarRef.value.scrollTo({
      top: Math.max(0, offsetTop - containerHeight / 2),
      behavior: 'smooth'
    })
  }

  // 延迟恢复颜色
  setTimeout(() => {
    menusOffsetColor.value = '#216ff6'
  }, 300)
}

// 打开菜单项
async function openMenuItems(checkMenu = false) {
  await nextTick()
  // 打开默认展开的菜单
  if (openedMenus.value.length > 0) {
    openedMenus.value.forEach(name => {
      elMenuRef.value?.open?.(name)
    })
  }

  if (checkMenu) {
    checkMenuActiveTimeOut()
  }
}

// 监听路由变化
watch(() => route.meta?.title, async (newPath) => {
  await nextTick()
  handleMenuSelect()
})

// 监听菜单数据变化
watch(navList, () => {
  nextTick(() => {
    openMenuItemsTimeOut(true)
  })
}, { immediate: true })
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

  h3 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
  }
}

.navContent {
  width: 100%;
  height: calc(100% - 60px);
  box-shadow: $shadow-md;
  border-radius: 10px;
  overflow: hidden;

  :deep(.el-menu-vertical-demo) {
    background-color: $base-bg !important;
    border-right: none;
    padding: 0 10px;
    box-sizing: border-box;
    position: relative;
    min-height: 100%;

    // 激活指示器
    &::after {
      content: '';
      position: absolute;
      left: 10px;
      top: 0;
      width: calc(100% - 20px);
      height: 50px;
      border-radius: 10px;
      background-color: $base-active;
      transform: translate(0, var(--active-offset-y, -100px));
      transition: transform var(--active-offset-duration, 0.3s) ease-out;
      z-index: 0;
      pointer-events: none;
    }

    &.hide-active::after {
      display: none;
    }

    .el-menu {
      background-color: $base-bg !important;
    }

    .el-menu-item {
      position: relative;
      z-index: 1;
      background-color: $base-bg !important;
      color: $white !important;
      height: 50px;
      margin: 4px 0;
      border-radius: 10px;

      &:hover {
        background-color: $base-active !important;
      }

      &.is-active {
        color: #ffffff !important;
        background-color: transparent !important;
      }
    }

    // 子菜单样式
    :deep(.el-sub-menu) {
      position: relative;
      z-index: 1;

      &.is-active {
        >.el-sub-menu__title {
          color: #ffffff !important;
        }
      }

      .el-sub-menu__title {
        background-color: $base-bg !important;
        color: $white !important;
        height: 50px;
        margin: 4px 0;
        border-radius: 10px;

        &:hover {
          background-color: $base-active !important;
        }
      }

      .el-menu-item {
        background-color: $base-bg !important;

        &:hover {
          background-color: $base-active !important;
        }

        &.is-active {
          color: #ffffff !important;
          background-color: var(--active-offset-color, transparent) !important;
        }
      }
    }

    // 滚动条样式
    :deep(.el-scrollbar__bar) {
      &.is-vertical {
        width: 6px;
      }

      .el-scrollbar__thumb {
        background-color: rgba(255, 255, 255, 0.3);
        border-radius: 3px;

        &:hover {
          background-color: rgba(255, 255, 255, 0.5);
        }
      }
    }
  }
}
</style>