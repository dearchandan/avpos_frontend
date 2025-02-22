const rentReceiptRoutes = [
    {
        path : '/rent_receipts',
        component : () => import('@/pages/rent_receipt/receipt/receipts.vue'),
        name : 'Rent Receipt',
        meta : {
            key : 'SM_RENT_RECEIPT',
            authRequired : true,
        },
    },
    {
        path : '/rent_receipt/add',
        component : () => import('@/pages/rent_receipt/receipt/add_receipt.vue'),
        name : 'Add Rent Receipt',
        meta : {
            key : 'A_WRITE_RENT_RECEIPT',
            authRequired : true,
        },
    },
    {
        path : '/rent_receipt/edit/:slack',
        component : () => import('@/pages/rent_receipt/receipt/add_receipt.vue'),
        name : 'Edit Rent Receipt',
        meta : {
            key : 'A_WRITE_RENT_RECEIPT',
            authRequired : true,
        },
    },
    {
        path : '/rent_receipt/:slack',
        component : () => import('@/pages/rent_receipt/receipt/view_receipt.vue'),
        name : 'View Rent Receipt',
        meta : {
            key : 'A_READ_RENT_RECEIPT',
            authRequired : true,
        },
    }
];

export default rentReceiptRoutes;