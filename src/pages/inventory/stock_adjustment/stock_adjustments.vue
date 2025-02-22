<template>
  <DefaultLayout>

    <template v-slot:subheader>
      <InventoryMenu/>
    </template>

    <div class="content">
      <div class="page-heading">

        <div class="row align-items-center justify-content-between mb-3">
            <div class="col-auto">
                <h2 class="mb-0">{{ $t('Stock Adjustment') }}</h2>
            </div>
            <div class="col-auto" v-if="permissions.write">
              <a href="#" class="btn btn-sm btn-light-primary2" data-bs-toggle="modal"
                   @click="openAddStockAdjustmentModal()" data-bs-target="#addStockAdjustmentModal">+ {{ $t('New Stock Adjustment') }}</a>
            </div>
        </div>
        
        <div class="row align-items-end justify-content-between mb-3">
            <div class="col-auto col-md-auto">
              <div class="row align-items-end justify-content-between">
                  <div class="col-auto col-md-auto">
                    <div class="form-field">
                      <label>{{ $t('Approved Date') }}</label>
                      <VueDatePicker range v-model="filter.dates" :format="'dd-MM-yyyy'" :enable-time-picker="false" @update:model-value="filterList()" input-class-name="form-control form-control-solid form-control-sm" />
                    </div>
                  </div>
                  <div class="col-auto">
                    <div class="form-field">
                      <label for="" class="form-label">{{ $t('Status') }}</label>
                      <select class="form-control form-control-sm form-control-solid" v-model="filter.status" @change="filterList">
                        <option value="">{{ $t('All') }}</option>
                        <option value="1">{{ $t('Pending') }}</option>
                        <option value="2">{{ $t('Approved') }}</option>
                        <option value="3">{{ $t('Rejected') }}</option>
                      </select>
                    </div>
                  </div>
              </div>
            </div>
            <div class="col-auto col-md-auto ml-0 me-auto" >
                <button class="btn btn-sm btn-light-danger" v-if="show_clear_filter" @click="clearFilter"> {{ $t('Clear') }} </button>
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

        <!--    Adjustment List    -->
        <table class="table table-list-data table-hover">
          <thead class="bg-light">
          <tr>
            <th scope="col" width="15%">{{ $t('Reference Number') }}</th>
            <th scope="col" width="30%" >{{ $t('Branch') }}</th>
            <th scope="col" width="15%">{{ $t('Created Date') }}</th>
            <th scope="col" width="15%">{{ $t('Approved Date') }}</th>
            <th scope="col" width="20%">{{ $t('Status') }}</th>
          </tr>
          </thead>
          <tbody>
          <tr v-if="stock_adjustments != ''" v-for="(stock_adjustment,stock_adjustment_index) in stock_adjustments"
              :key="stock_adjustment_index">
            <td @click="viewStockAdjustment(stock_adjustment.slack)" role="button">{{ stock_adjustment.reference_no }}</td>
            <td @click="viewStockAdjustment(stock_adjustment.slack)" role="button">{{ stock_adjustment.branch.name }}</td>
            <td @click="viewStockAdjustment(stock_adjustment.slack)" role="button">{{ stock_adjustment.created_at_label }}</td>
            <td @click="viewStockAdjustment(stock_adjustment.slack)" role="button">{{ stock_adjustment.approved_at_label }}</td>
            <!-- <td v-if="permissions.write && stock_adjustment.status==0 || stock_adjustment.status==1">
              <select class="form-control form-control-solid" v-model="stock_adjustment.status" name="from_status" :id="stock_adjustment.slack"
                  @change="changeStatus($event , stock_adjustment.slack)">
                <option :value="option.key" v-for="(option,index) in status_options" :key="index"> {{ option.value }} </option>
              </select>
            </td> -->
            <td>
              <span v-if="stock_adjustment.status==1" class="badge badge-warning" role="button">{{ $t('Pending') }}</span>
              <span v-if="stock_adjustment.status==2" class="badge badge-success" role="button">{{ $t('Approved') }}</span>
              <span v-if="stock_adjustment.status==3" class="badge badge-danger" role="button">{{ $t('Rejected') }}</span>
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
            <Bootstrap5Pagination :data="pagination" :limit="5"  @pagination-change-page="getStockAdjustments"/>
          </div>
        </div>
      </div>
    </div>

    <AsyncAddStockAdjustment :show_add_stock_adjustment_modal="show_add_stock_adjustment_modal"
      @closeAddStockAdjustmentModal="closeAddStockAdjustmentModal" @getStockAdjustments="getStockAdjustments"/>

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

const AsyncAddStockAdjustment = defineAsyncComponent(() => import('@/components/stock_adjustment/AddStockAdjustment.vue'));

const authStore = useAuthStore();

const show_add_stock_adjustment_modal = ref(false);

function openAddStockAdjustmentModal() {
  show_add_stock_adjustment_modal.value = true;
}

function closeAddStockAdjustmentModal() {
  show_add_stock_adjustment_modal.value = false;
  // getStockAdjustments();
}

const initialState = {
  server_messages: {
    type: "",
    messages: "",
  },
  is_listing: false,
  // form data
  search_query: ref("")
};
const search_placeholder = t("Search by reference no...")
const form = reactive({...initialState});

onMounted(() => {
  checkPermissions();
  getStockAdjustments();
  // loadBranches();
});

watch(() =>
        form.search_query, _.debounce(() => {
      getStockAdjustments();
    }, 500),
);

const stock_adjustments = ref([]);
const pagination = ref([]);

const status_options = ref([
  {
    key: '1',
    value: 'Pending',
  },
  {
    key: '2',
    value: 'Approved',
  },
  {
    key: '3',
    value: 'Rejected',
  }
]);

async function getStockAdjustments(page = 1) {

  form.is_listing = true;

  await axios.get('/api/stock_adjustments', {
    params: {
      page: page,
      paginate_limit: paginate_limit.value,
      search_query: form.search_query,
      filter: filter,
    }
  }).then((response) => {

    stock_adjustments.value = response.data.data;
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

async function paginate_limit_update(value) {
  paginate_limit.value = value;
  await getStockAdjustments();
}

async function changeStatus(event, slack) {

  var form_data = new FormData();
  form_data.append('slack', slack);
  form_data.append('status', event.target.value);

  await axios.post('/api/stock_adjustment/update_status', form_data).then((response) => {

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
  // branch: ref(),
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
  await getStockAdjustments();
}

async function fetchFilterData() {
  show_filter.value = !show_filter.value;
}

function clearFilter() {
  Object.assign(filter, initial_filter);
  show_clear_filter.value = false;
  getStockAdjustments();
}

//End filter code


function viewStockAdjustment(slack) {
  router.push('/stock_adjustment/' + slack);
}

//Delete Stock Adjustment
async function deleteStockAdjustment(slack) {

  var is_confirmed = false;

  await Swal.fire({
    title: t('Do you want to delete this stock adjustment?'),
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

    await axios.post('/api/stock_adjustment/delete', {
      slack: slack
    }).then((response) => {

      if (response.data.status_code == 200) {

        toast.success(response.data.msg);
        getStockAdjustments();

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

// const branches = ref([]);

 /*async function loadBranches() {
  let branch_data = await axios.get('api/branches/all');
  branch_data = branch_data.data.data;
  _.forEach(branch_data, (item) => {
    let template = {
      'key': item.slack,
      'value': item.code + ' - ' + item.name,
    };
    branches.value.push(template);
  })
} */


/* Checking permissions */
const permissions = ref({
    write : false,
    delete : false,
});

function checkPermissions(){
    permissions.value  = {
        write : isAuthorized('A_WRITE_STOCK_ADJUSTMENT'),
        delete : isAuthorized('A_DELETE_STOCK_ADJUSTMENT'),
    };
}

</script>