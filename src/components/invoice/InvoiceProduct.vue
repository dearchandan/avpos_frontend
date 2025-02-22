<template>
  <div class="row">
    <div class="col-md-12">
      <div class="card">
        <div class="row">
          <div class="col-md-12 mb-3">
            <h5>{{ $t('Products/Services') }}</h5>
          </div>
          <div class="col-12">
                <div class="table-responsive">
            <table class="table table-condensed">
              <thead>
              <tr>
                <th width="10%">{{ $t('Product/Service Name') }}</th>
                <th width="10%" class="text-end">{{ $t('Unit Rate') }}  <br/>
                  <span v-if="tax_inclusive_pricing == true"> {{ $t('(Tax Inclusive)') }}</span>
                  <span v-if="tax_inclusive_pricing == false"> {{ $t('(Tax Exclusive)') }}</span>
                </th>
                <th width="10%" class="text-end">{{ $t('Quantity') }}</th>
                <th width="10%" class="text-end">{{ $t('Amount') }}</th>
                <th width="10%" class="text-end">{{ $t('Discount') }}(%)</th>
                <th width="10%" class="text-center">{{ $t('Other Taxes') }} <br> {{ $t('and fee Amount') }}</th>
                <th width="10%" class="text-center">{{ $t('Subtotal') }}</th>
                <th width="10%" class="text-end">{{ $t('Tax') }}</th>
                <th width="10%" class="text-end">{{ $t('Tax Amount') }}</th>
                <th width="10%" class="text-end">{{ $t('Total') }}</th>
              </tr>
              </thead>
              <tbody>

              <tr v-if="invoice_products.length>0" v-for="(invoice_product,index) in invoice_products" :key="index">
                <td><strong>{{ invoice_product.product_name }}</strong></td>
                <td class="text-end">{{ invoice_product.product_price }}</td>
                <td class="text-end">{{ invoice_product.quantity }}</td>
                <td class="text-end">{{ invoice_product.amount }}</td>
                <td class="text-end" >
                  <span> {{ $t('Item Disc Amt:') }} {{ invoice_product.product_discount }} <br/> </span> 
                  {{ $t('Invoice Disc Amt:') }} {{ invoice_product.invoice_discount_amount }}
                </td>
                <td class="text-end">
                  <div v-if="invoice_product.additional_fee_amount > 0">{{ $t('Additional fee:') }} {{ invoice_product.additional_fee_amount }}</div>
                  <div v-else-if="invoice_product.tobacco_tax_amount > 0"> {{ $t('Tobacco Tax:') }} {{ invoice_product.tobacco_tax_amount }}</div>
                  <div v-else>0</div>
                </td>
                <td class="text-end">{{ invoice_product.subtotal_after_product_other_taxes_and_fee }}</td>
                <td class="text-end">{{ invoice_product.tax }}</td>
                <td class="text-end">{{ invoice_product.tax_amount }}</td>
                <td class="text-end">{{ invoice_product.total_amount }}</td>
              </tr>
              <tr v-else class="text-center">
                <td colspan="9">{{ $t('No Product Available') }}</td>
              </tr>
              </tbody>
            </table>
          </div>
          </div>
          <div class="col-12" v-if="invoice_products.length>0">
            <div class="row">
              <div :class="props.invoice.invoice_charges.length>0? 'col-md-3':'col-md-9'">
                <h6 v-show="props.invoice.invoice_charges.length>0" class="mt-3">{{ $t('Other Charges') }}</h6>
                <table class="table table-condensed">
                  <tr v-for="(charge,index) in props.invoice.invoice_charges" :key="index">
                    <td>{{charge.title}}</td>
                    <td>{{charge.charges}} {{ currency_symbol }}</td>
                  </tr>
                </table>
              </div>
              <div class="col-md-6" v-if="props.invoice.invoice_charges.length>0"></div>
              <div class="col-md-3 text-end mt-3">
                <table class="table table-condensed">
                  <tr>
                    <td>{{ $t('Sub Total') }}</td>
                    <td>{{ props.invoice.grand_subtotal_after_product_quantity }} {{ currency_symbol }}</td>
                  </tr>
                  <tr v-if="props.invoice.grand_product_discount > 0">
                    <td class="text-success">{{ $t('-Product Discount') }} </td>
                    <td class="text-success">{{ props.invoice.grand_product_discount }} {{ currency_symbol }}</td>
                  </tr>
                  <tr v-if="props.invoice.grand_product_discount>0">
                    <td>{{ $t('Sub Total After Discount')}}</td>
                    <td>{{ props.invoice.grand_subtotal_after_product_discount }} {{ currency_symbol }}</td>
                  </tr>
                  <tr v-if="props.invoice.invoice_discount > 0">
                    <td class="text-success">{{ $t('-Invoice Discount') }} <br/>
                      <span v-if="props.invoice.invoice_discount_type==1" class="p-0 text-small">{{ props.invoice.invoice_discount_percentage }} (%)</span>
                      <span v-if="props.invoice.invoice_discount_type==2" class="p-0 text-small">({{ $t('Flat') }})</span></td>
                    <td class="text-success">{{ props.invoice.invoice_discount }} {{ currency_symbol }}</td>
                  </tr>
                  <tr v-if="props.invoice.grand_product_tobacco_tax>0">
                    <td><span>{{ $t('Tobacco Tax') }}</span></td>
                    <td>{{ props.invoice.grand_product_tobacco_tax }} {{ currency_symbol }}</td>
                  </tr>
                  <tr v-if="props.invoice.grand_product_additional_fee>0">
                    <td><span>{{ $t('Product Additional Fee') }}</span></td>
                    <td>{{ props.invoice.grand_product_additional_fee }} {{ currency_symbol }}</td>
                  </tr>
                  <tr>
                    <td>{{ $t('Taxes') }}</td>
                    <td>{{ props.invoice.grand_product_tax }} {{ currency_symbol }}</td>
                  </tr>
                  <tr v-show="props.invoice.invoice_additional_charges>0">
                    <td>{{ $t('Invoice Other Charges') }}</td>
                    <td>{{ props.invoice.invoice_additional_charges }} {{ currency_symbol }}</td>
                  </tr>
                  <tr>
                    <td><h5 class="p-0">{{ $t('Total') }}</h5></td>
                    <td><h5 class="p-0">{{ props.invoice.grand_product_amount }} {{ currency_symbol }}</h5></td>
                  </tr>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>

import { Form, Field, ErrorMessage } from 'vee-validate'
import * as yup from 'yup';
import BeatLoader from 'vue-spinner/src/BeatLoader.vue'
import ClipLoader from 'vue-spinner/src/ClipLoader.vue'
import { useAuthStore } from '@/stores/auth';
import {onMounted, reactive, ref, watch} from "vue";

const tax_inclusive_pricing = useAuthStore().user.login_branch.tax_inclusive_pricing;

const initialState = {
  server_messages: {
    type: "",
    messages: "",
  }
};
const form = reactive({ ...initialState });
const props = defineProps(['invoice']);
const is_loading = ref(false);
const invoice_products = ref([]);
const total_discount = ref(0);
const auth = useAuthStore();
const currency_symbol = computed(() => {
  return auth.user.currency.symbol;
})
onMounted(() => {
  loadTableData();
});

function loadTableData(){
  _.forEach(props.invoice.invoice_products, (value) => {
    // var tax_amount = value.subtotal_after_product_discount * (value.tax_percentage / 100);
    // var total_amount = parseFloat(value.subtotal_after_product_discount) + parseFloat(tax_amount);

    let product_template = {
      type : value.type,
      slack : value.slack,
      product_name : value.product_name,
      quantity : value.product_quantity,
      sale_price_without_tax : parseFloat(value.product_price_without_tax).toFixed(2),
      product_price : parseFloat(value.product_price).toFixed(2),
      amount : parseFloat(value.subtotal_after_product_quantity).toFixed(2),
      product_discount : parseFloat(value.product_discount).toFixed(2),
      invoice_discount_amount : parseFloat(value.invoice_discount_amount).toFixed(2),
      tax : value.tax_name,
      tax_amount : parseFloat(value.product_tax).toFixed(2),
      tax_additional_fee_type : value.tax_additional_fee_type,
      additional_fee_amount : parseFloat(value.additional_fee_amount).toFixed(2),
      tobacco_tax_amount : parseFloat(value.tobacco_tax_amount).toFixed(2),
      subtotal_after_product_other_taxes_and_fee : parseFloat(value.subtotal_after_product_other_taxes_and_fee).toFixed(2),
      total_amount : parseFloat(value.product_amount).toFixed(2),
    };
    invoice_products.value.push(product_template);
  })
}
</script>