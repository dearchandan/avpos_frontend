<template>
  <DefaultLayout>

    <template v-slot:subheader>
      <RentReceiptMenu />
    </template>

    <div class="content">
      <div class="page-heading">

        <div class="row align-items-center justify-content-between mb-3">
          <div class="col-auto">
            <h2 class="mb-0">{{ $t('Rent Receipts') }}</h2>
          </div>
          <div class="col-auto" v-if="!authStore.isMerchant">
            <router-link class="btn btn-sm btn-light-primary2" to="/rent_receipt/add" >+ {{ $t('New Rent Receipt') }}</router-link>
          </div>
        </div>

        <div class="row align-items-end justify-content-between mb-3">
          <div class="col-md-auto">
            <div class="row align-items-end justify-content-between g-3">
              <div class="col-12 col-md-auto">
                <div class="form-field">
                  <label>{{ $t('Rent Receipt Date') }}</label>
                  <VueDatePicker range v-model="filter.dates" :format="'dd-MM-yyyy'" :enable-time-picker="false" @update:model-value="filterList()" input-class-name="form-control form-control-solid form-control-sm"/>
                </div>
              </div>
              <div class="col col-md-auto">
                <div class="form-field">
                  <label>{{ $t('Payment Status') }}</label>
                  <select class="form-control form-control-sm form-control-solid" v-model="filter.status" @change="filterList">
                    <option value="">{{ $t('All') }}</option>
                    <option value="0">{{ $t('Pending') }}</option>
                    <option value="1">{{ $t('Approved') }}</option>
                    <option value="2">{{ $t('Reject') }}</option>
                  </select>

                </div>
              </div>
              <div class="col-auto col-md-auto" >
                <button class="btn btn-sm btn-light-danger" v-if="show_clear_filter" @click="clearFilter"> {{ $t('Clear') }} </button>
              </div>
            </div>
          </div>
          <div class="col-auto">
            <div class="form-field page-heading-search-field mb-0">
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
      <div v-else class="table-responsive">
        <table class="table table-list-data table-hover">
          <thead class="bg-light">
          <tr>

            <th scope="col" width="10%">{{ $t('Rent Receipt No.') }}</th>
            <th scope="col" width="10%">{{ $t('Amount') }}</th>
            <th scope="col" width="20%" v-if="authStore.isMerchant">{{ $t('Branch') }}</th>
            <th scope="col" width="20%">{{ $t('User') }}</th>
            <th scope="col" width="10%">{{ $t('Rent Receipt Date') }}</th>
            <th scope="col" width="10%">{{ $t('Payment Status') }}</th>
            <th scope="col" class="text-end" width="5%" v-if="!authStore.isMerchant">{{ $t('Action') }}</th>
          </tr>
          </thead>
          <tbody>
          <tr v-if="rent_receipts != ''" v-for="(rent_receipt,branch_index) in rent_receipts" :key="branch_index" >
            <td @click="viewRentReceipt(rent_receipt.slack)" role="button">{{ rent_receipt.voucher_number }}</td>
            <td @click="viewRentReceipt(rent_receipt.slack)" role="button">{{ rent_receipt.withdrawal_amount }}</td>
            <td @click="viewRentReceipt(rent_receipt.slack)" role="button" v-if="authStore.isMerchant">{{ rent_receipt.branch.name }}</td>
            <td @click="viewRentReceipt(rent_receipt.slack)" role="button">{{ rent_receipt.voucher_user.name }}</td>
            <td @click="viewRentReceipt(rent_receipt.slack)" role="button">{{ rent_receipt.voucher_date_label }}</td>
            <td @click="viewRentReceipt(rent_receipt.slack)" role="button">
              <span v-if="rent_receipt.status==0" class="badge badge-primary">{{ $t('Pending') }}</span>
              <span v-if="rent_receipt.status==1" class="badge badge-success">{{ $t('Approved') }}</span>
              <span v-if="rent_receipt.status==2" class="badge badge-danger">{{ $t('Rejected') }}</span>
            </td>
            <td class="text-end" v-if="!authStore.isMerchant">
              <ActionButtonGroup :permissions="permissions" @edit="editRentReceipt" :slack="rent_receipt.slack" v-if="rent_receipt.status==0"/>
              <span v-else>--</span>
            </td>
          </tr>
          <tr v-else>
            <td class="text-center py-3" colspan="11">{{ $t('No Data Found') }}</td>
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
            <Bootstrap5Pagination :data="pagination" :limit="5"  @pagination-change-page="getRentReceipts" />
          </div>
        </div>
      </div>
    </div>

  </DefaultLayout>
</template>

<script setup>

import { ref , onMounted, reactive, watch, defineComponent, computed } from 'vue';

import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { Bootstrap5Pagination } from 'laravel-vue-pagination';
import { useAuthStore } from '@/stores/auth';
import PaginateLimit from '@/components/common/PaginateLimit.vue';
import VueDatePicker from '@vuepic/vue-datepicker';
import ManageMenu from '@/components/common/ManageMenu.vue'
import { useI18n } from 'vue-i18n'
import useGlobalFunctions from '@/composables/global_functions.js';

const { isAuthorized } = useGlobalFunctions();

const { t } = useI18n();

const authStore = useAuthStore();

const initialState = {
  server_messages: {
    type: "",
    messages: "",
  },
  is_listing: false,

  // form data
  search_query : ref("")
};
const search_placeholder = t("Search by number, amount")
const form = reactive({ ...initialState });

onMounted(() => {
  getRentReceipts()
});

watch(() =>
        form.search_query, _.debounce( () => {
      getRentReceipts();
    },500),
);

const rent_receipts = ref([]);
const pagination = ref([]);

async function getRentReceipts(page = 1){

  form.is_listing = true;

  await axios.get('/api/vouchers', { params : {
      page : page,
      paginate_limit : paginate_limit.value,
      search_query : form.search_query,
      filter: filter,
      type: 2,
    } }).then( (response) => {

    rent_receipts.value = response.data.data;
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
  await getRentReceipts();
}

async function changeStatus(slack){

  var form_data = new FormData();
  form_data.append('slack',slack);
  form_data.append('type',2);

  await axios.post('/api/voucher/update_status', form_data).then( (response) => {

    if(response.data.status_code == 200) {

      toast.success(response.data.msg);

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

//Code for Filter
const show_filter = ref(false);
const initial_filter = reactive({
  dates: ref(),
  status: ref(""),
});
const filter = reactive({...initial_filter});
const show_clear_filter = ref(false);

async function filterList() {
  if (JSON.stringify(filter) != JSON.stringify(initial_filter)) {
    show_clear_filter.value = true;
  }
  show_filter.value = false;
  await getRentReceipts();
}

async function fetchFilterData() {
  show_filter.value = !show_filter.value;
}

function clearFilter() {
  Object.assign(filter, initial_filter);
  show_clear_filter.value = false;
  getRentReceipts();
}
//End filter code

function viewRentReceipt(slack){
  router.push('/rent_receipt/'+slack);
}
function editRentReceipt(slack){
  router.push('/rent_receipt/edit/'+slack);
}

/* Checking permissions */
const permissions = ref({
  write : true,
  delete : false,
});


</script>