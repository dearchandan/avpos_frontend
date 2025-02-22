const customerDisplayRoutes = [
    {
        path : '/customer_displays',
        component : () => import('@/pages/restaurant/customer_display/customer_displays.vue'),
        name : 'Customer Display',
        meta : {
            key : 'SM_CUSTOMER_DISPLAY',
            authRequired : true,
        },
    },
    {
        path : '/customer_display/add',
        component : () => import('@/pages/restaurant/customer_display/add_customer_display.vue'),
        name : 'Add Customer Display',
        meta : {
            key : 'A_WRITE_CUSTOMER_DISPLAY',
            authRequired : true,
        },
    },
    {
        path : '/customer_display/edit/:slack',
        component : () => import('@/pages/restaurant/customer_display/add_customer_display.vue'),
        name : 'Edit Customer Display',
        meta : {
            key : 'A_WRITE_CUSTOMER_DISPLAY',
            authRequired : true,
        },
    },
    {
        path : '/customer_display/:slack',
        component : () => import('@/pages/restaurant/customer_display/view_customer_display.vue'),
        name : 'View Customer Display',
        meta : {
            key : 'A_READ_CUSTOMER_DISPLAY',
            authRequired : true,
        },
    },
];

export default customerDisplayRoutes;