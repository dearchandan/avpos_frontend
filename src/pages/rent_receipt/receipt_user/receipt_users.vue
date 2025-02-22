<template>
  <DefaultLayout>

    <template v-slot:subheader>
      <RentReceiptMenu />
    </template>

    <div class="content">
      <div class="page-heading">

        <div class="row align-items-center justify-content-between mb-3">
          <div class="col-auto">
            <h2 class="mb-0">{{ $t('Rent Receipt Users') }}</h2>
          </div>
          <div class="col-auto">
            <router-link class="btn btn-sm btn-light-primary2" to="/rent_receipt_user/add" >+ {{ $t('New Rent Receipt User') }}</router-link>
          </div>
        </div>

        <div class="row align-items-end justify-content-between mb-3">
          <div class="col-md-auto">
            <div class="row align-items-end justify-content-between g-3">
              <div class="col-12 col-md-auto">
                <div class="form-field">
                  <label>{{ $t('Created Date') }}</label>
                  <VueDatePicker range v-model="filter.dates" :format="'dd-MM-yyyy'" :enable-time-picker="false" @update:model-value="filterList()" input-class-name="form-control form-control-solid form-control-sm"/>
                </div>
              </div>
              <div class="col col-md-auto">
                <div class="form-field">
                  <label>{{ $t('Status') }}</label>
                  <select class="form-control form-control-sm form-control-solid" v-model="filter.status" @change="filterList">
                    <option value="">{{ $t('All') }}</option>
                    <option value="1">{{ $t('Active') }}</option>
                    <option value="0">{{ $t('Inactive') }}</option>
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

            <th scope="col" width="10%">{{ $t('Name') }}</th>
            <th scope="col" width="10%">{{ $t('IQAMA/Passport No.') }}</th>
            <th scope="col" width="20%">{{ $t('Country') }}</th>
            <th scope="col" width="10%">{{ $t('Created Date') }}</th>
            <th scope="col" width="10%">{{ $t('Status') }}</th>
              <th scope="col" class="text-end" width="5%">{{ $t('Action') }}</th>
          </tr>
          </thead>
          <tbody>
          <tr v-if="rent_receipt_users != ''" v-for="(rent_receipt_user,branch_index) in rent_receipt_users" :key="branch_index" >
            <td role="button">{{ rent_receipt_user.name }}</td>
            <td role="button">{{ rent_receipt_user.iqama_or_passport_number }}</td>
            <td role="button">{{ rent_receipt_user.country }}</td>
            <td role="button">{{ rent_receipt_user.created_at_label }}</td>
            <td role="button">
              <div class="form-feild">
                <div class="form-check form-switch form-switch-2">
                  <input class="form-check-input" type="checkbox" role="switch" id="Status_id" @change="changeStatus(rent_receipt_user.slack)" :checked="rent_receipt_user.status == 1">
                </div>
              </div>
            </td>
            <td class="text-end">
              <ActionButtonGroup :permissions="permissions" @edit="editRentReceiptUser" :slack="rent_receipt_user.slack" />
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
            <Bootstrap5Pagination :data="pagination" :limit="5"  @pagination-change-page="getRentReceiptUsers" />
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
const search_placeholder = t("Search by name, country, IQAMA/ Passport")
const form = reactive({ ...initialState });

onMounted(() => {
  getRentReceiptUsers()
});

watch(() =>
        form.search_query, _.debounce( () => {
      getRentReceiptUsers();
    },500),
);

const rent_receipt_users = ref([]);
const pagination = ref([]);

async function getRentReceiptUsers(page = 1){

  form.is_listing = true;

  await axios.get('/api/voucher_users', { params : {
      page : page,
      paginate_limit : paginate_limit.value,
      search_query : form.search_query,
      filter: filter,
      type:2,
    } }).then( (response) => {

    rent_receipt_users.value = response.data.data;
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
  await getRentReceiptUsers();
}

async function changeStatus(slack){

  var form_data = new FormData();
  form_data.append('slack',slack);

  await axios.post('/api/voucher_user/update_status', form_data).then( (response) => {

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
  await getRentReceiptUsers();
}

async function fetchFilterData() {
  show_filter.value = !show_filter.value;
}

function clearFilter() {
  Object.assign(filter, initial_filter);
  show_clear_filter.value = false;
  getRentReceiptUsers();
}
//End filter code
function editRentReceiptUser(slack){
  router.push('/rent_receipt_user/edit/'+slack);
}

/* Checking permissions */
const permissions = ref({
  write : true,
  delete : false,
});
</script>