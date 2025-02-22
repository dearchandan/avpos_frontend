const modifierRoutes = [
    {
        path : '/modifiers',
        component : () => import('@/pages/inventory/modifier/modifiers.vue'),
        name : 'Modifier',
        meta : {
            key : 'SM_MODIFIER',
            authRequired : true,
        },
    },
    {
        path : '/modifier/:slack',
        component : () => import('@/pages/inventory/modifier/view_modifier.vue'),
        name : 'View Modifier',
        meta : {
            key : 'A_READ_MODIFIER',
            authRequired : true,
        },
    },
    
];

export default modifierRoutes;