const accountRoutes = [
    {
        path : '/accounts',
        component : () =>import('@/pages/business/account/accounts.vue'),
        name : 'Accounts',
        meta : {
            key : 'SM_ACCOUNT',
            authRequired : true,
        },
    },
    
];

export default accountRoutes;