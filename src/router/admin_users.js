const adminUserRoutes = [
    {
        path : '/admin/users',
        component : () => import('@/pages/admin_user/sub_admin_users.vue'),
        name : 'Sub Admin',
    },
    {
        path : '/admin/user/add',
        component : () => import('@/pages/admin_user/add_sub_admin_user.vue'),
        name : 'Add Sub Admin',
    },
    {
        path : '/admin/user/edit/:slack',
        component : () => import('@/pages/admin_user/add_sub_admin_user.vue'),
        name : 'Edit Sub Admin',
    },
    {
        path : '/admin/user/:slack',
        component : () => import('@/pages/admin_user/view_sub_admin_user.vue'),
        name : 'View Sub Admin',
    },
    
];

export default adminUserRoutes;