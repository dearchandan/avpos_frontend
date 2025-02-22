const stockAdjustmentRoutes = [
    {
        path : '/stock_adjustments',
        component : () => import('@/pages/inventory/stock_adjustment/stock_adjustments.vue'),
        name : 'Stock Adjustments',
        meta : {
            key : 'SM_STOCK_TRANSFER',
            authRequired : true,
        },
    },
    {
        path : '/stock_adjustment/:slack',
        component : () => import('@/pages/inventory/stock_adjustment/view_stock_adjustment.vue'),
        name : 'View Stock Adjustment',
        meta : {
            key : 'A_READ_STOCK_TRANSFER',
            authRequired : true,
        },
    },


];

export default stockAdjustmentRoutes;