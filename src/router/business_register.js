const businessRegisterRoutes = [
    {
        path : '/business_registers',
        component : () => import('@/pages/business/business_register/business_registers.vue'),
        name : 'business_registers',
        meta : {
            key : 'SM_BUSINESS_REGISTER',
            authRequired : true,
        },
    },
    
];

export default businessRegisterRoutes;