const masterSubscriptionRoutes = [
    {
        path : '/master_subscriptions',
        component : () => import('@/pages/setting/master_subscription/master_subscriptions.vue'),
        name : 'Master Subscriptions',
    },
    {
        path : '/master_subscription/add',
        component : () => import('@/pages/setting/master_subscription/add_master_subscription.vue'),
        name : 'Add Master Subscription',
    },
    {
        path : '/master_subscription/edit/:slack',
        component : () => import('@/pages/setting/master_subscription/add_master_subscription.vue'),
        name : 'Edit Master Subscription',
    },
];

export default masterSubscriptionRoutes;