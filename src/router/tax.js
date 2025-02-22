const taxRoutes = [
    {
        path : '/taxes',
        component : () => import('@/pages/setting/taxes.vue'),
        name : 'Taxes',
        meta : {
            key : 'SM_TAX',
            key1 : 'SM_ADMIN_TAX',
            authRequired : true,
        },
    },
    
];

export default taxRoutes;