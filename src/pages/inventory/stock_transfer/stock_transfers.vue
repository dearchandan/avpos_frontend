<template>
  <DefaultLayout>

    <template v-slot:subheader>
      <InventoryMenu/>
    </template>

    <div class="content">
      <div class="page-heading">

          <div class="row align-items-center justify-content-between mb-3 g-3">
              <div class="col-auto order-1 order-md-1">
                <h2 class="mb-0">{{ $t('Stock Transfer') }}</h2>
              </div>
              <div class="col-auto me-auto ms-auto ms-md-0 order-3 order-md-2" >
                <div class="btn-group radio-btn-group">
                    <input class="btn-check" type="radio" name="list_type" checked="" v-model="form.list_type" :value="1" @change="changeList($event)" id="r-sent-stock">
                    <label class="btn btn-sm" for="r-sent-stock">{{ $t('Sent Stock') }}</label>

                    <input class="btn-check" type="radio" name="list_type" v-model="form.list_type" :value="2" @change="changeList($event)" id="r-sent-stock2">
                    <label class="btn btn-sm" for="r-sent-stock2">{{ $t('Received Stock') }}</label>
                </div>
              </div>
              <div class="col-auto order-2 order-md-3" v-if="permissions.write">
                <a href="#" class="btn btn-sm btn-light-primary2" data-bs-toggle="modal"
                    @click="openAddStockTransferModal()" data-bs-target="#addStockTransferModal">+ {{ $t('New Stock Transfer') }}</a>
              </div>
          </div>

          <div class="row align-items-end justify-content-between g-3">
              <div class="col col-lg-auto order-2 order-md-1">
                  <div class="row align-items-end g-3">
                      <div class="col-6 col-md-auto" >
                        <div class="form-field">
                              <label for="" class="form-label">{{ $t('Date') }}</label>
                              <VueDatePicker range v-model="filter.dates" :format="'dd-MM-yyyy'" 
                              :enable-time-picker="false" input-class-name="form-control form-control-solid form-control-sm" 
                              @update:model-value="filterList()"/>
                          </div>
                      </div>
                      <div class="col-6 col-md-auto" >
                          <div class="form-field">
                              <label for="" class="form-label">{{ $t('Select Branch') }}</label>
                              <VSelect
                                  name="branch"
                                  v-model="filter.branch"
                                  :placeholder="t('All')"
                                  :options="to_branches"
                                  @change="filterList"
                                  :islabel="false"
                                  height_sm="true"
                                />
                          </div>
                      </div>
                      <div class="col-6 col-md-auto" >
                        <div class="form-field">
                          <label for="" class="form-label">{{ $t('Status') }}</label>
                          <select class="form-control form-control-sm form-control-solid" v-model="filter.status" @change="filterList">
                            <option value="">{{ $t('All') }}</option>
                            <option value="0">{{ $t('Pending') }}</option>
                            <option value="1">{{ $t('Approval Pending') }}</option>
                            <option value="2">{{ $t('Accepted') }}</option>
                            <option value="3">{{ $t('Partial Accepted') }}</option>
                            <option value="4">{{ $t('Rejected') }}</option>
                          </select>
                        </div>
                      </div>
                      <div class="col-auto col-md-auto" >
                          <button class="btn btn-sm btn-light-danger" v-if="show_clear_filter" @click="clearFilter"> {{ $t('Clear') }} </button>
                      </div>
                  </div>
              </div>
              <div class="col-12 col-md-4 col-lg-3 order-1 order-md-2 d-none d-md-block">
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
      <div v-else class="table-responsive">
        <!--    Transfer To List    -->
        <table v-if="form.list_type==1" class="table table-list-data table-hover">
          <thead class="bg-light">
          <tr>
            <th scope="col" width="10%">{{ $t('Reference Number') }}</th>
            <th scope="col" width="60%">{{ $t('Receiving Branch') }}</th>
            <th scope="col" width="10%">{{ $t('Date') }}</th>
            <th scope="col" width="10%">{{ $t('Status') }}</th>
            <th scope="col" class="text-end" width="10%" v-if="permissions.write || permissions.delete">{{ $t('Action') }}</th>
          </tr>
          </thead>
          <tbody>
          <tr v-if="stock_transfers != ''" v-for="(stock_transfer,stock_transfer_index) in stock_transfers"
              :key="stock_transfer_index">
            <td stock_transfer="button" data-bs-toggle="modal" data-bs-target="#viewStockTransferModal"
                @click="viewStockTransfer(stock_transfer.slack)">{{ stock_transfer.reference_no }}
            </td>
            <td stock_transfer="button" data-bs-toggle="modal" data-bs-target="#viewStockTransferModal"
                @click="viewStockTransfer(stock_transfer.slack)">{{ stock_transfer.to_branch.name }}
            </td>
            <td stock_transfer="button" data-bs-toggle="modal" data-bs-target="#viewStockTransferModal"
                @click="viewStockTransfer(stock_transfer.slack)">{{ stock_transfer.transfer_at_label }}
            </td>
            <td>
              <span v-if="stock_transfer.status==0" class="badge badge-primary">{{ $t('Pending') }}</span>
              <span v-if="stock_transfer.status==1" class="badge badge-info">{{ $t('Approval Pending') }}</span>
              <span v-if="stock_transfer.status==2" class="badge badge-success">{{ $t('Accepted') }}</span>
              <span v-if="stock_transfer.status==3" class="badge badge-warning">{{ $t('Partial Accepted') }}</span>
              <span v-if="stock_transfer.status==4" class="badge badge-danger">{{ $t('Rejected') }}</span>
            </td>
            <td class="text-end" v-if="permissions.write || permissions.delete">
              <!-- <div class="dropdown" v-if="stock_transfer.status==0 || stock_transfer.status==1">
                <button class="btn btn-icon btn-sm btn-light dropdown-toggle arrow-none" type="button"
                        data-bs-toggle="dropdown" aria-expanded="false">
                  <Icon icon="fa6-solid:ellipsis-vertical"/>
                </button>
                <ul class="dropdown-menu">
                  <li v-if="permissions.delete">
                    <a class="dropdown-item" href="#" @click="deleteStockTransfer(stock_transfer.slack)">{{ $t('Delete') }}</a>
                  </li>
                </ul>
              </div> -->
              <ActionButtonGroup v-if="stock_transfer.status==0 || stock_transfer.status==1" :permissions="permissions"  @delete="deleteStockTransfer" :slack="stock_transfer.slack"  />
            </td>
          </tr>

          <tr v-else>
            <td class="text-center py-3" colspan="8">{{ $t('No Data Found') }}</td>
          </tr>

          </tbody>
        </table>

        <!--    Transfer From List    -->
        <table v-if="form.list_type==2" class="table table-list-data table-hover">
          <thead class="bg-light">
          <tr>
            <th scope="col" width="10%">{{ $t('Reference Number') }}</th>
            <th scope="col" width="70%">{{ $t('Sent Branch') }}</th>
            <th scope="col" width="10%">{{ $t('Date') }}</th>
            <th scope="col" width="10%">{{ $t('Status') }}</th>
          </tr>
          </thead>
          <tbody>
          <tr v-if="stock_transfers != ''" v-for="(stock_transfer,stock_transfer_index) in stock_transfers"
              :key="stock_transfer_index">
            <td stock_transfer="button" data-bs-toggle="modal" data-bs-target="#viewStockTransferModal"
                @click="viewStockTransfer(stock_transfer.slack)">{{ stock_transfer.reference_no }}
            </td>
            <td stock_transfer="button" data-bs-toggle="modal" data-bs-target="#viewStockTransferModal"
                @click="viewStockTransfer(stock_transfer.slack)">{{ stock_transfer.from_branch.name }}
            </td>
            <td stock_transfer="button" data-bs-toggle="modal" data-bs-target="#viewStockTransferModal"
                @click="viewStockTransfer(stock_transfer.slack)">{{ stock_transfer.transfer_at_label }}
            </td>
            <td v-if="permissions.write && stock_transfer.status==0 || stock_transfer.status==1">
              <select
                  class="form-control form-control-solid"
                  v-model="stock_transfer.status"
                  name="from_status"
                  :id="stock_transfer.slack"
                  @change="changeStatus($event , stock_transfer.slack)"
              >
                <option :value="option.key" v-for="(option,index) in to_status_options" :key="index">{{
                    option.value
                  }}
                </option>
              </select>
            </td>
            <td v-else>
              <span v-if="stock_transfer.status==2" class="badge badge-success">{{ $t('Accepted') }}</span>
              <span v-if="stock_transfer.status==3" class="badge badge-warning">{{ $t('Partial Accepted') }}</span>
              <span v-if="stock_transfer.status==4" class="badge badge-danger">{{ $t('Rejected') }}</span>
            </td>
          </tr>

          <tr v-else>
            <td class="text-center py-3" colspan="8">No Data Found</td>
          </tr>

          </tbody>
        </table>

      </div>
      <div class="data-footer">
        <div class="row align-items-center justify-content-between">
          <div class="col-auto">
            <PaginateLimit @paginate_limit_update="paginate_limit_update" :pagination="pagination"/>
          </div>
          <div class="col-auto">
            <Bootstrap5Pagination :data="pagination" :limit="5"  @pagination-change-page="getStockTransfers"/>
          </div>
        </div>
      </div>
    </div>

    <AsyncAddStockTransfer :show_add_stock_transfer_modal="show_add_stock_transfer_modal" @closeAddStockTransferModal="closeAddStockTransferModal"/>

  </DefaultLayout>
</template>

<script setup>

import {Bootstrap5Pagination} from 'laravel-vue-pagination';
import {useAuthStore} from '@/stores/auth';
import VueDatePicker from '@vuepic/vue-datepicker';
import {reactive, ref} from "vue";
import useGlobalFunctions from '@/composables/global_functions.js';
import { useI18n } from 'vue-i18n'

const { t } = useI18n();
const { isAuthorized } = useGlobalFunctions();

const AsyncAddStockTransfer = defineAsyncComponent(() => import('@/components/stock_transfer/AddStockTransfer.vue'));

const authStore = useAuthStore();

const show_add_stock_transfer_modal = ref(false);

function openAddStockTransferModal() {
  show_add_stock_transfer_modal.value = true;
}

function closeAddStockTransferModal() {
  show_add_stock_transfer_modal.value = false;
  getStockTransfers();
}

const initialState = {
  server_messages: {
    type: "",
    messages: "",
  },
  is_listing: false,
  list_type: 2,
  // form data
  search_query: ref(""),
};
const search_placeholder = t("Search by reference no...")
const form = reactive({...initialState});

onMounted(() => {
  checkPermissions();
  getStockTransfers()
  loadBranches()
});

watch(() =>
        form.search_query, _.debounce(() => {
      getStockTransfers();
    }, 500),
);

const stock_transfers = ref([]);
const pagination = ref([]);

const from_status_options = ref([
  {
    key: '0',
    value: 'Pending',
  },
  {
    key: '1',
    value: 'Approval Pending',
  }
]);
const to_status_options = ref([
  {
    key: '1',
    value: 'Approval Pending',
  },
  {
    key: '4',
    value: 'Rejected',
  }
]);

async function changeList(event) {
  form.list_type = event.target.value;
  getStockTransfers(1);
}

async function getStockTransfers(page = 1) {

  form.is_listing = true;

  await axios.get('/api/v2/stock_transfers', {
    params: {
      page: page,
      paginate_limit: paginate_limit.value,
      search_query: form.search_query,
      filter: filter,
      list_type: form.list_type,
    }
  }).then((response) => {

    stock_transfers.value = response.data.data.data;
    pagination.value = response.data.data.pagination;
    form.is_listing = false;

  }).catch((error) => {
    form.server_messages.type = "error";
    form.server_messages.messages = error;
    form.is_listing = false;
    console.log(error);
  });

}

const paginate_limit = ref();

async function paginate_limit_update(value) {
  paginate_limit.value = value;
  await getStockTransfers();
}

async function changeStatus(event, slack) {

  var form_data = new FormData();
  form_data.append('slack', slack);
  form_data.append('status', event.target.value);

  await axios.post('/api/stock_transfer/update_status', form_data).then((response) => {

    if (response.data.status_code == 200) {

      toast.success(response.data.msg);

    } else {
      try {
        form.server_messages.type = "error";
        form.server_messages.messages = JSON.parse(response.data.msg);
      } catch (err) {
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
  branch: ref(),
  status: ref(""),
});
const filter = reactive({...initial_filter});
// var initial_filter = JSON.stringify(JSON.parse(JSON.stringify(filter)));
const show_clear_filter = ref(false);

async function filterList() {
  if (JSON.stringify(filter) != JSON.stringify(initial_filter)) {
    show_clear_filter.value = true;
  }
  show_filter.value = false;
  await getStockTransfers();
}

async function fetchFilterData() {
  show_filter.value = !show_filter.value;
}

function clearFilter() {
  Object.assign(filter, initial_filter);
  show_clear_filter.value = false;
  getStockTransfers();
}

//End filter code


function viewStockTransfer(slack) {
  router.push('/stock_transfer/' + slack);
}

//Delete Stock Transfer
async function deleteStockTransfer(slack) {

  var is_confirmed = false;

  await Swal.fire({
    title: t('Do you want to delete this stock transfer?'),
    showCancelButton: true,
    confirmButtonText: t('Yes, Delete'),
    confirmButtonColor: '#d33',
    cancelButtonText: t('Cancel'),
  }).then((result) => {
    if (result.isConfirmed) {
      is_confirmed = true;
    }
  });

  if (is_confirmed) {

    await axios.post('/api/stock_transfer/delete', {
      slack: slack
    }).then((response) => {

      if (response.data.status_code == 200) {

        toast.success(response.data.msg);
        getStockTransfers();

      } else {
        try {
          form.server_messages.type = "error";
          form.server_messages.messages = JSON.parse(response.data.msg);
        } catch (err) {
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

const to_branches = ref([]);

async function loadBranches() {
  let branch_data = await axios.get('api/v2/branches/get_to_branches');
  branch_data = branch_data.data.data;
  _.forEach(branch_data, (item) => {
    let template = {
      'key': item.slack,
      'value': item.code + ' - ' + item.name,
    };
    to_branches.value.push(template);
  })
}


/* Checking permissions */
const permissions = ref({
    write : false,
    delete : false,
});

function checkPermissions(){
    permissions.value  = {
        write : isAuthorized('A_WRITE_STOCK_TRANSFER'),
        delete : isAuthorized('A_DELETE_STOCK_TRANSFER'),
    };
}

</script>