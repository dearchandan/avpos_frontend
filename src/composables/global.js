import { useI18n } from 'vue-i18n'

export default function useGlobal() {
    const { t } = useI18n(); 

    /* Coupons */
    const customer_types = [
        {
            key : 1,
            value: "All Customers"
        },
        {
            key: 2,
            value :  "Only New Customers"
        },
        {
            key: 3,
            value :  "Specific Customers"
        }
    ];

    const coupon_types = [
        {
            name : "Percentage",
            value: 1
        },
        {
            name :  "Flat",
            value: 2
        }
    ];
    
    const types = [
        {
            name : "Rectangle",
            value: 1
        },
        {
            name :  "Round",
            value: 2
        }
    ];

    const dinein_area_suggestions = [t('Main Hall'),t('First Floor'),t('AC Room'),t('Non AC Room')];
    
    
    const role_types = [
        {
            key: 1,
            value : "Admin"
        },
        {
            key: 2,
            value :  "Staff"
        },
        {
            key: 3,
            value :  "Waiter"
        },
        {
            key: 4,
            value :  "Delivery Person"
        }
    ];
    
    const order_types = [
        {
            key: 1,
            value : t("Take Away")
        },
        {
            key: 2,
            value :  t("Dine In")
        }
    ];
    
    const sale_types = [
        {
            key: 1,
            value : t("Sold")
        },
        {
            key: 2,
            value :  t("Returned")
        }
    ];
    const action_types = [
        {
            key : 'created',
            value : 'Created'
        },
        {
            key : 'updated',
            value : 'Updated'
        },
        {
            key : 'deleted',
            value : 'Deleted'
        },
        {
            key : 'custom',
            value : 'Custom'
        },
    ];
    const order_returned_reasons = ['Defective Product','Wrong Item Shipped','Product Not as Described','Expired or Spoiled Product','Cashier Input Error','Damaged Packaging','Billing Error','Other'];
    
    const business_types = [
        {
            key : 'RESTAURANT',
            layout : 'RESTRO',
            value : 'Restaurant'
        },
        {
            key : 'CAFE',
            layout : 'RESTRO',
            value : 'Cafe'
        },
        {
            key : 'RETAIL',
            layout : 'RESTRO',
            value :  'Retail'
        },
        {
            key : 'SUPERMARKET',
            layout : 'RETAIL',
            value : 'Supermarket',
        },
        {
            key : 'PHARMACY',
            layout : 'RETAIL',
            value : 'Pharmacy'
        },
        {
            key : 'MEDICAL',
            layout : 'RETAIL',
            value : 'Medical'
        },
        {
            key : 'LAUNDRY',
            layout : 'RETAIL',
            value : 'Laundry'
        },
        {
            key : 'FOOD_OUTLET',
            layout : 'RESTRO',
            value : 'Food Outlet'
        },
        {
            key : 'OTHER',
            layout : 'RETAIL',
            value : 'Other'
        },
    ];

    
    const device_types = [
        {
        id : 1,
        name : 'All',
        },
        {
        id: 2,
        name: 'Web Devices',
        },
        {
        id : 3,
        name : 'Mobile Devices',
        }
    ];

    
    const subscription_fors = [
        {
        id : 1,
        name : 'Wosul',
        },
        {
        id : 2,
        name : 'Alhamrani',
        }
    ];
    
    const price_types = [
        {
        id : 1,
        name : 'Inclusive Tax',
        },{
        id : 2,
        name : 'Exclusive Tax',
        }
    ];
    
    const discount_types = [
        {
        id : 1,
        name : 'Percentage',
        },{
        id : 2,
        name : 'Amount',
        }
    ];
    
    const subscription_categories = [
        {
        id : 1,
        name : 'Plan',
        },{
        id : 2,
        name : 'Service',
        }
    ];
    const section_types = [
        {
            key : t('Sales'),
            value : ['App\\Models\\Order','App\\Models\\Invoice','App\\Models\\PurchaseOrder','App\\Models\\Quotation']
        },
        {
            key : t('Inventory'),
            value : ['App\\Models\\Product','App\\Models\\Category','App\\Models\\Modifier','App\\Models\\Variant','App\\Models\\StockTransfer','App\\Models\\StockAdjustment']
        },
        {
            key : t('Business'),
            value : ['App\\Models\\Account','App\\Models\\Transaction']
        },
        {
            key : t('Manage'),
            value : ['App\\Models\\Branch','App\\Models\\User','App\\Models\\Terminal','App\\Models\\Customer','App\\Models\\Supplier','App\\Models\\Discount']
        },
        {
            key : t('Restaurant'),
            value : ['App\\Models\\Table','App\\Models\\DineinArea','App\\Models\\KitchenDisplay','App\\Models\\CustomerDisplay']
        },
        {
            key : t('Settings'),
            value : ['App\\Models\\Role','App\\Models\\Measurement','App\\Models\\Tax','App\\Models\\Subscription']
        },
    ];

    return { 
        customer_types, 
        coupon_types,
        types,
        dinein_area_suggestions,
        role_types,
        order_returned_reasons,
        order_types,
        sale_types,
        business_types,
        device_types,
        subscription_fors,
        price_types,
        discount_types,
        subscription_categories,
        action_types,
        section_types
    };

}


