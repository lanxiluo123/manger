<template>
  <div class="title">
    <h5>{{ routerName }}</h5>
    <div style="display: flex;align-items: center;">
      <el-dropdown>
        <div class="username">
          <el-avatar :size="25" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
          <span>{{ userName }}</span>
        </div>
        <template #dropdown>
          <el-dropdown-item @click="LoginOut">退出登录</el-dropdown-item>
        </template>
      </el-dropdown>
      <div class="screen">
        <el-button type="primary" size="mini" @click="routerTo"><i class="iconfont icon-setting"></i>前台</el-button>
      </div>

    </div>
  </div>
</template>
<script setup>
import { computed, ref } from 'vue';
import { useRouter ,useRoute } from 'vue-router';





const router = useRouter()
const route = ref(useRoute()) 

const routerName = computed(() => {
  return route.value?.meta?.title
})

const userName = computed(() => {
  return sessionStorage.getItem('username')
})


function routerTo() {
  router.push('/viewer')
}

function LoginOut() {
  router.push('/login')
}
</script>
<style lang="scss" scoped>
.title {
  width: 100%;
  height: 60px;
  background-color: $base-bg;
  color: $white;
  display: flex;
  padding: 0 $paddingwidth;
  box-sizing: border-box;
  align-items: center;
  justify-content: space-between;
  --tw-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --tw-shadow-colored: 0 4px 6px -1px var(--tw-shadow-color),
    0 2px 4px -2px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000),
    var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);

  .username {
    display: flex;
    align-items: center;
     margin-right: vw(20);
    span {
      margin-left: 5px;
      font-size: 11px;
    }
  }

  .screen {
    margin-right: vw(20);
  }
}
</style>