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
                        <h5 class="fw-bold">{{ $t('User Wise Sales Report') }}</h5>
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
                        <VMultiSelect 
                            name="branches" 
                            :label="select_branch_label" 
                            :placeholder="select_branch_placeholder" 
                            :text="'name'" 
                            :value="'id'" 
                            :options="branches"
                            v-model="filter.selected_branches"
                        />
                    </div>
                    
                    <div class="col-md-4 col-lg-3">
                        <VMultiSelect 
                        v-if=" filter.selected_branches != null && filter.selected_branches.length == 1"
                            name="users" 
                            :label="select_user_label" 
                            :placeholder="select_user_placeholder" 
                            :text="'name'" 
                            :value="'id'" 
                            :options="users"
                            v-model="filter.selected_users"
                        />
                    </div>

                    
                    <div class="col-auto text-end">
                        <div class="row align-items-center">
                            <div class="col-auto">
                                <button 
                                    type="button"
                                    class="btn btn-primary" 
                                    @click="generateReport()"
                                    :disabled="filter.is_listing || filter.dates == null"
                                    >
                                        <clip-loader v-if="filter.is_listing" :color="'white'" :size="'20px'" class="pt-2 pe-2">  </clip-loader>
                                        <span class="pt-0" v-if="filter.is_listing">
                                            {{ $t("Viewing...")  }}
                                        </span>
                                        <span class="pt-0" v-else>
                                            {{ $t("View")  }}
                                        </span> 

                                </button>
                            </div>
                            <div class="col-auto">
                                <button 
                                    type="button"
                                    class="btn btn-success" 
                                    @click="exportExcel()"
                                    :disabled="filter.is_exporting || filter.dates == null"
                                    >
                                        <clip-loader v-if="filter.is_exporting" :color="'white'" :size="'20px'" class="pt-2 pe-2">  </clip-loader>
                                        <span class="pt-0" v-if="filter.is_exporting">
                                            {{ $t("Exporting...")  }}
                                        </span>
                                        <span class="pt-0" v-else>
                                            {{ $t("Export Excel")  }}
                                        </span> 

                                </button>
                                
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
                                    <th scope="col">{{ $t('Branch') }}</th>
                                    <th scope="col">{{ $t('User Name') }}</th>
                                    <th scope="col" class="text-end">{{ $t('Sold Qty.') }}</th>
                                    <th scope="col" class="text-end">{{ $t('Sales Amount') }}</th>
                                    <th scope="col" class="text-end">{{ $t('Returned Qty.') }}</th>
                                    <th scope="col" class="text-end">{{ $t('Returned Amount') }}</th>
                                    <th scope="col" class="text-end">{{ $t('Discount') }}</th>
                                    <th scope="col" class="text-end">{{ $t('Returned Discount') }}</th>
                                    <th scope="col" class="text-end">{{ $t('Net Sales Qty.') }}</th>
                                    <th scope="col" class="text-end">{{ $t('Net Sales Amount') }}</th>
                                </tr>
                            </thead>
                            <tbody> 
                               
                                <tr v-if="report_data != ''" v-for="(report,index) in report_data" :key="index" >
                                    <td>{{ report.branch_name  }}</td>
                                    <td>{{ report.user_name }}</td>
                                    <td class="text-end">{{ report.sale_qty  }}</td>
                                    <td class="text-end">{{ getRoundedValue(report.sale_amount) }} {{ currency_symbol }} </td>
                                    <td class="text-end">{{ report.returned_qty }}</td>
                                    <td class="text-end">{{ getRoundedValue(report.returned_amount) }} {{ currency_symbol }}</td>
                                    <td class="text-end">{{ getRoundedValue(report.discount_amount) }} {{ currency_symbol }}</td>
                                    <td class="text-end">{{ getRoundedValue(report.returned_discount_amount) }} {{ currency_symbol }} </td>
                                    <td class="text-end">{{ report.net_sale_qty }}</td>
                                    <td class="text-end">{{ getRoundedValue(report.net_sale_amount) }} {{ currency_symbol }} </td>
                                </tr>

                                <tr v-else>
                                    <td class="text-center py-3" colspan="10">{{ $t('No Data Found') }}</td>
                                </tr>
                                
                            </tbody>

                            <tfoot v-if="grand_total != '' && grand_total != null">
                                <tr>
                                    <th colspan="2"></th>
                                    <th class="text-end">{{ grand_total.sale_qty }}</th>
                                    <th class="text-end">{{ getRoundedValue(grand_total.sale_amount) }} {{ currency_symbol }}</th>
                                    <th class="text-end">{{ grand_total.returned_qty }}</th>
                                    <th class="text-end">{{ getRoundedValue(grand_total.returned_amount) }} {{ currency_symbol }}</th>
                                    <th class="text-end">{{ getRoundedValue(grand_total.discount_amount) }} {{ currency_symbol }}</th>
                                    <th class="text-end">{{ getRoundedValue(grand_total.returned_discount_amount) }} {{ currency_symbol }}</th>
                                    <th class="text-end">{{ grand_total.net_sale_qty }}</th>
                                    <th class="text-end">{{ getRoundedValue(grand_total.net_sale_amount) }} {{ currency_symbol }}</th>
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
import { endOfMonth, endOfYear, startOfMonth, startOfYear, subMonths } from 'date-fns';
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
    users : ref([]),
    selected_branches : ref(),
    selected_users : ref([]),
    is_exporting : false,
});
const filter = reactive({ ...initial_filter });

const select_branch_label = t('Select Branch');
const select_branch_placeholder = t('All Branches');
const select_user_label = t('Select User');
const select_user_placeholder = t('All Users');

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

watch(() => 
    filter.selected_branches, (value) => {
        if(value.length == 1){
            getUsers(value[0])
        }else{
            filter.selected_users = [];
        }
    },
);

const users = ref([]);
async function getUsers(branch_id){

    if(branch_id!= undefined && branch_id != '') {

        await axios.post('/api/branch/users',{
        id : branch_id
        }).then( (response) => {
        if(response.data.status_code == 200) {
            users.value = [];
            let user_data = response.data.data.branch_users;
            _.forEach(user_data, (item) => {
                if(item.user != undefined){
                    let template = {
                        'id': item.user.id,
                        'name': item.user.name,
                    };
                    users.value.push(template);
                }
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
    await axios.get('/api/user_wise_sales_report', { params : {
            page : page,
            paginate_limit : paginate_limit.value,
            filter: filter,
        }}).then( (response) => {
            
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
            sale_qty : report_data.value.reduce(function (a, b) {return a + parseFloat(b.sale_qty) }, 0).toFixed(),
            sale_amount : report_data.value.reduce(function (a, b) {return a + parseFloat(b.sale_amount) }, 0).toFixed(2),
            returned_qty : report_data.value.reduce(function (a, b) {return a + parseFloat(b.returned_qty) }, 0).toFixed(),
            returned_amount : report_data.value.reduce(function (a, b) {return a + parseFloat(b.returned_amount) }, 0).toFixed(2),
            discount_amount : report_data.value.reduce(function (a, b) {return a + parseFloat(b.discount_amount) }, 0).toFixed(2),
            returned_discount_amount : report_data.value.reduce(function (a, b) {return a + parseFloat(b.returned_discount_amount) }, 0).toFixed(2),
            net_sale_qty : report_data.value.reduce(function (a, b) {return a + parseFloat(b.net_sale_qty) }, 0).toFixed(2),
            net_sale_amount : report_data.value.reduce(function (a, b) {return a + parseFloat(b.net_sale_amount) }, 0).toFixed(2),
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
    await axios.get('/api/user_wise_sales_report/export_excel', { params : {
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

