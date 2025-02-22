const multiplePriceRoutes = [
    {
        path : '/multiple_prices',
        component : () => import('@/pages/manage/multiple_price/multiple_prices.vue'),
        name : 'Multiple Price',
        meta : {
            key : 'SM_MULTIPLE_PRICE',
            authRequired : true,
        },
    },
    {
        path : '/multiple_price/add',
        component : () => import('@/pages/manage/multiple_price/add_multiple_price.vue'),
        name : 'Add Multiple Price',
        meta : {
            key : 'A_WRITE_MULTIPLE_PRICE',
            authRequired : true,
        },
    },
    {
        path : '/multiple_price/edit/:slack',
        component : () => import('@/pages/manage/multiple_price/add_multiple_price.vue'),
        name : 'Edit Multiple Price',
        meta : {
            key : 'A_WRITE_MULTIPLE_PRICE',
            authRequired : true,
        },
    },
    
];

export default multiplePriceRoutes;