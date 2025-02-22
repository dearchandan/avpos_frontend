const roleRoutes = [
    {
        path : '/roles',
        component : () => import('@/pages/setting/role/roles.vue'),
        name : 'Roles',
        meta : {
            key : 'SM_ROLE',
            authRequired : true,
        },
    },
    {
        path : '/role/:slack',
        component : () => import('@/pages/setting/role/view_role.vue'),
        name : 'View Role',
        meta : {
            key : 'A_READ_ROLE',
            authRequired : true,
        },
    },
    
];

export default roleRoutes;