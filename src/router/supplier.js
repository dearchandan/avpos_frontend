const supplierRoutes = [
    {
        path : '/suppliers',
        component : () => import('@/pages/manage/supplier/suppliers.vue'),
        name : 'Supplier',
        meta : {
            key : 'SM_SUPPLIER',
            authRequired : true,
        },
    },
    {
        path : '/supplier/add',
        component : () => import('@/pages/manage/supplier/add_supplier.vue'),
        name : 'Add Supplier',
        meta : {
            key : 'A_WRITE_SUPPLIER',
            authRequired : true,
        },
    },
    {
        path : '/supplier/edit/:slack',
        component : () => import('@/pages/manage/supplier/add_supplier.vue'),
        name : 'Edit Supplier',
        meta : {
            key : 'A_WRITE_SUPPLIER',
            authRequired : true,
        },
    },
    {
        path : '/supplier/:slack',
        component : () => import('@/pages/manage/supplier/view_supplier.vue'),
        name : 'View Supplier',
        meta : {
            key : 'A_READ_SUPPLIER',
            authRequired : true,
        },
    },
    
];

export default supplierRoutes;