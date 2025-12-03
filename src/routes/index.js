import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        //主页
        {
            path: '/',
            component: () => import(/* webpackChunkName: "layout" */ '@views/Layout/index.vue'),
            meta: { requiresAuth: true },
            redirect: '/home', // 可选：默认重定向到首页
            children: [
                {
                    path: 'home',
                    name: 'home',
                    component: () => import(/* webpackChunkName: "home" */ '@views/Home/index.vue'),
                    meta: { title: '首页' }
                },
                {
                    path: 'user',
                    name: 'user',
                    component: () => import(/* webpackChunkName: "home" */ '@views/User/index.vue'),
                    meta: { title: '用户管理' }
                },

                {
                    path: 'role',
                    name: 'role',
                    component: () => import(/* webpackChunkName: "home" */ '@views/Role/index.vue'),
                    meta: { title: '角色管理' }
                },
                {
                    path: 'watershed',
                    name: 'watershed',
                    component: () => import(/* webpackChunkName: "home" */ '@views/Watershed/index.vue'),
                    meta: { title: '流域管理' }
                },
                {
                    path: 'algorithm',
                    name: 'algorithm',
                    component: () => import(/* webpackChunkName: "home" */ '@views/Algorithm/index.vue'),
                    meta: { title: '算法管理' }
                },
                {
                    path: 'date',
                    name: 'date',
                    component: () => import(/* webpackChunkName: "home" */ '@views/Date/index.vue'),
                    meta: { title: '数据管理' }
                },
                {
                    path: 'monitoring',
                    name: 'monitoring',
                    component: () => import(/* webpackChunkName: "home" */ '@views/Monitoring/index.vue'),
                    meta: { title: '监控任务' }
                },
            ]
        },
        // 登录
        {
            path: '/login',
            name: 'Login',
            component: () => import(/* webpackChunkName: "login" */ '@views/Login.vue'),
            meta: {},
        },
        {
            path: '/viewer',
            name: 'viewer',
            component: () => import(/* webpackChunkName: "login" */ '@views/viewer/index.vue'),
            meta: {},
        }

    ]
})

export default router