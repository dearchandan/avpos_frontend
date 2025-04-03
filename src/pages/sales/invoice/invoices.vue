<template>
  <DefaultLayout>

    <template v-slot:subheader>
      <SalesMenu/>
    </template>

    <div class="content">
      <div class="page-heading">

        <div class="row align-items-center justify-content-between mb-3">
          <div class="col-auto">
              <h2 class="mb-0">{{ $t('Invoices') }}</h2>
          </div>
          <div class="col-auto" v-if="permissions.write">
              <router-link class="btn btn-sm btn-light-primary2" to="/invoice/add">+ {{ $t('New Invoice') }}
              </router-link>
          </div>
        </div>

        <div class="row align-items-end justify-content-between g-3">
            <div class="col col-lg-auto order-2 order-md-1">
                <div class="row g-3 align-items-end">
                    <div class="col col-md-auto">
                      <div class="form-field">
                        <label>{{ $t('Invoice Date') }}</label>
                        <VueDatePicker range v-model="filter.invoice_dates" :format="'dd-MM-yyyy'"
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
                        <label>{{ $t('Invoice Due Date') }}</label>
                            
                        <VueDatePicker range v-model="filter.invoice_due_dates" :format="'dd-MM-yyyy'"
                          :enable-time-picker="false"
                          input-class-name="form-control form-control-solid form-control-sm" 
                          @update:model-value="filterList()"
                          />
                      </div>
                    </div>
                    
                    <!-- Continue: Commented due to n+1 problem -->
                    <!-- <div class="col-6 col-md-auto">
                      
                      <VMultiSelect
                          name="customer"
                          :label="labels.customer"
                          :placeholder="labels.select_customer"
                          :text="'value'"
                          :value="'key'"
                          :options="customers"
                          v-model="filter.customer"
                          :no_class="false"
                          :height_sm="true"
                          mode="single"
                          :addModalShow="false"
                      />
                    </div> -->
                    <div class="col-6 col-md-auto d-md-block">
                      <label>{{ $t('Status') }}</label>
                      <select class="form-select form-select-solid form-select-sm" v-model="filter.status" @change="filterList">
                        <option value="">{{ $t('All') }}</option>
                        <option value="0">{{ $t('Draft') }}</option>
                        <option value="1">{{ $t('Paid') }}</option>
                        <option value="2">{{ $t('Partial Paid') }}</option>
                        <option value="3">{{ $t('Returned') }}</option>
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
        <AsyncServerMessage v-if="server_messages.messages != ''" :server_messages="server_messages"  />

        <!--    Transfer To List    -->
        <table class="table table-list-data table-hover">
          <thead class="bg-light">
          <tr>
            <th scope="col" width="10%">{{ $t('Invoice Number') }}</th>
            <th scope="col" width="10%">{{ $t('Ref. Number') }}</th>
            <th scope="col" width="10%">{{ $t('Customer') }}</th>
            <th scope="col" width="10%">{{ $t('Invoice Date') }}</th>
            <th scope="col" width="10%">{{ $t('Invoice Due Date') }}</th>
            <th scope="col" width="10%" class="text-end">{{ $t('Amount') }}</th>
            <th scope="col" width="10%" class="text-center">{{ $t('Status') }}</th>
            <th scope="col" class="text-end" width="10%" v-if="permissions.write">{{ $t('Action') }}</th>
          </tr>
          </thead>
          <tbody>
          <tr v-if="invoices != ''" v-for="(invoice,invoice_index) in invoices"
              :key="invoice_index">
            <td invoice="button" data-bs-toggle="modal" data-bs-target="#viewInvoiceModal"
                @click="viewInvoice(invoice.slack)">{{ invoice.invoice_number }}
            </td>
            <td invoice="button" data-bs-toggle="modal" data-bs-target="#viewInvoiceModal"
                @click="viewInvoice(invoice.slack)">{{ invoice.reference_no>0?invoice.reference_no:'--' }}
            </td>
            <td invoice="button" data-bs-toggle="modal" data-bs-target="#viewInvoiceModal"
                @click="viewInvoice(invoice.slack)">{{ invoice.customer?.name }}
            </td>
            <td invoice="button" data-bs-toggle="modal" data-bs-target="#viewInvoiceModal"
                @click="viewInvoice(invoice.slack)">{{ invoice.invoice_date_label }}
            </td>
            <td invoice="button" data-bs-toggle="modal" data-bs-target="#viewInvoiceModal"
                @click="viewInvoice(invoice.slack)"><span v-if="invoice.invoice_due_date_label!=null">{{ invoice.invoice_due_date_label }}</span><span v-else>--</span>
            </td>

            <td class="text-end" invoice="button" data-bs-toggle="modal" data-bs-target="#viewInvoiceModal"
                @click="viewInvoice(invoice.slack)">
              <span v-if="invoice.returned_status == 0">{{ invoice.grand_amount_after_returned.toFixed(2) }} {{  currency_symbol  }}</span>
              <s class="text-muted" v-if="invoice.grand_amount_after_returned != invoice.grand_product_amount">{{ invoice.grand_product_amount }} {{  currency_symbol  }}</s> </td>

            <td class="text-center">
              <span v-if="invoice.status==0" class="badge badge-primary">{{ $t('Draft') }}</span>
              <span v-if="invoice.status==1" class="badge badge-success">{{ $t('Paid') }}</span>
              <span v-if="invoice.status==2" class="badge badge-warning">{{ $t('Partial Paid') }}</span>
              <div v-if="invoice.status==3">
                <span v-if="invoice.returned_status==0" class="badge badge-info">{{ $t('Partial Returned') }}</span>
                <span v-if="invoice.returned_status==1" class="badge badge-secondary">{{ $t('Returned') }}</span>
              </div>
            </td>
            <td class="text-end" width="10%" >
              <!-- <ActionButtonGroup v-if="invoice.status==0" :permissions="permissions" @edit="editInvoice" :slack="invoice.slack" /> -->
              <div v-if="permissions.write && permissions.delete" >
              <div class="row flex-nowrap gx-2 text-end">
                <div class="col-auto">
                  <button v-if="invoice.status == 1 && zatca && !invoice.zatcaResponse" @click="signStandardInvoice(invoice.slack)" :disabled="is_signing" target="_blank" type="button" class="btn btn-xs btn-warning ms-2">
                    E-Sign
                  </button> 
                </div>
                <div class="col-auto">
                  <a v-if="permissions.write && invoice.status==0" class="btn btn-icon btn-xs btn-light" href="#" @click="editInvoice(invoice.slack)" >
                      <Icon icon="fa6-solid:pen" class="fs-5 text-default" />
                  </a>
                </div>
                <div class="col-auto" v-if="(invoice.returned_status != 1 && invoice.status != 0)">
                  <a v-if="(invoice.returned_status != 1 && invoice.status != 0 )" href="#" type="button" class="mx-2" 
                    :title="(invoice.invoice_service_products_qty_with_return_qty == invoice.grand_product_quantity) ? 'Return completed except Service Items':''"
                    @click="(invoice.invoice_service_products_qty_with_return_qty != invoice.grand_product_quantity) ? returnInvoice(invoice.slack):null">
                    <Icon icon="tabler:receipt-refund" class="fs-3 text-warning" />
                  </a>
                </div>
                <div class="col-auto">
                  <a :href="invoice.receipt_link" target="_blank" type="button" class="btn btn-icon btn-xs btn-light">
                    <!--<Icon icon="ph:printer-light" class="fs-3 text-info" />-->
                      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 8V1H17V8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M5 17H3C2.46957 17 1.96086 16.7893 1.58579 16.4142C1.21071 16.0391 1 15.5304 1 15V10C1 9.46957 1.21071 8.96086 1.58579 8.58579C1.96086 8.21071 2.46957 8 3 8H19C19.5304 8 20.0391 8.21071 20.4142 8.58579C20.7893 8.96086 21 9.46957 21 10V15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M17 13H5V21H17V13Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                  </a>  
                </div>
               
              </div>
              </div>
              
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
            <Bootstrap5Pagination :data="pagination" :limit="5"  @pagination-change-page="getInvoices"/>
          </div>
        </div>
      </div>
    </div>

    <asyncReturnInvoiceModal @refreshInvoices="getInvoices()" ref="returnInvoiceRef" />

  </DefaultLayout>
</template>

<script setup>

import {Bootstrap5Pagination} from 'laravel-vue-pagination';
import {useAuthStore} from '@/stores/auth';
import VueDatePicker from '@vuepic/vue-datepicker';
import {ref, onMounted, reactive, watch, defineComponent, computed} from "vue";
import useGlobalFunctions from '@/composables/global_functions.js';
import { useI18n } from 'vue-i18n'
const AsyncServerMessage = defineAsyncComponent( () => import('@/components/common/ServerMessage.vue') );

const { t } = useI18n();
const { isAuthorized } = useGlobalFunctions();

const server_messages = reactive({
        type : "",
        messages : "",
});

const AsyncAddInvoice = defineAsyncComponent(() => import('@/components/invoice/AddInvoice.vue'));

const authStore = useAuthStore();
const labels = ref({
  customer: t("Customer"),
  select_customer: t("Select Customer")
});
const initialState = {
  is_listing: false,
  // form data
  search_query: ref(""),
  filter_count: 0,
};
const search_placeholder = t("Search by Invoice No., Invoice Ref. No., Amount...")
const form = reactive({...initialState});

onMounted(() => {
  checkPermissions();
  getInvoices();
  // getCustomers() // Continue: commented due to n+1 problem, requires new API
  getZatca();
});

watch(() =>
        form.search_query, _.debounce(() => {
      getInvoices();
    }, 500),
);

const invoices = ref([]);
const pagination = ref([]);

async function getInvoices(page = 1) {

  form.is_listing = true;

  await axios.get('/api/invoices', {
    params: {
      page: page,
      paginate_limit: paginate_limit.value,
      search_query: form.search_query,
      filter: filter,

    }
  }).then((response) => {
    invoices.value = response.data.data;
    pagination.value = response.data.pagination;
    form.is_listing = false;

  }).catch((error) => {
    server_messages.type = "error";
    server_messages.messages = error;
    form.is_listing = false;
    console.log(error);
  });

}

const customers = ref([]);

async function getCustomers() {

  let customer_data = await axios.get('api/customers/all',{
    params: {
      type: 1,
    },
  });
  customer_data = customer_data.data.data;
  _.forEach(customer_data, (item) => {
    let template = {
      'key': item.slack,
      'value': item?.name+' - '+item?.phone,
    };
    customers.value.push(template);
  })
}

const paginate_limit = ref();

async function paginate_limit_update(value) {
  paginate_limit.value = value;
  await getInvoices();
}


//Code for Filter
const show_filter = ref(false);
const initial_filter = reactive({
  invoice_dates: ref(),
  invoice_due_dates: ref(),
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
        if(item != '' && item != undefined && index != 'invoice_dates'){
            form.filter_count = form.filter_count + 1;
        }
    });
  show_filter.value = false;
  await getInvoices();
}

async function fetchFilterData() {
  show_filter.value = !show_filter.value;
}

function clearFilter() {
  Object.assign(filter, initial_filter);
  filter.customer = ref("");
  show_clear_filter.value = false;
  form.filter_count = 0;
  document.getElementsByClassName('multiselect-clear')[0].click();
  getInvoices();
}

//End filter code


function viewInvoice(slack) {
  router.push('/invoice/' + slack);
}

function editInvoice(slack) {
  router.push('/invoice/edit/' + slack);
}

async function deleteInvoice(slack) {

  var is_confirmed = false;

  await Swal.fire({
    title: t('Do you want to delete this invoice?'),
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

    await axios.post('/api/invoice/delete', {
      slack: slack
    }).then((response) => {

      if (response.data.status_code == 200) {

        toast.success(response.data.msg);
        getInvoices();

      } else {
        try {
          server_messages.type = "error";
          server_messages.messages = JSON.parse(response.data.msg);
        } catch (err) {
          server_messages.type = "error";
          server_messages.messages = response.data.msg;
        }
      }

    }).catch((error) => {
      server_messages.type = "error";
      server_messages.messages = error;
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
        write : isAuthorized('A_WRITE_INVOICE'),
        delete : isAuthorized('A_DELETE_INVOICE'),
    };
}

const returnInvoiceRef = ref(null);
function returnInvoice(slack){
  returnInvoiceRef.value.getInvoiceDetail(slack);
  $('#returnInvoiceModal').modal('show');
}

const asyncReturnInvoiceModal = defineAsyncComponent( () => import('@/components/invoice/ReturnInvoiceModal.vue') );

/* Zatca Phase 2 */
const zatca = ref("");
async function getZatca(){
      const response = await axios.get('/api/v2/zatca/merchant');
      if (response.data.status_code == 200 || response.data.status_code == 201 ) {
          zatca.value = response.data.data;
      }
}

const is_signing = ref(false);

async function signStandardInvoice(slack) {
  is_signing.value = true;
  
  try {
    const response = await axios.post('/api/v2/zatca/signStandardInvoice', { slack });

    is_signing.value = false;
    
    const responseData = response.data;
    
    if (responseData.status_code === 200 && responseData.data?.res) {
      // Successful Response
      toast.success("Invoice signed successfully!");
      getOrders();
      
    } else {
      // Validation Error or Failed Response
      server_messages.type = "error";

      if (responseData.data?.errors) {
        // Extract validation errors
        server_messages.messages = Object.values(responseData.data.errors).flat().join(', ');
      } else {
        server_messages.messages = responseData.data?.message || "An unknown error occurred.";
      }
    }
    
  } catch (error) {
    // Handle Network or Server Errors
    is_signing.value = false;
    server_messages.type = "error";
    server_messages.messages = error.response?.data?.message || "Something went wrong.";
    console.error(error);
  }
}
</script>