const merchantRoutes = [
    {
        path : '/merchants',
        component : () => import('@/pages/merchant/merchants.vue'),
        name : 'Merchant',
        meta : {
            key : 'SM_MERCHANT',
            authRequired : true,
        },
    },
    {
        path : '/merchant/add',
        component : () => import('@/pages/merchant/add_merchant.vue'),
        name : 'Add Merchant',
        meta : {
            key : 'A_WRITE_MERCHANT',
            authRequired : true,
        },
    },
    {
        path : '/merchant/edit/:slack',
        component : () => import('@/pages/merchant/add_merchant.vue'),
        name : 'Edit Merchant',
        meta : {
            key : 'A_WRITE_MERCHANT',
            authRequired : true,
        },
    },
    {
        path : '/merchant/:slack',
        component : () => import('@/pages/merchant/view_merchant.vue'),
        name : 'View Merchant',
        meta : {
            key : 'A_READ_MERCHANT',
            authRequired : true,
        },
    },
    {
        path : '/merchant/subscription/:slack',
        component : () => import('@/pages/merchant/view_merchant_subscription.vue'),
        name : 'View Merchant Subscription',
        meta : {
            key : 'A_READ_MERCHANT',
            authRequired : true,
        },
    },
    
];

export default merchantRoutes;