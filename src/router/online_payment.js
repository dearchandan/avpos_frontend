const onlinePaymentRoutes = [
    {
        path : '/online_payment/:id/:slack',
        component : () => import('@/pages/online_payment.vue'),
        name : 'Online Payment',
        meta : {},
    },
    {
        path : '/online_payment/moyasar_status',
        component : () => import('@/pages/moyasar_status.vue'),
        name : 'Moyasar Status',
        meta : {},
    },
    
];

export default onlinePaymentRoutes;