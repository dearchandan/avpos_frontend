const rentReceiptUserRoutes = [
    {
        path : '/rent_receipt_users',
        component : () => import('@/pages/rent_receipt/receipt_user/receipt_users.vue'),
        name : 'Rent Receipt User',
        meta : {
            key : 'SM_RENT_RECEIPT_USER',
            authRequired : true,
        },
    },
    {
        path : '/rent_receipt_user/add',
        component : () => import('@/pages/rent_receipt/receipt_user/add_receipt_user.vue'),
        name : 'Add Rent Receipt User',
        meta : {
            key : 'A_WRITE_RENT_RECEIPT_USER',
            authRequired : true,
        },
    },
    {
        path : '/rent_receipt_user/edit/:slack',
        component : () => import('@/pages/rent_receipt/receipt_user/add_receipt_user.vue'),
        name : 'Edit Rent Receipt User',
        meta : {
            key : 'A_WRITE_RENT_RECEIPT_USER',
            authRequired : true,
        },
    }
];

export default rentReceiptUserRoutes;