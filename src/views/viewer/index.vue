<template>
  <div class="ce-map" v-loading="loading">
    <div class="ce-map-viewer" ref="ceMapViewerRef"></div>
    <div class="ce-map-title">
      <div class="ce-map-title-left">
        <h3>山区灾害风险预警与防控平台</h3>
        <span>Disaster Risk Warning and Prevention Platform</span>
      </div>
      <div class="ce-map-title-right">
        <span>当前流域:<span class="riverName">{{riverName}}</span></span>
        <div class="username">
          <el-avatar :size="25" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
          <span>{{userName}}</span>
        </div>
        <el-button type="primary" @click="routerTo"><i class="iconfont icon-setting"></i>管理后台</el-button>
      </div>
    </div>
    <aside-box></aside-box>
  </div>
</template>
<script setup>
//import
import { defineAsyncComponent, onMounted, ref, useTemplateRef } from 'vue';
import { createViewer, disposeViewer, resetNorth, toCenter, moveForward, moveBackward } from './utils';
const { promise, resolve } = Promise.withResolvers();
const asideBox = defineAsyncComponent(() => import('@views/viewer/aside.vue'))
import { useRouter } from 'vue-router';
import { DrawingTool } from './Handler'

//const
const router = useRouter()
const loading = ref(false)
let viewer = null
const ceMapViewerRef = useTemplateRef('ceMapViewerRef');
const riverName = ref('长江流域')
const name = sessionStorage.getItem('username') || ''
const userName = ref(name)
let HandlerDraw = null

//function
function routerTo() {
  router.push('/')
}
onMounted(async () => {
  loading.value = true
  viewer = await createViewer(ceMapViewerRef.value);
  loading.value = false;
  resolve(viewer);
  HandlerDraw = new DrawingTool(viewer)
})

</script>
<style lang="scss" scoped>
.ce-map {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  &-viewer {
    position: relative;
    width: 100%;
    height: 100%;
  }
  &-title {
    width: 100vw;
    height: vh(70);
    background-color: $base-bg;
    position: absolute;
    top: 0;
    z-index: 1;
    display: flex;
    justify-content: space-between;
    &-left {
      color: $white;
      height: 100%;
      width: vw(300);
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: center;
      padding-left: vw(30);
      box-sizing: border-box;
      h3 {
        margin: 0;
      }
      span {
        font-size: vh(11);
      }
    }
    &-right {
      color: $white;
      height: 100%;
      width: vw(350);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-right: vw(30);
      box-sizing: border-box;
      font-size: vh(12);
      .riverName {
        font-size: vh(14);
        color: rgb(0, 208, 255);
        margin-left: vw(5);
      }
      .username {
        display: flex;
        align-items: center;
        span {
          margin-left: vw(5);
        }
      }
    }
  }
}
</style>