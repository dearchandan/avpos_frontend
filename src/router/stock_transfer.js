const stockTransferRoutes = [
    {
        path : '/stock_transfers',
        component : () => import('@/pages/inventory/stock_transfer/stock_transfers.vue'),
        name : 'Stock Transfers',
        meta : {
            key : 'SM_STOCK_TRANSFER',
            authRequired : true,
        },
    },
    {
        path : '/stock_transfer/:slack',
        component : () => import('@/pages/inventory/stock_transfer/view_stock_transfer.vue'),
        name : 'View Stock Transfer',
        meta : {
            key : 'A_READ_STOCK_TRANSFER',
            authRequired : true,
        },
    },
];

export default stockTransferRoutes;