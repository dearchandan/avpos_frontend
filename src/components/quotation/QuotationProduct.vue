<template>
  <div class="row">
    <div class="col-md-12">
      <div class="card">
        <div class="row">
          <div class="col-md-12 mb-3">
            <h5>{{ $t('Products/Services') }}</h5>
          </div>
          <div class="col-12">
            <table class="table table-condensed">
              <thead>
              <tr>
                <th width="10%">{{ $t('Product/Service Name') }}</th>
                <th width="10%" class="text-end">{{ $t('Unit Rate') }}  <br/>
                  <!-- <span v-if="tax_inclusive_pricing == true"> {{ $t('(Tax Inclusive)') }}</span>
                  <span v-if="tax_inclusive_pricing == false"> {{ $t('(Tax Exclusive)') }}</span> -->
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

              <tr v-if="quotation_products.length>0" v-for="(quotation_product,index) in quotation_products" :key="index">
                <td><strong>{{ quotation_product.product_name }}</strong></td>
                <td class="text-end">{{ quotation_product.product_price_without_tax }}</td>
                <td class="text-end">{{ quotation_product.product_quantity }}</td>
                <td class="text-end">{{ quotation_product.subtotal_after_product_quantity }}</td>

                <td class="text-end" >
                  <span v-if="quotation_product.type == 1"> {{ $t('Item Disc Amt:') }} {{ quotation_product.product_discount }} <br/> </span> 
                  {{ $t('Quotation Disc Amt:') }} {{ quotation_product.quotation_discount_amount }}
                </td>
                <td class="text-end">
                  <div v-if="quotation_product.additional_fee_amount > 0">{{ $t('Additional fee:') }} {{ quotation_product.additional_fee_amount }}</div>
                  <div v-else-if="quotation_product.tobacco_tax_amount > 0"> {{ $t('Tobacco Tax:') }} {{ quotation_product.tobacco_tax_amount }}</div>
                  <div v-else>0</div>
                </td>
                <td class="text-end">{{ quotation_product.subtotal_after_product_other_taxes_and_fee }}</td>
                <td class="text-end">{{ quotation_product.tax }}</td>
                <td class="text-end">{{ quotation_product.product_tax }}</td>
                <td class="text-end">{{ quotation_product.product_amount }}</td>
              </tr>
              <tr v-else>
                <td colspan="8">{{ $t('No Product Available') }}</td>
              </tr>
              </tbody>
            </table>
          </div>
          <div class="col-12">
            <div class="row">
              <div :class="props.quotation.quotation_charges.length>0? 'col-3':'col-9'">
                <h6 v-show="props.quotation.quotation_charges.length>0" class="mt-3">{{ $t('Other Charges') }}</h6>
                <table class="table table-condensed">
                  <tr v-for="(charge,index) in props.quotation.quotation_charges" :key="index">
                    <td>{{charge.title}}</td>
                    <td>{{charge.charges}} SAR</td>
                  </tr>
                </table>
              </div>
              <div class="col-6" v-if="props.quotation.quotation_charges.length>0"></div>
              <div class="col-3 text-end mt-3">
                <table class="table table-condensed">
                  <tr>
                    <td>{{ $t('Sub Total') }}</td>
                    <td>{{ props.quotation.grand_subtotal_after_product_quantity }} SAR</td>
                  </tr>
                  <tr v-if="props.quotation.grand_product_discount > 0">
                    <td class="text-success">{{ $t('-Product Discount') }} </td>
                    <td class="text-success">{{ props.quotation.grand_product_discount }} SAR</td>
                  </tr>
                  <tr v-if="props.quotation.grand_product_discount>0">
                    <td>{{ $t('Sub Total After Discount')}}</td>
                    <td>{{ props.quotation.grand_subtotal_after_product_discount }} SAR</td>
                  </tr>
                  <tr v-if="props.quotation.quotation_discount > 0">
                    <td class="text-success">{{ $t('-Quotation Discount') }} <br/>
                      <span v-if="props.quotation.discount_type==1" class="p-0 text-small">{{ props.quotation.quotation_discount_percentage }} (%)</span>
                      <span v-if="props.quotation.discount_type==2" class="p-0 text-small">({{ $t('Flat') }})</span></td>
                    <td class="text-success">{{ props.quotation.quotation_discount }} SAR</td>
                  </tr>
                  <tr v-if="props.quotation.grand_product_tobacco_tax>0">
                    <td><span>{{ $t('Tobacco Tax') }}</span></td>
                    <td>{{ props.quotation.grand_product_tobacco_tax }} SAR</td>
                  </tr>
                  <tr v-if="props.quotation.grand_product_additional_fee>0">
                    <td><span>{{ $t('Product Additional Fee') }}</span></td>
                    <td>{{ props.quotation.grand_product_additional_fee }} SAR</td>
                  </tr>
                  <tr>
                    <td>{{ $t('Taxes') }}</td>
                    <td>{{ props.quotation.grand_product_tax }} SAR</td>
                  </tr>
                  <tr v-show="props.quotation.quotation_additional_charges>0">
                    <td>{{ $t('Quotation Other Charges') }}</td>
                    <td>{{ props.quotation.quotation_additional_charges }} SAR</td>
                  </tr>
                  <tr>
                    <td><h5 class="p-0">{{ $t('Total') }}</h5></td>
                    <td><h5 class="p-0">{{ props.quotation.grand_product_amount }} SAR</h5></td>
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

const initialState = {
  server_messages: {
    type: "",
    messages: "",
  }
};
const form = reactive({ ...initialState });
const props = defineProps(['quotation']);
const is_loading = ref(false);
const quotation_products = ref([]);
const total_discount = ref(0);

onMounted(() => {
  loadTableData();
});

function loadTableData(){
  _.forEach(props.quotation.quotation_products, (value) => {
    let product_template = {
      type : value.type,
      po_product_slack : value.slack,
      product_name : value.type==1?value.product.name:value.product_name,
      product_quantity : value.product_quantity,
      product_price_without_tax : value.product_price_without_tax,
      subtotal_after_product_quantity : value.subtotal_after_product_quantity,
      discount_slack : value.discount_slack,
      product_discount : parseFloat(value.product_discount).toFixed(2),
      quotation_discount_amount : parseFloat(value.quotation_discount_amount).toFixed(2),
      tax : value.tax!=null?value.tax.name:'-',
      tax_additional_fee_type : value.tax_additional_fee_type,
      additional_fee_amount : parseFloat(value.additional_fee_amount).toFixed(2),
      tobacco_tax_amount : parseFloat(value.tobacco_tax_amount).toFixed(2),
      subtotal_after_product_other_taxes_and_fee : parseFloat(value.subtotal_after_product_other_taxes_and_fee).toFixed(2),
      product_tax : value.product_tax,
      product_amount : value.product_amount,
      status : value.status,
    };
    quotation_products.value.push(product_template);
  })
}

</script>