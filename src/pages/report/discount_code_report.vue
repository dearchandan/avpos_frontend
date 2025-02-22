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
                      <h5 class="fw-bold">{{ $t('Discount Code Report') }}</h5>
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
                          <VueDatePicker range :preset-dates="presetDates" v-model="filter.dates" :format="'dd-MM-yyyy'" :enable-time-picker="false"  input-class-name="form-control form-control-solid">
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
                          name="order_types"
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
                      <VMultiSelect
                          name="sale_types"
                          :label="select_inventory_type_label"
                          :placeholder="select_inventory_type_placeholder"
                          :text="'value'"
                          :value="'key'"
                          :options="inventory_types"
                          v-model="filter.selected_inventory_type"
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
                        <th scope="col">{{ $t('Discount') }}</th>
                        <th scope="col">{{ $t('Type') }}</th>
                        <th scope="col">{{ $t('Value') }}</th>
                        <th scope="col">{{ $t('Applies to') }}</th>
                        <th scope="col">{{ $t('Min. Order Amt.') }}</th>
                        <th scope="col">{{ $t('Max. Discount Amt.') }}</th>
                        <th scope="col">{{ $t('Created At') }}</th>
                        <th scope="col" class="text-end">{{ $t('Count of use') }}</th>
                        <th scope="col" class="text-end">{{ $t('Amount') }}</th>
                      </tr>
                      </thead>
                      <tbody>
                      <tr v-if="report_data != ''" v-for="(report,index) in report_data" :key="index" >
                        <td>{{ report.name }}</td>
                        <td>{{ report.type==1?'Percentage':'Flat' }}</td>
                        <td>{{ report.value }}</td>
                        <td>{{ report.inventory_type==1?'All Products':'Specific CAtegory/Product' }}</td>
                        <td>{{ getRoundedValue(report.minimum_order_amount) }}</td>
                        <td>{{ getRoundedValue(report.maximum_discount_amount) }}</td>
                        <td>{{ report.created_date }}</td>
                        <td class="text-end">{{ report.total_count }}</td>
                        <td class="text-end">{{ getRoundedValue(report.total_discount) }}</td>
                      </tr>
                      <tr v-else>
                        <td class="text-center py-3" colspan="13">{{ $t('No Data Found') }}</td>
                      </tr>
                      </tbody>
                      <tfoot v-if="grand_total != '' && grand_total != null">
                      <tr>
                        <th colspan="7"></th>
                        <th class="text-end">{{ grand_total.total_count }} </th>
                        <th class="text-end">{{ getRoundedValue(grand_total.total_discount) }}</th>
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
    selected_type : ref(),
    selected_inventory_type : ref(),
    is_exporting : false,
});
const filter = reactive({ ...initial_filter });

const select_type_label = t('Select Type');
const select_type_placeholder = t('All Types');
const select_inventory_type_label = t('Select Inventory Type');
const select_inventory_type_placeholder = t('All Inventory Type');

const presetDates = ref([
  { label: 'Today', value: [new Date(), new Date()] },
  { label: 'This month', value: [startOfMonth(new Date()), endOfMonth(new Date())] },
  {
    label: 'Last month',
    value: [startOfMonth(subMonths(new Date(), 1)), endOfMonth(subMonths(new Date(), 1))],
  },
  { label: 'This year', value: [startOfYear(new Date()), endOfYear(new Date())] },
]);


const types = [
  {
    key : "1",
    value: "Percentage"
  },
  {
    key :  "2",
    value: "Flat"
  }
];

const inventory_types = [
  {
    key : "1",
    value: "All Products"
  },
  {
    key :  "2",
    value: "Specific Category/Product"
  }
];

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
    await axios.get('/api/discount_code_report', { params : {
            page : page,
            paginate_limit : paginate_limit.value,
            filter: filter,
        } }).then( (response) => {

        report_data.value = response.data.data.data;
        console.log('report_data =', report_data.value);
        _.forEach(report_data.value, (item, index) => {
          report_data.value[index].total_discount 
              = parseFloat(item.total_order_discount) + parseFloat(item.total_order_item_disc) + parseFloat(item.total_invoice_item_disc);
          report_data.value[index].total_count 
              = item.total_order_count + item.total_order_item_count + item.total_invoice_item_count;
        })
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
          total_count : report_data.value.reduce(function (a, b) {
            return parseFloat(a) + parseFloat(b.total_count)
          }, 0).toFixed(2),
          total_discount : report_data.value.reduce(function (a, b) {
            var b = b.total_discount!=null?b.total_discount:0;
            return parseFloat(a) + parseFloat(b)
          }, 0).toFixed(2),
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
    await axios.get('/api/discount_code_report/export_excel', { params : {
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

