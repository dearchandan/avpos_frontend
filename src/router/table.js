const tableRoutes = [
    {
        path : '/tables',
        component : () => import('@/pages/restaurant/table/tables.vue'),
        name : 'Tables',
        meta : {
            key : 'SM_TABLE',
            authRequired : true,
        },
    }

];

export default tableRoutes;