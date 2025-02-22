const orderRoutes = [
    {
        path : '/orders',
        component : () => import('@/pages/sales/order/sales.vue'),
        name : 'Order',
        meta : {
            key : 'SM_ORDER',
            authRequired : true,
        },
    },
    {
        path : '/cashier',
        component : () => import('@/pages/sales/order/cashier.vue'),
        name : 'Cashier',
        meta : {
            key : 'A_CLOSE_ORDER',
            authRequired : true,
        },
    },
    {
        path : '/order/:slack',
        component : () => import('@/pages/sales/order/view_order.vue'),
        name : 'View Order',
        meta : {
            key : 'A_READ_ORDER',
            authRequired : true,
        },
    },
    
];

export default orderRoutes;