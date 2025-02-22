const rentReceiptSettingRoutes = [
    {
        path : '/rent_receipt_settings',
        component : () => import('@/pages/rent_receipt/receipt_setting/receipt_settings.vue'),
        name : 'Rent Receipt Settings',
    },
];

export default rentReceiptSettingRoutes;