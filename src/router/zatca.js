const zatcaRoutes = [
    {
        path : '/zatca',
        component : () => import('@/pages/setting/zatca.vue'),
        name : 'Zatca',
        meta : {
            key : 'SM_ZATCA',
            authRequired : true,
        },
    },
];

export default zatcaRoutes;