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
                        <h5 class="fw-bold">{{ $t('Purchase Order Report') }}</h5>
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
                          name="approval_status"
                          :label="select_approval_status_label"
                          :placeholder="select_approval_status_placeholder"
                          :text="'value'"
                          :value="'key'"
                          :options="approval_statuses"
                          v-model="filter.selected_approval_status"
                          mode="single"
                      />
                    </div>
                    <div class="col-md-4 col-lg-3">
                      <VMultiSelect
                          name="delivery_status"
                          :label="select_delivery_status_label"
                          :placeholder="select_delivery_status_placeholder"
                          :text="'value'"
                          :value="'key'"
                          :options="delivery_statuses"
                          v-model="filter.selected_delivery_status"
                          mode="single"
                      />
                    </div>
                    <div class="col-auto text-end">
                        <div class="row align-items-center">
                            <div class="col-auto">
                              <button class="btn btn-primary" @click="generateReport" :disabled="filter.dates == null" >{{ $t('View') }}</button>
                            </div>
                            <div class="col-auto">
                              <button class="btn btn-success" @click="exportExcel()" :disabled="filter.dates == null">{{ $t('Export Excel') }}</button>
                            </div>
                        </div>
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
                                    <th scope="col">{{ $t('PO No.') }}</th>
                                    <th scope="col">{{ $t('PO Reference No.') }}</th>
                                    <th scope="col">{{ $t('PO Date') }}</th>
                                    <th scope="col">{{ $t('PO Due Date') }}</th>
                                    <th scope="col">{{ $t('Supplier Code') }}</th>
                                    <th scope="col">{{ $t('Supplier Name') }}</th>
                                    <th scope="col">{{ $t('Approval Status') }}</th>
                                    <th scope="col">{{ $t('Delivery Status') }}</th>
                                    <th scope="col" class="text-end">{{ $t('Sub Total') }}</th>
                                    <th scope="col" class="text-end">{{ $t('Tax') }}</th>
                                    <th scope="col" class="text-end">{{ $t('Other Charges') }}</th>
                                    <th scope="col" class="text-end">{{ $t('Net Amount') }}</th>
                                </tr>
                            </thead>
                            <tbody> 
                               
                                <tr v-if="report_data != ''" v-for="(report,index) in report_data" :key="index" >
                                    <td>{{ report.branch!=null?report.branch.name:'-'  }}</td>
                                    <td class="text-center">{{ report.po_number }}</td>
                                    <td class="text-center">{{ report.reference_number }}</td>
                                    <td class="text-center">{{ report.po_date }}</td>
                                    <td class="text-center">{{ report.due_date }}</td>
                                    <td class="text-center">{{ report.supplier!=null?report.supplier.code:'-' }}</td>
                                    <td class="text-center">{{ report.supplier!=null?report.supplier.name:'-' }}</td>
                                    <td class="text-center">
                                      <span v-if="report.approval_status==0" class="badge badge-primary">{{ $t('Draft') }}</span>
                                      <span v-if="report.approval_status==1" class="badge badge-success">{{ $t('Approved') }}</span>
                                      <span v-if="report.approval_status==2" class="badge badge-warning">{{ $t('Rejected') }}</span>
                                      <span v-if="report.approval_status==3" class="badge badge-danger">{{ $t('Cancelled') }}</span>
                                    </td>
                                    <td class="text-center">
                                      <span v-if="report.delivery_status==0" class="badge badge-primary">{{ $t('Undelivered') }}</span>
                                      <span v-if="report.delivery_status==1" class="badge badge-success">{{ $t('Partial Delivered') }}</span>
                                      <span v-if="report.delivery_status==2" class="badge badge-warning">{{ $t('Delivered/Closed') }}</span>
                                    </td>

                                    <td class="text-end">{{ getRoundedValue(report.grand_subtotal_after_product_quantity) }} {{ currency_symbol }}</td>
                                    <td class="text-end">{{ getRoundedValue(report.grand_product_tax) }} {{ currency_symbol }}</td>
                                    <td class="text-end">{{ getRoundedValue(report.grand_product_other_changes) }} {{ currency_symbol }}</td>
                                    <td class="text-end">{{ getRoundedValue(report.grand_product_amount) }} {{ currency_symbol }} </td>
                                </tr>

                                <tr v-else>
                                    <td class="text-center py-3" colspan="15">{{ $t('No Data Found') }}</td>
                                </tr>
                                
                            </tbody>

                            <tfoot v-if="grand_total != '' && grand_total != null">
                                <tr>
                                    <th colspan="9"></th>
                                    <th class="text-end">{{ getRoundedValue(grand_total.grand_subtotal_after_product_quantity) }} {{ currency_symbol }}</th>
                                    <th class="text-end">{{ getRoundedValue(grand_total.grand_product_tax) }} {{ currency_symbol }}</th>
                                    <th class="text-end">{{ getRoundedValue(grand_total.grand_product_other_changes) }}</th>
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
    selected_branch : ref(),
    selected_approval_status : ref(),
    selected_delivery_status : ref(),
    is_exporting : false,
});
const filter = reactive({ ...initial_filter });

const select_branch_label = t('Select Branch');
const select_branch_placeholder = t('All Branches');
const select_approval_status_label = t('Select Approval Status');
const select_approval_status_placeholder = t('All Approval Status');
const select_delivery_status_label = t('Select Delivery Status');
const select_delivery_status_placeholder = t('All Delivery Status');

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
});

const approval_statuses = [
  {
    key : "0",
    value: "Draft"
  },
  {
    key :  "1",
    value: "Approved"
  },
  {
    key :  "2",
    value: "Rejected"
  },
  {
    key :  "3",
    value: "Cancelled"
  }
];

const delivery_statuses = [
  {
    key : "0",
    value: "Undelivered"
  },
  {
    key :  "1",
    value: "Partial Delivered"
  },
  {
    key :  "2",
    value: "Delivered/Closed"
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
    await axios.get('/api/purchase_order_report', { params : {
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
            grand_subtotal_after_product_quantity : report_data.value.reduce(function (a, b) {return a + parseFloat(b.grand_subtotal_after_product_quantity) }, 0).toFixed(2),
            grand_product_tax : report_data.value.reduce(function (a, b) {return a + parseFloat(b.grand_product_tax) }, 0).toFixed(2),
            grand_product_other_changes : report_data.value.reduce(function (a, b) {return a + parseFloat(b.grand_product_other_changes) }, 0).toFixed(2),
            grand_product_amount : report_data.value.reduce(function (a, b) {return a + parseFloat(b.grand_product_amount) }, 0).toFixed(2),
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
    await axios.get('/api/purchase_order_report/export_excel', { params : {
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

