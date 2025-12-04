<template>
  <el-sub-menu v-if="Array.isArray(items?.child) && items.child.length !== 0" :index="items.name">
    <template #title>
      <span>{{ items.name }}</span>
    </template>
    <template v-for="item in items.child" :key="item.name">
      <!-- <menu-item v-if="Array.isArray(item?.child) && item.children.length !== 0" :items="item" /> -->
      <el-menu-item :index="item.name" @click="handleTo(item)">
        <template #title>
          <i class="iconfont-1"></i>
          <span>{{ item?.name || '--' }}</span>
        </template>
      </el-menu-item>
    </template>
  </el-sub-menu>
    <el-menu-item v-else :index="items.name" @click="handleTo(items)">
    <template #title>
      <span>{{ items?.name || '--'}}</span>
    </template>
  </el-menu-item>
</template>
<script setup>
import { useRouter } from 'vue-router';
const router = useRouter()

defineOptions({
  name: 'MenuItem',
});
const props = defineProps({
  items: {
    type: Object,
    required: true
  }
})

function handleTo(row) {
  if (row.path) {
    router.push(row.path)
  }
}


</script>
<style lang="scss" scoped>
:deep(.el-sub-menu__title) {
  color: $white !important;
  border-radius: 10px;
  height: 50px;
  background-color: $base-bg !important;

  &:hover {
    background-color: $base-active !important;
  }

  :deep(.el-menu-item) {
    color: $white !important;
    border-radius: 10px;
    height: 50px;

    &:hover {
      background-color: $base-active !important;
    }
  }
}
</style>