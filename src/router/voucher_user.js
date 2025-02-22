const voucherUserRoutes = [
    {
        path : '/voucher_users',
        component : () => import('@/pages/closing_voucher/voucher_user/voucher_users.vue'),
        name : 'Voucher User',
        meta : {
            key : 'SM_VOUCHER_USER',
            authRequired : true,
        },
    },
    {
        path : '/voucher_user/add',
        component : () => import('@/pages/closing_voucher/voucher_user/add_voucher_user.vue'),
        name : 'Add Voucher User',
        meta : {
            key : 'A_WRITE_VOUCHER_USER',
            authRequired : true,
        },
    },
    {
        path : '/voucher_user/edit/:slack',
        component : () => import('@/pages/closing_voucher/voucher_user/add_voucher_user.vue'),
        name : 'Edit Voucher User',
        meta : {
            key : 'A_WRITE_VOUCHER_USER',
            authRequired : true,
        },
    }
];

export default voucherUserRoutes;