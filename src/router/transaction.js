const transactionRoutes = [
    {
        path : '/transactions',
        component : () => import('@/pages/business/transaction/transactions.vue'),
        name : 'Transaction',
        meta : {
            key : 'SM_TRANSACTION',
            authRequired : true,
        },
    },
    {
        path : '/transaction/add',
        component : () => import('@/pages/business/transaction/add_transaction.vue'),
        name : 'Add Transaction',
        meta : {
            key : 'A_WRITE_TRANSACTION',
            authRequired : true,
        },
    },
    {
        path : '/transaction/:slack',
        component : () => import('@/pages/business/transaction/view_transaction.vue'),
        name : 'View Transaction',
        meta : {
            key : 'A_READ_TRANSACTION',
            authRequired : true,
        },
    },

];

export default transactionRoutes;