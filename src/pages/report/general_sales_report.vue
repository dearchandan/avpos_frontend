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
                        <h5 class="fw-bold">{{ $t('General Sales Report') }}</h5>
                    </div>
                </div>
            </div>
        </template>

        <div class="content">
            <AsyncServerMessage class="py-3" v-if="filter.server_messages.messages != ''" :server_messages="filter.server_messages"  />
          <div class="row">
            <div class="col-md-12">
              <div class="card">
               
                <div class="row field-m-0 align-items-end g-3">
                    <div class="col-md-4 col-lg-3">
                    <div class="form-field ">
                      <label for="" class="form-label">{{ $t('Select Dates') }} <span class="text-danger">*</span> </label>
                      <VueDatePicker range :preset-dates="presetDates" v-model="filter.dates" :format="'dd-MM-yyyy'" :enable-time-picker="false"  input-class-name="form-control form-control-solid" >
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
                        
                        :text="'name'"
                        :value="'id'"
                        :options="branches"
                        v-model="filter.selected_branch"
                        :selected="filter.selected_branch"
                        mode="single"
                    />
                  </div>
                    <div class="col-auto text-end">
                      <div class="row align-items-center">
                          <div class="col-auto">
                            <button class="btn btn-primary" @click="generateReport" :disabled="filter.dates == null" >{{ $t('View') }}</button>
                          </div>
                          <div class="col-auto">
                            <button class="btn btn-success" @click="printReport()" :disabled="filter.dates == null">{{ $t('Print') }}</button>
                          </div>
                      </div>
                    </div>
                </div>
              </div>
            </div>
            <div class="col-md-12" v-if="report_data.general_data!=null">
              <div class="row justify-content-center">
                <div class="col-md-8 col-lg-8">
                  <div class="card" id="print_div">
                    <div class="row">
                      <div v-if="filter.is_listing">
                        <ListingSkeleton />
                      </div>
                      <div v-else>
                        <div class="card-head mb-4">
                          <div class="text-center">
                            <div class="head-title">
                              <h4>General Sales Report</h4>
                            </div>
                            <div class="head-data">
                              <span><label><b>Printed On:</b> {{ report_data.printed_on }}</label> </span>
                            </div>
                            <div class="head-data">
                              <span><label><b>Date:</b> {{ report_data.date }}</label> </span>
                            </div>
                            <div class="head-data">
                              <span><label><b>Branch:</b> {{ report_data.branch}}</label> </span>
                            </div>
                          </div>
                        </div>
                        <div class="card-data">
                          <div class="text-center">
                            <div class="head-title">
                              <div class="table-responsive mb-3">
                                <table class="table table-list-data table-hover">
                                  <thead>
                                    <tr>
                                      <th colspan="3">General</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                  <tr v-for="(general, index) in report_data.general_data">
                                    <td width="60%" class="text-start">{{general.title}}</td>
                                    <td width="20%" class="text-center">{{general.count}}</td>
                                    <td width="20%" class="text-end">{{ getRoundedValue(general.amount) }}</td>
                                  </tr>
                                  </tbody>
                                </table>
                              </div>
                              <div class="table-responsive mb-3">
                                <table class="table table-list-data table-hover">
                                  <thead>
                                  <tr>
                                    <th colspan="3">Order Types</th>
                                  </tr>
                                  </thead>
                                  <tbody>
                                  <tr v-for="(order_type, index) in report_data.order_types">
                                    <td width="60%" class="text-start">{{order_type.title}}</td>
                                    <td width="20%" class="text-center">{{order_type.count}}</td>
                                    <td width="20%" class="text-end">{{ getRoundedValue(order_type.amount) }}</td>
                                  </tr>
                                  </tbody>
                                </table>
                              </div>
                              <div class="table-responsive">
                                <table class="table table-list-data table-hover">
                                  <thead>
                                  <tr>
                                    <th colspan="3">Payments</th>
                                  </tr>
                                  </thead>
                                  <tbody>
                                  <tr v-for="(payment, index) in report_data.payment_wise_count">
                                    <td width="60%" class="text-start">{{payment.title}}</td>
                                    <td width="20%" class="text-center">{{payment.count}}</td>
                                    <td width="20%" class="text-end">{{ getRoundedValue(payment.amount) }}</td>
                                  </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>
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
    selected_branch : authStore.user.branch_id,
    is_exporting : false,
});
const filter = reactive({ ...initial_filter });

const select_branch_label = t('Select Branch');
const select_branch_placeholder = t('All Branches');

const presetDates = ref([
  { label: 'Today', value: [new Date(), new Date()] },
  { label: 'This month', value: [startOfMonth(new Date()), endOfMonth(new Date())] },
  {
    label: 'Last month',
    value: [startOfMonth(subMonths(new Date(), 1)), endOfMonth(subMonths(new Date(), 1))],
  },
  { label: 'This year', value: [startOfYear(new Date()), endOfYear(new Date())] },
]);

const branches = computed(() => {
  return authStore.user.branches;
})

const report_data = ref([]);

async function generateReport(page = 1){
    filter.is_listing = true;
    filter.dates[0] = moment(filter.dates[0]).format('YYYY-MM-DD');
    filter.dates[1] = moment(filter.dates[1]).format('YYYY-MM-DD');
    await axios.get('/api/general_sales_report', { params : {
            filter: filter,
        } }).then( (response) => {
        report_data.value = response.data.data;
        filter.is_listing = false;
    }).catch((error) => {
        filter.server_messages.type = "error";
        filter.server_messages.messages = error;
        filter.is_listing = false;
        console.log(error);
    });
}

async function printReport(){

  const prtHtml = document.getElementById('print_div').innerHTML;
  // Get all stylesheets HTML
  let stylesHtml = '';
  for (const node of [...document.querySelectorAll('link[rel="stylesheet"], style')]) {
    stylesHtml += node.outerHTML;
  }

// Open the print window
  const WinPrint = window.open('Wosul', '', 'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0');

  WinPrint.document.write(`<!DOCTYPE html>
<html>
  <head>
    ${stylesHtml}
  </head>
  <body>
    ${prtHtml}
  </body>
</html>`);

  WinPrint.document.close();
  WinPrint.focus();
  WinPrint.print();
  //WinPrint.close();
}


const AsyncServerMessage = defineAsyncComponent( () => import('@/components/common/ServerMessage.vue') );

</script>

