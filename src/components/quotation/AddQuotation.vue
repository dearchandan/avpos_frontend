<template>
  <Form :validation-schema="schema" @submit="saveQuotation" enctype="multipart/form-data" :initial-values="form"
        v-if="slack == '' || slack == undefined || (slack != '' && is_loaded)">
    <div class="row">
      <AsyncServerMessage class="py-3" v-if="form.server_messages.messages != ''"
                          :server_messages="form.server_messages"/>
      <div class="col-md-12">
        <div class="row">
          <div class="col-md-12">
            <div class="card">
              <div class="row">
                <h5 class="section-title text-muted">{{ $t('Basic Details') }}:</h5>

                <div class="col-6 col-md-4 col-lg-3">
                  <VMultiSelect
                      name="customer"
                      :label="labels.customer"
                      :placeholder="labels.select_customer"
                      :text="'name'"
                      :value="'slack'"
                      :options="customers"
                      v-model="form.customer"
                      mode="single"
                      required
                      :addModalShow="true"
                      :addModalId="'#addCustomerModal'"
                  />
                </div>

                <div class="col-6 col-md-4 col-lg-3">
                  <VTextInput
                      type="text"
                      name="quotation_number"
                      v-model="form.quotation_number"
                      :label="labels.quotation_number"
                      :required="true"
                      :disabled="true"
                  />
                </div>

                <div class="col-6 col-md-4 col-lg-3">
                  <VTextInput
                      type="text"
                      name="quotation_reference_number"
                      v-model="form.quotation_reference_number"
                      :label="labels.quotation_reference_number"
                  />
                </div>

                <div class="col-6 col-md-4 col-lg-3">
                  <VTextInput
                      type="date"
                      name="quotation_date"
                      v-model="form.quotation_date"
                      :label="labels.quotation_date"
                      :required="true"
                  />
                </div>

                <div class="col-6 col-md-4 col-lg-3">
                  <VTextInput
                      type="date"
                      name="quotation_due_date"
                      v-model="form.quotation_due_date"
                      :label="labels.quotation_due_date"
                  />
                </div>

              </div>
            </div>
          </div>

          <div class="col-md-12">
            <div class="card">
              <div class="row">

                <h5 class="section-title text-muted">{{ $t('Products') }}:</h5>
                <div class="col-md-4">
                  <AsyncProductSearch
                      @select-product="addProduct"
                      :placeholder="labels.search_placeholder"
                      :selected_products="selected_products"
                      :button_placeholder="labels.add_service"
                      :only_available="2"
                  />
                </div>
                <!--  Table goes here! -->
                <div class="table-responsive">
                  <table class="table table-hover table-bordered mb-3 table-responsive-data">
                    <thead class="bg-light">
                    <tr>
                      <th>{{ $t('Product/Service Name') }}</th>
                      <th class="text-center">{{ $t('Unit Rate') }} <br/>
                        <span v-if="tax_inclusive_pricing == true"> {{ $t('(Tax Inclusive)') }}</span>
                        <span v-if="tax_inclusive_pricing == false"> {{ $t('(Tax Exclusive)') }}</span>
                      </th>
                      <th class="text-center">{{ $t('Quantity') }}</th>
                      <th class="text-center">{{ $t('Amount') }}</th>
                      <th class="text-center">{{ $t('Discount') }}</th>
                      <th class="text-center">{{ $t('Other Taxes') }} <br> {{ $t('and fee') }}</th>
                      <th class="text-center">{{ $t('Subtotal') }}</th>
                      <th class="text-center">{{ $t('Tax') }}</th>
                      <th class="text-center">{{ $t('Total') }}</th>
                      <th class="text-center">{{ $t('Remove') }}</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-if="form.quotation_products.length>0" v-for="(quotation_product,index) in form.quotation_products" :key="index">
                      <input type="hidden" name="product_name" v-model="quotation_product.product_name">
                      <input type="hidden" name="product.sku" v-model="quotation_product.product_slack">
                      <td data-title="Search Product" width="20%" v-if="quotation_product.type==1">
                        {{  quotation_product.product_name }}
                        <Field type="hidden" :name="'quotation_products['+index+'].product_name'" :value="quotation_product.product_name" ></Field>
                        <ErrorMessage :name="'quotation_products['+index+'].product_name'" as="div" class="error"></ErrorMessage>
                      </td>
                      <td data-title="Search Product" width="18%" v-else>
                        <VTextInput
                            type="text"
                            :name="'quotation_products['+index+'].product_name'"
                            v-model="quotation_product.product_name"
                            :islabel=false
                        />
                      </td>
                      <td data-title="Unit Price" width="13%"  v-if="quotation_product.type==1">
                        <VTextInput
                            type="number"
                            :name="'quotation_products['+index+'].sale_price'"
                            :input_group_text="'SAR'"
                            v-model="quotation_product.prices.product_rate"
                            min="0.01"
                            step="0.01"
                            v-on:input="calculateTotal"
                            label=""
                            :disabled=quotation_product.is_fixed_price
                        />
                      </td>
                      <td data-title="Unit Price" width="13%" v-else>
                        <VTextInput
                            type="number"
                            :name="'quotation_products['+index+'].sale_price'"
                            :input_group_text="currency_symbol"
                            :islabel=false
                            v-model="quotation_product.sale_price"
                            min="0.01"
                            step="0.01"
                            v-on:input="calculateTotal"
                            :class="'pt-0'"
                            
                        />
                      </td>
                      <td data-title="Quantity" width="13%" v-if="quotation_product.type==1">
                        <VTextInput
                            type="number"
                            :name="'quotation_products['+index+'].quantity'"
                            :input_group_text="labels.units"
                            :islabel=false
                            v-model="quotation_product.quantity"
                            min="0.01"
                            step="0.01"
                            v-on:input="calculateTotal"
                        />
                      </td>
                      <td v-else class="text-end">
                        <span >1.00</span>
                        <Field type="hidden" :name="'quotation_products['+index+'].quantity'" :value="quotation_product.quantity" ></Field>
                        <ErrorMessage :name="'quotation_products['+index+'].quantity'" as="div" class="error"></ErrorMessage>
                      </td>
                      
                      <td data-title="Amount" width="7%" class="text-end">
                        {{ quotation_product.prices.product_amount.toFixed(2) }}
                      </td>
                      <td data-title="Discount" width="12%" v-if="quotation_product.type==1">
                        <VSelect
                            :name="'quotation_products['+index+'].discount_slack'"
                            :placeholder="labels.select_discount"
                            :options="item_discounts"
                            class="mb-0"
                            v-model="quotation_product.discount_slack"
                            v-on:change="calculateTotal"
                            v-bind:id="index"
                            label=""
                            :islabel=false
                        />
                        {{ $t('Item Disc Amount:') }}  {{ quotation_product.prices.product_discount_amount.toFixed(2) }}<br/>
                        {{ $t('Quotation Disc Amount:') }}  {{ quotation_product.prices.order_discount_amount.toFixed(2) }}
                      </td>
                      <td v-else class="text-end">
                        <span > {{ $t('Quotation Disc Amount:') }}  {{ quotation_product.prices.order_discount_amount.toFixed(2) }}</span>
                      </td>
                      <td data-title="Additional Fees" width="8%" class="text-end" v-if="quotation_product.type==1">
                        <span v-if="quotation_product.prices.additional_fee_amount > 0"> {{ quotation_product.prices.additional_fee_amount.toFixed(2) }}</span>
                        <span v-else-if="quotation_product.prices.tobacco_tax_amount > 0"> {{ quotation_product.prices.tobacco_tax_amount.toFixed(2) }}</span>
                        <span v-else>0</span>
                      </td>
                      <td data-title="Other Taxes and fee" width="14%" class="text-end" v-else>
                        <div class="col-auto col-md-auto col-lg-auto text-start" >
                          <VSelectInput
                              :name="`tax_additional_fee_types_${index}`"
                              :label="'Additional Fee Type'"
                              :options="other_tax_types"
                              v-model="quotation_product.tax_additional_fee_type"
                              size="normal"
                              v-on:change="calculateTotal"
                          />
                        </div>
                        <div class="col-auto col-md-auto col-lg-auto text-start" v-if="quotation_product.tax_additional_fee_type == 2" >
                          <VSelect
                            :name="`additional_fee_${index}`"
                            :label="'Additional Fee'"
                            :placeholder="'None'"
                            :options="item_additional_fees"
                            class="mb-0"
                            v-model="quotation_product.additional_fee_slack"
                            v-on:change="calculateTotal"
                              
                          />
                        </div>
                        <span>{{ $t('Amount: ') }}</span>
                        
                        <span v-if="quotation_product.prices.additional_fee_amount > 0"> {{ quotation_product.prices.additional_fee_amount.toFixed(2) }}</span>
                        <span v-else-if="quotation_product.prices.tobacco_tax_amount > 0"> {{ quotation_product.prices.tobacco_tax_amount.toFixed(2) }}</span>
                        <span v-else>0</span>
                      </td>
                      <td data-title="SubTotal" width="10%" class="text-end" >
                        {{ quotation_product.prices.product_amount_after_fee_and_taxes.toFixed(2) }}                        
                      </td>

                      <td data-title="Select Tax" width="10%" class="text-end" v-if="quotation_product.type==1">
                        {{ quotation_product.prices.tax_amount.toFixed(2) }}
                      </td>
                      <td data-title="Tax" width="7%" v-else>
                        <VSelect
                            :name="`tax_${index}`"
                            :placeholder="labels.select_tax"
                            :options="taxes"
                            class="mb-0"
                            v-model="quotation_product.tax"
                            v-on:change="calculateTotal"
                            v-bind:id="index"
                            label=""
                            :islabel=false
                        />
                      </td>                      
                      <td data-title="Amount" width="10%" class="text-end">{{ quotation_product.prices.final_product_amount.toFixed(2) }}</td>
                      <td data-title="Action" width="3%" class="text-center">
                        <a role="button" class="btn btn-icon btn-xs btn-light-danger" @click="removeProduct(quotation_product)">
                          <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" width="0.88em" height="1em" viewBox="0 0 448 512" class="iconify iconify--fa6-regular"><path fill="currentColor" d="m170.5 51.6l-19 28.4h145l-19-28.4c-1.5-2.2-4-3.6-6.7-3.6h-93.7c-2.7 0-5.2 1.3-6.7 3.6zm147-26.6l36.7 55H424c13.3 0 24 10.7 24 24s-10.7 24-24 24h-8v304c0 44.2-35.8 80-80 80H112c-44.2 0-80-35.8-80-80V128h-8c-13.3 0-24-10.7-24-24s10.7-24 24-24h69.8l36.7-55.1C140.9 9.4 158.4 0 177.1 0h93.7c18.7 0 36.2 9.4 46.6 24.9zM80 128v304c0 17.7 14.3 32 32 32h224c17.7 0 32-14.3 32-32V128zm80 64v208c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16m80 0v208c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16m80 0v208c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16"></path></svg>
                        </a>
                      </td>
                    </tr>
                    </tbody>
                  </table>
                </div>
                <div>
                  <div class="row justify-content-between mt-1">
                    <div class="col-auto">

                      <div class="col-auto text-decoration-underline mb-3">
                        <a href="javascript:;" @click="addService">+ {{ $t('Add Service') }}</a>
                      </div>

                      <div class="form-check">
                        <input class="form-check-input" type="checkbox" value="" id="Shipping_charge" data-bs-toggle="collapse" 
                          data-bs-target="#shipping_table_wrap" v-model="form.other_charges" @click="showHideAdditionalCharges">
                        <input class="form-check-input" type="checkbox" value="" id="Shipping_charge" data-bs-toggle="collapse" data-bs-target="#shipping_table_wrap" v-model="form.other_charges" @click="showHideAdditionalCharges">
                        <label class="form-check-label mb-0" for="Shipping_charge">
                          {{ $t('Other Charges') }}
                        </label>
                      </div>
                      <div :class="form.other_charges?'collapse show':'collapse'" id="shipping_table_wrap">
                        <table class="table">
                          <tr v-for="(additional_charge,index) in form.additional_charges" :key="index">
                            <th class="text-end border-0 field-m-0 field-label-hide">
                              <div class="form-field mb-0">
                                <VTextInput 
                                  type="text" 
                                  :name="'additional_charges['+index+'].charge_name'"  
                                  v-model="additional_charge.charge_name" 
                                  :placeholder="labels.charge_name" 
                                />
                              </div>
                            </th>
                            <th class="border-0 field-m-0 field-label-hide">
                              <div class="form-field mb-0">
                                <VTextInput 
                                  type="number" 
                                  :name="'additional_charges['+index+'].charge_amount'" 
                                  v-model="additional_charge.charge_amount" 
                                  :placeholder="labels.charge" 
                                  v-on:input="other_charge_calc" 
                                />
                              </div>
                            </th>
                            <th class="border-0 px-0">
                              <div class="form-field mb-0">
                              <div class="d-flex align-items-center pt-0 pb-0">
                                <button role="button" type="button" class="btn btn-sm btn-icon btn-light-danger" @click="removeCharge(index)" :disabled="form.additional_charges.length>1 ? false : true">x</button>
                                <button role="button" type="button" class="btn btn-sm btn-icon btn-light-primary ms-2" @click="addCharge()" v-if="index == form.additional_charges.length - 1">+</button>
                              </div>
                              </div>
                            </th>
                          </tr>
                        </table>
                      </div>
                    </div>
                    <div class="col-md-4">
                      <table class="table">
                        <tr>
                          <th class="text-end border-0"><h6>{{ $t('Item Sub Total') }}</h6></th>
                          <th class="border-0 text-end"><h6>{{ quotation_item_sub_total_amount }} SAR</h6></th>
                          <th class="border-0 px-0"></th>
                        </tr>
                        <tr>
                          <th class="border-0">
                            <VSelect
                                name="quotation_discount_type"
                                v-model="form.quotation_discount_type"
                                :placeholder="labels.discount_type"
                                :options="discount_types"
                                class="mt-0"
                                label=""
                                v-on:change="calculateTotal"
                                :islabel=false
                            />
                          </th>
                          <th  class="border-0">
                            <VTextInput
                                v-model="form.quotation_discount_amount"
                                type="number"
                                name="quotation_discount_amount"
                                class="mt-0 p-0"
                                :placeholder="labels.value"
                                label=""
                                v-on:input="calculateTotal"
                                :islabel=false
                            />
                          </th>
                          <th class="border-0 px-0"></th>
                        </tr>
                        <tr v-if="quotation_grand_product_discount_amount>0">
                          <th class="text-end border-0"><h6 class="p-0 text-success">{{ $t('-Product Discount') }}</h6></th>
                          <th class="border-0 text-end"><h6 class="p-0 text-success">{{ quotation_grand_product_discount_amount }} {{ currency_symbol }}</h6></th>
                          <th class="border-0 px-0"></th>
                        </tr>
                        <tr v-if="quotation_grand_product_discount_amount>0">
                          <th class="text-end border-0"><h6 class="p-0">{{ $t('Subtotal after Product Discount') }}</h6></th>
                          <th class="border-0 text-end"><h6 class="p-0">{{ quotation_sub_total_after_product_discount }} {{ currency_symbol }}</h6></th>
                          <th class="border-0 px-0"></th>
                        </tr>
                        <tr v-if="quotation_grand_additional_discount_amount>0">
                          <th class="text-end border-0"><h6 class="p-0 text-success">{{ $t('-Quotation Discount') }}</h6></th>
                          <th class="border-0 text-end"><h6 class="p-0 text-success">{{ quotation_grand_additional_discount_amount }} SAR</h6></th>
                          <th class="border-0 px-0"></th>
                        </tr>
                        <tr v-if="quotation_grand_additional_discount_amount>0">
                          <th class="text-end border-0"><h6 class="p-0">{{ $t('Sub Total After Discount') }}</h6></th>
                          <th class="border-0 text-end"><h6 class="p-0">{{ quotation_sub_total_after_discount }} {{ currency_symbol }}</h6></th>
                          <th class="border-0 px-0"></th>
                        </tr>
                        <tr v-if="quotation_total_tobacco_tax>0">
                          <th class="text-end border-0"><h6 class="p-0">{{ $t('Tobacco Tax') }}</h6></th>
                          <th class="border-0 text-end"><h6 class="p-0">{{ quotation_total_tobacco_tax }} {{ currency_symbol }}</h6></th>
                          <th class="border-0 px-0"></th>
                        </tr>
                        <tr v-if="quotation_total_additional_fee>0">
                          <th class="text-end border-0"><h6 class="p-0">{{ $t('Additional Fees') }}</h6></th>
                          <th class="border-0 text-end"><h6 class="p-0">{{ quotation_total_additional_fee }} {{ currency_symbol }}</h6></th>
                          <th class="border-0 px-0"></th>
                        </tr>
                        <tr>
                          <th class="text-end border-0"><h6 class="p-0">{{ $t('Taxes') }}</h6></th>
                          <th class="border-0 text-end"><h6 class="p-0">{{ quotation_grand_tax_amount }} SAR</h6></th>
                          <th class="border-0 px-0"></th>
                        </tr>
                        <tr v-if="form.other_charges==true">
                          <th class="text-end border-0"><h6 class="p-0">{{ $t('Other Charges') }}</h6></th>
                          <th class="border-0 text-end"><h6 class="p-0">{{ quotation_grand_additional_charges_amount }} SAR</h6></th>
                          <th class="border-0 px-0"></th>
                        </tr>
                        <tr class="tr-total">
                          <th class="text-end border-0"><h5 class="p-0">{{ $t('Total') }}</h5></th>
                          <th class="border-0 text-end text-dark"><h5 class="p-0">{{ quotation_grand_final_total_amount }} SAR</h5></th>
                          <th  class="border-0 px-0"></th>
                        </tr>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="col-md-12">
            <div class="card">
              <div class="row">
                <h5 class="section-title text-muted">{{ $t('Note/Terms and Conditions') }}:  
                  <label for="" class="text-warning h6">{{ terms_character_count }}</label>
                </h5>
                <div class="col-12">
                  <textarea maxlength="500"
                      class="form-control form-control-solid text-area"
                      name="terms"
                      v-model="form.terms"
                      rows="1"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="text-end">
      <button type="submit" class="btn btn-primary" :disabled="form.is_submitting">
        <clip-loader v-if="form.is_submitting" :color="'white'" :size="'20px'" class="pt-2 pe-2"></clip-loader>
        <span class="pt-0" v-if="form.is_submitting">{{ $t('Saving...') }}</span>
        <span class="pt-0" v-else>{{ $t('Save') }}</span>
      </button>
    </div>
  </Form>
  <EditFormSkeleton v-else />

  <div class="modal hide" id="addCustomerModal" tabindex="-1" aria-labelledby="Add Customer" aria-modal="true"
       role="dialog"  data-bs-backdrop="static" data-bs-keyboard="false">
    <div class="modal-dialog modal-dialog-centered modal-xl">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title fs-5">{{ $t('Add Customer') }}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="closeModal"
                  id="close_btn"></button>
        </div>
        <div class="modal-body">
          <AddCustomer @closeAddCustomerModal="closeAddCustomerModal"/>
        </div>
      </div>
    </div>
  </div>

</template>


<script setup>

import useGlobalFunctions from "@/composables/global_functions.js";
import { Form, Field, ErrorMessage } from 'vee-validate'
import * as yup from 'yup';
import BeatLoader from 'vue-spinner/src/BeatLoader.vue'
import ClipLoader from 'vue-spinner/src/ClipLoader.vue'

import { useAuthStore } from '@/stores/auth';
import {onMounted, reactive, ref, watch} from "vue";
import {useRoute} from "vue-router";
import { useI18n } from 'vue-i18n'
import { error } from "jquery";

const { t } = useI18n();
const { calculateQuotation } = useGlobalFunctions();
const tax_inclusive_pricing = useAuthStore().user.login_branch.tax_inclusive_pricing;

const labels = ref({
  search_placeholder: t("Search and Add Product"),
  add_service: t("Add Service"),
  charge: t('Charge'),
  charge_name: t('Charge Name'),
  discount_type: t('Discount Type'),
  value: t('Value'),
  units: t('Units'),
  select_tax: t('Select Tax'),
  select_discount: t('Select Discount'),
  customer: t('Customer'),
  select_customer: t('Select Customer'),
  quotation_number: t('Quotation Number'),
  quotation_reference_number: t('Quotation Reference Number'),
  quotation_date: t('Quotation Date'),
  quotation_due_date: t('Quotation Due Date'),
});
const AsyncServerMessage = defineAsyncComponent(() => import('@/components/common/ServerMessage.vue'));
const AsyncProductSearch = defineAsyncComponent(() => import('@/components/common/InvoiceProductSearch.vue'));

const route = useRoute();
const slack = route.params.slack;
const quotation = ref([]);
const auth = useAuthStore();
const currency_symbol = computed(() => {
  return auth.user.currency.symbol;
})

const merchant_tax = computed(() => {
  return auth.user.tax;
})

const initialState = {
  server_messages: {
    type: "",
    messages: "",
  },
  is_submitting: false,

  // form data   
  slack: "",
  customer: "",
  quotation_number: "",
  quotation_reference_number: "",
  quotation_date:new Date().toISOString().split("T")[0],
  quotation_due_date: "",
  terms: "",
  other_charges:false,
  quotation_products: [],
  quotation_discount_type: "",
  quotation_discount_amount: 0,
  additional_charges: []
};

const form = reactive({...initialState});

const schema = yup.object().shape({
  customer: yup.string().required(t('name is required', { name: t('Customer') })),
  quotation_reference_number: yup.number().typeError(t('must be a number',{ name: t('Quotation Reference') })).nullable().moreThan(0, "Quotation Reference cannot be negative")
      .transform((_, val) => (val !== "" ? Number(val) : null)),
  quotation_date: yup.string().required(t('name is required', { name: t('Quotation Date') })),
  quotation_products: yup.array(yup.object({
    product_name: yup.string().required(t('name is required', { name: t('Service Name') })),
    sale_price: yup.number().typeError(t('must be a number',{ name: t('Unit Price') })).required(t('name is required', { name: t('Unit Price') })).positive(t('must be a positive number', { name: t('Unit Price') })),
    quantity:yup.number().typeError(t('must be a number',{ name: t('Quantity') })).required(t('name is required', { name: t('Quantity') })).positive(t('must be a positive number', { name: t('Quantity') }))
  })).required(),
  additional_charges: yup.array(yup.object().shape({
    charge_name: yup.string().nullable()
    .when('charge_amount', {
        is: (val) => val!='' && val > 0,
        then: (schema) => schema.required(t('name is required', { name: t('Charge Name') })),
        otherwise:(schema) => schema.nullable()
    }),
    charge_amount: yup.number().typeError(t('must be a number',{ name: t('Amount') })).nullable()
    .when('charge_name', {
        is: (val) => val!='',
        then: (schema) => schema.required(t('name is required', { name: t('Amount') })),
        otherwise:(schema) => schema.nullable()
    }),
  },['charge_name','charge_amount'])).required(),
  quotation_discount_type: yup
    .string()
    .nullable()
    .when('quotation_discount_amount', {
        is: (val) => val!='' && val > 0,
        then: (schema) => schema.required(t('name is required', { name: t('Discount Type') })),
        otherwise: (schema) => schema.nullable()
    }),
  quotation_discount_amount: yup
    .number()
    .typeError(t('must be a number',{ name: t('Discount Amount') }))
    .nullable()
    .when('quotation_discount_type', {
        is: (val) => val!='',
        then: (schema) => schema.required(t('name is required', { name: t('Discount Amount') })),
        otherwise:(schema) => schema.nullable()
    })
},['quotation_discount_type','quotation_discount_amount']);

const discount_types = [
  {
    key : "1",
    value: "Percentage"
  },
  {
    key :  "2",
    value: "Amount"
  }
];
const fixed_additional_charges = [
  {
    charge_name : "Shipping Charges",
    charge_amount: 0
  },
  {
    charge_name :  "Packing Charges",
    charge_amount: 0
  }
];
onMounted(() => {
  getQuotationAddData();
  form.additional_charges = fixed_additional_charges;
  if(slack!=null){
    getQuotation();
  }
});

function other_charge_calc(){
  setTimeout(() => calculateTotal(), 200);
}

const customers = ref([]);
const taxes = ref([]);
const item_discounts = ref([]);
const item_additional_fees = ref([]);

const other_tax_types = ref([
  {
    id: "",
    name: t("None"),
  },
  {
    id: 1,
    name: t("Tobacco Tax"),
  },
  {
    id: 2,
    name: t("Additional Fee"),
  },
]);

async function getQuotationAddData(){
  let add_data = await axios.get('api/quotation/add');
  form.quotation_number = add_data.data.data.quotation_number;
  form.quotation_reference_number = add_data.data.data.quotation_reference_number;
  // item Additional Fees
  let item_additional_fees_data = add_data.data.data.item_additional_fees;
    //Customer
    customers.value = [];
    let customer_data = add_data.data.data.customers;
  _.forEach(customer_data, (item) => {
    let template = {
      'slack': item.slack,
      'name': item.name!=""?(item.phone!="" && item.phone!="null"?item.name+' - '+item.phone:item.name):item.phone,
    };
    customers.value.push(template);
  });

  //Taxes
  taxes.value = [];
  _.forEach(auth.user.country.taxes, (item) => {
    let template = {
      'key': item.slack,
      'value': item.name,
      'percentage': item.total_percentage,
    };
    taxes.value.push(template);
  });

  item_discounts.value = [];
  let discounts_data = add_data.data.data.discounts;
  _.forEach(discounts_data, (item) => {
    let template = {
      'key': item.slack,
      'value': item.name,
      'disc': item.value,
      'type': item.type,
    };
    item_discounts.value.push(template);
  });

  _.forEach(item_additional_fees_data, (item) => {
    let template = {
      'key': item.slack,
      'value': item.name,
      'fee_val': item.value,
      'type': item.type,
    };
    item_additional_fees.value.push(template);
  });

}

const is_loaded = ref(false);
async function getQuotation(){
  await axios.get('/api/quotation', { params : {
      slack : slack,
    } }).then( (response) => {
    is_loaded.value = true;
    quotation.value = response.data.data;
    form.slack = quotation.value.slack;
    form.quotation_number = quotation.value.quotation_number;
    form.quotation_reference_number = quotation.value.reference_no;
    form.terms = quotation.value.terms;
    form.quotation_date = quotation.value.quotation_date;
    form.quotation_due_date = quotation.value.due_date == null?'':quotation.value.due_date;
    form.quotation_discount_type = quotation.value.discount_type;
    form.quotation_discount_amount = (quotation.value.discount_type == 1) ? quotation.value.quotation_discount_percentage : quotation.value.quotation_discount;
    // grand_aditional_discount_amount.value = quotation.value.quotation_discount;
    form.customer = quotation.value.customer.slack;
    if(quotation.value.quotation_products.length > 0)
    {
      form.quotation_products = [];
      for(var i = 0;i < quotation.value.quotation_products.length;i++)
      {
        let product_type = quotation.value.quotation_products[i].type
        var sale_price = quotation.value.quotation_products[i].product_price_without_tax;
        var discounts = [];
        var selected_product_discount = [0];
        if(quotation.value.quotation_products[i].discount_slack != '' && quotation.value.quotation_products[i].discount_slack != null){
          selected_product_discount = calculateProductDiscount(item_discounts.value, quotation.value.quotation_products[i].discount_slack);
        }
        var is_fixed_price = true;
        var sale_price = 0;
        if(product_type==1 ){
          var item_prices = calculateQuotation(quotation.value.quotation_products[i].product,quotation.value.quotation_products[i].product_quantity,selected_product_discount[0]);
          is_fixed_price = quotation.value.quotation_products[i].product.price_type==1?true:false;
        }else{
          is_fixed_price = false;
          sale_price = quotation.value.quotation_products[i].product_price;
          quotation.value.quotation_products[i].sale_price = sale_price;
          var item_prices = calculateQuotation(quotation.value.quotation_products[i],quotation.value.quotation_products[i].product_quantity,selected_product_discount[0]);
        }
        let product_template = reactive({
          type : product_type,
          product_slack : (product_type == 1)? quotation.value.quotation_products[i].product.slack : quotation.value.quotation_products[i].slack,
          product_name : quotation.value.quotation_products[i].product_name,
          quantity : quotation.value.quotation_products[i].product_quantity,
          is_fixed_price : is_fixed_price,
          sale_price: sale_price,
          // edit_sale_price : 0,
          // price_excluding_tax : quotation.value.quotation_products[i].product_price_without_tax,
          // amount : quotation.value.quotation_products[i].product_price,
          discount : [],
          discount_slack : quotation.value.quotation_products[i].discount_slack,
          discount_amount : 0,          
          tax_additional_fee_type: quotation.value.quotation_products[i].tax_additional_fee_type, 
          additional_fee_slack: quotation.value.quotation_products[i].additional_fee_slack, 
          tax: (product_type==2 && quotation.value.quotation_products[i].tax !=null)?quotation.value.quotation_products[i].tax.slack:'',
          // tax_amount: quotation.value.quotation_products[i].product_tax,
          // total_amount: quotation.value.quotation_products[i].product_amount,
          product: product_type==1?quotation.value.quotation_products[i].product:[],
          prices: item_prices,
        });
        form.quotation_products.push(product_template);
      }
    }
    if(response.data.data.quotation_charges.length > 0){
      form.additional_charges = [];
      for(var i = 0;i < response.data.data.quotation_charges.length;i++)
      {
        var charge = {
          charge_name : response.data.data.quotation_charges[i].title,
          charge_amount: response.data.data.quotation_charges[i].charges
        }
        form.additional_charges.push(charge);
      }
      form.other_charges = true;
    }
    calculateTotal();
  }).catch((error) => {
    form.server_messages.type = "error";
    form.server_messages.messages = error;
    console.log(error);
  });

}

// const quotation_products = ref([]);
const selected_products = ref([]);

function addProduct(clicked_product){
  var item_prices = calculateQuotation(clicked_product);
  selected_products.value.push(clicked_product.slack);
  // var discounts = [];
  // if(clicked_product.discounts!=null){
  //   for (var index in clicked_product.discounts) {
  //     discounts[index] = {
  //       'value': clicked_product.discounts[index].name,
  //       'key': clicked_product.discounts[index].slack,
  //       'type': clicked_product.discounts[index].type,
  //       'disc': clicked_product.discounts[index].value,
  //     }
  //   }
  // }
  //HERE Type=1 PRODUCT
  let product_template = reactive({
    type:1,
    product_slack : clicked_product.slack,
    product_name : clicked_product.name,
    quantity : 1,
    is_fixed_price : clicked_product.price_type==1?true:false,
    // sale_price : clicked_product.sale_price,
    edit_sale_price : 0,
    // price_excluding_tax : clicked_product.this_branch_inventory.sale_price,
    // amount : clicked_product.sale_price,
    discount : [],
    discount_slack : '',
    discount_amount : 0,
    // tax : '',
    // tax_amount : 0,
    // total_amount : clicked_product.sale_price,
    product: clicked_product,
    prices: item_prices,
  });
  form.quotation_products.push(product_template);
  // console.log('clicked_product =',clicked_product, form.quotation_products[0].other_taxes_and_fee);
  calculateTotal();
}

function removeProduct(quotation_prod){
  form.quotation_products.splice(form.quotation_products.indexOf(quotation_prod), 1);
  selected_products.value.splice(selected_products.value.indexOf(quotation_prod.product_slack), 1);
  calculateTotal();
}

function addService(){
  //HERE Type=2 SERVICE
  let product_template = reactive({
    type:2,
    product_slack : '',
    product_name : '',
    quantity : 1,
    is_fixed_price : false,
    sale_price : '',
    edit_sale_price : '',
    price_excluding_tax:'',
    amount : '',
    discount : [],
    discount_slack : '',
    discount_amount : 0,
    tax : '',
    tax_amount : 0,
    // total_amount : 0,
    tobacco_tax_amount: 0, 
    tax_additional_fee_type: '', 
    additional_fee_slack: '',
    prices:[],
  });
  form.quotation_products.push(product_template);
  calculateTotal();
}

function showHideAdditionalCharges(){
  form.other_charges = form.other_charges==true?false:true;
  calculateTotal();
}

const additional_charges = ref(fixed_additional_charges);

function addCharge(){
  let charges_template = reactive({
    charge_name : "",
    charge_amount :0,
  });
  form.additional_charges.push(charges_template);
}

function removeCharge(key_index){
  form.additional_charges.splice(key_index, 1);
  calculateTotal();
}

const quotation_total_product_quantity = ref(0);
const quotation_item_sub_total_amount = ref(0);
const quotation_grand_product_discount_amount = ref(0);
const quotation_sub_total_after_product_discount = ref(0);
const quotation_grand_additional_discount_amount = ref(0);
const quotation_sub_total_after_discount = ref(0);
const quotation_total_tobacco_tax = ref(0);
const quotation_total_additional_fee = ref(0);
const quotation_grand_tax_amount = ref(0);
const quotation_grand_additional_charges_amount = ref(0);
const quotation_grand_final_total_amount = ref(0);
const quotation_discount_percentage = ref(0);

watch(() =>
  quotation_grand_additional_discount_amount.value, _.debounce( (newValue) => {
    calculateTotal();
    },100),
);

function get_tax_percentages(slack){
  var selected_tax = auth.user.country.taxes.filter(function (elem) {
    if (elem.slack == slack) return elem;
  });
  return selected_tax[0].total_percentage;
}

function calculateQuotationDiscountPercentage(type, value) {
      
  let order_discount_percentage = 0;
  if(value > 0){
    if(type == 2){
      let product_amount_after_product_discount = 0;
      form.quotation_products.map((item) => {
        if(item.type == 1){
          product_amount_after_product_discount += parseFloat(item.prices.product_amount_after_product_discount);
        }else{
          if(item.prices.product_amount_after_product_discount != undefined){
            product_amount_after_product_discount += parseFloat(item.prices.product_amount_after_product_discount);
          }
        }

      });
      if(product_amount_after_product_discount > 0){
        order_discount_percentage =(value / product_amount_after_product_discount) * 100;
      }
    }else{
      order_discount_percentage =  value;
    }
  }
  return  order_discount_percentage;
  
}


function calculateTotal() {

  if (form.quotation_discount_amount != "" && form.quotation_discount_type != '') {
    var order_discount_percentage = calculateQuotationDiscountPercentage(form.quotation_discount_type, parseFloat(form.quotation_discount_amount));
    quotation_discount_percentage.value = order_discount_percentage;
  } 

  for (var index in form.quotation_products) {

    var quantity = form.quotation_products[index].quantity;
    var discount_slack = form.quotation_products[index].discount_slack;
    var additional_fee_slack = form.quotation_products[index].additional_fee_slack;
    var discount = form.quotation_products[index].discounts;
    var selected_product_discount = [0];
    var selected_additional_fee = [0];
    var is_open_price = false;
    var newPrice = 0;
    var tax_slack = form.quotation_products[index].tax;
    var tax_percentage = 0;
    if(tax_slack!='' && form.quotation_products[index].type ==2){
      tax_percentage = (tax_slack != null && tax_slack != "")?get_tax_percentages(tax_slack):0;
    }

    // DISCOUNT AMOUNT
    //if item discount selected
    if (discount_slack != null && discount_slack != "" ) {
      //find the discount from slack
      selected_product_discount = calculateProductDiscount(item_discounts.value, discount_slack);
    }
    // Additiona Fee 
    if (additional_fee_slack != null && additional_fee_slack != "" ) {
      //find the  Additiona Fee from slack
      selected_additional_fee = selectedAdditionalFee(item_additional_fees.value, additional_fee_slack);
      form.quotation_products[index].additional_fee = selected_additional_fee[0];
    }else{
      form.quotation_products[index].additional_fee = '';
    }

    if(form.quotation_products[index].is_fixed_price == false ){
      if(form.quotation_products[index].type ==1){
        newPrice = form.quotation_products[index].prices.product_rate;
      }else{
        newPrice = form.quotation_products[index].sale_price; 
      }
      is_open_price = true;
    }

    if(form.quotation_products[index].type ==1){
      var product_prices = calculateQuotation(form.quotation_products[index].product, quantity, selected_product_discount[0], order_discount_percentage, is_open_price,newPrice );
    }else{
      form.quotation_products[index].tax_percentage = tax_percentage;
      var product_prices = calculateQuotation(form.quotation_products[index], quantity, selected_product_discount[0], order_discount_percentage, is_open_price,newPrice );
    }

    form.quotation_products[index].prices = product_prices;
    
  }

  grandTotal();

  var inv_additional_charges = 0.00;
  var inv_after_additional_charges = 0.00;

  // ADDITIONAL CHARGES
  if(form.other_charges){
    for (var index in form.additional_charges) {
      var charge = form.additional_charges[index].charge_amount;
      if(!isNaN(charge) && charge!=null && charge>0){
        inv_additional_charges = parseFloat(inv_additional_charges) + parseFloat(form.additional_charges[index].charge_amount);
      }
    }
  }

  quotation_grand_additional_charges_amount.value = inv_additional_charges.toFixed(2);
  inv_after_additional_charges = parseFloat(quotation_grand_final_total_amount.value) + parseFloat(inv_additional_charges);

  // PAYABLE AMOUNT
  quotation_grand_final_total_amount.value = inv_after_additional_charges.toFixed(2);

}

function grandTotal() {
  var total_product_quantity = 0;
  var subtotal = 0;
  var product_discount = 0;
  var subtotal_after_product_discount = 0;
  var order_discount = 0;
  var subtotal_after_order_discount = 0;
  var additional_fee = 0;
  var tobacco_tax = 0;
  var tax = 0;
  var total = 0;

  form.quotation_products .map((item) => {
    let temp_subtotal = item.prices.product_amount;
    let temp_product_discount = item.prices.product_discount_amount;
    let temp_subtotal_after_product_discount =  temp_subtotal - temp_product_discount;
    let temp_order_discount = item.prices.order_discount_amount;
    let temp_subtotal_after_order_discount = temp_subtotal_after_product_discount - temp_order_discount;
    let temp_additional_fee = item.prices.additional_fee_amount;
    let temp_tobacco_tax = item.prices.tobacco_tax_amount;
    let temp_tax = item.prices.tax_amount;
    let temp_total = temp_subtotal_after_order_discount + temp_additional_fee + temp_tobacco_tax + temp_tax;

    total_product_quantity += parseFloat(item.prices.product_quantity);
    subtotal += temp_subtotal;
    product_discount += temp_product_discount;
    subtotal_after_product_discount += temp_subtotal_after_product_discount;
    order_discount += temp_order_discount;
    subtotal_after_order_discount += temp_subtotal_after_order_discount;
    additional_fee += temp_additional_fee;
    tobacco_tax += temp_tobacco_tax;
    tax += temp_tax;
    total += temp_total;
  });

  let round_off = 0;
  // if(_.round(total,0) != _.round(total,2)){
  //   round_off = _.round(total,0) - _.round(total,2);
  //   total += round_off;
  // }

  quotation_total_product_quantity.value = total_product_quantity;
  quotation_item_sub_total_amount.value = _.round(subtotal, 2);
  quotation_grand_product_discount_amount.value = _.round(product_discount, 2);
  quotation_sub_total_after_product_discount.value = _.round( subtotal_after_product_discount,2 );
  quotation_grand_additional_discount_amount.value =  _.round(order_discount, 2);
  quotation_sub_total_after_discount.value = _.round( subtotal_after_order_discount,2 );
  quotation_total_additional_fee.value = _.round(additional_fee, 2);
  quotation_total_tobacco_tax.value = _.round(tobacco_tax, 2);
  quotation_grand_tax_amount.value =  _.round(tax, 2);
  // quotation_grand_additional_charges_amount = 
  quotation_grand_final_total_amount.value = _.round(total, 2);
 
}


function selectedAdditionalFee(item_additional_fees,selected_additional_fee_slack){
  //find the selected discount
  return item_additional_fees.filter(function (elem) {
    if (elem.key == selected_additional_fee_slack) return elem;
  });
}

function calculateProductDiscount(discounts,selected_discount){
  //find the selected discount
   return discounts.filter(function (elem) {
    if (elem.key == selected_discount) return elem;
  }); 
}

async function saveQuotation() {
  form.is_submitting = true;
  var form_data = new FormData();
  form_data.append('customer', form.customer);
  form_data.append('quotation_number', form.quotation_number);
  form_data.append('quotation_reference_number', form.quotation_reference_number);
  form_data.append('quotation_date', form.quotation_date);
  form_data.append('quotation_due_date', form.quotation_due_date);
  form_data.append('products', JSON.stringify(form.quotation_products));

  form_data.append('grand_total_product_quantity', quotation_total_product_quantity.value!=null?quotation_total_product_quantity.value:0);
  form_data.append('grand_subtotal_after_product_quantity', quotation_item_sub_total_amount.value!=null?quotation_item_sub_total_amount.value:0);
  form_data.append('grand_product_discount', quotation_grand_product_discount_amount.value!=null?quotation_grand_product_discount_amount.value:0);
  form_data.append('grand_subtotal_after_product_discount',quotation_sub_total_after_product_discount.value!=null?quotation_sub_total_after_product_discount.value:0);
  form_data.append('quotation_discount_amount', quotation_grand_additional_discount_amount.value!=null?quotation_grand_additional_discount_amount.value:0);
  form_data.append('quotation_discount_type', form.quotation_discount_type!=null?form.quotation_discount_type:0);
  form_data.append('quotation_discount_percentage', quotation_discount_percentage.value!=null?quotation_discount_percentage.value:0);
  form_data.append('is_additional_charges', form.other_charges);
  form_data.append('additional_charges', JSON.stringify(form.additional_charges));
  form_data.append('grand_product_additional_fee',quotation_total_additional_fee.value);
  form_data.append('grand_product_tobacco_tax',quotation_total_tobacco_tax.value);
  form_data.append('grand_product_tax', quotation_grand_tax_amount.value);
  form_data.append('quotation_additional_charges', quotation_grand_additional_charges_amount.value);
  form_data.append('grand_product_amount', quotation_grand_final_total_amount.value );

  form_data.append('terms', form.terms);
  form_data.append('quotation_slack', form.slack);
  var submit_url = (form.slack!='' && form.slack!= undefined)?'/api/quotation/update':'/api/quotation/save';
  await axios.post(submit_url, form_data).then((response) => {
    if (response.data.status_code == 200) {
      toast.success(response.data.msg);
      form.is_submitting = false;
      router.push('/quotations');
    } else {
      try {
        form.server_messages.type = "error";
        form.server_messages.messages = JSON.parse(response.data.msg);
      } catch (err) {
        form.server_messages.type = "error";
        form.server_messages.messages = response.data.msg;
      }
      form.is_submitting = false;
    }

  }).catch((error) => {
    form.server_messages.type = "error";
    form.server_messages.messages = error;
    form.is_submitting = false;
  });

}

const show_add_customer_modal = ref(false);
async function openAddCustomerModal(){
  show_add_customer_modal.value = true;
}

async  function closeAddCustomerModal() {
  show_add_customer_modal.value = false;
  document.getElementById("add_customer_form").reset();
  getQuotationAddData();
  document.getElementById('close_btn').click();
}

const terms_character_count = computed(() => {
  if(form.terms =='' || form.terms == null){
    return 0+' / 500 Characters';
  }else{
    return form.terms.length+' / 500 Characters';
  } 
});

function resetData() {
  Object.assign(form, initialState);
}

function number_format (number, decimals, dec_point, thousands_sep) {
  // Strip all characters but numerical ones.
  number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
  var n = !isFinite(+number) ? 0 : +number,
      prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
      sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
      dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
      s = '',
      toFixedFix = function (n, prec) {
        var k = Math.pow(10, prec);
        return '' + Math.round(n * k) / k;
      };
  // Fix for IE parseFloat(0.55).toFixed(0) = 0;
  s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
  if (s[0].length > 3) {
    s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
  }
  if ((s[1] || '').length < prec) {
    s[1] = s[1] || '';
    s[1] += new Array(prec - s[1].length + 1).join('0');
  }
  return s.join(dec);
}

</script>