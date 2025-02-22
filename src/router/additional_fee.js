const additionalFeeRoutes = [
    {
        path : '/additional_fee',
        component : () => import('@/pages/setting/additional_fee.vue'),
        name : 'Additional Fee',
        meta : {
            key : 'SM_ADDITIONAL_FEE',
            key1 : 'SM_ADDITIONAL_FEE',
            authRequired : true,
        },
    },
    
];

export default additionalFeeRoutes;