const adminRoleRoutes = [
    {
        path : '/admin/roles',
        component : () => import('@/pages/admin_role/admin_roles.vue'),
        name : 'Admin Roles',
    },
    {
        path : '/admin/role/:slack',
        component : () => import('@/pages/admin_role/view_admin_role.vue'),
        name : 'View Admin Role',
    },
    
];

export default adminRoleRoutes;