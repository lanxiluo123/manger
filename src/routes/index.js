import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        // 登录
        {
            path: '/login',
            name: 'Login',
            // component: () => import(/* webpackChunkName: "login" */ '@views/Login.vue'),
            meta: {
                rollType: ROLE_TYPE_OPTIONS_ENUM.PlatformRole,
            }, 
        },
    ]
})  

export default router