<template>
  <Form :validation-schema="schema" @submit="savePurchaseOrder" enctype="multipart/form-data" :initial-values="form"
    v-if="slack == '' || slack == undefined || (slack != '' && is_loaded)">
    <div class="row">
      <AsyncServerMessage class="py-3" v-if="form.server_messages.messages != ''"
                          :server_messages="form.server_messages"/>
      <div class="col-md-12">
        <div class="row">
          <div class="col-md-12">
            <div class="card">
              <div class="row">
                <h5 class="section-title pb-3 text-muted">{{ $t('Basic Details') }}:</h5>
                <div class="col-6 col-md-4 col-lg-3">
                  <VMultiSelect
                      name="supplier"
                      :label="labels.supplier"
                      :placeholder="labels.select_supplier"
                      :text="'name'"
                      :value="'slack'"
                      :options="suppliers"
                      v-model="form.supplier"
                      mode="single"
                      required
                      :addModalShow="true"
                      :addModalId="'#addSupplierModal'"
                  />
                </div>
                <div class="col-6 col-md-4 col-lg-3">
                  <VSelect
                      name="expense_account"
                      :label="labels.expense_account"
                      v-model="form.expense_account"
                      :placeholder="labels.select_expense_account"
                      :options="expense_accounts"
                      required
                  />
                </div>
                <div class="col-6 col-md-4 col-lg-3">
                  <VSelect
                    name="payment_method_id"
                    :label="'Payment Method'"
                    v-model="form.payment_method_id"
                    :options="payment_methods"
                    :placeholder="'Select Payment Method'"
                    required
                  />
                </div>

                <div class="col-6 col-md-4 col-lg-3">
                  <VTextInput
                      type="text"
                      name="po_number"
                      v-model="form.po_number"
                      :label="labels.po_number"
                      :required="true"
                      :disabled="true"
                  />
                </div>

                <div class="col-4 col-md-3 col-lg-2">
                  <VTextInput
                      type="text"
                      name="po_reference_number"
                      v-model="form.po_reference_number"
                      :label="labels.po_reference_number"
                  />
                </div>

                <div class="col-4 col-md-3 col-lg-2">
                  <VTextInput
                      type="date"
                      name="po_date"
                      v-model="form.po_date"
                      :label="labels.po_date"
                      :required="true"
                  />
                </div>

                <div class="col-4 col-md-3 col-lg-2">
                  <VTextInput
                      type="date"
                      name="po_due_date"
                      v-model="form.po_due_date"
                      :label="labels.po_due_date"
                  />
                </div>

                <div class="col-6 col-md-4 col-lg-3">
                  <VSelect
                      name="reporting_person"
                      :label="labels.reporting_person"
                      v-model="form.reporting_person"
                      :placeholder="labels.select_person"
                      :options="reporting_persons"
                  />
                </div>

                <div class="col-6 col-md-4 col-lg-3 pt-4">
                  <div class="form-field">
                    <div class="form-check form-switch pt-3">
                      <input class="form-check-input me-2" type="checkbox" role="switch" id="is_stockable" checked
                             v-model="form.is_stockable">
                      <label class="form-check-label" for="is_stockable">{{ $t('Is Stockable') }} <em>*</em> </label>
                      <VTooltip :message="labels.is_stockable_tooltip"/>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          <div class="col-md-12">
            <div class="card">
              <div class="row">

                <h5 class="section-title pb-2 text-muted">{{ $t('Products') }}:</h5>
                <div class="col-md-4 mb-4">
                  <AsyncProductSearch
                      @select-product="addProduct"
                      :placeholder="labels.search_placeholder"
                      :selected_products="selected_products"
                      :button_placeholder="labels.add_service"
                  />
                </div>
                <!--  Table goes here! -->
                <div class="table-responsive">
                  <table class="table table-hover table-bordered mb-3 table-responsive-data">
                    <thead class="bg-light">
                    <tr>
                      <th>{{ $t('Product/Service') }}</th>
                      <th class="text-center">{{ $t('Quantity') }}</th>
                      <th class="text-center">{{ $t('Unit Price') }}</th>
                      <th class="text-center">{{ $t('Amount') }}</th>
                      <th class="text-center">{{ $t('Tax') }}</th>
                      <th class="text-center">{{ $t('Tax Amount') }}</th>
                      <th class="text-center">{{ $t('Total') }}</th>
                      <th class="text-center">{{ $t('Remove') }}</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-if="form.purchase_order_products.length>0" v-for="(purchase_order_product,index) in form.purchase_order_products" :key="index">
                      <input type="hidden" name="product_name" v-model="purchase_order_product.product_name">
                      <input type="hidden" name="product.sku" v-model="purchase_order_product.product_slack">
                      <td data-title="Search Product" width="20%" v-if="purchase_order_product.type==1">
                        {{  purchase_order_product.product_name }}
                        <Field type="hidden" :name="'purchase_order_products['+index+'].product_name'" :value="purchase_order_product.product_name" ></Field>
                        <ErrorMessage :name="'purchase_order_products['+index+'].product_name'" as="div" class="error"></ErrorMessage>
                      </td>
                      <td data-title="Search Product" width="20%" v-else>
                        <VTextInput
                            type="text"
                            :name="'purchase_order_products['+index+'].product_name'"
                            label=""
                            v-model="purchase_order_product.product_name"
                        />
                      </td>
                      <td data-title="Quantity" width="15%" v-if="purchase_order_product.type==1">
                        <VTextInput
                            type="number"
                            :name="'purchase_order_products['+index+'].quantity'"
                            :input_group_text="labels.units"
                            label=""
                            v-model="purchase_order_product.quantity"
                            min="0.01"
                            step="0.01"
                            v-on:input="calculateTotal"
                        />
                      </td>
                      <td v-else class="text-end">
                        <span >1.00</span>
                        <Field type="hidden" :name="'purchase_order_products['+index+'].quantity'" :value="purchase_order_product.quantity" ></Field>
                        <ErrorMessage :name="'purchase_order_products['+index+'].quantity'" as="div" class="error"></ErrorMessage>
                      </td>
                      <td data-title="Unit Price" width="15%">
                        <VTextInput
                            type="number"
                            :name="'purchase_order_products['+index+'].sale_price'"
                            :input_group_text="'SAR'"
                            v-model="purchase_order_product.sale_price"
                            min="0.01"
                            step="0.01"
                            v-on:input="calculateTotal"
                            label=""
                        />
                      </td>
                      <td data-title="Amount" width="10%" class="text-end">
                        {{ purchase_order_product.amount }}
                      </td>
                      <td data-title="Tax %" width="10%">
                        <VSelect
                            :name="`tax_${index}`"
                            :placeholder="labels.select_tax"
                            :options="taxes"
                            class="mb-0"
                            v-model="purchase_order_product.tax"
                            v-on:change="calculateTotal"
                            v-bind:id="index"
                            label=""
                            :islabel=false
                        />
                      </td>
                      <td data-title="Select Tax" width="10%" class="text-end">
                        {{ purchase_order_product.tax_amount }}
                      </td>
                      <td data-title="Amount" width="15%" class="text-end">{{ purchase_order_product.total_amount }}</td>
                      <td data-title="Action" width="5%" class="text-center">
                        <a role="button" class="btn btn-icon btn-xs btn-light-danger" @click="removeProduct(purchase_order_product)">
                            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" width="0.88em" height="1em" viewBox="0 0 448 512" class="iconify iconify--fa6-regular"><path fill="currentColor" d="m170.5 51.6l-19 28.4h145l-19-28.4c-1.5-2.2-4-3.6-6.7-3.6h-93.7c-2.7 0-5.2 1.3-6.7 3.6zm147-26.6l36.7 55H424c13.3 0 24 10.7 24 24s-10.7 24-24 24h-8v304c0 44.2-35.8 80-80 80H112c-44.2 0-80-35.8-80-80V128h-8c-13.3 0-24-10.7-24-24s10.7-24 24-24h69.8l36.7-55.1C140.9 9.4 158.4 0 177.1 0h93.7c18.7 0 36.2 9.4 46.6 24.9zM80 128v304c0 17.7 14.3 32 32 32h224c17.7 0 32-14.3 32-32V128zm80 64v208c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16m80 0v208c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16m80 0v208c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16"></path></svg>
                          </a>
                      </td>
                    </tr>
                    </tbody>
                  </table>
                </div>
                <div class="row justify-content-between mt-1">
                  <div class="col-auto">

                    <div class="col-auto text-decoration-underline mb-3">
                      <a href="javascript:;" @click="addService">+ {{ $t('Add Service') }}</a>
                    </div>

                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" value="" id="Shipping_charge" data-bs-toggle="collapse" data-bs-target="#shipping_table_wrap" 
                        v-model="form.other_charges" @click="showHideAdditionalCharges" >
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
                              <!-- <ErrorMessage :name="'additional_charges['+index+'].charge_name'" as="div" class="error text-start"></ErrorMessage> -->
                            </div>
                          </th>
                          <th class="border-0 field-m-0 field-label-hide">
                            <div class="form-field mb-0">
                              <VTextInput 
                                type="number" 
                                :name="'additional_charges['+index+'].charge_amount'" 
                                v-model="additional_charge.charge_amount" 
                                :placeholder="labels.charge" v-on:input="other_charge_calc"  
                              />
                              <!-- <ErrorMessage :name="'additional_charges['+index+'].charge_amount'" as="div" class="error"></ErrorMessage> -->
                            </div>
                          </th>
                          <th class="border-0 px-0">
                            <div class="form-field mb-0">
                            <div class="d-flex align-items-center pt-0 pb-0">
                              <button role="button" type="button" class="btn btn-sm btn-icon btn-light-danger" 
                                @click="removeCharge(index)" :disabled="form.additional_charges.length>1 ? false : true">x</button>
                              <button role="button" type="button" class="btn btn-sm btn-icon btn-light-primary ms-2" 
                                @click="addCharge()" v-if="index == form.additional_charges.length - 1">+</button>
                            </div>
                            </div>
                          </th>
                        </tr>
                      </table>
                    </div>
                  </div>
                  <div class="col-md-3 p-0">
                    <table class="table">
                      <tr>
                        <th class="text-end border-0"><h6>{{ $t('Sub Total') }}</h6></th>
                        <th class="border-0 text-end"><h6>{{ grand_sub_total_amount }} SAR</h6></th>
                        <th class="border-0 px-0"></th>
                      </tr>
                      <tr>
                        <th class="text-end border-0"><h6>{{ $t('Taxes') }}</h6></th>
                        <th class="border-0 text-end"><h6>{{ grand_tax_amount }} SAR</h6></th>
                        <th class="border-0 px-0"></th>
                      </tr>
                      <tr v-if="form.other_charges==true">
                        <th class="text-end border-0"><h6>{{ $t('Other Charges') }}</h6></th>
                        <th class="border-0 text-end"><h6>{{ grand_additional_charges_amount }} SAR</h6></th>
                        <th class="border-0 px-0"></th>
                      </tr>
                      <tr class="tr-total">
                        <th class="text-end border-0"><h5>{{ $t('Total') }}</h5></th>
                        <th class="border-0 text-end text-dark"><h5>{{ grand_final_total_amount }} SAR</h5></th>
                        <th  class="border-0 px-0"></th>
                      </tr>
                    </table>
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

  <div class="modal hide" id="addSupplierModal" tabindex="-1" aria-labelledby="Add Customer" aria-modal="true"
       role="dialog"  data-bs-backdrop="static" data-bs-keyboard="false">
    <div class="modal-dialog modal-dialog-centered modal-xl">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title fs-5">{{ $t('Add Supplier') }}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="closeModal" id="close_btn"></button>
        </div>
        <div class="modal-body">
          <AddSupplier  @closeAddSupplierModal="closeAddSupplierModal" :popupWindow="true"/>
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
import {useRoute} from "vue-router";
import { useI18n } from 'vue-i18n'

const { t } = useI18n();
const labels = ref({
  search_placeholder: t("Search and Add Product"),
  add_service: t("Add Service"),
  supplier: t('Supplier'),
  select_supplier: t('Select Supplier'),
  expense_account: t('Expense Account'),
  select_expense_account: t('Select Expense Account'),
  po_number: t('PO Number'),
  po_reference_number: t('PO Reference'),
  po_date: t('PO Date'),
  po_due_date: t('PO Due Date'),
  reporting_person: t('Reporting Person'),
  select_person: t('Select Person'),
  is_stockable_tooltip: t('If this option is enabled, product stock will be updated when the purchase order is Delivered/Closed.'),
  units: t('Units'),
  select_tax: t('Select Tax'),
  charge: t('Charge'),
  charge_name: t('Charge Name'),
  value: t('Value')
});

const AsyncServerMessage = defineAsyncComponent(() => import('@/components/common/ServerMessage.vue'));
const AsyncProductSearch = defineAsyncComponent(() => import('@/components/common/ProductSearch.vue'));

const route = useRoute();
const slack = route.params.slack;
const purchase_order = ref([]);
const auth = useAuthStore();
const currency_symbol = computed(() => {
  return auth.user.currency.symbol;
});

const initialState = {
  server_messages: {
    type: "",
    messages: "",
  },
  is_submitting: false,

  // form data   
  slack: "",
  supplier: "",
  expense_account: "",
  payment_method_id: "",
  po_number: "",
  po_reference_number: "",
  po_date: "",
  po_due_date: "",
  is_stockable: true,
  terms: "",
  other_charges:false,
  reporting_person: "",
  purchase_order_products: [],
  additional_charges:[]
};

const form = reactive({...initialState});

const schema = yup.object().shape({
  supplier: yup.string().required(t('name is required', { name: t('Supplier') })),
  expense_account: yup.string().required(t('name is required', { name: t('Expense Account') })),
  payment_method_id: yup.string().required(t('name is required', { name: t('Payment Method') })),
  po_reference_number: yup.number().typeError(t('must be a number',{ name: t('PO Reference') })).nullable().moreThan(0, "PO Reference cannot be negative")
      .transform((_, val) => (val !== "" ? Number(val) : null)),
  po_date: yup.string().required(t('name is required', { name: t('PO Date') })),
  purchase_order_products: yup.array(yup.object({
    product_name: yup.string().required(t('name is required', { name: t('Product Name') })),
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
  },['charge_name','charge_amount'])).required()
});

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
  getPOAddData();
  form.additional_charges = fixed_additional_charges;
  if(slack!=null){
    getPurchaseOrder();
  }
  getPaymentMethods();
});

  const payment_methods = ref([]);
  async function getPaymentMethods() {
    let data = await axios.get("api/payment_methods/all");
    // expense Accounts
    let payment_methods_data = data.data.data;
    _.forEach(payment_methods_data, (item) => {
      let template = {
        'key': item.id,
        'value': item.name,
      };
      payment_methods.value.push(template);
    });
    
  }

function other_charge_calc(){
  setTimeout(() => calculateTotal(), 200);
}

const suppliers = ref([]);
const expense_accounts = ref([]);
const taxes = ref([]);
const reporting_persons = ref([]);
async function getPOAddData(){
  let add_data = await axios.get('api/purchase_order/add');

  form.po_number = add_data.data.data.po_number;
  form.po_reference_number = add_data.data.data.po_reference_number;
  //Suppliers
  let supplier_data = add_data.data.data.suppliers;
  _.forEach(supplier_data, (item) => {
    let template = {
      'slack': item.slack,
      'name': item.name!=""?(item.phone!="" && item.phone!="null" && item.phone!= undefined?item.name+' - '+item.phone:item.name):item.phone,
    };
    suppliers.value.push(template);
  })


  // expense Accounts
  let expense_accounts_data = add_data.data.data.expense_accounts;
  _.forEach(expense_accounts_data, (item) => {
    let template = {
      'key': item.id,
      'value': item.name,
      'chk_default': item.is_default,
    };
    if(item.is_default == 1){
      form.expense_account = item.id;
    }
    expense_accounts.value.push(template);
  })

  //Tax from Auth
  _.forEach(auth.user.country.taxes, (item) => {
    let template = {
      'key': item.slack,
      'value': item.name,
      'percentage': item.total_percentage,
    };
    taxes.value.push(template);
  })

  //Reporting Person from Auth
  _.forEach(auth.user.login_branch.branch_users, (item) => {
    if(item.user.slack!=auth.user.slack){
      let template = {
        'key': item.user.slack,
        'value': item.user.name,
      };
      reporting_persons.value.push(template);
    }
  })

}
const is_loaded = ref(false);
async function getPurchaseOrder(){
  await axios.get('/api/purchase_order', { params : {
      slack : slack,
    } }).then( (response) => {
    is_loaded.value = true;
    purchase_order.value = response.data.data;
    form.slack = purchase_order.value.slack;
    form.supplier = purchase_order.value.supplier.slack;
    form.expense_account = purchase_order.value.account_id;
    form.payment_method_id = purchase_order.value.payment_method_id;
    form.po_number = purchase_order.value.po_number;
    form.po_reference_number = purchase_order.value.reference_no;
    form.po_date = purchase_order.value.po_date;
    form.po_due_date = purchase_order.value.due_date;
    form.is_stockable = purchase_order.value.is_update_in_stock == 1?true:false;
    form.terms = purchase_order.value.terms;
     if(purchase_order.value.purchase_order_products.length > 0)
      {
        form.purchase_order_products = [];
        for(var i = 0;i < purchase_order.value.purchase_order_products.length;i++)
        {
          let product_type = purchase_order.value.purchase_order_products[i].type;
          let product_template = reactive({
            type:purchase_order.value.purchase_order_products[i].type,
            product_slack : (product_type == 1)? purchase_order.value.purchase_order_products[i].product.slack : purchase_order.value.purchase_order_products[i].slack,
            product_name : purchase_order.value.purchase_order_products[i].product_name,
            quantity : purchase_order.value.purchase_order_products[i].product_quantity,
            sale_price : purchase_order.value.purchase_order_products[i].product_price_without_tax,
            amount : purchase_order.value.purchase_order_products[i].subtotal_after_product_quantity,
            tax : purchase_order.value.purchase_order_products[i].tax?purchase_order.value.purchase_order_products[i].tax.slack:"",
            tax_amount : purchase_order.value.purchase_order_products[i].product_tax,
            total_amount : purchase_order.value.purchase_order_products[i].product_amount,
          });
          form.purchase_order_products.push(product_template);
        }
      }
    if(response.data.data.purchase_order_charges.length > 0){
      form.additional_charges = [];
      for(var i = 0;i < response.data.data.purchase_order_charges.length;i++)
      {
        var charge = {
          charge_name : response.data.data.purchase_order_charges[i].title,
          charge_amount: response.data.data.purchase_order_charges[i].charges
        }
        form.additional_charges.push(charge);
      }
      form.other_charges = true;
      $("#shipping_table_wrap").addClass('show');
    }
    form.reporting_person = purchase_order.value.reporting_user?purchase_order.value.reporting_user.slack:0;
    calculateTotal();
  }).catch((error) => {
    form.server_messages.type = "error";
    form.server_messages.messages = error;
    console.log(error);
  });

}

const selected_products = ref([]);

function addProduct(clicked_product){
  selected_products.value.push(clicked_product.slack);
  //HERE Type=1 PRODUCT
  let product_template = reactive({
    type:1,
    product_slack : clicked_product.slack,
    product_name : clicked_product.name,
    quantity : 1,
    sale_price : clicked_product.purchase_price,
    amount : clicked_product.purchase_price,
    tax : '',
    tax_amount : 0,
    total_amount : clicked_product.purchase_price,
  });
  form.purchase_order_products.push(product_template);
  calculateTotal();
}

function removeProduct(purchase_order_product){
  form.purchase_order_products.splice(form.purchase_order_products.indexOf(purchase_order_product), 1);
  selected_products.value.splice(selected_products.value.indexOf(purchase_order_product.product_slack), 1);
  calculateTotal();
}

function addService(){
  //HERE Type=2 SERVICE
  let product_template = reactive({
    type:2,
    product_slack : '',
    product_name : '',
    quantity : 1,
    sale_price : '',
    amount : '',
    tax : '',
    tax_amount : 0,
    total_amount : 0,
  });
  form.purchase_order_products.push(product_template);
  calculateTotal();
}

function showHideAdditionalCharges(){
  form.other_charges = form.other_charges==true?false:true;
  calculateTotal(); 
}

function addCharge(){
  let charges_template = {
    charge_name : "",
    charge_amount :0,
  };
  form.additional_charges.push(charges_template);
}

function removeCharge(key_index){
  form.additional_charges.splice(key_index, 1);
  calculateTotal();
}

const grand_product_price_without_tax_amount = ref(0);
const grand_product_quantity_sum = ref(0);
const grand_sub_total_amount = ref(0);
const grand_tax_amount = ref(0);
const grand_additional_charges_amount = ref(0);
const grand_final_total_amount = ref(0);


function calculate_tax(item_total, tax_percentage) {
  var tax_amount = (parseFloat(tax_percentage) / 100) * parseFloat(item_total);
  return tax_amount.toFixed(2);
}


function get_tax_percentages(slack){
  var selected_tax = auth.user.country.taxes.filter(function (elem) {
    if (elem.slack == slack) return elem;
  });
  return selected_tax[0].total_percentage;
}

function calculateTotal() {
  var grand_product_price_without_tax = 0;
  var grand_product_quantity = 0;
  var grand_sub_total = 0;
  var grand_tax = 0;
  var grand_additional_charges = 0;
  var grand_final_total =0;

  for (var index in form.purchase_order_products) {
    var item_tax_amount = 0;
    var item_total_amount = 0;

    var quantity = form.purchase_order_products[index].quantity;
    var unit_price = form.purchase_order_products[index].sale_price;
    grand_product_price_without_tax += parseFloat(unit_price);
    var tax = form.purchase_order_products[index].tax;

    if (!isNaN(quantity) && quantity != null && quantity != "" && !isNaN(unit_price) && unit_price != null && unit_price != "") {
      //item total
      grand_product_quantity += parseFloat(quantity);
      item_total_amount = parseFloat(quantity) * parseFloat(unit_price);
      grand_sub_total += item_total_amount;
      item_total_amount = item_total_amount.toFixed(2);
      form.purchase_order_products[index].amount = item_total_amount;
     
      //if item tax added
      if (tax != null && tax != "" ) {
        var tax_percentage = get_tax_percentages(tax);
        if (tax_percentage >= 0) {
          item_tax_amount = calculate_tax(item_total_amount, tax_percentage);
          item_tax_amount = parseFloat(item_tax_amount).toFixed(2);
          form.purchase_order_products[index].tax_amount = item_tax_amount;
        }
      }

      item_total_amount = parseFloat(item_total_amount) + parseFloat(item_tax_amount);
      item_total_amount = item_total_amount.toFixed(2);
      form.purchase_order_products[index].total_amount = item_total_amount;

      grand_tax = parseFloat(grand_tax) + parseFloat(item_tax_amount);

    }else{
      form.purchase_order_products[index].amount = 0;
      form.purchase_order_products[index].total_amount = 0;
      continue;
    }

  }

  if(form.other_charges == true){
    for (var index in form.additional_charges) {
      var charge_amount = form.additional_charges[index].charge_amount;
      if(!isNaN(charge_amount) && charge_amount!=null && charge_amount>0){
        grand_additional_charges = parseFloat(grand_additional_charges) + parseFloat(charge_amount);
      }
    }
  }

  grand_final_total = parseFloat(grand_sub_total) + parseFloat(grand_tax) + parseFloat(grand_additional_charges);
  grand_product_price_without_tax_amount.value = grand_product_price_without_tax.toFixed(2);
  grand_product_quantity_sum.value = grand_product_quantity;
  grand_sub_total_amount.value = grand_sub_total.toFixed(2);
  grand_tax_amount.value = grand_tax.toFixed(2);
  grand_additional_charges_amount.value = grand_additional_charges.toFixed(2);
  grand_final_total_amount.value = grand_final_total.toFixed(2);

}

async function savePurchaseOrder() {
  form.is_submitting = true;
  var form_data = new FormData();
  form_data.append('supplier', form.supplier);
  form_data.append('account_id', form.expense_account);
  form_data.append('payment_method_id', form.payment_method_id);
  form_data.append('po_number', form.po_number);
  form_data.append('po_reference_number', form.po_reference_number);
  form_data.append('po_date', form.po_date);
  form_data.append('po_due_date', form.po_due_date);
  form_data.append('is_stockable', form.is_stockable);
  form_data.append('reporting_person', form.reporting_person!=null?form.reporting_person:0);
  form_data.append('products', JSON.stringify(form.purchase_order_products));
  form_data.append('is_additional_charges', form.other_charges);
  form_data.append('additional_charges', JSON.stringify(form.additional_charges));
  form_data.append('terms', form.terms);
  form_data.append('po_slack', form.slack);
  var submit_url = (form.slack!='' && form.slack!=undefined)?'/api/purchase_order/update':'/api/purchase_order/save';
  await axios.post(submit_url, form_data).then((response) => {
    if (response.data.status_code == 200) {
      toast.success(response.data.msg);
      form.is_submitting = false;
      router.push('/purchase_orders');
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

function resetData() {
  Object.assign(form, initialState);
}

const terms_character_count = computed(() => {
  if(form.terms =='' || form.terms == null){
    return 0+' / 500 Characters';
  }else{
    return form.terms.length+' / 500 Characters';
  } 
});

async  function closeAddSupplierModal() {
    document.getElementById('close_btn').click();
    refreshSuppliers();
}

async function refreshSuppliers(){
      await axios.get('/api/suppliers/all').then( (response) => {
          let supplier_data = response.data.data;
          suppliers.value = [];
          _.forEach(supplier_data, (item) => {
            let template = {
              'slack': item.slack,
              'name': item.name!=""?(item.phone!="" && item.phone!="null" && item.phone!= undefined?item.name+' - '+item.phone:item.name):item.phone,
            };
            suppliers.value.push(template);
          });
      }).catch((error) => {
          form.server_messages.type = "error";
          form.server_messages.messages = error;
      });
  }
</script>