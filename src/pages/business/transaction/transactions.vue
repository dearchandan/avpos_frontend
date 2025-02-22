<template>
    <DefaultLayout>

        <template v-slot:subheader>
            <BusinessMenu />
        </template>
        
        <div class="content">
            <div class="page-heading">

                <div class="row align-items-center justify-content-between mb-3">
                  <div class="col-auto">
                      <h2 class="mb-0">{{ $t('Transactions') }}</h2>
                  </div>
                  <div class="col-auto" v-if="permissions.write">
                    <router-link class="btn btn-sm btn-light-primary2" to="/transaction/add" >+ {{ $t("New Transaction") }}</router-link>
                  </div>
                </div>

                <div class="row align-items-end justify-content-between g-3">
                    <div class="col col-lg-auto order-2 order-md-1">
                        <div class="row g-3 align-items-end">
                            <div class="col col-md-auto">
                              <div class="form-field">
                                <label>{{ $t('Date') }}</label>
                                <VueDatePicker range v-model="filter.transaction_dates" :format="'dd-MM-yyyy'"
                                        :enable-time-picker="false"
                                        input-class-name="form-control form-control-solid form-control-sm" @update:model-value="filterList()"/>
                              </div>
                            </div>
                            
                            <div class="col-auto col-md-auto" >
                                <button class="btn btn-sm btn-light-primary font-weight-normal" type="button" data-bs-toggle="collapse" data-bs-target="#subFilter" aria-expanded="false" aria-controls="collapseExample">
                                    <svg width="13" height="14" viewBox="0 0 13 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M0.464286 2.33333H7.03022C7.23775 3.136 7.95879 3.73333 8.82143 3.73333C9.68407 3.73333 10.4051 3.136 10.6126 2.33333H12.5357C12.792 2.33333 13 2.12427 13 1.86667C13 1.60907 12.792 1.4 12.5357 1.4H10.6126C10.4051 0.597333 9.68407 0 8.82143 0C7.95879 0 7.23775 0.597333 7.03022 1.4H0.464286C0.208 1.4 0 1.60907 0 1.86667C0 2.12427 0.208 2.33333 0.464286 2.33333ZM8.82143 0.933333C9.33354 0.933333 9.75 1.35193 9.75 1.86667C9.75 2.3814 9.33354 2.8 8.82143 2.8C8.30932 2.8 7.89286 2.3814 7.89286 1.86667C7.89286 1.35193 8.30932 0.933333 8.82143 0.933333ZM12.5357 11.6667H10.6126C10.4051 10.864 9.68407 10.2667 8.82143 10.2667C7.95879 10.2667 7.23775 10.864 7.03022 11.6667H0.464286C0.208 11.6667 0 11.8757 0 12.1333C0 12.3909 0.208 12.6 0.464286 12.6H7.03022C7.23775 13.4027 7.95879 14 8.82143 14C9.68407 14 10.4051 13.4027 10.6126 12.6H12.5357C12.792 12.6 13 12.3909 13 12.1333C13 11.8757 12.792 11.6667 12.5357 11.6667ZM8.82143 13.0667C8.30932 13.0667 7.89286 12.6481 7.89286 12.1333C7.89286 11.6186 8.30932 11.2 8.82143 11.2C9.33354 11.2 9.75 11.6186 9.75 12.1333C9.75 12.6481 9.33354 13.0667 8.82143 13.0667ZM12.5357 6.53333H5.5055C5.29797 5.73067 4.57693 5.13333 3.71429 5.13333C2.85164 5.13333 2.13061 5.73067 1.92307 6.53333H0.464286C0.208 6.53333 0 6.7424 0 7C0 7.2576 0.208 7.46667 0.464286 7.46667H1.92307C2.13061 8.26933 2.85164 8.86667 3.71429 8.86667C4.57693 8.86667 5.29797 8.26933 5.5055 7.46667H12.5357C12.792 7.46667 13 7.2576 13 7C13 6.7424 12.792 6.53333 12.5357 6.53333ZM3.71429 7.93333C3.20218 7.93333 2.78571 7.51473 2.78571 7C2.78571 6.48527 3.20218 6.06667 3.71429 6.06667C4.22639 6.06667 4.64286 6.48527 4.64286 7C4.64286 7.51473 4.22639 7.93333 3.71429 7.93333Z" fill="currentColor"/>
                                    </svg>
                                    {{ $t('Filters') }} <span class="badge" id="filter_count_badge" v-show="form.filter_count > 0"> {{ form.filter_count }} </span>
                                </button>
                            </div>
                            <div class="col-auto col-md-auto" >
                                <button class="btn btn-sm btn-light-danger" v-if="show_clear_filter" @click="clearFilter"> {{ $t('Clear') }} </button>
                            </div>
                        </div>
                    </div>
                    <div class="col-12 col-md-4 col-lg-3 order-1 order-md-2">
                        <div class="form-field mb-0">
                            <div class="field-icon">
                                <input type="search" class="form-control form-control-sm form-control-solid" :placeholder="search_placeholder" v-model="form.search_query">
                                <div class="icon"><Icon icon="fa6-solid:magnifying-glass" /></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="collapse" id="subFilter">
                    <div class="sub-filter">
                        <div class="row align-items-center g-3">
                            <div class="col-6 col-md-auto">
                              <VSelect
                                  name="payment_method"
                                  :label="labels.payment_method"
                                  v-model="filter.payment_method"
                                  :placeholder="labels.select_payment_method"
                                  :options="payment_methods"
                                    :height_sm="true"
                              />
                            </div>
                            <div class="col-6 col-md-auto d-md-block">
                              <div class="form-field">
                                <label>{{ $t("Transaction Type") }}</label>
                                <select class="form-control form-control-sm form-control-solid"
                                        v-model="filter.transaction_type" @change="filterList">
                                  <option value="">{{ $t("All") }}</option>
                                  <option value="INCOME">{{ $t("Income") }}</option>
                                  <option value="EXPENSE">{{ $t("Expense") }}</option>
                                </select>
                              </div>
                            </div>
                            <div class="col-6 col-md-auto d-md-block">
                              <div class="form-field">
                                <label>{{ $t("Bill Type") }}</label>
                                <select class="form-control form-control-sm form-control-solid"
                                        v-model="filter.bill_type" @change="filterList">
                                  <option value="">{{ $t("All") }}</option>
                                  <option value="1">{{ $t("Order") }}</option>
                                  <option value="2">{{ $t("Invoice") }}</option>
                                  <option value="3">{{ $t("Purchase") }}</option>
                                </select>
                              </div>
                            </div>
                            <!-- <div class="col-6 col-md-auto d-md-block">
                              <VSelect
                                  name="account"
                                  :label="labels.account"
                                  v-model="filter.account"
                                  :placeholder="labels.select_account"
                                  :options="accounts"
                                    :height_sm="true"

                              />
                            </div> -->
                        </div>
                    </div>
                </div>
               
              </div>
            <div v-if="form.is_listing">
              <ListingSkeleton />
            </div>
            <div v-else class="table-responsive">
                <table class="table table-list-data table-hover">
                    <thead class="bg-light">
                        <tr>
                            <th scope="col" width="20%">{{ $t("Type") }}</th>
                            <th scope="col" width="15%">{{ $t("Amount") }}</th>
                            <th scope="col" width="15%">{{ $t("Account") }}</th>
                            <th scope="col" width="10%">{{ $t("Payment Method") }}</th>
                            <th scope="col" width="10%">{{ $t("Bill Type") }}</th>
                            <th scope="col" width="15%">{{ $t("Bill To Name") }}</th>
                            <th scope="col" width="10%">{{ $t("Transaction Date") }}</th>
                            <!-- <th scope="col" class="text-end" width="5%" v-if="permissions.write || permissions.delete">{{ $t("Action") }}</th> -->
                        </tr>
                    </thead>
                    <tbody> 
                        <tr v-if="transactions != ''" v-for="(transaction,branch_index) in transactions" :key="branch_index" >
                            <td @click="viewTransaction(transaction.slack)" role="button">{{ transaction.type }}</td>
                            <td @click="viewTransaction(transaction.slack)" role="button">
                                <span v-if="transaction.type == 'INCOME'" class="text-success">+{{ transaction.amount }} {{ currency_symbol }}</span>
                                <span v-if="transaction.type == 'EXPENSE'" class="text-danger">-{{ transaction.amount }} {{ currency_symbol }}</span>
                            </td>
                            <td @click="viewTransaction(transaction.slack)" role="button">
                              {{ transaction.account.name }}
                              <small class="text-muted" v-if="transaction.notes != undefined && transaction.notes != ''"><br>Note: {{ transaction.notes }}</small>

                            </td>
                            <td @click="viewTransaction(transaction.slack)" role="button"> {{ transaction.payment_method_name }} </td>
                            <td @click="viewTransaction(transaction.slack)" role="button">{{ transaction.bill_type_text }}</td>
                            <td @click="viewTransaction(transaction.slack)" role="button">{{ transaction.bill_to_name }}</td>
                            <td @click="viewTransaction(transaction.slack)" role="button">{{ transaction.transaction_date }}</td>

                            <!-- <td class="text-end" v-if="permissions.write || permissions.delete">-->
                                <!-- <div class="dropdown">
                                    <button class="btn btn-icon btn-sm btn-light dropdown-toggle arrow-none" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        <Icon icon="fa6-solid:ellipsis-vertical" />
                                    </button>
                                  <ul class="dropdown-menu">
                                    <li v-if="permissions.delete">
                                      <a class="dropdown-item" href="#" @click="deleteTransaction(transaction.slack)">{{ $t("Delete") }}</a>
                                    </li>
                                  </ul>
                                </div> -->
                                <!-- <ActionButtonGroup :permissions="permissions"  @delete="deleteTransaction" :slack="transaction.slack" />
                            </td> -->
                        </tr>
                        <tr v-else>
                            <td class="text-center py-3" colspan="11">{{ $t("No Data Found") }}</td>
                        </tr>
                        
                    </tbody>
                </table>
            </div>
            <div class="data-footer">
                <div class="row align-items-center justify-content-between">
                    <div class="col-auto">
                        <PaginateLimit @paginate_limit_update="paginate_limit_update" :pagination="pagination" />
                    </div>
                    <div class="col-auto">                      
                        <Bootstrap5Pagination :data="pagination" :limit="5"  @pagination-change-page="getTransactions" />
                    </div>
                </div>
            </div>
        </div>
        
    </DefaultLayout>
</template>

<script setup>

import { ref , onMounted, reactive, watch, defineComponent, computed } from 'vue';

import { Bootstrap5Pagination } from 'laravel-vue-pagination';
import { useAuthStore } from '@/stores/auth';
import VueDatePicker from '@vuepic/vue-datepicker';
import { useI18n } from 'vue-i18n'
import useGlobalFunctions from '@/composables/global_functions.js';

const { isAuthorized } = useGlobalFunctions();

const { t } = useI18n();
const auth = useAuthStore();

const currency_symbol = computed(() => {
    return auth.user.currency.symbol;
})

const show_add_branch_modal = ref(false);

function openAddTransactionModal(){
    show_add_branch_modal.value = true; 
}
function closeAddTransactionModal(){
    show_add_branch_modal.value = false;
    getTransactions();
}
const labels = ref({
    "type": t('Type'),
    "account": t('Account'),
    "select_account": t('Select Account'),
    "payment_method": t('Payment Method'),
    "select_payment_method": t("Select Payment Method"),
    "amount": t('Amount'),
    "transaction_date": t('Transaction Date')
})
const initialState = {
    server_messages: {
    type: "",
    messages: "",
    },
    is_listing: false,

    // form data   
    search_query : ref(""),
    filter_count: 0,
};
const search_placeholder = t("Search by amount")
const form = reactive({ ...initialState });

onMounted(() => {
    checkPermissions();
    getTransactions()
    // getAccounts()
    getPaymentMethods()
});

watch(() =>
    form.search_query, _.debounce( () => {
      getTransactions();
    },500),
);

const transactions = ref([]);
const pagination = ref([]);
const accounts = ref([]);
const payment_methods = ref([]);

async function getTransactions(page = 1){

    form.is_listing = true;

    await axios.get('/api/v2/transactions', { params : {
            page : page,
            paginate_limit : paginate_limit.value,
            search_query : form.search_query,
            filter: filter,
        } }).then( (response) => {
            
        transactions.value = response.data.data;
        pagination.value = response.data.pagination;
        form.is_listing = false;
        
    }).catch((error) => {
        form.server_messages.type = "error";
        form.server_messages.messages = error;
        form.is_listing = false;
        console.log(error);
    });

}

const paginate_limit = ref();
async function paginate_limit_update(value){
    paginate_limit.value = value;
    await getTransactions();
}

async function getAccounts(){

  let form_data = new FormData();
  form_data.append('account_type',filter.transaction_type);

  let account_data = await axios.post('api/accounts/all',form_data);
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


//Code for Filter
const show_filter = ref(false);
const initial_filter = reactive({
  transaction_dates: ref(),
  payment_method: ref(),
  transaction_type: ref(""),
  account: ref(""),
  bill_type: ref(""),
});
const filter = reactive({...initial_filter});
watch(() => 
    filter.account, (value) => {
      filterList();
    },
);
watch(() => 
    filter.payment_method, (value) => {
      filterList();
    },
);
const show_clear_filter = ref(false);

async function filterList() {
  form.filter_count = 0;
  if (JSON.stringify(filter) != JSON.stringify(initial_filter)) {
    show_clear_filter.value = true;
  }
   _.forEach(filter, (item,index) => {
        if(item != '' && item != undefined && index != 'transaction_dates'){
          form.filter_count = form.filter_count + 1;
      }
  });
  show_filter.value = false;
  await getTransactions();
}

async function fetchFilterData() {
  show_filter.value = !show_filter.value;
}

function clearFilter() {
  Object.assign(filter, initial_filter);
  show_clear_filter.value = false;
  form.filter_count = 0;
  getTransactions();
}
//End filter code


function viewTransaction(slack){
    router.push('/transaction/'+slack);
}

async function deleteTransaction(slack){

  var is_confirmed = false;

  await Swal.fire({
    title: t('Do you want to delete this Transaction?'),
    showCancelButton: true,
    confirmButtonText: t('Yes, Delete'),
    confirmButtonColor: '#d33',
    cancelButtonText: t('Cancel'),
  }).then( (result) => {
    if(result.isConfirmed){
      is_confirmed = true;
    }
  });

  if(is_confirmed){

    await axios.post('/api/transaction/delete',{
      slack : slack
    }).then( (response) => {

      if(response.data.status_code == 200) {

        Swal.fire(response.data.msg);
        getTransactions();

      }else{
        try{
          form.server_messages.type = "error";
          form.server_messages.messages = JSON.parse(response.data.msg);
        }catch(err){
          form.server_messages.type = "error";
          form.server_messages.messages = response.data.msg;
        }
      }

    }).catch((error) => {
      form.server_messages.type = "error";
      form.server_messages.messages = error;
      console.log(error);
    });
  }

}

/* Checking permissions */
const permissions = ref({
    write : false,
    delete : false,
});

function checkPermissions(){
    permissions.value  = {
        write : isAuthorized('A_WRITE_TRANSACTION'),
        delete : isAuthorized('A_DELETE_TRANSACTION'),
    };
}


</script>