const adminCouponRoutes = [
    {
        path : '/admin/coupons',
        component : () => import('@/pages/admin_coupon/admin_coupons.vue'),
        name : 'Coupons',
        meta : {
            key : 'A_READ_ADMIN_COUPON',
            authRequired : true,
        },
    },
    {
        path : '/admin/coupon/add',
        component : () => import('@/pages/admin_coupon/admin_add_coupon.vue'),
        name : 'Add Coupon',
        meta : {
            key : 'A_WRITE_ADMIN_COUPON',
            authRequired : true,
        },
    },
    {
        path : '/admin/coupon/edit/:slack',
        component : () => import('@/pages/admin_coupon/admin_add_coupon.vue'),
        name : 'Edit Coupon',
        meta : {
            key : 'A_WRITE_ADMIN_COUPON',
            authRequired : true,
        },
    }
];

export default adminCouponRoutes;