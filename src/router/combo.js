const comboRoutes = [
    {
        path : '/combos',
        component : () => import('@/pages/inventory/combo/combos.vue'),
        name : 'Combos',
        meta : {
            key : 'SM_COMBO',
            authRequired : true,
        },
    },
    {
        path : '/combos/add',
        component : () => import('@/pages/inventory/combo/add_combo.vue'),
        name : 'Add combo',
        meta : {
            key : 'A_WRITE_COMBO',
            authRequired : true,
        },
    },
    {
        path : '/combos/edit/:slack',
        component : () => import('@/pages/inventory/combo/add_combo.vue'),
        name : 'Edit combo',
        meta : {
            key : 'A_WRITE_COMBO',
            authRequired : true,
        },
    },
    {
        path : '/combo/:slack',
        component : () => import('@/pages/inventory/combo/view_combo.vue'),
        name : 'View combo',
        meta : {
            key : 'A_READ_COMBO',
            authRequired : true,
        },
    },
    
];

export default comboRoutes;