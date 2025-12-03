export const REQUEST_BASE_URL = import.meta.env.PUBLIC_BASE_URL;

export const arr = [
    {
        name: '系统管理',
        child: [
            { name: '用户管理',path:'/user' },
            { name: '角色权限',path:'/role'  },
        ]
    },
    {
        name: '业务管理',
        child: [
            { name: '流域管理',path:'/watershed'  },
            { name: '算法管理',path:'/algorithm'  },
        ]
    },
    {
        name: '数据中心',
        child: [
            { name: '数据查询',path:'/date'  },
            { name: '监控任务',path:'/monitoring'  },
        ]
    },
]