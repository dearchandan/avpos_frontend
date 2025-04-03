import Swal from 'sweetalert2/dist/sweetalert2';

import { createRouter, createWebHistory } from 'vue-router';
import useGlobalFunctions from '@/composables/global_functions.js';
import authRoutes from './auth';
import dashboardRoutes from './dashboard';
import categoryRoutes from './category';
import measurementRoutes from './measurement';
import modifierRoutes from './modifier';
import variantRoutes from './variant';
import ingredientRoutes from './ingredient';
import brandRoutes from './brands';
import accountRoutes from './account';
import businessRegisterRoutes from './business_register';
import branchRoutes from './branch';
import settingRoutes from './setting';
import merchantRoutes from './merchant';
import customerRoutes from './customer';
import supplierRoutes from './supplier';
import multiplePriceRoutes from "./multiple_prices";
import discountRoutes from './discount';
import couponRoutes from './coupon';
import orderRoutes from './order';
import transactionRoutes from './transaction';
import taxRoutes from './tax';
import additionalFeeRoutes from './additional_fee';
import userRoutes from './user';
import roleRoutes from './role';
import productRoutes from './product';
import terminalRoutes from './terminal';
import stockTransferRoutes from './stock_transfer';
import stockAdjustmentRoutes from './stock_adjustment';
import tableRoutes from './table';
import bulkImportRoutes from './bulk_import';
import purchaseOrderRoutes from './purchase_order';
import quotationRoutes from './quotation';
import invoiceRoutes from './invoice';
import comboRoutes from './combo';
import kitchenDisplayRoutes from './kitchen_display';
import customerDisplayRoutes from './customer_display';
import kitchenNotifierRoutes from './kitchen_notifier';
import otherRoutes from './other';
import reportRoutes from './report';
import subscriptionRoutes from './subscription';
import reservationRoutes from './reservations';
import masterSubscriptionRoutes from './master_subscription';
import supportTicketRoutes from './support_ticket';
import paymentGatewayRoutes from './payment_gateway';
import onlinePaymentRoutes from './online_payment';
import adminUserRoutes from './admin_users';
import adminRoleRoutes from './admin_roles';
import inquiryRoutes from './inquiry';
import adminCouponRoutes from './admin_coupon';
import adminAccountRoutes from './admin_account';
import adminTransactionRoutes from './admin_transaction';
import voucherSettingRoutes from './voucher_setting';
import voucherRoutes from './voucher';
import voucherUserRoutes from './voucher_user';
import rentReceiptSettingRoutes from './rent_receipt_setting';
import rentReceiptRoutes from './rent_receipt';
import rentReceiptUserRoutes from './rent_receipt_user';
import inventoryCountRoutes from './inventory_count';
import barcodeRoutes from './barcode';
import zatcaRoutes from './zatca';

const { isAuthorized } = useGlobalFunctions();
import { useAuthStore } from '@/stores/auth';
    
const routes = [
    ...authRoutes,
    ...dashboardRoutes,
    ...categoryRoutes,
    ...measurementRoutes,
    ...modifierRoutes,
    ...variantRoutes,
    ...ingredientRoutes,
    ...productRoutes,
    ...brandRoutes,
    ...accountRoutes,
    ...businessRegisterRoutes,
    ...branchRoutes,
    ...settingRoutes,
    ...merchantRoutes,
    ...customerRoutes,
    ...supplierRoutes,
    ...multiplePriceRoutes,
    ...discountRoutes,
    ...couponRoutes,
    ...orderRoutes,
    ...transactionRoutes,
    ...taxRoutes,
    ...additionalFeeRoutes,
    ...userRoutes,
    ...roleRoutes,
    ...terminalRoutes,
    ...stockTransferRoutes,
    ...stockAdjustmentRoutes,
    ...tableRoutes,
    ...bulkImportRoutes,
    ...purchaseOrderRoutes,
    ...quotationRoutes,
    ...invoiceRoutes,
    ...comboRoutes,
    ...kitchenDisplayRoutes,
    ...customerDisplayRoutes,
    ...kitchenNotifierRoutes,
    ...otherRoutes,
    ...reportRoutes,
    ...subscriptionRoutes,
    ...reservationRoutes,
    ...masterSubscriptionRoutes,
    ...supportTicketRoutes,
    ...paymentGatewayRoutes,
    ...onlinePaymentRoutes,
    ...adminUserRoutes,
    ...adminRoleRoutes,
    ...inquiryRoutes,
    ...adminCouponRoutes,
    ...adminAccountRoutes,
    ...adminTransactionRoutes,
    ...voucherRoutes,
    ...voucherSettingRoutes,
    ...voucherUserRoutes,
    ...rentReceiptRoutes,
    ...rentReceiptSettingRoutes,
    ...rentReceiptUserRoutes,
    ...inventoryCountRoutes,
    ...barcodeRoutes,
    ...zatcaRoutes,
];

const router = createRouter({
    history: createWebHistory(),
    routes,
    linkActiveClass : 'active'
})

router.beforeEach((to, from) => {

    if(!useAuthStore().authenticated){

        if (!_.isUndefined(to.meta) && to.meta.authRequired) {

             if ( !_.isUndefined(to.meta) && to.meta.authRequired && !isAuthorized(to.meta.key) && _.isUndefined(to.meta.key1) ) {
                return { name: '401' };
            }
            else if( !_.isUndefined(to.meta) && to.meta.authRequired && !isAuthorized(to.meta.key) && !_.isUndefined(to.meta.key) && !_.isUndefined(to.meta.key1) && !isAuthorized(to.meta.key1))
            {
                return { name: '401' };
            }

            /* Redirecting to login page */
            return { name: 'login' }
        }
    }else{

        if(to.name === 'login'){
        
            if(useAuthStore().user.user_type==1 || useAuthStore().user.user_type==4){
                return { name : 'Admin Dashboard' };
            }else{
                return { name : 'Dashboard' };
            }
        
        }else{
            
            axios.interceptors.response.use(function (response) {
                return response
              }, function (error) {
                if (error.response.status === 401) {
                    Swal.fire({
                        timer: 5000,
                        timerProgressBar: true,
                        icon: 'error',
                        title: 'Session Expired',
                        text: 'You are being logged out from this device because the your session is expired or this account is already logged in from some other device'
                      }).then( () => {
                            useAuthStore().logout();
                      });
                    //   return Promise.reject(error)
                }
            })

        }

    }

})

export default router;


