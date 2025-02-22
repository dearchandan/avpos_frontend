const variantRoutes = [
    {
        path : '/variants',
        component : () => import('@/pages/inventory/variant/variants.vue'),
        name : 'Variant',
        meta : {
            key : 'SM_VARIANT',
            authRequired : true,
        },
    },
];
export default variantRoutes;