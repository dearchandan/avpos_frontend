const voucherRoutes = [
    {
        path : '/vouchers',
        component : () => import('@/pages/closing_voucher/voucher/vouchers.vue'),
        name : 'Voucher',
        meta : {
            key : 'SM_VOUCHER',
            authRequired : true,
        },
    },
    {
        path : '/voucher/add',
        component : () => import('@/pages/closing_voucher/voucher/add_voucher.vue'),
        name : 'Add Voucher',
        meta : {
            key : 'A_WRITE_VOUCHER',
            authRequired : true,
        },
    },
    {
        path : '/voucher/edit/:slack',
        component : () => import('@/pages/closing_voucher/voucher/add_voucher.vue'),
        name : 'Edit Voucher',
        meta : {
            key : 'A_WRITE_VOUCHER',
            authRequired : true,
        },
    },
    {
        path : '/voucher/:slack',
        component : () => import('@/pages/closing_voucher/voucher/view_voucher.vue'),
        name : 'View Voucher',
        meta : {
            key : 'A_READ_VOUCHER',
            authRequired : true,
        },
    }
];

export default voucherRoutes;