<template>
  <el-tooltip v-bind="$attrs" :popper-style="`white-space: pre-wrap;`" :disabled="!isEllipsis">
    <span :class="['overflow-tooltip', bClass]" ref="ellipsisSpanRef">{{ $attrs?.content }}</span>
  </el-tooltip>
</template>
<script setup>
import { onMounted, ref, useTemplateRef, watch } from 'vue';
import { useElementSize, useDebounceFn } from '@vueuse/core';

defineProps({
  bClass: {
    type: String,
    default: '',
  },
});
const ellipsisSpanRef = useTemplateRef('ellipsisSpanRef');
const { promise, resolve } = Promise.withResolvers();
const { width, height } = useElementSize(ellipsisSpanRef);
const isEllipsis = ref(false);
const checkEllipsis = useDebounceFn(async () => {
  await promise;
  isEllipsis.value = ellipsisSpanRef.value?.scrollWidth > ellipsisSpanRef.value?.clientWidth;
}, 1000);

onMounted(resolve);
watch([width, height], checkEllipsis, { immediate: true });
</script>
<style lang="scss" scoped>
.overflow-tooltip {
  display: inline-block;
  max-width: 100%;
  font-size: inherit;
  line-height: 1.2;
  @include ellipsis;
}
</style>
