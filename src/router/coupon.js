const couponRoutes = [
    {
        path : '/coupons',
        component : () => import('@/pages/manage/coupon/coupons.vue'),
        name : 'Coupons',
        meta : {
            key : 'SM_COUPON',
            authRequired : true,
        },
    },
    {
        path : '/coupon/add',
        component : () => import('@/pages/manage/coupon/add_coupon.vue'),
        name : 'Add coupon',
        meta : {
            key : 'A_WRITE_COUPON',
            authRequired : true,
        },
    },
    {
        path : '/coupon/edit/:slack',
        component : () => import('@/pages/manage/coupon/add_coupon.vue'),
        name : 'Edit coupon',
        meta : {
            key : 'A_WRITE_COUPON',
            authRequired : true,
        },
    },
    {
        path : '/coupon/:slack',
        component : () => import('@/pages/manage/coupon/view_coupon.vue'),
        name : 'View coupon',
        meta : {
            key : 'A_READ_COUPON',
            authRequired : true,
        },
    },
    
];

export default couponRoutes;