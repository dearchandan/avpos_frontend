const bulkImportRoutes = [
    {
        path : '/bulk_import',
        component : () => import('@/pages/setting/bulk_import.vue'),
        name : 'Bulk Import',
        meta : {
            key : 'SM_BULK_IMPORT',
            authRequired : true,
        },
    },
    
];

export default bulkImportRoutes;