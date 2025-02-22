const productRoutes = [
    {
        path : '/products',
        component : () => import('@/pages/inventory/product/products.vue'),
        name : 'Product',
        meta : {
            key : 'SM_PRODUCT',
            authRequired : true,
        },
    },
    {
        path : '/product/add',
        component : () => import('@/pages/inventory/product/add_product.vue'),
        name : 'Add Product',
        meta : {
            key : 'A_WRITE_PRODUCT',
            authRequired : true,
        },
    },
    {
        path : '/product/add/:slack',
        component : () => import('@/pages/inventory/product/add_product.vue'),
        name : 'Edit Product',
        meta : {
            key : 'A_WRITE_PRODUCT',
            authRequired : true,
        },
    },
    {
        path : '/product/clone/:slack',
        component : () => import('@/pages/inventory/product/clone_product.vue'),
        name : 'Clone Product',
        meta : {
            key : 'A_WRITE_PRODUCT',
            authRequired : true,
        },
    },
    {
        path : '/product/:slack',
        component : () => import('@/pages/inventory/product/view_product.vue'),
        name : 'View Product',
        meta : {
            key : 'A_READ_PRODUCT',
            authRequired : true,
        },
    },
    
];

export default productRoutes;