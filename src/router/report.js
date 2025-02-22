const reportRoutes = [
    {
        path : '/reports',
        component : () => import('@/pages/report/reports.vue'),
        name : 'Reports',
        meta : {
            key : 'MM_REPORT',
            authRequired : true,
        },
    },
    {
        path : '/reports/user_wise_sales_report',
        component : () => import('@/pages/report/user_wise_sales_report.vue'),
        name : 'User Wise Sales Report',
        meta : {
            key : 'A_USER_WISE_SALES_REPORT',
            authRequired : true,
        },
    },
    {
        path : '/reports/product_wise_sales_report',
        component : () => import('@/pages/report/product_wise_sales_report.vue'),
        name : 'Product Wise Sales Report',
        meta : {
            key : 'A_PRODUCT_WISE_SALES_REPORT',
            authRequired : true,
        },
    },
    {
        path : '/reports/sales_report',
        component : () => import('@/pages/report/sales_report.vue'),
        name : 'Sales Report',
        meta : {
            key : 'A_SALES_REPORT',
            authRequired : true,
        },
    },
    {
        path : '/reports/sales_returned_report',
        component : () => import('@/pages/report/sales_returned_report.vue'),
        name : 'Sales Returned Report',
        meta : {
            key : 'A_SALES_RETURNED_REPORT',
            authRequired : true,
        },
    },
    {
        path : '/reports/category_wise_product_sales_report',
        component : () => import('@/pages/report/category_wise_product_sales_report.vue'),
        name : 'Category Wise Product Sales Report',
        meta : {
            key : 'A_CATEGORY_WISE_PRODUCT_SALES_REPORT',
            authRequired : true,
        },
    },
    {
        path : '/reports/general_sales_report',
        component : () => import('@/pages/report/general_sales_report.vue'),
        name : 'General Sales Report',
        meta : {
            key : 'A_GENERAL_SALES_REPORT',
            authRequired : true,
        },
    },
    {
        path : '/reports/invoice_report',
        component : () => import('@/pages/report/invoice_report.vue'),
        name : 'Invoice Report',
        meta : {
            key : 'A_INVOICE_REPORT',
            authRequired : true,
        },
    },
    {
        path : '/reports/transaction_report',
        component : () => import('@/pages/report/transaction_report.vue'),
        name : 'Transaction Report',
        meta : {
            key : 'A_TRANSACTION_REPORT',
            authRequired : true,
        },
    },
    {
        path : '/reports/purchase_order_report',
        component : () => import('@/pages/report/purchase_order_report.vue'),
        name : 'Purchase Order Report',
        meta : {
            key : 'A_PURCHASE_ORDER_REPORT',
            authRequired : true,
        },
    },
    {
        path : '/reports/tax_code_report',
        component : () => import('@/pages/report/tax_code_report.vue'),
        name : 'Tax Code Report',
        meta : {
            key : 'A_TAX_CODE_REPORT',
            authRequired : true,
        },
    },
    {
        path: '/reports/tax_report',
        component: () => import('@/pages/report/tax_report.vue'),
        name: 'Tax Report',
        meta: {
            key: 'A_TAX_REPORT',
            authRequired: true,
        },
    },
    {
        path: '/reports/tax_returned_report',
        component: () => import('@/pages/report/tax_returned_report.vue'),
        name: 'Tax Returned Report',
        meta: {
            key: 'A_TAX_RETURNED_REPORT',
            authRequired: true,
        },
    },
    {
        path: '/reports/discount_code_report',
        component: () => import('@/pages/report/discount_code_report.vue'),
        name: 'Discount Code Report',
        meta: {
            key: 'A_DISCOUNT_CODE_REPORT',
            authRequired: true,
        },
    },
    {
        path: '/reports/till_summary_report',
        component: () => import('@/pages/report/till_summary_report.vue'),
        name: 'Till Summary Report',
        meta: {
            key: 'A_TILL_SUMMARY_REPORT',
            authRequired: true,
        },
    },
    {
        path: '/reports/payment_report',
        component: () => import('@/pages/report/payment_report.vue'),
        name: 'Payment Report',
        meta: {
            key: 'A_PAYMENT_REPORT',
            authRequired: true,
        },
    }
];

export default reportRoutes;