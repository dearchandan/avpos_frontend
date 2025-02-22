const customerRoutes = [
    {
        path : '/customers',
        component : () => import('@/pages/manage/customer/customers.vue'),
        name : 'Customer',
        meta : {
            key : 'SM_CUSTOMER',
            authRequired : true,
        },
    },
    {
        path : '/customer/add',
        component : () => import('@/pages/manage/customer/add_customer.vue'),
        name : 'Add Customer',
        meta : {
            key : 'A_WRITE_CUSTOMER',
            authRequired : true,
        },
    },
    {
        path : '/customer/edit/:slack',
        component : () => import('@/pages/manage/customer/add_customer.vue'),
        name : 'Edit Customer',
        meta : {
            key : 'A_WRITE_CUSTOMER',
            authRequired : true,
        },
    },
    {
        path : '/customer/:slack',
        component : () => import('@/pages/manage/customer/view_customer.vue'),
        name : 'View Customer',
        meta : {
            key : 'A_READ_CUSTOMER',
            authRequired : true,
        },
    },
    
];

export default customerRoutes;