const kitchenDisplayRoutes = [
    {
        path : '/kitchen_displays',
        component : () => import('@/pages/restaurant/kitchen_display/kitchen_displays.vue'),
        name : 'Kitchen Display',
        meta : {
            key: 'SM_KITCHEN_DISPLAY',
            authRequired : true,
        },
    },
    {
        path : '/kitchen_display/add',
        component : () => import('@/pages/restaurant/kitchen_display/add_kitchen_display.vue'),
        name : 'Add Kitchen Display',
        meta : {
            key: 'A_WRITE_KITCHEN_DISPLAY',
            authRequired : true,
        },
    },
    {
        path : '/kitchen_display/edit/:slack',
        component : () => import('@/pages/restaurant/kitchen_display/add_kitchen_display.vue'),
        name : 'Edit Kitchen Display',
        meta : {
            key: 'A_WRITE_KITCHEN_DISPLAY',
            authRequired : true,
        },
    },
    {
        path : '/kitchen_display/:slack',
        component : () => import('@/pages/restaurant/kitchen_display/view_kitchen_display.vue'),
        name : 'View Kitchen Display',
        meta : {
            key: 'A_READ_KITCHEN_DISPLAY',
            authRequired : true,
        },
    },
];

export default kitchenDisplayRoutes;