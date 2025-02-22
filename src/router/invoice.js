const invoiceRoutes = [
    {
        path : '/invoices',
        component : () => import('@/pages/sales/invoice/invoices.vue'),
        name : 'Invoices',
        meta : {
            key : 'SM_INVOICE',
            authRequired : true,
        },
    },
    {
        path : '/invoice/add',
        component : () => import('@/pages/sales/invoice/add_invoice.vue'),
        name : 'Add Invoice',
        meta : {
            key : 'A_WRITE_INVOICE',
            authRequired : true,
        },
    },
    {
        path : '/invoice/edit/:slack',
        component : () => import('@/pages/sales/invoice/add_invoice.vue'),
        name : 'Edit Invoice',
        meta : {
            key : 'A_WRITE_INVOICE',
            authRequired : true,
        },
    },
    {
        path : '/invoice/:slack',
        component : () => import('@/pages/sales/invoice/view_invoice.vue'),
        name : 'View Invoice',
        meta : {
            key : 'A_READ_INVOICE',
            authRequired : true,
        },
    },
];

export default invoiceRoutes;