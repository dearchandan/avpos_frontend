const categoryRoutes = [
    {
        path : '/categories',
        component : () => import('@/pages/inventory/category/categories.vue'),
        name : 'Categories',
        meta : {
            key : 'SM_CATEGORY',
            authRequired : true,
        },
    },
    
];

export default categoryRoutes;