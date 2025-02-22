const brandRoutes = [
    {
        path : '/brands',
        component : () => import('@/pages/inventory/brand/brands.vue'),
        name : 'Brand',
        meta : {
            key : 'SM_BRAND',
            authRequired : true,
        },
    },
    
];

export default brandRoutes;