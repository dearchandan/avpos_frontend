const userRoutes = [
    {
        path : '/users',
        component : () => import('@/pages/manage/user/users.vue'),
        name : 'User',
        meta : {
            key : 'SM_USER',
            authRequired : true,
        },
    },
    {
        path : '/user/add',
        component : () => import('@/pages/manage/user/add_user.vue'),
        name : 'Add User',
        meta : {
            key : 'A_WRITE_USER',
            authRequired : true,
        },
    },
    {
        path : '/user/edit/:slack',
        component : () => import('@/pages/manage/user/add_user.vue'),
        name : 'Edit User',
        meta : {
            key : 'A_WRITE_USER',
            authRequired : true,
        },
    },
    {
        path : '/user/:slack',
        component : () => import('@/pages/manage/user/view_user.vue'),
        name : 'View User',
        meta : {
            key : 'A_READ_USER',
            authRequired : true,
        },
    },
    {
        path : '/verify/:token',
        component : () => import('@/pages/manage/user/verify.vue'),
        name : 'Verify',
        meta : {
            authRequired : false,
        },
    },
];

export default userRoutes;