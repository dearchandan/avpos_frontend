const dashboardRoutes = [
    {
        path : '/dashboard',
        component : () => import('@/pages/dashboard.vue'),
        name : 'Dashboard',
        meta : {
            key : 'MM_DASHBOARD',
            authRequired : true,
        },
    },
    {
        path : '/admin/dashboard',
        component : () => import('@/pages/admin_dashboard.vue'),
        name : 'Admin Dashboard',
        meta : {
            authRequired : true,
        },
    },
    
];

export default dashboardRoutes;