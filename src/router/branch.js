const branchRoutes = [
    {
        path : '/branches',
        component : () => import('@/pages/manage/branch/branches.vue'),
        name : 'Branches',
        meta : {
            key : 'SM_BRANCH',
            authRequired : true,
        },
    },
    {
        path : '/branch/add',
        component : () => import('@/pages/manage/branch/add_branch.vue'),
        name : 'Add Branch',
        meta : {
            key : 'A_WRITE_BRANCH',
            authRequired : true,
        },
    },
    {
        path : '/branch/edit/:slack',
        component : () => import('@/pages/manage/branch/add_branch.vue'),
        name : 'Edit Branch',
        meta : {
            key : 'A_WRITE_BRANCH',
            authRequired : true,
        },
    },
    {
        path : '/branch/:slack',
        component : () => import('@/pages/manage/branch/view_branch.vue'),
        name : 'View Branch',
        meta : {
            key : 'A_READ_BRANCH',
            authRequired : true,
        },
    },
    
];

export default branchRoutes;