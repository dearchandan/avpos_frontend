const adminTransactionRoutes = [
    {
        path : '/admin/transactions',
        component : () =>import('@/pages/admin_transaction/admin_transactions.vue'),
        name : 'Admin Transactions',
    },
    {
        path : '/admin/transaction/add',
        component : () => import('@/pages/admin_transaction/add_admin_transaction.vue'),
        name : 'Add Admin Transaction',
    },
    {
        path : '/admin/transaction/:slack',
        component : () => import('@/pages/admin_transaction/view_admin_transaction.vue'),
        name : 'View Admin Transaction',
        
    },
];

export default adminTransactionRoutes;