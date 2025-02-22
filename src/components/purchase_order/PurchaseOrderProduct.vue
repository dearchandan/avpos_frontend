<template>
  <div class="row">
    <div class="col-md-12">
      <div class="card">
        <div class="row">
          <div class="col-md-12 mb-3">
            <h5>{{ $t('Products/Services') }}</h5>
          </div>
          <Form>
            <div class="col-12">
              <table class="table table-condensed">
                <thead>
                <tr>
                  <th width="5%" v-if="props.purchase_order.approval_status==1 && props.purchase_order.delivery_status!=2"><input type="checkbox" class="form-check-input me-1" v-model="selectAll" @change="selectAllItems" /></th>
                  <th width="10%">{{ $t('Product/Service') }}</th>
                  <th width="10%" class="text-end">{{ $t('Quantity') }}</th>
                  <th width="10%" class="text-end" v-if="props.purchase_order.approval_status==1 && props.purchase_order.delivery_status!=2">{{ $t('Accept Quantity') }}</th>
                  <th width="10%" class="text-end">{{ $t('Unit Price') }}</th>
                  <th width="10%" class="text-end">{{ $t('Amount') }}</th>
                  <th width="10%" class="text-end">{{ $t('Tax %') }}</th>
                  <th width="10%" class="text-end">{{ $t('Tax Amount') }}</th>
                  <th width="10%" class="text-end">{{ $t('Total') }}</th>
                  <th width="10%" class="text-center">{{ $t('Accepted Status') }}</th>
                </tr>
                </thead>
                <tbody>

                <tr v-if="purchase_order_products.length>0" v-for="(purchase_order_product,index) in purchase_order_products" :key="index">
                  <td v-if="props.purchase_order.approval_status==1 && props.purchase_order.delivery_status!=2">
                    <input type="checkbox" class="form-check-input me-1" :value="purchase_order_product.po_product_slack" v-model="selectedItems" :id="index" v-if="purchase_order_product.status!=2"/>
                  </td>
                  <!--:disabled="purchase_order_product.status"-->
                  <td><strong>{{ purchase_order_product.product_name }}</strong></td>
                  <td class="text-end">{{ purchase_order_product.quantity }}</td>
                  <td class="text-end" v-if="props.purchase_order.approval_status==1 && props.purchase_order.delivery_status!=2">
                    <VTextInput
                      type="number"
                      :name="'accept_quantity['+index+']'"
                      v-model="purchase_order_product.accept_quantity"
                      :max="purchase_order_product.accept_quantity"
                      :min="0"
                      :step="0.01"
                      v-if="purchase_order_product.status!=2" @input="checkQuantity(purchase_order_product, index)"
                    />
                    <div :id="'accept_quantity_error'+index" class="error d-none">{{ $t('Accept Quantity must be less than or equal to Balance Quantity of '+purchase_order_product.pending_quantity) }} </div>
                  </td>
                  <td class="text-end">{{ purchase_order_product.sale_price }}</td>
                  <td class="text-end">{{ purchase_order_product.amount }}</td>
                  <td class="text-end">{{ purchase_order_product.tax }}</td>
                  <td class="text-end">{{ purchase_order_product.tax_amount }}</td>
                  <td class="text-end">{{ purchase_order_product.total_amount }}</td>
                  <td class="text-center">
                    <span class="badge badge-primary" v-if="purchase_order_product.status==0">{{ $t('Pending') }}</span>
                    <span class="badge badge-info" v-if="purchase_order_product.status==1">{{ $t('Partial Accepted') }}</span>
                    <span class="badge badge-success" v-if="purchase_order_product.status==2">{{ $t('Accepted') }}</span>
                  </td>
                </tr>
                <tr v-else>
                  <td colspan="8">{{ $t('No Product Available') }}</td>
                </tr>

                </tbody>

              </table>
            </div>
            <div class="col-12">
              <div class="row">
                <div :class="props.purchase_order.purchase_order_charges.length>0? 'col-3':'col-9'">
                  <h6 v-show="props.purchase_order.purchase_order_charges.length>0" class="mt-3">{{ $t('Other Charges') }}</h6>
                  <table class="table table-condensed">
                    <tr v-for="(charge,index) in props.purchase_order.purchase_order_charges" :key="index">
                      <td>{{charge.title}}</td>
                      <td>{{charge.charges}}</td>
                    </tr>
                  </table>
                </div>
                <div class="col-6" v-if="props.purchase_order.purchase_order_charges.length>0"></div>
                <div class="col-3 text-end mt-3">
                  <table class="table table-condensed">
                    <tr>
                      <td>{{ $t('Sub Total ') }}</td>
                      <td>{{ props.purchase_order.grand_subtotal_after_product_quantity }} SAR</td>
                    </tr>
                    <tr>
                      <td>{{ $t('Taxes') }}</td>
                      <td>{{ props.purchase_order.grand_product_tax }} SAR</td>
                    </tr>
                    <tr v-show="props.purchase_order.grand_product_other_changes>0">
                      <td>{{ $t('Other Charges') }}</td>
                      <td>{{ props.purchase_order.grand_product_other_changes }} SAR</td>
                    </tr>
                    <tr>
                      <td><h5 class="p-0">{{ $t('Total') }}</h5></td>
                      <td><h5 class="p-0">{{ props.purchase_order.grand_product_amount }} SAR</h5></td>
                    </tr>
                  </table>
                </div>
              </div>
            </div>
            <div class="col-12 py-3" v-if="form.server_messages.messages != ''">
              <ServerMessage  :server_messages="form.server_messages"  />
            </div>
            <div class="col-12 mt-2 text-end">
              <button
                  type="button"
                  class="btn btn-primary"
                  :disabled="form.is_submitting || form.is_disabled"
                  v-if="selectedItems.length>0"
                  @click="submitForm('selected')"
              >
                <clip-loader v-if="form.is_submitting" :color="'white'" :size="'20px'" class="pt-2 pe-2">  </clip-loader>
                <span class="pt-0" v-if="form.is_submitting">{{ $t('Saving...') }}</span>
                <span class="pt-0" v-else>{{ $t('Accept Selected') }}</span>

              </button>
              <button
                  type="button"
                  class="btn btn-primary ms-2"
                  :disabled="form.is_submitting || form.is_disabled" 
                  @click="submitForm('all')"
                  v-if="props.purchase_order.approval_status==1 && props.purchase_order.delivery_status!=2"
              >
                <clip-loader v-if="form.is_submitting" :color="'white'" :size="'20px'" class="pt-2 pe-2">  </clip-loader>
                <span class="pt-0" v-if="form.is_submitting">{{ $t('Saving...') }}</span>
                <span class="pt-0" v-else>{{ $t('Accept All') }}</span>

              </button>
            </div>
          </Form>
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
import { useI18n } from 'vue-i18n'

const { t } = useI18n();

const initialState = {
  server_messages: {
    type: "",
    messages: "",
  }
};
const form = reactive({ ...initialState });
const props = defineProps(['purchase_order']);
const is_loading = ref(false);
const purchase_order_products = ref([]);
const selectedItems = ref([]);
const selectAll = ref(false);
const button_name = ref('all');
const error_flag = ref(false);

onMounted(() => {
  loadTableData();
});

// const schema = yup.object().shape({
//   purchase_order_products: yup.array(yup.object({
//     accept_quantity:yup.number()
//     .typeError(t('must be a number',{ name: t('Quantity') }))
//     .positive(t('must be a positive number', { name: t('Quantity') }))
//     .when('quantity', {
//         is: (val) => val >= accept_quantity && accept_quantity > 0,
//         then: (schema) => schema.required(t('name must be less than or equal to Balance Quantity', { name: t('Accept Quantity') })),
//         otherwise:(schema) => schema.nullable()
//     }),
//   })).required(),
// },['quantity','accept_quantity']);

function checkQuantity(purchase_order_product, index){
  purchase_order_product.accept_quantity = purchase_order_product.accept_quantity.toString().replace(/-/g, "");
  var element = document.getElementById("accept_quantity_error"+index);
  if(purchase_order_product.accept_quantity > purchase_order_product.pending_quantity){
    // purchase_order_product.accept_quantity = 0;
    element.classList.remove("d-none");
    error_flag.value = true;
  }else{
    element.classList.add("d-none");
    error_flag.value = false;
    form.server_messages.messages = '';

      form.is_disabled = true;
      var i = 0;
      _.forEach(purchase_order_products.value, (value) => {
        if(value.accept_quantity > 0)
        {
          i = i + 1;
        }
      })
      if(i > 0){
        form.is_disabled = false;
      }
      else{
        form.is_disabled = true;
      }
  }
}

function submitForm(mode){
  if(error_flag.value == false ){
    if(mode=='selected'){
      button_name.value = 'selected';
    }
    form.server_messages.messages = '';
    update();
  }else{
    form.server_messages.type = "error";
    form.server_messages.messages = t('Please check the items Accept Quantity. It must be less than or equal to Pending quantity!');
  }
}

function loadTableData(){
  _.forEach(props.purchase_order.purchase_order_products, (value) => {
    // let status=value.accepted_quantity== value.product_quantity?1:0;
    let pending_quantity = parseFloat(value.product_quantity) - parseFloat(value.accepted_quantity);
    let product_template = {
      type : value.type,
      po_product_slack : value.slack,
      product_name : value.product_name,
      quantity : value.product_quantity,
      pending_quantity : pending_quantity,
      accept_quantity : pending_quantity.toFixed(2),
      sale_price : value.product_price_without_tax,
      amount : value.subtotal_after_product_quantity,
      tax : value.tax!=null?value.tax.name:'-',
      tax_amount : value.product_tax,
      total_amount : value.product_amount,
      status : value.acceptance_status,
      accepted_at : value.accepted_at_label,
    };
    purchase_order_products.value.push(product_template);
  });
}

const selectAllItems =()=> {
  selectedItems.value = [];
  if (selectAll.value) {
    for (let i = 0; i < purchase_order_products.value.length; i++) {
      selectedItems.value.push(purchase_order_products.value[i].po_product_slack);
    }
  }
};

watch(() => selectedItems.value, () => {
      selectAll.value = selectedItems.value.length === purchase_order_products.value.length;
    },
);

//Accept the product
async function update(){

  form.is_submitting = true;

  var form_data = new FormData();
  form_data.append('purchase_order_slack',props.purchase_order.slack);
  form_data.append('all_selected_products',JSON.stringify(selectedItems.value));
  form_data.append('purchase_order_products',JSON.stringify(purchase_order_products.value));
  form_data.append('mode',button_name.value);

  await axios.post('/api/purchase_order/product/accept', form_data).then( (response) => {
    form.is_submitting = false;
    if(response.data.status_code == 200) {
      toast.success(response.data.msg);
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }else{
      try{
        form.server_messages.type = "error";
        form.server_messages.messages = JSON.parse(response.data.msg);
      }catch(err){
        form.server_messages.type = "error";
        form.server_messages.messages = response.data.msg;
      }
      form.is_submitting = false;
    }
  }).catch((error) => {
    form.server_messages.type = "error";
    form.server_messages.messages = error;
    form.is_submitting = false;
    console.log(error);
  });
}
</script>