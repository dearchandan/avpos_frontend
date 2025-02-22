const kitchenNotifierRoutes = [
    {
        path : '/kitchen_notifier',
        component : () => import('@/pages/restaurant/kitchen_notifier/kitchen_notifier.vue'),
        name : 'Kitchen Notifier',
        meta : {
            key : 'SM_KITCHEN_NOTIFIER',
            authRequired : true,
        },
    }
];

export default kitchenNotifierRoutes;