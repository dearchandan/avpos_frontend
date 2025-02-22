<template>
  <DefaultLayout>

    <template v-slot:subheader>
      <SalesMenu/>
    </template>

    <div class="content">
      <div class="page-heading">

        <div class="row align-items-center justify-content-between mb-3">
          <div class="col-auto">
              <h2 class="mb-0">{{ $t('Orders') }}</h2>
          </div>
        </div>

        <div class="row align-items-center justify-content-between g-3">
          <div class="col col-lg-auto order-2 order-md-1">
                <div class="row g-3 align-items-end">
                    <div class="col col-md-auto">
                      <div class="form-field">
                        <label>{{ $t('Date Range') }}</label>  
                        <VueDatePicker 
                            range :format="'dd-MM-yyyy'"
                            v-model="filters.business_dates" 
                            :enable-time-picker="false"
                            input-class-name="form-control form-control-sm form-control-solid"
                            class="dp-custom-sm"
                            max-range="90"
                            multi-calendars=""
                            :preset-dates="presetDates" 
                          >
                          <template #preset-date-range-button="{ label, value, presetDate }">
                            <span 
                                role="button"
                                :tabindex="0"
                                @click="presetDate(value)"
                                @keyup.enter.prevent="presetDate(value)"
                                @keyup.space.prevent="presetDate(value)">
                              {{ label }}
                            </span>
                          </template>
                        </VueDatePicker>
                      </div>
                    </div>
                    
                    <div class="col-auto col-md-auto">
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

                          <VMultiSelect 
                              :label="t('Terminal')"
                              v-model="filters.terminal_id"
                              name="terminals" 
                              :placeholder="t('All')" 
                              :text="'terminal_name'" 
                              :value="'id'" 
                              mode="single"
                              :options="terminals"
                              :no_class="false"
                              :height_sm="true"
                              
                          />
                    </div>
                    
                    <div class="col-6 col-md-auto">
                        <VMultiSelect 
                            :label="t('Order Type')"
                            v-model="filters.order_type"
                            name="order_type" 
                            :placeholder="t('All')" 
                            :text="'value'" 
                            :value="'key'" 
                            mode="single"
                            :options="order_types"
                            :no_class="false"
                            :height_sm="true"
                        />
                    </div>
                    <div class="col-6 col-md-auto d-md-block">
                        <VMultiSelect 
                            v-model="filters.sale_type"
                            name="sale_types" 
                            :text="'value'" 
                            :value="'key'" 
                            mode="single"
                            :options="sale_types"
                            :no_class="false"
                            :height_sm="true"
                            :placeholder="t('All')"
                            :label="t('Sale Type')"
                        />
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
            <th scope="col" width="10%">{{ $t('Business Date') }}</th>
            <th scope="col" width="10%">{{ $t('Terminal') }}</th>
            <th scope="col" width="5%">{{ $t('Order No.') }}</th>
            <!-- <th scope="col" width="5%">{{ $t('Reference No.') }}</th> -->
            <th scope="col" width="10%">{{ $t('Payment Method') }}</th>
            <th scope="col" width="5%">{{ $t('Order Type') }}</th>
            <th scope="col" width="5%" class="text-end">{{ $t('Status') }}</th>
            <th scope="col" width="8%" class="text-end">{{ $t('Amount') }}</th>
            <!-- <th scope="col" width="15%">{{ $t('Created At') }}</th> -->
            <th scope="col" width="20%" class="text-end">{{ $t('Action') }}</th>
          </tr>
          </thead>
          <tbody>

          <tr role="button" v-if="orders != ''" v-for="(order,order_index) in orders" :key="order_index" @click="handleRowClick($event,order.slack)">

              <td>{{ order.business_date_label }}</td>

              <td>{{ order.terminal_name }}</td>

              <td># {{ order.order_number }}</td>

              <!-- <td>{{ order.reference_number }}</td> -->
              
              
              <td>{{ order.payment_method_name }}</td>
              
              <td>
                  <span v-if="order.order_type == 1">{{ $t('Take Away') }}</span>
                  <span v-if="order.order_type == 2">{{ $t('Dine In') }}</span>
              </td>
              
             
              
              <!-- <td> <span v-if="order.returned_status == 0">{{ order.returned_total }} {{  currency_symbol  }}</span>  <s class="text-muted" v-if="order.returned_total != order.total">{{ order.total }} {{  currency_symbol  }}</s> </td> -->
              <td class="text-end">
                  <span v-if="order.order_status==0" class="badge badge-primary">{{ $t('Open') }}</span>
                  <span v-if="order.order_status==1" class="badge badge-success">{{ $t('Closed') }}</span>
                  <span v-if="order.order_status==2" class="badge badge-warning">{{ $t('In Kitchen') }}</span>
                  <span v-if="order.order_status==3" class="badge badge-danger">{{ $t('On Hold') }}</span>
                  <span v-if="order.order_status==4" class="badge badge-danger">{{ $t('Hold & In Kitchen') }}</span>
                  <span v-if="order.order_status==5" class="badge badge-secondary">Returned</span>
                  <span v-if="order.order_status==6" class="badge badge-info">Partial Returned</span>
                  <span v-if="order.order_status==7" class="badge badge-danger"><s>Cancelled</s></span>
              </td>
              <td class="fw-bold text-end text-primary">{{ getRoundedValue(order.total) }} {{  currency_symbol  }}</td>
          
              <!-- <td>{{ order.created_at_label }}</td> -->
              <td class="text-end"> 
                <a :href="order.receipt_link" target="_blank" type="button" class="btn btn-sm btn-primary ms-2">
                  Print <Icon icon="ph:printer-light" class="fs-3" />
                </a> 
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
            <Bootstrap5Pagination :data="pagination" :limit="5"  @pagination-change-page="getOrders"/>
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
import { endOfMonth,  startOfMonth, subMonths , startOfWeek, endOfWeek } from 'date-fns';
import useGlobalFunctions from '@/composables/global_functions.js';
import { useI18n } from 'vue-i18n'
import useGlobal from '@/composables/global.js';

const { t } = useI18n(); 
const { isAuthorized, getRoundedValue } = useGlobalFunctions();
const { order_types, sale_types } = useGlobal();

const authStore = useAuthStore();

const currency_symbol = computed(() => {
  return authStore.user.currency.symbol;
});
const user_branch_id = computed(() => {
  return authStore.user.branch_id;
})

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
const search_placeholder = t("Search by order or reference number")
const form = reactive({...initialState});

onMounted(() => {
  checkPermissions();
  getOrders()
  getTerminals();
});

watch(() =>
        form.search_query, _.debounce(() => {
      getOrders();
    }, 500),
);
const show_clear_filter = ref(false);

/* Filters */
const initial_filters = reactive({
      terminal_id : ref(""),
      business_dates : ref([new Date(), new Date()]),
      order_type : ref(""),
      sale_type : ref(""),
  });
const filters = reactive({ ...initial_filters });

const terminals = ref([]);
async function getTerminals(){
  await axios.post('/api/branch/terminals',{
      id : user_branch_id.value
    }).then( (response) => {
      if(response.data.status_code == 200) {
        terminals.value = response.data.data;
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
const presetDates = ref([
  { label: 'Today', value: [new Date(), new Date()] },
  { label: 'This Week', value: [startOfWeek(new Date()), endOfWeek(new Date())] },
  { label: 'This Month', value: [startOfMonth(new Date()), endOfMonth(new Date())] },
  {
    label: 'Last Month',
    value: [startOfMonth(subMonths(new Date(), 1)), endOfMonth(subMonths(new Date(), 1))],
  },
]);

watch(filters, () => {
  form.filter_count = 0;
  _.forEach(filters, (item,index) => {
        if(item != '' && item != undefined && index != 'business_dates'){
            form.filter_count = form.filter_count + 1;
        }
        if(form.filter_count > 0){
          show_clear_filter.value = true;
        }
    });
    getOrders();
},{ deep: true });

/* Orders */
const orders = ref([]);
const pagination = ref([]);

async function getOrders(page = 1) {

  form.is_listing = true;

  await axios.get('/api/v2/orders', {
    params: {
      page: page,
      paginate_limit: paginate_limit.value,
      search_query: form.search_query,
      filters: filters,
    }
  }).then((response) => {

    orders.value = response.data.data.data;
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
  await getOrders();
}

function clearFilter(){
    Object.assign(filters, initial_filters);
    show_clear_filter.value = false;
    form.filter_count = 0;
    document.getElementsByClassName('multiselect-clear')[0].click();
    document.getElementsByClassName('multiselect-clear')[1].click();
    document.getElementsByClassName('multiselect-clear')[2].click();
    getOrders();
}

function viewOrder(slack) {
  router.push('/order/' + slack);
}

function editOrder(slack) {
  router.push('/order/add/' + slack);
}

async function deleteOrder(slack) {

  var is_confirmed = false;

  await Swal.fire({
    title: t('Do you want to delete this order?'),
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

    await axios.post('/api/order/delete', {
      slack: slack
    }).then((response) => {

      if (response.data.status_code == 200) {

        toast.success(response.data.msg);
        getOrders();

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
        write : isAuthorized('A_CLOSE_ORDER') || isAuthorized('A_HOLD_ORDER'),
        delete : isAuthorized('A_DELETE_ORDER'),
    };
}

function handleRowClick(event,slack){
  if (!event.target.closest('td:nth-child(10)')) {
    viewOrder(slack);
  }
}



</script>
