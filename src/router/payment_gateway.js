const cdsRoutes = [
    {
        path : '/payment_gateway',
        component : () => import('@/pages/setting/payment_gateway.vue'),
        name : 'Payment Gateway',
        meta : {
            key : 'SM_PAYMENT_GATEWAY',
            authRequired : true,
        },
    },
    
];

export default cdsRoutes;