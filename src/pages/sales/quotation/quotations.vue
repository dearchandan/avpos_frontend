<template>
  <DefaultLayout>

    <template v-slot:subheader>
      <SalesMenu/>
    </template>

    <div class="content">
      <div class="page-heading">

        <div class="row align-items-center justify-content-between mb-3">
          <div class="col-auto">
              <h2 class="mb-0">{{ $t('Quotations') }}</h2>
          </div>
          <div class="col-auto" v-if="permissions.write">
            <router-link class="btn btn-sm btn-light-primary2" to="/quotation/add">+ {{ $t('New Quotation') }}
            </router-link>
          </div>
        </div>

        <div class="row align-items-end justify-content-between g-3">
          <div class="col col-lg-auto order-2 order-md-1">
                <div class="row g-3 align-items-end">
                    <div class="col col-md-auto">
                      <div class="form-field">
                        <label>{{ $t('Quotation Date') }}</label>
                        <VueDatePicker range v-model="filter.quotation_dates" :format="'dd-MM-yyyy'"
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
                <div class="row align-items-end g-3">
                    <div class="col-6 col-md-auto">
                      <div class="form-field">
                            <label>{{ $t('Quotation Due Date') }}</label>
                            <VueDatePicker range v-model="filter.quotation_due_dates" :format="'dd-MM-yyyy'"
                              :enable-time-picker="false"
                              input-class-name="form-control form-control-solid form-control-sm" 
                              @update:model-value="filterList()"
                              />
                          </div>
                    </div>
                    
                    <div class="col-6 col-md-auto">
                      <VSelect
                          name="customer"
                          :label="labels.customer"
                          v-model="filter.customer"
                          :placeholder="labels.select_customer"
                          :options="customers"
                          :height_sm="true"
                      />
                    </div>
                    <div class="col-6 col-md-auto d-md-block">
                      <label>{{ $t('Status') }}</label>
                      <select class="form-select form-select-solid form-select-sm" v-model="filter.status" @change="filterList">
                        <option value="">{{ $t('All') }}</option>
                        <option value="0">{{ $t('Draft') }}</option>
                        <option value="1">{{ $t('Approved') }}</option>
                      </select>
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
        <table class="table table-list-data table-hover">
          <thead class="bg-light">
          <tr>
            <th scope="col" width="10%">{{ $t('Quotation Number') }}</th>
            <th scope="col" width="10%">{{ $t('Ref. Number') }}</th>
            <th scope="col" width="10%">{{ $t('Customer') }}</th>
            <th scope="col" width="10%">{{ $t('Quotation Date') }}</th>
            <th scope="col" width="10%">{{ $t('Quotation Due Date') }}</th>
            <th scope="col" width="10%" class="text-end">{{ $t('Amount') }}</th>
            <th scope="col" width="10%" class="text-center">{{ $t('Status') }}</th>
            <!-- <th scope="col" width="10%" class="text-center">{{ $t('Print') }}</th> -->
            <th scope="col" class="text-end" width="5%" v-if="permissions.write || permissions.delete">{{ $t('Action') }}</th>
          </tr>
          </thead>
          <tbody>
          <tr v-if="quotations != ''" v-for="(quotation,quotation_index) in quotations"
              :key="quotation_index">
            <td quotation="button" data-bs-toggle="modal" data-bs-target="#viewQuotationModal"
                @click="viewQuotation(quotation.slack)">{{ quotation.quotation_number }}
            </td>
            <td quotation="button" data-bs-toggle="modal" data-bs-target="#viewQuotationModal"
                @click="viewQuotation(quotation.slack)">{{ quotation.reference_no }}
            </td>
            <td quotation="button" data-bs-toggle="modal" data-bs-target="#viewQuotationModal"
                @click="viewQuotation(quotation.slack)">{{ quotation.customer_name }}
            </td>
            <td quotation="button" data-bs-toggle="modal" data-bs-target="#viewQuotationModal"
                @click="viewQuotation(quotation.slack)">{{ quotation.quotation_date_label }}
            </td>
            <td quotation="button" data-bs-toggle="modal" data-bs-target="#viewQuotationModal"
                @click="viewQuotation(quotation.slack)">{{ quotation.quotation_due_date_label }}
            </td>
            <td class="text-end" quotation="button" data-bs-toggle="modal" data-bs-target="#viewQuotationModal"
                @click="viewQuotation(quotation.slack)">{{ quotation.grand_product_amount }}
            </td>
            <td class="text-center" v-if="quotation.status==0">
              <div class="form-field mb-0">
                <select
                    class="form-control form-control-solid"
                    v-model="quotation.status"
                    name="status"
                    :id="quotation.slack"
                    @change="changeStatus($event , quotation.slack)"
                >
                  <option :value="option.key" v-for="(option,index) in status_options" :key="index">{{ option.value }}</option>
                </select>
              </div>

            </td>
            <td class="text-center" v-else>
              <span v-if="quotation.status==1" class="badge badge-success">{{ $t('Approved') }}</span>
            </td>
            
            <td class="text-end" width="10%" v-if="permissions.write || permissions.delete">
              <!-- <ActionButtonGroup v-if="quotation.status==0" :permissions="permissions"  @delete="deleteQuotation" @edit="editQuotation" :slack="quotation.slack" /> -->
              <a :href="quotation.receipt_link" v-if="quotation.receipt_link != null" target="_blank" type="button" class="mx-2">
                <Icon icon="ph:printer-light" class="fs-3 text-info" />
              </a>

              <a v-if="permissions.write && quotation.status==0" class="mx-2" href="#" @click="editQuotation(quotation.slack)" >
                      <Icon icon="fa6-solid:pen" class="fs-5 text-default" />
              </a>

              <a v-if="permissions.delete && quotation.status==0" class="mx-2" href="#" @click="deleteQuotation(quotation.slack)" >
                      <Icon icon="fa6-solid:trash-can" class="fs-5 text-default" />
              </a>
              <a v-else>--</a>
              
            </td>
          </tr>

          <tr v-else>
            <td class="text-center py-3" colspan="10">{{ $t('No Data Found') }}</td>
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
            <Bootstrap5Pagination :data="pagination" :limit="5"  @pagination-change-page="getQuotations"/>
          </div>
        </div>
      </div>
    </div>

  </DefaultLayout>
</template>

<script setup>

import {Bootstrap5Pagination} from 'laravel-vue-pagination';
import {useAuthStore} from '@/stores/auth';
import VueDatePicker from '@vuepic/vue-datepicker';
import {ref, onMounted, reactive, watch, defineComponent, computed} from "vue";
import useGlobalFunctions from '@/composables/global_functions.js';
import { useI18n } from 'vue-i18n'

const { t } = useI18n();
const { isAuthorized } = useGlobalFunctions();

const authStore = useAuthStore();

const initialState = {
  server_messages: {
    type: "",
    messages: "",
  },
  is_listing: false,
  // form data
  search_query: ref(""),
  filter_count: 0,
};
const search_placeholder = t("Search by Quotation No., Quotation Ref. No., Amount...")
const form = reactive({...initialState});
const labels = ref({
  customer: t("Customer"),
  select_customer: t("Select Customer"),
});
onMounted(() => {
  checkPermissions();
  getQuotations();
  getCustomers();
});

watch(() =>
        form.search_query, _.debounce(() => {
      getQuotations();
    }, 500),
);

const quotations = ref([]);
const pagination = ref([]);

const status_options = ref([
  {
    key: '0',
    value: 'Draft',
  },
  {
    key: '1',
    value: 'Approved',
  }
]);

async function getQuotations(page = 1) {

  form.is_listing = true;

  await axios.get('/api/v2/quotations', {
    params: {
      page: page,
      paginate_limit: paginate_limit.value,
      search_query: form.search_query,
      filter: filter,

    }
  }).then((response) => {
    quotations.value = response.data.data;
    pagination.value = response.data.pagination;
    form.is_listing = false;

  }).catch((error) => {
    form.server_messages.type = "error";
    form.server_messages.messages = error;
    form.is_listing = false;
    console.log(error);
  });

}

const customers = ref([]);

async function getCustomers() {

  let customer_data = await axios.get('api/v2/customers/dropdown');
  customer_data = customer_data.data.data;
  _.forEach(customer_data, (item) => {
    let template = {
      'key': item.slack,
      'value': item?.name,
    };
    customers.value.push(template);
  })
}

const paginate_limit = ref();

async function paginate_limit_update(value) {
  paginate_limit.value = value;
  await getQuotations();
}

async function changeStatus(event, slack) {
  var form_data = new FormData();
  form_data.append('slack', slack);
  form_data.append('status', event.target.value);

  await axios.post('/api/quotation/update_status', form_data).then((response) => {

    if (response.data.status_code == 200) {

      toast.success(response.data.msg);
      getQuotations();
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
  quotation_dates: ref(),
  quotation_due_dates: ref(),
  customer: ref(""),
  status: ref(""),
});
const filter = reactive({...initial_filter});
// var initial_filter = JSON.stringify(JSON.parse(JSON.stringify(filter)));
const show_clear_filter = ref(false);

watch(() => 
    filter.customer, (value) => {
      filterList();
    },
);

async function filterList() {
  form.filter_count = 0;
  if (JSON.stringify(filter) != JSON.stringify(initial_filter)) {
    show_clear_filter.value = true;
  }
  _.forEach(filter, (item,index) => {
        if(item != '' && item != undefined && index != 'quotation_dates'){
          form.filter_count = form.filter_count + 1;
      }
  });
  show_filter.value = false;
  await getQuotations();
}

async function fetchFilterData() {
  show_filter.value = !show_filter.value;
}

function clearFilter() {
  Object.assign(filter, initial_filter);
  show_clear_filter.value = false;
  form.filter_count = 0;
  getQuotations();
}

//End filter code


function viewQuotation(slack) {
  router.push('/quotation/' + slack);
}

function editQuotation(slack) {
  router.push('/quotation/edit/' + slack);
}

async function deleteQuotation(slack) {

  var is_confirmed = false;

  await Swal.fire({
    title: t('Do you want to delete this quotation?'),
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

    await axios.post('/api/quotation/delete', {
      slack: slack
    }).then((response) => {

      if (response.data.status_code == 200) {

        toast.success(response.data.msg);
        getQuotations();

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


/* Checking permissions */
const permissions = ref({
    write : false,
    delete : false,
});

function checkPermissions(){
    permissions.value  = {
        write : isAuthorized('A_WRITE_QUOTATION'),
        delete : isAuthorized('A_DELETE_QUOTATION'),
    };
}


</script>