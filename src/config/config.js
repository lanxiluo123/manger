export const REQUEST_BASE_URL = import.meta.env.PUBLIC_BASE_URL;

export const arr = [
    {
        name: '首页',
        child: [
            {
                name: '首页', path: '/home',
            },
        ]
    },
    {
        name: '系统管理',
        child: [
            { name: '用户管理', path: '/user' },
            { name: '角色管理', path: '/role' },
        ]
    },
    {
        name: '业务管理',
        child: [
            { name: '流域管理', path: '/watershed' },
            { name: '算法管理', path: '/algorithm' },
        ]
    },
    {
        name: '数据中心',
        child: [
            { name: '数据管理', path: '/date' },
            { name: '监控任务', path: '/monitoring' },
        ]
    },

]