const measurementRoutes = [
    {
        path : '/measurements',
        component : () => import('@/pages/setting/measurements.vue'),
        name : 'Measurement',
        meta : {
            key : 'SM_MEASUREMENT',
            key1 : 'SM_ADMIN_MEASUREMENT',
            authRequired : true,
        },
    },
    
];

export default measurementRoutes;