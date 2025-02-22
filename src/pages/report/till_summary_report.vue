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
                        <h5 class="fw-bold">{{ $t('Till Summary Report') }}</h5>
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
                      <label class="form-label">{{ $t('Select dates for filter opening time') }} <span class="text-danger">*</span> </label>
                      <VueDatePicker range :preset-dates="presetDates" v-model="filter.opening_dates" :format="'dd-MM-yyyy'" :enable-time-picker="false" input-class-name="form-control form-control-solid">
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
                      <label class="form-label">{{ $t('Select dates for filter closing time') }} <span class="text-danger">*</span> </label>
                      <VueDatePicker range :preset-dates="presetDates2" v-model="filter.closing_dates" :format="'dd-MM-yyyy'" :enable-time-picker="false" input-class-name="form-control form-control-solid">
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
                    <div class="col-auto text-end">
                      <div class="row align-items-center">
                          <div class="col-auto">
                            <button class="btn btn-primary" @click="generateReport" :disabled="(filter.opening_dates == null && filter.closing_dates == null)" >View</button>
                          </div>
                          <div class="col-auto">
                            <!--                    <button class="btn btn-success ms-3" @click="printReport()" :disabled="filter.dates == null">Print</button>-->
                          </div>
                      </div>
                    </div>
                </div>
              </div>

            </div>
          </div>
          <div class="row">
            <div class="col-md-3" v-if="filter.is_data_loaded == true " v-for="(report,index) in report_data" :key="index">
              <div class="card">
                <div class="row" :id="report.slack">
                  <div v-if="filter.is_listing">
                    <TillsReportSkeleton />
                  </div>
                  <div v-else>
                    <div class="card-head mb-4">
                      <div class="text-center">
                        <div class="head-title">
                          <h4>Tills Summary Report</h4>
                        </div>
                        <div class="head-data">
                          <span><label><b>Printed On:</b> {{ printed_on }}</label> </span>
                        </div>
                        <div class="head-data">
                          <span><label><b>Opening Date Time:</b> {{ report.opening_datetime }} </label> </span>
                          <span v-if="report.closing_datetime!=null"><label><b>Closing Date Time:</b> {{ report.closing_datetime }} </label> </span>
                        </div>
                        <div class="head-data">
                          <span><label><b>Branch:</b> {{ report.branch_name }}</label> </span>
                        </div>
                      </div>
                    </div>
                    <div class="card-data">
                      <div class="table-responsive mb-3">
                        <table class="table table-list-data table-hover">
                          <tbody>
                          <tr v-for="(payment,index) in report.payment_data">
                            <td width="75%" class="text-start">{{ payment.payment_method_name }}</td>
                            <td width="25%" class="text-end">{{ getRoundedValue(payment.amount) }}</td>
                          </tr>
                          <tr>
                            <td width="75%" class="text-start">{{ $t('System Opening Cash') }}</td>
                            <td width="25%" class="text-end">{{ getRoundedValue(report.system_opening_cash) }}</td>
                          </tr>
                          <tr>
                            <td width="75%" class="text-start">{{ $t('System Closing Cash') }}</td>
                            <td width="25%" class="text-end"><span v-if="report.system_closing_cash>0">{{ getRoundedValue(report.system_closing_cash) }}</span><span v-else>0.00</span></td>
                          </tr>
                          <tr>
                            <td width="75%" class="text-start">{{ $t('Manual Opening Cash') }}</td>
                            <td width="25%" class="text-end">{{ getRoundedValue(report.manual_opening_cash) }}</td>
                          </tr>
                          <tr>
                            <td width="75%" class="text-start">{{ $t('Manual Closing Cash') }}</td>
                            <td width="25%" class="text-end"><span v-if="report.manual_closing_cash>0">{{ getRoundedValue(report.manual_closing_cash) }}</span><span v-else>0.00</span></td>
                          </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-md-12 text-center">
                        <button class="btn btn-success ms-3" @click="printReport(report.slack)">Print</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="" >
              <div class="card text-center">   
                {{ $t('No Data Found') }}
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
    opening_dates : ref([new Date(),new Date()]),
    closing_dates : ref([ new Date(),new Date()]),
    selected_branch : ref(),
    is_exporting : false,
    is_data_loaded: false,
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

const presetDates2 = ref([
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
const printed_on = ref();

async function generateReport(page = 1){

    filter.is_listing = true;
    if(filter.opening_dates.length>0){
      filter.opening_dates[0] = moment(filter.opening_dates[0]).format('YYYY-MM-DD');
      filter.opening_dates[1] = filter.opening_dates[1]!=''?moment(filter.opening_dates[1]).format('YYYY-MM-DD'):'';
    }
    if(filter.closing_dates.length>0){
      filter.closing_dates[0] = moment(filter.closing_dates[0]).format('YYYY-MM-DD');
      filter.closing_dates[1] = filter.closing_dates[1]!=''?moment(filter.closing_dates[1]).format('YYYY-MM-DD'):'';
    }
  
    await axios.get('/api/till_summary_report', { params : {
            filter: filter,
        } }).then( (response) => {
        report_data.value = response.data.data.summery_data;
        if(report_data.value == undefined){
          filter.is_data_loaded = false;
        }else{
          filter.is_data_loaded = true;
        }
        printed_on.value = response.data.data.printed_date;
        filter.is_listing = false;
    }).catch((error) => {
        filter.server_messages.type = "error";
        filter.server_messages.messages = error;
        filter.is_listing = false;
        console.log(error);
    });
}

async function printReport(div_id){

  const prtHtml = document.getElementById(div_id).innerHTML;
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

