const adminAccountRoutes = [
    {
        path : '/admin/accounts',
        component : () =>import('@/pages/admin_account/admin_accounts.vue'),
        name : 'Admin Accounts',
    },
    
];

export default adminAccountRoutes;