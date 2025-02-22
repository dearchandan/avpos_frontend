const ingredientRoutes = [
    {
        path : '/ingredients',
        component : () => import('@/pages/inventory/ingredient/ingredients.vue'),
        name : 'Ingredient',
        meta : {
            key : 'SM_INGREDIENT',
            authRequired : true,
        },
    },
    {
        path : '/ingredient/add',
        component : () => import('@/pages/inventory/ingredient/add_ingredient.vue'),
        name : 'Add Ingredient',
        meta : {
            key : 'A_WRITE_INGREDIENT',
            authRequired : true,
        },
    },
    {
        path : '/ingredient/add/:slack',
        component : () => import('@/pages/inventory/ingredient/add_ingredient.vue'),
        name : 'Edit Ingredient',
        meta : {
            key : 'A_WRITE_INGREDIENT',
            authRequired : true,
        },
    },
    {
        path : '/ingredient/:slack',
        component : () => import('@/pages/inventory/ingredient/view_ingredient.vue'),
        name : 'View Ingredient',
        meta : {
            key : 'A_READ_INGREDIENT',
            authRequired : true,
        },
    },
    
];

export default ingredientRoutes;