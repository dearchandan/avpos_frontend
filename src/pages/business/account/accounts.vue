<template>
    <DefaultLayout>

        <template v-slot:subheader>
            <BusinessMenu />
        </template>

        <div class="content">
            <div class="page-heading">

                <div class="row align-items-center justify-content-between mb-3">
                  <div class="col-auto">
                      <h2 class="mb-0">{{ $t('Accounts') }}</h2>
                  </div>
                  <div class="col-auto" v-if="permissions.write">
                    <a href="#" class="btn btn-sm btn-light-primary2" data-bs-toggle="modal" @click="openAddAccountModal" data-bs-target="#addAccountModal">+ {{ $t("New Account") }}</a>
                  </div>
                </div>

                <div class="row align-items-center justify-content-between g-3">
                    <div class="col col-lg-auto order-2 order-md-1">
                        <div class="row g-3 align-items-end">
                            <div class="col-auto col-md-auto">
                              <div class="form-field">
                                <label>{{ $t('Status') }}</label>
                                <select class="form-control form-control-sm form-control-solid" v-model="filter.status" @change="filterList">
                                    <option value="" >{{ $t("All") }}</option>
                                    <option value="1">{{ $t("Active") }}</option>
                                    <option value="0">{{ $t("Inactive") }}</option>
                                </select>
                              </div>
                            </div>
                            <div class="col-auto col-md-auto ">
                              <VSelect 
                                  v-model="filter.account_type"
                                  name="" 
                                  :label="t('Account Type')" 
                                  :placeholder="t('All')"
                                  :options="account_types"
                                  :height_sm="true"
                              />
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
            </div>

          <div v-if="form.is_listing">
            <ListingSkeleton />
          </div>
            <div v-else class="table-responsive" >
                <table class="table table-list-data table-hover">
                    <thead class="bg-light">
                        <tr>
                            <th scope="col">{{ $t("Account Name") }}</th>
                            <th scope="col">{{ $t("Account Type") }}</th>
                            <th scope="col">{{ $t("Initial Balance") }}</th>
                            <th scope="col">{{ $t("Income/Expense") }}</th>
                            <!-- <th scope="col">{{ $t("Created By") }}</th> -->
                            <th scope="col">{{ $t("Active") }}</th>
                            <th scope="col" class="text-end" v-if="permissions.write || permissions.delete">{{ $t("Action") }}</th>
                        </tr>
                    </thead>
                  <tbody>
                  <tr v-if="accounts != ''" v-for="(account,account_index) in accounts" :key="account_index" >
                    <td  role="button" data-bs-toggle="modal" data-bs-target="#viewAccountModal" @click="openViewAccountModal(account)">
                      <div>
                        <span class="fw-bold highlighted-list-item">{{  account.name  }}</span>
                        <span class="badge badge-primary ms-2" v-if="account.is_default"> {{ $t('Default') }} </span>
                        <br>
                        <small class="text-muted">{{  account.name_ar  }}</small>
                      </div>
                    </td>
                    <td role="button" data-bs-toggle="modal" data-bs-target="#viewAccountModal" @click="openViewAccountModal(account)">
                      <span v-if="account.account_type == 1" class="badge badge-success">{{ $t("INCOME") }}</span>
                      <span v-if="account.account_type == 2" class=" badge badge-warning">{{ $t("EXPENSE") }}</span>
                      <span v-if="account.account_type == 3" class=" badge badge-warning">{{ $t("ASSET") }}</span>
                      <span v-if="account.account_type == 4" class=" badge badge-warning">{{ $t("LIABILITY") }}</span>
                    </td>
                    <td role="button" data-bs-toggle="modal" data-bs-target="#viewAccountModal" @click="openViewAccountModal(account)">{{ account.initial_balance }} {{  currency_symbol  }}</td>
                    <td role="button" data-bs-toggle="modal" data-bs-target="#viewAccountModal" @click="openViewAccountModal(account)">
                      <span v-if="account.account_type == 1" class="text-success">{{ account.total_sale }} {{  currency_symbol  }}</span>
                      <span v-if="account.account_type == 2" class="text-danger">{{ account.total_expense }} {{  currency_symbol  }}</span>
                    </td>
                    <!-- <td role="button" data-bs-toggle="modal" data-bs-target="#viewAccountModal" @click="openViewAccountModal(account)">{{ account.created_by.name }}</td> -->
                    <td>
                      <div v-if="account.is_default || account.total_sale>0 || account.total_expense>0">--</div>
                      <div class="form-field" v-else>
                        <div class="form-check form-switch form-switch-2">
                          <input class="form-check-input ms-2" type="checkbox" role="switch" id="Status_id" @change="changeStatus(account.slack)" :checked="account.status == 1">
                        </div>
                      </div>
                    </td>
                    <td class="text-end" v-if="permissions.write || permissions.delete">
                      <div v-if="account.is_default || account.total_sale>0 || account.total_expense>0">
                        <ActionButtonGroup :permissions="permissions" :slack="account.slack" @editModal="openAddAccountModal" :edit_modal_data="account" :edit_modal_target="'#addAccountModal'" />
                      </div>
                      <div v-else>
                        <ActionButtonGroup :permissions="permissions"  @delete="deleteAccount" :slack="account.slack" @editModal="openAddAccountModal" :edit_modal_data="account" :edit_modal_target="'#addAccountModal'" />
                      </div>

                    </td>
                  </tr>
                  <tr v-else>
                      <td class="text-center py-3" colspan="7">{{ $t("No Data Found") }}</td>
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
                  <Bootstrap5Pagination :data="pagination" :limit="5"  @pagination-change-page="getAccounts" />
                </div>
              </div>
            </div>
        </div>

        <AddAccount  @onSubmitReload="getAccounts" :show_add_account_modal="show_add_account_modal" @closeAddAccountModal="closeAddAccountModal" :edit_data="edit_data" :account_types="account_types"/>

        <ViewAccount :show_view_account_modal="show_view_account_modal" :account="shown_account" @closeViewAccountModal="closeViewAccountModal" />

    </DefaultLayout>
</template>

<script setup>

import { ref , onMounted, reactive, watch } from 'vue';
import { useAuthStore } from "@/stores/auth";
import { Bootstrap5Pagination } from 'laravel-vue-pagination';
import useGlobalFunctions from '@/composables/global_functions.js';

const { isAuthorized } = useGlobalFunctions();
const authStore = useAuthStore();

import { useI18n } from 'vue-i18n'
const { t } = useI18n();

const show_add_account_modal = ref(false);

const edit_data = ref([]);

function openAddAccountModal(editData=''){
    edit_data.value = editData;
    show_add_account_modal.value = true;
}
function closeAddAccountModal(){
    show_add_account_modal.value = false;
    getAccounts();
}
const show_filter = ref(false);
const initial_filter = reactive({
    status : ref(""),
    account_type : ref(""),
});
const filter = reactive({ ...initial_filter });
function fetchFilterData(){

    show_filter.value = !show_filter.value;
}


const initialState = {
    server_messages: {
    type: "",
    messages: "",
    },
    is_listing: false,

    // form data
    search_query : ref("")
};

const search_placeholder = t("Search by name, type..")
const form = reactive({ ...initialState });

onMounted(() => {
  checkPermissions();
  getAccounts();
  loadAccountTypes();
});

watch(() =>
        form.search_query, _.debounce( () => {
        getAccounts();
    },500),
);

const accounts = ref([]);
const pagination = ref([]);

async function getAccounts(page = 1){
  accounts.value = [];
  form.is_listing = true;

  await axios.get('/api/v2/accounts', { params : {
      page : page,
      paginate_limit : paginate_limit.value,
      search_query : form.search_query,
      filter: filter,
    } }).then( (response) => {

    _.forEach(response.data.data, (item) => {

      var total_sale = 0;
      var total_expense = 0;
      if(item.total_invoice_sales!=null && item.total_invoice_sales.total_invoice_sales>0){
        total_sale = parseFloat(total_sale) + parseFloat(item.total_invoice_sales.total_invoice_sales);
      }
      if(item.total_order_sales!=null && item.total_order_sales.total_order_sales>0){
        total_sale = parseFloat(total_sale) + parseFloat(item.total_order_sales.total_order_sales);
      }
      if(item.total_po_expense!=null && item.total_po_expense.total_po_expense>0){
        total_expense = parseFloat(total_expense) + parseFloat(item.total_po_expense.total_po_expense);
      }
      total_sale = total_sale.toFixed(2);
      total_expense = total_expense.toFixed(2);

      let template = {
        'slack': item.slack,
        'name': item.name,
        'name_ar': item.name_ar,
        'code': item.code,
        'account_type': item.account_type,
        'initial_balance': item.initial_balance,
        'is_default': item.is_default,
        // 'created_by': item.created_by,
        'status': item.status,
        'total_sale': total_sale,
        'total_expense': total_expense
      };
      accounts.value.push(template);
    })
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
  await getAccounts();
}

async function changeStatus(slack){

  var form_data = new FormData();
  form_data.append('slack',slack);

  await axios.post('/api/account/update_status', form_data).then( (response) => {

    if(response.data.status_code == 200) {

      toast.success(response.data.msg);
      getAccounts();
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

const show_view_account_modal = ref(false);

const shown_account = ref([]);

function openViewAccountModal(account){
  show_view_account_modal.value = true;
  shown_account.value = account;
}

function closeViewAccountModal(){
  show_view_account_modal.value = false;
}


async function deleteAccount(slack){

  var is_confirmed = false;

  await Swal.fire({
    title: t('Do you want to delete this Account?'),
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

    await axios.post('/api/account/delete',{
      slack : slack
    }).then( (response) => {

      if(response.data.status_code == 200) {

        Swal.fire(response.data.msg);
        getAccounts();

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

const account_types = ref([]);

async function loadAccountTypes(){

  await axios.post('/api/account/add').then( (response) => {
      if(response.data.status_code == 200) {
        _.forEach(response.data.data.account_types, (item,index) => {
            let template = {
                'key' : index,
                'value' : item,
            };
            account_types.value.push(template);
        })

      }else{
      }

  }).catch((error) => {

  });

}
const show_clear_filter = ref(false);

watch(() => 
    filter.account_type, (value) => {
      filterList();
    },
);
async function filterList(){
    if(JSON.stringify(filter) != JSON.stringify(initial_filter)){
        show_clear_filter.value = true;
    }
    show_filter.value = false;
    await getAccounts();
}
function clearFilter(){
    Object.assign(filter, initial_filter);
    show_clear_filter.value = false;
    getAccounts();
}


/* Checking permissions */
const permissions = ref({
    write : false,
    delete : false,
});

function checkPermissions(){
    permissions.value  = {
        write : isAuthorized('A_WRITE_ACCOUNT'),
        delete : isAuthorized('A_DELETE_ACCOUNT'),
    };
}

const currency_symbol = computed(() => {
  return authStore.user.currency.symbol;
});


</script>