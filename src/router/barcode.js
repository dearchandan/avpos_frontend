const barcodeRoutes = [
    {
        path : '/generate_barcode',
        component : () => import('@/pages/inventory/barcode/generate_barcode.vue'),
        name : 'Generate Barcode',
        meta : {
            key : 'A_GENERATE_BARCODE',
            authRequired : true,
        },
    },
];

export default barcodeRoutes;