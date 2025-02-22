const terminalRoutes = [
    {
        path : '/terminals',
        component : () => import('@/pages/manage/terminal/terminals.vue'),
        name : 'Terminal',
        meta : {
            key : 'SM_TERMINAL',
            authRequired : true,
        },
    },
    {
        path : '/terminal/add',
        component : () => import('@/pages/manage/terminal/add_terminal.vue'),
        name : 'Add Terminal',
        meta : {
            key : 'A_WRITE_TERMINAL',
            authRequired : true,
        },
    },
    {
        path : '/terminal/edit/:slack',
        component : () => import('@/pages/manage/terminal/add_terminal.vue'),
        name : 'Edit Terminal',
        meta : {
            key : 'A_WRITE_TERMINAL',
            authRequired : true,
        },
    },
    {
        path : '/terminal/:slack',
        component : () => import('@/pages/manage/terminal/view_terminal.vue'),
        name : 'View Terminal',
        meta : {
            key : 'A_READ_TERMINAL',
            authRequired : true,
        },
    },
    
];

export default terminalRoutes;