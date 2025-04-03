const inventoryCountRoutes = [
    {
        path : '/inventory_counts',
        component : () => import('@/pages/inventory/inventory_count/inventory_counts.vue'),
        name : 'Inventory Count',
        meta : {
            key : 'SM_INVENTORY_COUNT',
            authRequired : true,
        },
    },
    {
        path : '/inventory_count/add',
        component : () => import('@/pages/inventory/inventory_count/add_inventory_count.vue'),
        name : 'Add Inventory Count',
        meta : {
            key : 'A_WRITE_INVENTORY_COUNT',
            authRequired : true,
        },
    },
    {
        path : '/inventory_count/edit/:slack',
        component : () => import('@/pages/inventory/inventory_count/add_inventory_count.vue'),
        name : 'Edit Inventory Count',
        meta : {
            key : 'A_WRITE_INVENTORY_COUNT',
            authRequired : true,
        },
    },
    {
        path : '/inventory_count/:slack',
        component : () => import('@/pages/inventory/inventory_count/view_inventory_count.vue'),
        name : 'View Inventory Count',
        meta : {
            key : 'A_READ_INVENTORY_COUNT',
            authRequired : true,
        },
    },
    
];

export default inventoryCountRoutes;