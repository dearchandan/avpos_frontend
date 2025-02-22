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
                        <h5 class="fw-bold">{{ $t('Transaction Report') }}</h5>
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
                            <label for="" class="form-label">{{ $t('Select Dates') }} <span class="text-danger">*</span> </label>
                          <VueDatePicker range :preset-dates="presetDates" v-model="filter.dates" :format="'dd-MM-yyyy'" :enable-time-picker="false" input-class-name="form-control form-control-solid" >
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
                      <VSelect
                          name="branches"
                          :label="select_branch_label"
                          :placeholder="select_branch_placeholder"
                          :text="'name'"
                          :value="'id'"
                          :options="branches"
                          v-model="filter.selected_branch"
                      />
                    </div>
                    <div class="col-md-4 col-lg-3">
                      <VMultiSelect
                          name="status"
                          :label="select_type_label"
                          :placeholder="select_type_placeholder"
                          :text="'value'"
                          :value="'key'"
                          :options="types"
                          v-model="filter.selected_type"
                          mode="single"
                      />
                    </div>
                    <div class="col-md-4 col-lg-3">
                      <VSelect
                          name="account"
                          :label="select_account_label"
                          :placeholder="select_account_placeholder"
                          :text="'name'"
                          :value="'slack'"
                          :options="accounts"
                          v-model="filter.selected_account"
                      />
                    </div>
                    <div class="col-md-4 col-lg-3">
                      <VMultiSelect
                          name="bill_type"
                          :label="select_bill_type_label"
                          :placeholder="select_bill_type_placeholder"
                          :text="'value'"
                          :value="'key'"
                          :options="bill_types"
                          v-model="filter.selected_bill_type"
                          mode="single"
                      />
                    </div>
                    <div class="col-md-4 col-lg-3">
                      <VSelect
                          name="payment_method"
                          :label="select_payment_method_label"
                          :placeholder="select_payment_method_placeholder"
                          :text="'name'"
                          :value="'slack'"
                          :options="payment_methods"
                          v-model="filter.selected_payment_method"
                      />
                    </div>
                </div>
                <div class="row mt-3">
                    <div class="col-12 text-end">
                        <button class="btn btn-primary" @click="generateReport" :disabled="filter.dates == null" >{{ $t('View') }}</button>
                        <button class="btn btn-success ms-3" @click="exportExcel()" :disabled="filter.dates == null">{{ $t('Export Excel') }}</button>
                    </div>
                </div>
            </div>

            <div class="card">
                <div class="">
                    <div v-if="filter.is_listing">
                      <ListingSkeleton />
                    </div>
                    <div v-else class="table-responsive">
                        <table class="table table-list-data table-hover">
                            <thead class="bg-light">
                                <tr>
                                    <th scope="col">{{ $t('Branch Name') }}</th>
                                    <th scope="col">{{ $t('Transaction Date') }}</th>
                                    <th scope="col">{{ $t('Transaction Code') }}</th>
                                    <th scope="col">{{ $t('Branch Wise Transaction No.') }}</th>
                                    <th scope="col">{{ $t('Account Code') }}</th>
                                    <th scope="col">{{ $t('Account') }}</th>
                                    <th scope="col">{{ $t('Type') }}</th>
                                    <th scope="col">{{ $t('Bill Type') }}</th>
                                    <th scope="col">{{ $t('Payment Method') }}</th>
                                    <th scope="col" class="text-end">{{ $t('Amount') }}</th>
                                </tr>
                            </thead>
                            <tbody> 
                               
                                <tr v-if="report_data != ''" v-for="(report,index) in report_data" :key="index" >
                                    <td>{{ report.branch!=null?report.branch.name:'--'  }}</td>
                                    <td class="text-center">{{ report.transaction_date }}</td>
                                    <td class="text-center">{{ report.code }}</td>
                                    <td class="text-center">{{ report.branch_transaction_number }}</td>
                                    <td class="text-center">{{ report.account!=null?report.account.code:'--' }}</td>
                                    <td class="text-center">{{ report.account!=null?report.account.name:'--' }}</td>
                                    <td class="text-center">{{ report.type }}</td>
                                    <td class="text-center">
                                      <span v-if="report.bill_type==1" class="badge badge-primary">{{ $t('Order') }}</span>
                                      <span v-if="report.bill_type==2" class="badge badge-primary">{{ $t('Invoice') }}</span>
                                      <span v-if="report.bill_type==3" class="badge badge-primary">{{ $t('Purchase') }}</span>
                                    </td>

                                    <td class="text-center">{{ report.payment_method_name }} </td>
                                    <td class="text-end">{{ getRoundedValue(report.amount) }} {{ currency_symbol }}</td>
                                </tr>

                                <tr v-else>
                                    <td class="text-center py-3" colspan="10">{{ $t('No Data Found') }}</td>
                                </tr>
                                
                            </tbody>

                            <tfoot v-if="grand_total != '' && grand_total != null">
                                <tr>
                                    <th colspan="9"></th>
                                    <th class="text-end">{{ getRoundedValue(grand_total.amount) }} {{ currency_symbol }}</th>
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
import { onMounted } from 'vue';
import { useI18n } from 'vue-i18n'
import VueDatePicker from '@vuepic/vue-datepicker';
import { useAuthStore } from '@/stores/auth';
import { Bootstrap5Pagination } from 'laravel-vue-pagination';
import {endOfMonth, endOfYear, startOfMonth, startOfYear, subMonths} from "date-fns";
import moment from 'moment';

const { t } = useI18n();

const { isAuthorized, getRoundedValue } = useGlobalFunctions();

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
    selected_branch : ref(),
    selected_type : ref(),
    selected_account : ref(),
    selected_bill_type : ref(),
    selected_payment_method : ref(),
    is_exporting : false,
});
const filter = reactive({ ...initial_filter });

const select_branch_label = t('Select Branch');
const select_branch_placeholder = t('All Branches');
const select_type_label = t('Select Type');
const select_type_placeholder = t('All Type');
const select_account_label = t('Select Account');
const select_account_placeholder = t('All Account');
const select_bill_type_label = t('Select Bill Type');
const select_bill_type_placeholder = t('All Bill Type');
const select_payment_method_label = t('Select Payment Method');
const select_payment_method_placeholder = t('All Payment Method');

const presetDates = ref([
  { label: 'Today', value: [new Date(), new Date()] },
  { label: 'This month', value: [startOfMonth(new Date()), endOfMonth(new Date())] },
  {
    label: 'Last month',
    value: [startOfMonth(subMonths(new Date(), 1)), endOfMonth(subMonths(new Date(), 1))],
  },
  { label: 'This year', value: [startOfYear(new Date()), endOfYear(new Date())] },
]);

onMounted(() => {
  loadBranch();
  loadAccount();
  loadPaymentMethods();
});

const types = [
  {
    key : "INCOME",
    value: "Income"
  },
  {
    key :  "EXPENSE",
    value: "Expense"
  }
];
const bill_types = [
  {
    key : "1",
    value: "Order"
  },
  {
    key :  "2",
    value: "Invoice"
  },
  {
    key :  "3",
    value: "Purchase"
  }
];

const branches = ref([]);
async function loadBranch(){
  _.forEach(authStore.user.branches, (item) => {
    let template = {
      'key': item.slack,
      'value': item.name,
      'id': item.slack,
    };
    branches.value.push(template);
  });
}

watch(() =>
    filter.selected_type, (value) => {
      loadAccount()
    },
);

const accounts = ref([]);
async function loadAccount(){
  accounts.value = [];
  let form_data = new FormData();
  form_data.append('account_type',filter.selected_type);
  await axios.post('/api/accounts/all', form_data).then( (response) => {
    _.forEach(response.data.data, (item) => {
      let template = {
        'key': item.slack,
        'value': item.name,
      };
      accounts.value.push(template);
    });

  }).catch((error) => {
    filter.server_messages.type = "error";
    filter.server_messages.messages = error;
    filter.is_listing = false;
    console.log(error);
  });
}

const payment_methods = ref([]);
async function loadPaymentMethods() {
  let payment_method_data = await axios.get('api/payment_methods/all');
  _.forEach(payment_method_data.data.data, (item) => {
    let template = {
      'key': item.id,
      'value': item.name,
    };
    payment_methods.value.push(template);
  })
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
    filter.dates[0] = moment(filter.dates[0]).format('YYYY-MM-DD');
    filter.dates[1] = moment(filter.dates[1]).format('YYYY-MM-DD');
    await axios.get('/api/transaction_report', { params : {
            page : page,
            paginate_limit : paginate_limit.value,
            filter: filter,
        } }).then( (response) => {

        report_data.value = response.data.data.data;
        pagination.value = response.data.pagination;
        console.log(report_data.value);
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
            amount : report_data.value.reduce(function (a, b) {return a + parseFloat(b.amount) }, 0).toFixed(2),
        };

        return data;
    }else{
        return null;
    }
})

async function exportExcel(){

    filter.is_exporting = true;
    filter.dates[0] = moment(filter.dates[0]).format('YYYY-MM-DD');
    filter.dates[1] = moment(filter.dates[1]).format('YYYY-MM-DD');
    await axios.get('/api/transaction_report/export_excel', { params : {
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

