const subscriptionRoutes = [
    {
        path : '/subscriptions',
        component : () => import('@/pages/setting/subscription/subscriptions.vue'),
        name : 'Subscriptions',
        meta : {
            key : 'SM_SUBSCRIPTION',
            authRequired : true,
        },
    },
    {
        path : '/my_orders',
        component : () => import('@/pages/setting/subscription/my_orders.vue'),
        name : 'My Orders',
        meta : {
            key : 'SM_SUBSCRIPTION',
            authRequired : true,
        },
    },
];

export default subscriptionRoutes;