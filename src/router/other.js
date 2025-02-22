const otherRoutes = [
    {
        path : '/forbidden',
        component : () => import('@/pages/other/ForbiddenErrorPage.vue'),
        name : '401'
    },
    {
        path : '/:notFound(.*)',
        component : () => import('@/pages/other/NotFoundErrorPage.vue'),
        name : '404'
    },
    // {
    //     path : '/notifications',
    //     component : () => import('@/pages/other/notifications.vue'),
    //     name : 'Notifications'
    // }
];

export default otherRoutes;