<template>
  <div class="aside">
    <div class="aside-title">
      <div class="aside-title-left">
        <i class="iconfont icon-liuyu"></i>
        <h3>流域导航</h3>
      </div>
      <i class="iconfont icon-arrow-right"></i>
    </div>
    <div class="aside-content">
      <div class="aside-content-choose">
        <el-input v-model="inputName" style="width: 100%" placeholder="搜索流域...">
          <template #prepend> <i class="iconfont icon-dingwei"></i></template>
        </el-input>
      </div>
      <div class="aside-content-rives">
        <el-scrollbar>

        </el-scrollbar>
      </div>

    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue';

const inputName = ref('')
</script>
<style lang="scss" scoped>
.aside {
  width: vw(350);
  height: calc(100vh - vh(120));
  background-color: $base-bg;
  position: absolute;
  top: vh(100);
  left: vw(20);
  border-radius: vw(10);
  &-title {
    width: 100%;
    height: vh(50);
    background: linear-gradient(
      135deg,
      rgba(37, 99, 235, 0.2),
      rgba(59, 130, 246, 0.1)
    );
    border-bottom: 1px solid rgba(59, 130, 246, 0.3);
    border-top-left-radius: vw(15);
    border-top-right-radius: vw(15);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: vw(20);
    box-sizing: border-box;
    color: $white;
    &-left {
      display: flex;
      align-items: center;
      h3 {
        margin-left: vw(10);
      }
      .iconfont {
        color: rgb(0, 208, 255);
      }
    }
    .iconfont {
      margin-top: vw(1);
      font-size: vh(20);
      transform: rotate(180deg);
      cursor: pointer;
    }
  }
  &-content {
    width: vw(350);
    height: calc(100% - vh(50));
    &-choose {
      height: vh(40);
      widows: 100%;
      padding: vw(20);
      box-sizing: border-box;
      :deep(.el-input) {
        --el-input-bg-color: #1f2937;
        --el-input-border-color: #1f2937;
        --el-input-hover-border-color: #1f2937;
        --el-input-focus-border-color: #1f2937;
        --el-input-text-color: white;
        height: vh(40);
        border-radius: vh(10);
      }
      :deep(.el-input-group__prepend) {
        background-color: #1f2937;
        padding: 0 vw(10);
      }
    }
    &-rives {
      margin-top: vh(10);
      height: calc(100% - vh(60));
    }
  }
}
</style>