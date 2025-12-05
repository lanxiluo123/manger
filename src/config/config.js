
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
            { name: '数据类型管理', path: '/date' },
            { name: '数据查询', path: '/datep' },
            { name: '监控任务', path: '/monitoring' },
        ]
    },

]

export const PAGE_SIZE_OPTIONS = [20, 60, 100, 200];
export const ALL_PAGE_SIZE = 100000;

export const OFFSET_BASE = 8;
export const OFFSET_MIDDLE_BASE = 12;
export const OFFSET_LARGE_BASE = 16;