const quotationRoutes = [
    {
        path : '/quotations',
        component : () => import('@/pages/sales/quotation/quotations.vue'),
        name : 'Quotations',
        meta : {
            key : 'SM_QUOTATION',
            authRequired : true,
        },
    },
    {
        path : '/quotation/add',
        component : () => import('@/pages/sales/quotation/add_quotation.vue'),
        name : 'Add Quotation',
        meta : {
            key : 'A_WRITE_QUOTATION',
            authRequired : true,
        },
    },
    {
        path : '/quotation/edit/:slack',
        component : () => import('@/pages/sales/quotation/add_quotation.vue'),
        name : 'Edit Quotation',
        meta : {
            key : 'A_WRITE_QUOTATION',
            authRequired : true,
        },
    },
    {
        path : '/quotation/:slack',
        component : () => import('@/pages/sales/quotation/view_quotation.vue'),
        name : 'View Quotation',
        meta : {
            key : 'A_READ_QUOTATION',
            authRequired : true,
        },
    },
];

export default quotationRoutes;