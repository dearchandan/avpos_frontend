<template>
    <DefaultLayout>


      <template v-slot:subheader>
          <div class="header-nav-wrap">
              <div class="row align-items-center">
                  <div class="col-auto">
                      <div class="header-back-link">
                          <router-link class="text-primary" to="/reports" ><Icon icon="fa6-solid:chevron-left"  /> {{ $t('Reports') }}</router-link>
                      </div>
                  </div>
                  <div class="col-auto">
                      <h5 class="fw-bold">{{ $t('Sales Report') }}</h5>
                  </div>
              </div>
          </div>
      </template>

        <div class="content">

            <AsyncServerMessage class="py-3" v-if="filter.server_messages.messages != ''" :server_messages="filter.server_messages"  />

            <div class="card">

                <div class="row field-m-0 align-items-end g-3">
                    <div class="col-md-4 col-lg-3">
                        <div class="form-field ">
                            <label for="" class="form-label">{{ $t('Business Dates') }} <span class="text-danger">*</span> </label>
                          <VueDatePicker range :preset-dates="presetDates" v-model="filter.dates" :format="'dd-MM-yyyy'" :enable-time-picker="false" input-class-name="form-control form-control-solid"  >
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
                  <div class="col-md-4 col-lg-3">
                        <div class="form-field ">
                            <label for="" class="form-label">{{ $t('Created At Dates') }} <span class="text-danger">*</span> </label>
                          <VueDatePicker range :preset-dates="presetDates" v-model="filter.created_dates" :format="'dd-MM-yyyy HH:mm'" :enable-time-picker="true" input-class-name="form-control form-control-solid"  >
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

                    <div class="col-md-4 col-lg-3">
                      <VMultiSelect
                          name="branches"
                          :label="select_branch_label"
                          :placeholder="select_branch_placeholder"
                          :text="'name'"
                          :value="'id'"
                          :options="branches"
                          v-model="filter.selected_branch"
                          mode="single"
                      />
                    </div>
                    <div class="col-md-4 col-lg-3" v-if=" filter.selected_branch != null && filter.selected_branch>0">
                      <VMultiSelect
                          v-if=" filter.selected_branch != null && filter.selected_branch>0"
                          name="terminals"
                          :label="select_terminal_label"
                          :placeholder="select_terminal_placeholder"
                          :text="'name'"
                          :value="'id'"
                          :options="terminals"
                          v-model="filter.selected_terminals"
                      />
                    </div>

                    <div class="col-md-3 col-lg-3">
                      <VMultiSelect
                          name="payment_methods"
                          :label="select_payment_method_label"
                          :placeholder="select_payment_method_placeholder"
                          :text="'name'"
                          :value="'id'"
                          :options="payment_methods"
                          v-model="filter.payment_method"
                          mode="single"
                      />
                    </div>

                    <div class="col-md-3 col-lg-3">
                      <VMultiSelect
                          name="order_types"
                          :label="select_order_type_label"
                          :placeholder="select_order_type_placeholder"
                          :text="'value'"
                          :value="'key'"
                          :options="order_types"
                          v-model="filter.selected_order_type"
                          mode="single"
                      />
                    </div>
                  <div class="col-md-3 col-lg-3">
                      <VMultiSelect
                          name="sale_types"
                          :label="select_sale_type_label"
                          :placeholder="select_sale_type_placeholder"
                          :text="'value'"
                          :value="'key'"
                          :options="sale_types"
                          v-model="filter.selected_sale_type"
                          mode="single"
                      />
                    </div>
                </div>

                <div class="row mt-4">

                    <div class="col-12 text-end">

                        <button class="btn btn-primary" @click="generateReport" :disabled="(filter.dates == null && filter.created_dates ==null)" >{{ $t('View') }}</button>

                        <button class="btn btn-success ms-3" @click="exportExcel()" :disabled="(filter.dates == null && filter.created_dates ==null)">{{ $t('Export Excel') }}</button>

                    </div>

                </div>

            </div>

            <div class="card ">

                <div class="">
                    <div v-if="filter.is_listing">
                      <ListingSkeleton />
                    </div>
                    <div v-else class="table-responsive">

                        <table class="table table-list-data table-hover">
                            <thead class="bg-light">
                                <tr>
                                    <th scope="col">{{ $t('Branch Name') }}</th>
                                    <th scope="col">{{ $t('Terminal') }}</th>
                                    <th scope="col">{{ $t('Order No.') }}</th>
                                    <th scope="col">{{ $t('Reference No.') }}</th>
                                    <th scope="col">{{ $t('Sale Date') }}</th>
                                    <th scope="col">{{ $t('Customer Name') }}</th>
                                    <th scope="col">{{ $t('Customer Phone') }}</th>
                                    <th scope="col">{{ $t('Payment Type') }}</th>
                                    <th scope="col">{{ $t('Order Type') }}</th>
                                    <th scope="col">{{ $t('Sale Type') }}</th>
                                    <th scope="col" class="text-end">{{ $t('Discount Amount') }}</th>
                                    <th scope="col" class="text-end">{{ $t('Tax Amount') }}</th>
                                    <th scope="col" class="text-end">{{ $t('Net Sales Amount') }}</th>
                                </tr>
                            </thead>
                            <tbody>

                                <tr v-if="report_data != ''" v-for="(report,index) in report_data" :key="index" >
                                    <td>{{ report.branch.name  }}</td>
                                    <td><span v-if="report.terminal">{{ report.terminal.terminal_name }}</span></td>
                                    <td class="text-end">{{ report.order_number }}</td>
                                    <td class="text-end">{{ report.reference_number }}</td>
                                    <td class="text-end">{{ report.business_date }}</td>
                                    <td class="text-end">{{ report.customer_name }}</td>
                                    <td class="text-end">{{ report.customer_phone }}</td>
                                    <td class="text-end">{{ report.payment_method_name }}</td>
                                    <td>
                                      <span v-if="report.order_type == 1">{{ $t('Take Away') }}</span>
                                      <span v-if="report.order_type == 2">{{ $t('Dine In') }}</span>
                                    </td>
                                    <td>
                                      <span v-if="report.order_status==0" class="badge badge-primary">{{ $t('Open') }}</span>
                                      <span v-if="report.order_status==1" class="badge badge-success">{{ $t('Closed') }}</span>
                                      <span v-if="report.order_status==2" class="badge badge-warning">{{ $t('In Kitchen') }}</span>
                                      <span v-if="report.order_status==3" class="badge badge-danger">{{ $t('On Hold') }}</span>
                                      <span v-if="report.order_status==4" class="badge badge-danger">{{ $t('Hold & In Kitchen') }}</span>
                                      <span v-if="report.order_status==5 && report.returned_status == 0" class="badge badge-info">Partial Returned</span>
                                      <span v-if="report.order_status==5 && report.returned_status == 1" class="badge badge-secondary">Returned</span>
                                    </td>
                                    <td class="text-end">{{ getRoundedValue(report.order_discount) }} {{ currency_symbol }}</td>
                                    <td class="text-end">{{ getRoundedValue(report.tax) }} {{ currency_symbol }}</td>
                                    <td class="text-end">{{ getRoundedValue(report.total) }} {{ currency_symbol }} </td>
                                </tr>

                                <tr v-else>
                                    <td class="text-center py-3" colspan="13">{{ $t('No Data Found') }}</td>
                                </tr>

                            </tbody>

                            <tfoot v-if="grand_total != '' && grand_total != null">
                                <tr>
                                    <th colspan="10"></th>
                                    <th class="text-end">{{ getRoundedValue(grand_total.order_discount) }} {{ currency_symbol }}</th>
                                    <th class="text-end">{{ getRoundedValue(grand_total.grand_product_tax) }}</th>
                                    <th class="text-end">{{ getRoundedValue(grand_total.grand_product_amount) }} {{ currency_symbol }}</th>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                    <div class="data-footer">
                        <div class="row align-items-center justify-content-between">
                            <div class="col-auto">
                                <PaginateLimit @paginate_limit_update="paginate_limit_update" :pagination="pagination" />
                            </div>
                            <div class="col-auto">                      
                                <Bootstrap5Pagination :data="pagination" :limit="5"  @pagination-change-page="generateReport" />
                            </div>
                        </div>
                    </div>
                </div>

            </div>

        </div>

    </DefaultLayout>
</template>

<script setup>

import useGlobalFunctions from '@/composables/global_functions.js';
import useGlobal from '@/composables/global.js';
import { onMounted } from 'vue';
import { useI18n } from 'vue-i18n'
import VueDatePicker from '@vuepic/vue-datepicker';
import { useAuthStore } from '@/stores/auth';
import { Bootstrap5Pagination } from 'laravel-vue-pagination';
import {endOfMonth, endOfYear, startOfMonth, startOfYear, subMonths} from "date-fns";
import moment from 'moment';

const { t } = useI18n();

const { isAuthorized,getRoundedValue } = useGlobalFunctions();

const { order_types, sale_types } = useGlobal();
const authStore = useAuthStore();

const currency_symbol = computed(() => {
    return authStore.user.currency.symbol;
})

const initial_filter = reactive({
    server_messages: {
        type: "",
        messages: "",
    },
    is_submitting: false,
    is_listing : false,
    dates : ref([new Date(), new Date()]),
    created_dates : ref([new Date(), new Date()]),
    selected_branch : ref(),
    selected_terminals : ref([]),
    payment_method : ref(),
    selected_order_type : ref(),
    selected_sale_type : ref(),
    is_exporting : false,
});
const filter = reactive({ ...initial_filter });

const select_branch_label = t('Select Branch');
const select_branch_placeholder = t('All Branches');
const select_product_placeholder = t('All Products');
const select_terminal_label = t('All Terminals');
const select_terminal_placeholder = t('Select Terminals');
const select_order_type_label = t('Select Order Type');
const select_order_type_placeholder = t('All Order Type');
const select_sale_type_label = t('Select Sale Type');
const select_sale_type_placeholder = t('All Sale Type');
const select_payment_method_label = t('Select Payment Type');
const select_payment_method_placeholder = t('All Payment Type');

const presetDates = ref([
  { label: 'Today', value: [new Date(), new Date()] },
  { label: 'This month', value: [startOfMonth(new Date()), endOfMonth(new Date())] },
  {
    label: 'Last month',
    value: [startOfMonth(subMonths(new Date(), 1)), endOfMonth(subMonths(new Date(), 1))],
  },
  { label: 'This year', value: [startOfYear(new Date()), endOfYear(new Date())] },
]);

watch(() =>
      filter.selected_branch, (value) => {
      if(value>0){
        getTerminals(value)
      }else{
        filter.selected_terminals = [];
      }
    },
);

onMounted(() =>{
  getPaymentMethod();
})

const branches = computed(() => {
  return authStore.user.branches;
})

const terminals = ref([]);
async function getTerminals(branch_id){
  if(branch_id!= undefined && branch_id != '') {

    await axios.post('/api/branch/terminals',{
      id : branch_id
    }).then( (response) => {
      if(response.data.status_code == 200) {
        terminals.value = [];
        let terminal_data = response.data.data;
        _.forEach(terminal_data, (item) => {
          let template = {
            'id': item.id,
            'name': item.code+' - '+item.terminal_name,
          };
          terminals.value.push(template);
        })
      }else{
        try{
          initial_filter.server_messages.type = "error";
          initial_filter.server_messages.messages = JSON.parse(response.data.msg);
        }catch(err){
          initial_filter.server_messages.type = "error";
          initial_filter.server_messages.messages = response.data.msg;
        }
      }

    }).catch((error) => {
      initial_filter.server_messages.type = "error";
      initial_filter.server_messages.messages = error;
      console.log(error);
    });

  }

}

const payment_methods = ref([]);
async function getPaymentMethod(){
  await axios.get('/api/payment_methods/all').then( (response) => {
    if(response.data.status_code == 200) {
      payment_methods.value = [];
      let payment_method = response.data.data;
      _.forEach(payment_method, (item) => {
        let template = {
          'id': item.id,
          'name': item.name,
        };
        payment_methods.value.push(template);
      })
    }else{
      try{
        initial_filter.server_messages.type = "error";
        initial_filter.server_messages.messages = JSON.parse(response.data.msg);
      }catch(err){
        initial_filter.server_messages.type = "error";
        initial_filter.server_messages.messages = response.data.msg;
      }
    }

  }).catch((error) => {
    initial_filter.server_messages.type = "error";
    initial_filter.server_messages.messages = error;
    console.log(error);
  });

}

const paginate_limit = ref();
async function paginate_limit_update(value){
    paginate_limit.value = value;
    await generateReport();
}

const report_data = ref([]);
const pagination = ref([]);

async function generateReport(page = 1){

    filter.is_listing = true;

    if(filter.dates!=null){
      filter.dates[0] = moment(filter.dates[0]).format('YYYY-MM-DD');
      filter.dates[1] = moment(filter.dates[1]).format('YYYY-MM-DD');
    }
    if(filter.created_dates!=null){
      filter.created_dates[0] = moment(filter.created_dates[0]).format('YYYY-MM-DD HH:mm');
      filter.created_dates[1] = moment(filter.created_dates[1]).format('YYYY-MM-DD HH:mm');
    }

    await axios.get('/api/sales_report', { params : {
            page : page,
            paginate_limit : paginate_limit.value,
            filter: filter,
        } }).then( (response) => {

        report_data.value = response.data.data.data;
        pagination.value = response.data.pagination;

        filter.is_listing = false;

    }).catch((error) => {
        filter.server_messages.type = "error";
        filter.server_messages.messages = error;
        filter.is_listing = false;
        console.log(error);
    });

}

const grand_total = computed(() => {

    if(report_data.value.length){

        let data = {
            order_discount : report_data.value.reduce(function (a, b) {return a + parseFloat(b.order_discount) }, 0).toFixed(2),
            grand_product_tax : report_data.value.reduce(function (a, b) {return a + parseFloat(b.tax) }, 0).toFixed(2),
            grand_product_amount : report_data.value.reduce(function (a, b) {return a + parseFloat(b.total) }, 0).toFixed(2),
        };  

        return data;
    }else{
        return null;
    }
})

async function exportExcel(){

    filter.is_exporting = true;

    if(filter.dates!=null){
      filter.dates[0] = moment(filter.dates[0]).format('YYYY-MM-DD');
      filter.dates[1] = moment(filter.dates[1]).format('YYYY-MM-DD');
    }
    if(filter.created_dates!=null){
      filter.created_dates[0] = moment(filter.created_dates[0]).format('YYYY-MM-DD HH:mm');
      filter.created_dates[1] = moment(filter.created_dates[1]).format('YYYY-MM-DD HH:mm');
    }

    await axios.get('/api/sales_report/export_excel', { params : {
            filter: filter,
    }}).then( (response) => {

    if(response.data.status_code == 200) {

      filter.is_exporting = false;
      const link = document.createElement('a');
      link.target='_blank';
      link.href = response.data.data.file;
      document.body.appendChild(link);
      link.click();

    }else{
      try{
        filter.server_messages.type = "error";
        filter.server_messages.messages = JSON.parse(response.data.msg);
      }catch(err){
        filter.server_messages.type = "error";
        filter.server_messages.messages = response.data.msg;
      }
      filter.is_exporting = false;
    }

  }).catch((error) => {
    filter.server_messages.type = "error";
    filter.server_messages.messages = error;
    filter.is_exporting = false;
    console.log(error);
  });
}

const AsyncServerMessage = defineAsyncComponent( () => import('@/components/common/ServerMessage.vue') );

</script>

