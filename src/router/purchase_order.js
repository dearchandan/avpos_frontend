const purchaseOrderRoutes = [
    {
        path : '/purchase_orders',
        component : () => import('@/pages/sales/purchase_order/purchase_orders.vue'),
        name : 'Purchase Orders',
        meta : {
            key : 'SM_PURCHASE_ORDER',
            authRequired : true,
        },
    },
    {
        path : '/purchase_order/add',
        component : () => import('@/pages/sales/purchase_order/add_purchase_order.vue'),
        name : 'Add Purchase Order',
        meta : {
            key : 'A_WRITE_PURCHASE_ORDER',
            authRequired : true,
        },
    },
    {
        path : '/purchase_order/edit/:slack',
        component : () => import('@/pages/sales/purchase_order/add_purchase_order.vue'),
        name : 'Edit Purchase Order',
        meta : {
            key : 'A_WRITE_PURCHASE_ORDER',
            authRequired : true,
        },
    },
    {
        path : '/purchase_order/:slack',
        component : () => import('@/pages/sales/purchase_order/view_purchase_order.vue'),
        name : 'View Purchase Order',
        meta : {
            key : 'A_READ_PURCHASE_ORDER',
            authRequired : true,
        },
    },
];

export default purchaseOrderRoutes;