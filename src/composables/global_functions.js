import { useAuthStore } from '@/stores/auth';
import { useUserPermissionStore } from '@/stores/userPermissionStore';
import { useCashierStore } from '@/stores/cashierStore';
import { useCashierStorePersist } from '@/stores/cashierStorePersist';
import { isNumber } from 'lodash';

export default function useGlobalFunctions() {
   
    function calculateOrder(product,product_quantity=1,product_modifiers=[],product_discount="",order_discount_percentage=0,is_gift_item=false,is_open_price=false,newPrice=0){

        let initial_product_rate = parseFloat(product.this_branch_inventory.initial_sale_price);

        let product_rate = 0;
        if(is_gift_item){
            product_rate = 0;
        }else if(is_open_price){
            product_rate = parseFloat(newPrice);
        }else{
            product_rate = initial_product_rate;
        }
        
        let tobacco_tax = product.tobacco_tax;

        let additional_fee = {
            type : (product.additional_fee) ? product.additional_fee.type : '',
            value : (product.additional_fee) ? product.additional_fee.value : ''
        };

        /* get total tax percentage */
        let tax_percentage = 0;
        if( product != '' && product.tax != null){
            tax_percentage = parseFloat(product.tax.total_percentage);
        }
        /* get total modifier price */                
        let modifier_rate = 0;
        if(product_modifiers != '' && product_modifiers.length > 0){
            modifier_rate = product_modifiers.reduce((a,b) => {
                return a + parseFloat(b.sale_price)
            },0);
            product_rate += parseFloat(modifier_rate);
        }
        
        let tax_inclusive_pricing = useAuthStore().user.login_branch.tax_inclusive_pricing;

        let product_price_with_tax = product_rate;
        let product_price_before_tax = product_rate;
        let product_price_before_tobacco_tax = product_rate;
        let product_price_before_additional_fee = product_rate;
        let product_price_without_tax = product_rate;

        if(tax_inclusive_pricing){
            if(tax_percentage != '' && tax_percentage > 0){
                product_price_before_tax = parseFloat(product_rate * 100 / (100 + tax_percentage));
            }else{
                product_price_before_tax = parseFloat(product_rate);
            }
            if(tobacco_tax){
                product_price_before_tobacco_tax = parseFloat(product_price_before_tax / 2 );
            }else{
                product_price_before_tobacco_tax = parseFloat(product_price_before_tax);
            }
            if(additional_fee.value && additional_fee.value > 0){
                if(additional_fee.type == 1){
                    // Percentage
                    product_price_before_additional_fee = parseFloat(product_price_before_tobacco_tax) * 100 / (100 + parseFloat(additional_fee.value) );
                    }else{
                    // Fixed
                    product_price_before_additional_fee = parseFloat(product_price_before_tobacco_tax - additional_fee.value );
                } 
            }else{
                product_price_before_additional_fee = parseFloat( product_price_before_tobacco_tax);
            }
            product_price_without_tax = parseFloat(product_price_before_additional_fee);
        }

        let product_amount = parseFloat( product_price_without_tax * product_quantity);
        let product_discount_amount = 0;
        if( typeof product_discount === 'object'  &&  product_discount.value > 0 && !is_gift_item){
            if(product_discount.type == 1){
                // Percentage
                product_discount_amount = parseFloat( product_amount * product_discount.value / 100);
                }else{
                // Fixed
                product_discount_amount = parseFloat(product_discount.value * product_quantity);
            } 
        }
        let product_amount_after_product_discount = parseFloat( product_amount - product_discount_amount);

        let order_discount_amount = 0; 
        let is_order_discount_applied = useCashierStore().is_discount_applied; 
        if(order_discount_percentage > 0 && is_order_discount_applied){
            order_discount_amount = parseFloat( product_amount_after_product_discount * order_discount_percentage / 100 );
        }   

        let product_amount_after_order_discount = parseFloat(product_amount_after_product_discount - order_discount_amount);
        
        /* Additional Fee */
        let additional_fee_amount = 0;
        if(additional_fee.value && additional_fee.value > 0){
            if(additional_fee.type == 1){
                // Percentage
                additional_fee_amount = parseFloat(product_amount * additional_fee.value / 100 );
                }else{
                // Fixed
                additional_fee_amount = parseFloat(additional_fee.value * product_quantity );
            } 
        }

        /* Tobacco Tax */
        let tobacco_tax_amount = 0;
        if(tobacco_tax){
            tobacco_tax_amount = parseFloat(product_amount_after_order_discount );
        }

        let product_amount_after_fee_and_taxes = parseFloat(product_amount_after_order_discount + additional_fee_amount + tobacco_tax_amount)
        
        let tax_amount = 0;
        if(tax_percentage && tax_percentage > 0){
            tax_amount = parseFloat(product_amount_after_fee_and_taxes * tax_percentage / 100 );
        }
        
        let final_product_amount = parseFloat(product_amount_after_fee_and_taxes + tax_amount);

        let prices = {
            /* Core Params */
            product_price_with_tax: product_price_with_tax,
            product_price_before_tax: product_price_before_tax,
            product_price_before_tobacco_tax: product_price_before_tobacco_tax,
            product_price_before_additional_fee: product_price_before_additional_fee,
            product_price_without_tax: product_price_without_tax,
            product_quantity: product_quantity,
            product_amount: product_amount,
            product_discount_amount: product_discount_amount,
            product_amount_after_product_discount: product_amount_after_product_discount,
            order_discount_percentage: order_discount_percentage,
            order_discount_amount: order_discount_amount,
            product_amount_after_order_discount: product_amount_after_order_discount,
            additional_fee_amount: additional_fee_amount,
            tobacco_tax_amount: tobacco_tax_amount,
            product_amount_after_fee_and_taxes: product_amount_after_fee_and_taxes,
            tax_percentage: tax_percentage,
            tax_amount: tax_amount,
            final_product_amount: final_product_amount,
            /* Additional Params*/
            tax_type: (tax_inclusive_pricing) ? 1 : 2,
            initial_product_rate: initial_product_rate,
            is_open_price: is_open_price,
            product_rate: product_rate,
        };

        return prices;
        
    }

    function calculateInvoice(product,product_quantity=1,product_discount="",order_discount_percentage=0,is_open_price=false,newPrice=0){
        
        let initial_product_rate = 0;
        if(product.type == 2){
            initial_product_rate = parseFloat(product.sale_price);
        }else{
            initial_product_rate = parseFloat(product.this_branch_inventory.initial_sale_price);
        }
        if(isNaN(initial_product_rate)){ initial_product_rate = 0; }
        let product_rate = 0;
        if(is_open_price){
            product_rate = parseFloat(newPrice);
            if(isNaN(product_rate)){ product_rate = 0; }
        }else{
            product_rate = initial_product_rate;
        }
        
        if(product.type == 2 && product.tax_additional_fee_type == 2 &&  product.additional_fee != '' && product.additional_fee != null && product.additional_fee != undefined){
            // product.additional_fee.value = parseFloat(product.additional_fee.fee_val);
            var additional_fee = {
                type : (product.additional_fee) ? product.additional_fee.type : '',
                value : (product.additional_fee) ? parseFloat(product.additional_fee.fee_val) : ''
            };
        }else{
            var additional_fee = {
                type : (product.additional_fee) ? product.additional_fee.type : '',
                value : (product.additional_fee) ? parseFloat(product.additional_fee.value) : ''
            };
        }
        if(product.type == 2 && product.tax_additional_fee_type == 1){
            var tobacco_tax = true;
        }else{
            var tobacco_tax = product.tobacco_tax;
        }
        /* get total tax percentage */
        let tax_id = 0;
        let tax_percentage = 0;
        
        if( product != '' && product.tax != null){
            if(product.type == 2){
                tax_percentage = parseFloat(product.tax_percentage);
            }else{
                tax_percentage = parseFloat(product.tax.total_percentage);
            }
            // tax_id = product.tax.id;
        }
        /* get total modifier price */                
        let modifier_rate = 0;
        // if(product_modifiers != '' && product_modifiers.length > 0){
        //     modifier_rate = product_modifiers.reduce((a,b) => {
        //         return a + parseFloat(b.sale_price)
        //     },0);
        //     product_rate += parseFloat(modifier_rate);
        // }
        
        let tax_inclusive_pricing = useAuthStore().user.login_branch.tax_inclusive_pricing;

        let product_price_with_tax = product_rate;
        let product_price_before_tax = product_rate;
        let product_price_before_tobacco_tax = product_rate;
        let product_price_before_additional_fee = product_rate;
        let product_price_without_tax = product_rate;

        if(tax_inclusive_pricing){
            if(tax_percentage != '' && tax_percentage > 0){
                product_price_before_tax = parseFloat(product_rate * 100 / (100 + tax_percentage));
            }else{
                product_price_before_tax = product_rate;
            }
            if(tobacco_tax){
                product_price_before_tobacco_tax = parseFloat(product_price_before_tax) / 2;
            }else{
                product_price_before_tobacco_tax = product_price_before_tax;
            }
            if(additional_fee.value && additional_fee.value > 0){
                if(additional_fee.type == 1){
                    // Percentage
                    product_price_before_additional_fee = parseFloat(product_price_before_tobacco_tax) * 100 / (100 + parseFloat(additional_fee.value) );
                }else{
                    // Fixed
                    product_price_before_additional_fee = parseFloat(product_price_before_tobacco_tax) - parseFloat(additional_fee.value);
                } 
            }else{
                product_price_before_additional_fee = product_price_before_tobacco_tax;
            }
            product_price_without_tax = product_price_before_additional_fee;
        }

        let product_amount = parseFloat(product_price_without_tax) * product_quantity;
        let product_discount_amount = 0;
        
        if( typeof product_discount === 'object'  &&  product_discount.disc > 0){
            if(product_discount.type == 1){
                // Percentage
                product_discount_amount = parseFloat(product_amount) * parseFloat(product_discount.disc) / 100;
                }else{
                // Fixed
                product_discount_amount = parseFloat(product_discount.disc) * product_quantity;
            } 
        }
        let product_amount_after_product_discount = parseFloat(product_amount) - product_discount_amount;

        let order_discount_amount = 0; 
        // let is_order_discount_applied = useCashierStore().is_discount_applied; 
        if(order_discount_percentage > 0 ){
            order_discount_amount = parseFloat(product_amount_after_product_discount) * parseFloat(order_discount_percentage) / 100;
        }   

        let product_amount_after_order_discount = parseFloat(product_amount_after_product_discount) - order_discount_amount;
        
        /* Additional Fee */
        let additional_fee_amount = 0;
        if(additional_fee.value && additional_fee.value > 0){
            if(additional_fee.type == 1){
                // Percentage
                additional_fee_amount = parseFloat(product_amount) * parseFloat(additional_fee.value) / 100;
                }else{
                // Fixed
                additional_fee_amount = parseFloat(additional_fee.value) * product_quantity;
            } 
        }

        /* Tobacco Tax */
        let tobacco_tax_amount = 0;
        if(tobacco_tax){
            tobacco_tax_amount = product_amount_after_order_discount;
        }

        let product_amount_after_fee_and_taxes = parseFloat(product_amount_after_order_discount + additional_fee_amount + tobacco_tax_amount);
        
        let tax_amount = 0;
        if(tax_percentage && tax_percentage > 0){
            tax_amount = parseFloat(product_amount_after_fee_and_taxes) * parseFloat(tax_percentage) / 100;
        }
        
        let final_product_amount = parseFloat(product_amount_after_fee_and_taxes + tax_amount);

        let prices = {
            /* Core Params */
            product_price_with_tax: product_price_with_tax,
            product_price_before_tax: product_price_before_tax,
            product_price_before_tobacco_tax: product_price_before_tobacco_tax,
            product_price_before_additional_fee: product_price_before_additional_fee,
            product_price_without_tax: product_price_without_tax,
            product_quantity: product_quantity,
            product_amount: product_amount,
            product_discount_type: product_discount.type,
            product_discount_value: product_discount.disc,
            product_discount_amount: product_discount_amount,
            product_amount_after_product_discount: product_amount_after_product_discount,
            order_discount_percentage: order_discount_percentage,
            order_discount_amount: order_discount_amount,
            product_amount_after_order_discount: product_amount_after_order_discount,
            additional_fee_amount: additional_fee_amount,
            tobacco_tax_amount: tobacco_tax_amount,
            product_amount_after_fee_and_taxes: product_amount_after_fee_and_taxes,
            // tax_id: tax_id,
            tax_percentage: tax_percentage,
            tax_amount: tax_amount,
            final_product_amount: final_product_amount,
            /* Additional Params*/
            tax_type: (tax_inclusive_pricing) ? 1 : 2,
            initial_product_rate: initial_product_rate,
            is_open_price: is_open_price,
            product_rate: product_rate,
        };

        return prices;
        
    }

    function calculateQuotation(product,product_quantity=1,product_discount="",order_discount_percentage=0,is_open_price=false,newPrice=0){

        let initial_product_rate = 0;
        if(product.type == 2){
            initial_product_rate = parseFloat(product.sale_price);
        }else{
            initial_product_rate = parseFloat(product.this_branch_inventory.initial_sale_price);
        }
        if(isNaN(initial_product_rate)){ initial_product_rate = 0; }
        let product_rate = 0;
        if(is_open_price){
            product_rate = parseFloat(newPrice);
            if(isNaN(product_rate)){ product_rate = 0; }
        }else{
            product_rate = initial_product_rate;
        }
        
        if(product.type == 2 && product.tax_additional_fee_type == 2 &&  product.additional_fee != '' && product.additional_fee != null && product.additional_fee != undefined){
            // product.additional_fee.value = parseFloat(product.additional_fee.fee_val);
            var additional_fee = {
                type : (product.additional_fee) ? product.additional_fee.type : '',
                value : (product.additional_fee) ? parseFloat(product.additional_fee.fee_val) : ''
            };
        }else{
            var additional_fee = {
                type : (product.additional_fee) ? product.additional_fee.type : '',
                value : (product.additional_fee) ? product.additional_fee.value : ''
            };
        }
        if(product.type == 2 && product.tax_additional_fee_type == 1){
            var tobacco_tax = true;
        }else{
            var tobacco_tax = product.tobacco_tax;
        }
        /* get total tax percentage */
        let tax_id = 0;
        let tax_percentage = 0;
        
        if( product != '' && product.tax != null){
            if(product.type == 2){
                tax_percentage = parseFloat(product.tax_percentage);
            }else{
                tax_percentage = parseFloat(product.tax.total_percentage);
            }
            // tax_id = product.tax.id;
        }
        /* get total modifier price */                
        let modifier_rate = 0;
        // if(product_modifiers != '' && product_modifiers.length > 0){
        //     modifier_rate = product_modifiers.reduce((a,b) => {
        //         return a + parseFloat(b.sale_price)
        //     },0);
        //     product_rate += parseFloat(modifier_rate);
        // }
        
        let tax_inclusive_pricing = useAuthStore().user.login_branch.tax_inclusive_pricing;

        let product_price_with_tax = product_rate;
        let product_price_before_tax = product_rate;
        let product_price_before_tobacco_tax = product_rate;
        let product_price_before_additional_fee = product_rate;
        let product_price_without_tax = product_rate;

        if(tax_inclusive_pricing){
            if(tax_percentage != '' && tax_percentage > 0){
                product_price_before_tax = parseFloat(product_rate * 100 / (100 + tax_percentage));
            }else{
                product_price_before_tax = product_rate;
            }
            if(tobacco_tax){
                product_price_before_tobacco_tax = parseFloat(product_price_before_tax) / 2;
            }else{
                product_price_before_tobacco_tax = product_price_before_tax;
            }
            if(additional_fee.value && additional_fee.value > 0){
                if(additional_fee.type == 1){
                    // Percentage
                    product_price_before_additional_fee = parseFloat(product_price_before_tobacco_tax) * 100 / (100 + parseFloat(additional_fee.value) );
                }else{
                    // Fixed
                    product_price_before_additional_fee = parseFloat(product_price_before_tobacco_tax) - parseFloat(additional_fee.value);
                } 
            }else{
                product_price_before_additional_fee = product_price_before_tobacco_tax;
            }
            product_price_without_tax = product_price_before_additional_fee;
        }

        let product_amount = parseFloat(product_price_without_tax) * product_quantity;
        let product_discount_amount = 0;
        
        if( typeof product_discount === 'object'  &&  product_discount.disc > 0){
            if(product_discount.type == 1){
                // Percentage
                product_discount_amount = parseFloat(product_amount) * parseFloat(product_discount.disc) / 100;
                }else{
                // Fixed
                product_discount_amount = parseFloat(product_discount.disc) * product_quantity;
            } 
        }
        let product_amount_after_product_discount = parseFloat(product_amount) - product_discount_amount;

        let order_discount_amount = 0; 
        // let is_order_discount_applied = useCashierStore().is_discount_applied; 
        if(order_discount_percentage > 0 ){
            order_discount_amount = parseFloat(product_amount_after_product_discount) * parseFloat(order_discount_percentage) / 100;
        }   

        let product_amount_after_order_discount = parseFloat(product_amount_after_product_discount) - order_discount_amount;
        
        /* Additional Fee */
        let additional_fee_amount = 0;
        if(additional_fee.value && additional_fee.value > 0){
            if(additional_fee.type == 1){
                // Percentage
                additional_fee_amount = parseFloat(product_amount) * parseFloat(additional_fee.value) / 100;
                }else{
                // Fixed
                additional_fee_amount = parseFloat(additional_fee.value) * product_quantity;
            } 
        }

        /* Tobacco Tax */
        let tobacco_tax_amount = 0;
        if(tobacco_tax){
            tobacco_tax_amount = product_amount_after_order_discount;
        }

        let product_amount_after_fee_and_taxes = parseFloat(product_amount_after_order_discount + additional_fee_amount + tobacco_tax_amount);
        
        let tax_amount = 0;
        if(tax_percentage && tax_percentage > 0){
            tax_amount = parseFloat(product_amount_after_fee_and_taxes) * parseFloat(tax_percentage) / 100;
        }
        
        let final_product_amount = parseFloat(product_amount_after_fee_and_taxes + tax_amount);

        let prices = {
            /* Core Params */
            product_price_with_tax: product_price_with_tax,
            product_price_before_tax: product_price_before_tax,
            product_price_before_tobacco_tax: product_price_before_tobacco_tax,
            product_price_before_additional_fee: product_price_before_additional_fee,
            product_price_without_tax: product_price_without_tax,
            product_quantity: product_quantity,
            product_amount: product_amount,
            product_discount_type: product_discount.type,
            product_discount_value: product_discount.disc,
            product_discount_amount: product_discount_amount,
            product_amount_after_product_discount: product_amount_after_product_discount,
            order_discount_percentage: order_discount_percentage,
            order_discount_amount: order_discount_amount,
            product_amount_after_order_discount: product_amount_after_order_discount,
            additional_fee_amount: additional_fee_amount,
            tobacco_tax_amount: tobacco_tax_amount,
            product_amount_after_fee_and_taxes: product_amount_after_fee_and_taxes,
            // tax_id: tax_id,
            tax_percentage: tax_percentage,
            tax_amount: tax_amount,
            final_product_amount: final_product_amount,
            /* Additional Params*/
            tax_type: (tax_inclusive_pricing) ? 1 : 2,
            initial_product_rate: initial_product_rate,
            is_open_price: is_open_price,
            product_rate: product_rate,
        };

        return prices;
        
    }

    function calculateCrmAddon(addon, yearly_remain_months, monthly_remain_months){

        var qty = addon.quantity>0?addon.quantity:1;
        var price = addon.price;
        if(yearly_remain_months == 12){
            price = addon.price * qty;
            if(addon.type==1 && qty==13){
                qty = monthly_remain_months.toFixed(2);
                price = monthly_remain_months * addon.price;
            }
        }else{
            let one_month_price = addon.price/12;
            if(addon.value_type==1){
                price = one_month_price * yearly_remain_months * qty;
            }else{
                price = one_month_price * yearly_remain_months;
            }
            if(addon.type==1){
                if(qty==13){
                    price = addon.price * monthly_remain_months;
                    qty = monthly_remain_months.toFixed(2);
                }else{
                    price = addon.price * qty;
                }
            }
        }

        let addon_quantity = parseFloat(qty);
        let addon_amount = parseFloat(price);
        let addon_discount_amount = 0;
        let addon_amount_after_addon_discount = parseFloat(price - addon_discount_amount);
        let tax_percentage = parseFloat(15);
        let tax_amount = parseFloat(addon_amount_after_addon_discount * tax_percentage / 100 );
        let final_addon_amount = parseFloat(addon_amount_after_addon_discount + tax_amount);

        let prices = {
            /* Core Params */
            addon_quantity: addon_quantity,
            addon_amount: addon_amount,
            addon_discount_amount: addon_discount_amount,
            addon_amount_after_addon_discount: addon_amount_after_addon_discount,
            tax_percentage: tax_percentage,
            tax_amount: tax_amount,
            final_addon_amount: final_addon_amount,
        };

        return prices;
    }

    function getPriceExclusiveTax(price_including_tax, tax_percent) {
        let tax_rate = parseFloat(tax_percent) / 100;
        let price_before_tax = parseFloat(price_including_tax) / (1 + tax_rate);
        return price_before_tax * tax_rate;
    }

    async function placeOrder(){
        
        var form_data = new FormData();

        let order_slack = useCashierStore().edit_mode ? useCashierStore().edit_order.slack : '';
        form_data.append('order_slack',order_slack);
        form_data.append('action_type',useCashierStore().action_type);
        form_data.append('terminal_slack',useAuthStore().loggedInTerminal.slack);
        form_data.append('payment_method',useCashierStore().payment_method);
        
        let cart = [];
        useCashierStore().cart.forEach((item) => {

            let template = {
                product_slack : item.product.this_branch_inventory.slack,
                product_discount_slack : (item.discount != '' && item.discount != null) ? item.discount.slack : '',
                product_modifier_slacks : item.modifiers.map((item) => item.slack),
                note : item.note,
                product_quantity : item.product_quantity,
                is_gift_item : item.is_gift_item,
                is_open_price: item.is_open_price,
                open_sale_price: item.prices.product_rate,
            }
            cart.push(template);
        });


        form_data.append('cart',JSON.stringify(cart));
        
        let table = {
            slack : (useCashierStore().table != null) ? useCashierStore().table.slack : '',
            seats : (useCashierStore().seats != null) ? useCashierStore().seats : ''
        };
        form_data.append('table',JSON.stringify(table));
        form_data.append('customer',JSON.stringify(useCashierStore().customer));
        form_data.append('cash_amount',useCashierStore().cash_amount);
        form_data.append('card_amount',useCashierStore().card_amount);
        form_data.append('change_amount',useCashierStore().change_amount);
        if(useCashierStore().is_discount_applied){
            form_data.append('order_discount',JSON.stringify(useCashierStore().discount));
        }
        form_data.append('is_offline_order',false);
        form_data.append('order_type',useCashierStore().order_type);
        form_data.append('note',useCashierStore().order_note);
        form_data.append('multiple_price_id',useCashierStorePersist().multiple_price_id);

        return await axios.post('/api/order/save', form_data );
    
    }

    function isAuthorized(menu_key){
        // console.log(menu_key,'menu_key');
        if(useAuthStore().user != null && useAuthStore().user.user_type == 1){
            return true;
        }else{
            if(useAuthStore().user != null && !_.isUndefined(useAuthStore().user)){

                var flag = false;

                let menus = useAuthStore().menus;
                let permissions = useAuthStore().user.role.menus;
                let permissions_ids = _.map(permissions, 'menu_id');

                if(!_.isArray(menu_key)){
                    menu_key = [menu_key];
                }

                menu_key.forEach( (key) => {

                    let menu = _.find(menus, (item) => item.menu_key == key  );

                    if( !_.isUndefined(menu) && permissions_ids.includes(menu.id)){
                        flag = true;
                    }

                })
                return flag;

            }else{

                location.href='/';

            }
        }

 
    }   

    function checkUserPermissions(permissions){    
        
        
        if(permissions.length > 0) {
            
            let data = [];
            
            permissions.forEach( (item) => {
    
                let permission = _.toUpper(item);
                
                if(isAuthorized(permission)){
                    
                    data.push({
                        permission : permission,
                        value : true,
                    });
                    
                }else{
                    
                    data.push({
                        permission : _.toUpper(permission),
                        value : false,
                    });
    
                }
    
            })

            useUserPermissionStore().setPermissions(data);

        }else{
            
            useUserPermissionStore().resetPermissions();

        }
        
    }

    function hasPermission(permission){
        
        permission = _.toUpper(permission);

        let permissions = useUserPermissionStore().getPermissions;
        
        let result = _.find(permissions,{
            permission: permission,
            value: true,
        });
        
        if(!_.isUndefined(result)){
            return true;
        }else{
            return false;
        }

    }

    function checkSubscriptionRedirection(){
        if(useAuthStore().user!=null){
            if(useAuthStore().user.user_type!=1){
                if(useAuthStore().user.merchant.user_subscription==null || (useAuthStore().user.merchant.user_subscription!=null && useAuthStore().user.merchant.user_subscription.status==3)){
                    if(useAuthStore().user.user_type==2){
                        return '/subscriptions';
                    }else{
                        return '/dashboard';
                    }
                }else{
                    return '';
                }
            }else{
                return '';
            }
        }else{
            return '';
        }
    }

    
    async function signOut(){

        try{

            // is_processing.value = true;

            let response = await useAuthStore().logout();

            if(response) {
                // is_processing.value = false;

                router.push('/');

            }

        }catch(error) {
            //server_messages.type = "error";
            // server_messages.messages = error;
            // is_processing.value = false;
            //console.log(error.error);
            if (401 === error.response.status) {
                router.push('/'); 
            } 
        };
        
    }

    function getRoundedValue(value,decimal_points = 2){
        return _.round(value,decimal_points);
    }

    function generatePassword(length) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const passwordLength = length;
        let password = '';
    
        for (let i = 0; i < passwordLength; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            password += characters[randomIndex];
        }
    
        return password;
    }

    return {
        calculateOrder,
        calculateInvoice,
        calculateQuotation,
        calculateCrmAddon,
        getPriceExclusiveTax,
        placeOrder,
        isAuthorized,
        checkUserPermissions,
        hasPermission,
        checkSubscriptionRedirection,
        signOut,
        getRoundedValue,
        generatePassword,
    }


}
