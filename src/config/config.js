
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


export const KEYTYPEOPTIONS = [
    {
        name: '数值型',
        Value: ""
    },
    {
        name: '文本型',
        Value: ""
    },
    {
        name: '枚举型',
        Value: ""
    },
    {
        name: '布尔型',
        Value: ""
    },
    {
        name: '文件选择',
        Value: ""
    },
]