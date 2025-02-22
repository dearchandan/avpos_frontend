<template>
    <DefaultLayout>

        <template v-slot:subheader>
            <div class="header-nav-wrap">
                <div class="row align-items-center">
                    <div class="col-auto">
                        <div class="header-back-link">
                          <router-link class="text-primary" to="/admin/transactions" ><Icon icon="fa6-solid:chevron-left"  /> {{ $t('Transactions') }}</router-link>                        </div>
                    </div>
                    <div class="col-auto">
                        <h5 class="fw-bold">{{ $t('Add Transaction') }}</h5>
                    </div>
                </div>
            </div>
        </template>

        <div class="content">
    

            <Form :validation-schema="schema" @submit="saveTransaction" :initial-values="form" enctype="multipart/form-data">
                <div class="row card-strash">
                    
                    <div class="py-3" v-if="form.server_messages.messages != ''">
                        <ServerMessage  :server_messages="form.server_messages"  />
                    </div>

                    <div class="col-md-12">
                        <div class="row">
                            <div class="col-md-12 mb-4">
                                <div class="card">
                                  <div class="row">
                                    <div class="col-md-3">

                                      <VRadio
                                          type="radio"
                                          name="type"
                                          v-model="form.type"
                                          :label="labels.type"
                                          :required="true"
                                          :options="types"
                                      />
                                    </div>
                                    <div class="col-md-3">
                                      <VSelect
                                          name="account"
                                          :label="labels.account"
                                          v-model="form.account"
                                          :placeholder="labels.select_account"
                                          :options="accounts"
                                          required
                                      />
                                    </div>
                                    <div class="col-md-3">
                                      <VSelect
                                          name="payment_method"
                                          :label="labels.payment_method"
                                          v-model="form.payment_method"
                                          :placeholder="labels.select_payment_method"
                                          :options="payment_methods"
                                          required
                                      />
                                    </div>
                                    <div class="col-md-3">
                                      <VTextInput
                                          type="number"
                                          name="amount"
                                          v-model="form.amount"
                                          :label="labels.amount"
                                          :required="true"
                                      />
                                    </div>
                                    <div class="col-md-3">
                                      <VTextInput
                                          type="date"
                                          name="transaction_date"
                                          v-model="form.transaction_date"
                                          :label="labels.transaction_date"
                                          :required="true"
                                      />
                                    </div>
                                    <div class="col-md-9">
                                      <label>{{ $t('Note') }}</label>
                                      <textarea
                                          class="form-control form-control-solid p-3"
                                          name="note"
                                          v-model="form.note"
                                          cols="10"
                                          rows="10"
                                      ></textarea>
                                    </div>
                                  </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="text-end">
                    <button 
                        type="submit"
                        class="btn btn-primary" 
                        :disabled="form.is_submitting"
                        >   
                            <clip-loader v-if="form.is_submitting" :color="'white'" :size="'20px'" class="pt-2 pe-2">  </clip-loader>
                            <span class="pt-0" v-if="form.is_submitting">
                                {{ $t('Saving...') }}
                            </span>
                            <span class="pt-0" v-else>
                                {{ $t('Save') }}
                            </span> 

                    </button>
                </div>
            </Form>
        </div>
     </DefaultLayout>
</template>

<script setup>

import {ref, reactive, onMounted } from 'vue';
import { Form } from 'vee-validate'
import * as yup from 'yup';

import { useAuthStore } from '@/stores/auth';
import ClipLoader from 'vue-spinner/src/ClipLoader.vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n();
const initialState = {
  server_messages: {
    type: "",
    messages: "",
  },
  is_submitting: false,

  // form data   
  type : "INCOME",
  account : "",
  payment_method : "",
  amount : "",
  transaction_date : "",
  note : "",
};

const types = [
  {
    name : "Income",
    value: "INCOME"
  },
  {
    name :  "Expense",
    value: "EXPENSE"
  }
];
const labels = ref({
    "type": t('Type'),
    "account": t('Account'),
    "select_account": t('Select Account'),
    "payment_method": t('Payment Method'),
    "select_payment_method": t("Select Payment Method"),
    "amount": t('Amount'),
    "transaction_date": t('Transaction Date')
})
const form = reactive({ ...initialState });

const schema = yup.object({
  type: yup.string().required(t('name is required', { name: t('Type') })),
  account: yup.string().required(t('name is required', { name: t('Account') })),
  payment_method: yup.string().required(t('name is required', { name: t('Payment Method') })),
  amount: yup.number().typeError(t('must be a number',{ name: t('Amount') })).required(t('name is required', { name: t('Amount') })).positive(t('must be a positive number', { name: t('Amount') })),
  transaction_date: yup.string().required(t('name is required', { name: t('Transaction Date') })),
});

const accounts = ref([]);

onMounted(() => {
    getAccounts()
});

watch(() => 
      form.type, (value) => {
          getAccounts();
      },
  );

async function getAccounts(){

  let form_data = new FormData();
  form_data.append('account_type',form.type);

  let account_data = await axios.post('api/admin_accounts/all',form_data);
  account_data = account_data.data.data;
  accounts.value = [];
  _.forEach(account_data, (item) => {
    let template = {
      'key': item.slack,
      'value': item.name,
    };
    accounts.value.push(template);
  })
}

const payment_methods = ref([]);

onMounted(() => {
    getPaymentMethods()
});

async function getPaymentMethods() {
  let payment_method_data = await axios.get('api/payment_methods/all');
  payment_method_data = payment_method_data.data.data;
  _.forEach(payment_method_data, (item) => {
    let template = {
      'key': item.slack,
      'value': item.name,
    };
    payment_methods.value.push(template);
  })
}

async function saveTransaction(){
    form.is_submitting = true;

    var form_data = new FormData();
    form_data.append('type',form.type);
    form_data.append('account',form.account);
    form_data.append('payment_method',form.payment_method);
    form_data.append('amount',form.amount);
    form_data.append('transaction_date',form.transaction_date);
    form_data.append('note',form.note);
    await axios.post('/api/admin_transaction/save', form_data).then( (response) => {
        
        if(response.data.status_code == 200) {

            toast.success(response.data.msg);
            form.is_submitting = false;
            
            router.push('/admin/transactions');
            resetData();

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

function resetData(){
    Object.assign(form, initialState);
}

</script>