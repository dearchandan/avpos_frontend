const discountRoutes = [
    {
        path : '/discounts',
        component : () => import('@/pages/manage/discount/discounts.vue'),
        name : 'discounts',
        meta : {
            key : 'SM_DISCOUNT',
            authRequired : true,
        },
    },
    {
        path : '/discount/add',
        component : () => import('@/pages/manage/discount/add_discount.vue'),
        name : 'Add discount',
        meta : {
            key : 'A_WRITE_DISCOUNT',
            authRequired : true,
        },
    },
    {
        path : '/discount/edit/:slack',
        component : () => import('@/pages/manage/discount/add_discount.vue'),
        name : 'Edit discount',
        meta : {
            key : 'A_WRITE_DISCOUNT',
            authRequired : true,
        },
    },
    {
        path : '/discount/:slack',
        component : () => import('@/pages/manage/discount/view_discount.vue'),
        name : 'View discount',
        meta : {
            key : 'A_READ_DISCOUNT',
            authRequired : true,
        },
    },
    
];

export default discountRoutes;