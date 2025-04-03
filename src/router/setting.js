const settingRoutes = [
    {
        path : '/settings',
        component : () => import('@/pages/setting/settings.vue'),
        name : 'Settings',
    },
    {
        path : '/app_setting',
        component : () => import('@/pages/setting/app_setting.vue'),
        name : 'App Setting',
    },
    // {
    //     path : '/currency_setting',
    //     component : () => import('@/pages/setting/currency_setting.vue'),
    //     name : 'Currencies',
    // },
    // {
    //     path : '/merchant_setting',
    //     component : () => import('@/pages/setting/merchant_setting.vue'),
    //     name : 'Merchant Setting',
    // },
    {
        path : '/mail_templates',
        component : () => import('@/pages/setting/mail_templates.vue'),
        name : 'Mail Templates',
    },
    {
        path : '/mail_template/edit/:id',
        component : () => import('@/pages/setting/add_mail_template.vue'),
        name : 'Edit Mail Template',
      
    },
    {
        path : '/cashier_setting',
        component : () => import('@/pages/setting/cashier_setting.vue'),
        name : 'Cashier Setting',
        meta : {
            key : 'SM_CASHIER_SETTING',
            authRequired : true,
        },
    },
    // {
    //     path : '/branch_setting',
    //     component : () => import('@/pages/setting/branch_setting.vue'),
    //     name : 'Branch Setting',
    //     meta : {
    //         key : 'SM_BRANCH_SETTING',
    //         authRequired : true,
    //     },
    // },
    {
        path : '/printer_setting',
        component : () => import('@/pages/setting/printer_setting.vue'),
        name : 'Printer Setting',
        meta : {
            key : 'SM_PRINTER_SETTING',
            authRequired : true,
        },
    },
    // {
    //     path : '/cds_setting',
    //     component : () => import('@/pages/setting/cds_setting.vue'),
    //     name : 'CDS Setting',
    //     meta : {
    //         key : 'SM_CUSTOMER_DISPLAY_SETTING',
    //         authRequired : true,
    //     },
    // },
    {
        path : '/activity_logs',
        component : () => import('@/pages/setting/activity_logs.vue'),
        name : 'Activity Logs',
        meta : {
            key : 'SM_ACTIVITY_LOG',
            authRequired : true,
        },
    },
    {
        path : '/bulk_import',
        component : () => import('@/pages/setting/bulk_import.vue'),
        name : 'Bulk Import',
        meta : {
            key : 'SM_BULK_IMPORT',
            authRequired : true,
        },
    },
    {
        path : '/measurements',
        component : () => import('@/pages/setting/measurements.vue'),
        name : 'Measurements',
        meta : {
            key : 'SM_MEASUREMENT',
            authRequired : true,
        },
    },
    {
        path : '/payment_methods',
        component : () => import('@/pages/setting/payment_methods.vue'),
        name : 'Payment Methods',
        meta : {
            key : 'SM_PAYMENT_METHOD',
            authRequired : true,
        },
    },
    {
        path : '/taxes',
        component : () => import('@/pages/setting/taxes.vue'),
        name : 'Taxes',
        meta : {
            key : 'SM_TAX',
            authRequired : true,
        },
    },
    {
        path : '/releases',
        component : () => import('@/pages/setting/version_release/version_release.vue'),
        name : 'Releases',
        meta : {
            key : 'SM_RELEASE',
            authRequired : true,
        },
    },
    {
        path : '/release/add',
        component : () => import('@/pages/setting/version_release/add_version_release.vue'),
        name : 'Add Version Release',
      
    },
    {
        path : '/release/edit/:id',
        component : () => import('@/pages/setting/version_release/add_version_release.vue'),
        name : 'Edit Version Release',
    },
    {
        path : '/payment_gateway',
        component : () => import('@/pages/setting/payment_gateway.vue'),
        name : 'Payment Gateways',
        meta : {
            key : 'SM_PAYMENT_GATEWAY',
            authRequired : true,
        },
    },
    {
        path : '/fake_data_generate',
        component : () => import('@/pages/setting/fake_data_generate.vue'),
        name : 'Fake Data Generate',
    },
    {
        path : '/data_migrate',
        component : () => import('@/pages/setting/data_migrate.vue'),
        name : 'Data Restore',
    },
    {
        path : '/pricing',
        component : () => import('@/pages/setting/pricing.vue'),
        name : 'Pricing',
    },
    {
        path : '/backups',
        component : () => import('@/pages/setting/backups.vue'),
        name : 'Backups',
    },
    {
        path : '/data_reset',
        component : () => import('@/pages/setting/data_reset.vue'),
        name : 'Data Reset',
    },
    {
        path : '/payment_modes',
        component : () => import('@/pages/setting/payment_modes.vue'),
        name : 'Payment Mode',
    },

    
];

export default settingRoutes;