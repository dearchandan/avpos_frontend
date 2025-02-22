<template>
  <div class="modal hide" id="addPaymentModal" tabindex="-1" aria-labelledby="Add Payment" aria-modal="true"
       role="dialog"  data-bs-backdrop="static" data-bs-keyboard="false">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title fs-5">{{ $t('Make Payment') }}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="closeModal"
                  id="close_btn"></button>
        </div>
        <div class="modal-body">
          <Form
              :validation-schema="schema"
              @submit="savePayment"
              enctype="multipart/form-data"
              id="add_payment_form"
          >
            <div class="row">
              <div class="col-md-4">
                <div class="makepayment-counter">
                  <h3>{{ props.invoice!=null?props.invoice.grand_product_amount:0 }}</h3>
                  <h6>{{ $t('Total Amount') }} (SAR)</h6>
                </div>
              </div>
              <div class="col-md-4">
                <div class="makepayment-counter">
                  <h3>{{ props.total_paid_amount }}</h3>
                  <h6 class="text-success">{{ $t('Paid Amount') }} (SAR)</h6>
                </div>
              </div>
              <div class="col-md-4">
                <div class="makepayment-counter">
                  <h3>{{ props.total_pending_amount }}</h3>
                  <h6 class="text-warning">{{ $t('Pending Amount') }} (SAR)</h6>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-6">
                <VTextInput
                    type="date"
                    name="transaction_date"
                    v-model="form.transaction_date"
                    :label="labels.transaction_date"
                    :required="true"
                />
              </div>
              <div class="col-6">
                <VSelect
                    name="account"
                    label="Account"
                    v-model="form.account"
                    :placeholder="labels.select_account"
                    :options="accounts"
                    required
                />
              </div>
              <div class="col-6">
                <VTextInput
                    type="number"
                    name="amount"
                    v-model="form.amount"
                    :label="labels.amount+'(SAR)'"
                    :required="true"
                    :min="1"
                    :max="props.total_pending_amount!=null?props.total_pending_amount:0"
                />
              </div>
              <div class="col-6">
                <VSelect
                    name="payment_method"
                    :label="labels.payment_method"
                    v-model="form.payment_method"
                    :placeholder="labels.select_payment_method"
                    :options="payment_methods"
                    required
                    @change="check_payment()"
                    :disabled="form.is_payment_disable"
                />
              </div>
              <div class="col-6" v-if="form.is_online==true">
                <VTextInput
                    type="number"
                    name="contact_number"
                    v-model="form.contact_number"
                    :label="labels.contact_number"
                    :required="true"
                />
              </div>

              <div class="col-6">
                <div class="pt-3">
                  <VTextInput
                      type="hidden"
                      name="is_online"
                      v-model="form.is_online"
                      :required="true"
                      :islabel="false"
                  />
                  <img :src="online_image" v-if="form.is_online==true"/>
                </div>
              </div>
            </div>
            <div class="form-field">
              <label> Notes: </label>
              <div class="col-12">
                  <textarea
                      class="form-control form-control-solid text-area"
                      name="notes"
                      v-model="form.notes"
                      rows="1"
                      :placeholder="labels.enter_notes"
                  ></textarea>
              </div>
            </div>
            <div class="py-3" v-if="form.server_messages.messages != ''">
              <ServerMessage :server_messages="form.server_messages"/>
            </div>
            <div class="mt-2 text-end">
              <button
                  type="submit"
                  class="btn btn-primary"
                  :disabled="form.is_submitting"
              >
                <clip-loader v-if="form.is_submitting" :color="'white'" :size="'20px'" class="pt-2 pe-2"></clip-loader>
                <span class="pt-0" v-if="form.is_submitting">{{ $t('Paying...') }}</span>
                <span class="pt-0" v-else>{{ $t('Pay') }}</span>
              </button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>

import {ref, reactive, watch, computed} from 'vue';
import {Form, Field, ErrorMessage} from 'vee-validate'
import * as yup from 'yup';
import BeatLoader from 'vue-spinner/src/BeatLoader.vue'

import {useAuthStore} from '@/stores/auth';
import ClipLoader from 'vue-spinner/src/ClipLoader.vue'
import { useI18n } from 'vue-i18n'
import { compareAsc, format } from "date-fns";
import online_image from '@/assets/images/mada-visa-master.png'

const { t } = useI18n();
const labels = ref({
  transaction_date: t('Transactoin Date'),
  account: t('Account'),
  select_account: t('Select Account'),
  amount: t('Amount'),
  payment_method: t('Payment Method'),
  contact_number: t('Contact Number'),
  select_payment_method: t('Select Payment Method'),
  enter_notes: t('enter notes...')
});
const is_loading = ref(false);
const props = defineProps(['show_add_payment_modal', 'invoice', 'total_paid_amount', 'total_pending_amount']);
const initialState = {
  server_messages: {
    type: "",
    messages: "",
  },
  is_submitting: false,
  is_listing: false,

  // form data
  transaction_date: new Date().toISOString().split("T")[0],
  account: "",
  amount: "",
  payment_method: "",
  is_payment_disable:false,
  is_online:false,
  contact_number: props.invoice.customer_phone!=null?props.invoice.customer_phone:'',
  notes: "",
};

const form = reactive({...initialState});

const authStore = useAuthStore();

const schema = yup.object({
  transaction_date: yup.string().required(t('name is required', { name: t('Transaction Date') })),
  account: yup.string().required(t('name is required', { name: t('Account') })),
  amount: yup.number().typeError(t('must be a number',{ name: t('Amount') })).required(t('name is required', { name: t('Amount') })).min(1, t('Amount must be more than 1')).test({
    name: 'max',
    exclusive: false,
    params: { },
    test: function (value,context) {
      var max = $('[name="'+context.path+'"]').attr("max");
      return value <= parseFloat(max) ?true: context.createError({path:`${context.path}`, message:t('must be less than or equal to n',{ name:t('Amount'), number:max }) });
    },
  }),
  payment_method: yup.string().required(t('name is required', { name: t('Payment Method') })),
  is_online:yup.boolean().required(t('name is required', { name: t('Is Online') })),
  contact_number: yup
      .string().nullable()
      .when('is_online', {
        is: (value) => value ===true,
        then: (schema) => schema.required(t('name is required', { name: t('Contact Number') })),
        otherwise: (schema) => schema.nullable()
      }),
});

const emit = defineEmits(['closeAddPaymentModal'])



function closeModal() {
  document.getElementById("add_payment_form").reset();
  resetData();
  emit('closeAddPaymentModal');
  document.getElementById('close_btn').click();
}

watch(() =>
    props.show_add_payment_modal, (value) => {
      if (value) {
        loadAccounts();
        loadPaymentMethods();
      }
      form.amount = props.total_pending_amount>0?props.total_pending_amount:"";
      form.payment_method = props.invoice.payment_method!=null?props.invoice.payment_method.slack:"";
      form.is_payment_disable = props.invoice.payment_method!=null?true:false;
    },
);

const accounts = ref([]);
async function loadAccounts(){
  accounts.value = [];
  
  var form_data = new FormData();
  form_data.append('account_type','INCOME');

  let account_data = await axios.post('api/accounts/all',form_data);
  account_data = account_data.data.data;
  _.forEach(account_data, (item) => {
    let template = {
      'key': item.slack,
      'value': item.name,
    };
    if(item.is_default == 1){
      form.account = item.slack;
    }
    accounts.value.push(template);
  })
}

const payment_methods = ref([]);
async function loadPaymentMethods(){
  payment_methods.value = [];
  let payment_method_data = await axios.get('api/payment_methods/all');
  payment_method_data = payment_method_data.data.data;
  _.forEach(payment_method_data, (item) => {
    let template = {
      'key': item.slack,
      'value': item.name,
      'constant': item.constant,
    };
    payment_methods.value.push(template);
  })
}

async function check_payment(){
  _.forEach(payment_methods.value, (item) => {
    if(item.constant =='ONLINE' && item.key==form.payment_method){
      form.is_online = true;
    }else{
      form.is_online = false;
    }
  });
}

const close_btn = ref(null);
async function savePayment() {

  form.is_submitting = true;

  var form_data = new FormData();
  form_data.append('invoice_slack', props.invoice.slack);
  form_data.append('transaction_date', form.transaction_date);
  form_data.append('account', form.account);
  form_data.append('amount', form.amount);
  form_data.append('payment_method', form.payment_method);
  form_data.append('notes', form.notes);
  form_data.append('is_online', form.is_online);
  form_data.append('contact_number', form.contact_number);

  await axios.post('/api/invoice/add_payment', form_data).then((response) => {

    if (response.data.status_code == 200) {
      toast.success(response.data.msg);
      form.is_submitting = false;
      closeModal();
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
    console.log(error);
  });

}

function resetData() {
  Object.assign(form, initialState);
}

</script>