<template>
    <DefaultLayout>

        <template v-slot:subheader>
            <BusinessMenu />
        </template>
        
        <div class="content">
            <div class="page-heading">

                <div class="row align-items-center justify-content-between mb-3">
                  <div class="col-auto">
                      <h2 class="mb-0">{{ $t('Business Registers') }}</h2>
                  </div>
                </div>

                    <div class="row align-items-end g-3">
                        <div class="col-12 col-md-auto">
                            <div class="form-field">
                                <label class="form-label">{{ $t('Date Range') }}</label>
                                <VueDatePicker 
                                    range :format="'dd-MM-yyyy'"
                                    v-model="filters.dates" 
                                    :enable-time-picker="false"
                                    input-class-name="dp-custom-input form-control-solid form-control form-control-sm"
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
                        <div class="col-6 col-md-auto"  v-if="terminals != ''">
                            <div class="form-field">
                                <label class="form-label">{{ $t('Terminal') }}</label>
                                <select class="form-control form-control-sm form-control-solid"
                                        v-model="filters.terminal_id">
                                <option value="">{{ $t('Select Terminal') }}</option>
                                <option :value="terminal.id" v-for="(terminal,terminal_index) in terminals" :key="terminal_index">{{ terminal.terminal_name }}</option>
                                </select>
                            </div>
                        </div>
                        <div class="col-6 col-md-auto">
                            <div class="form-field">
                                <label class="form-label">{{ $t('Date Type') }}</label>
                                <select class="form-control form-control-sm form-control-solid"
                                        v-model="filters.date_type">
                                <option value="1">{{ $t('Opening Date') }}</option>
                                <option value="2">{{ $t('Closing Date') }}</option>
                                </select>
                            </div>
                        </div>
                        
                        <div class="col-auto col-md-auto ">
                            <button class="btn btn-sm btn-light-danger" v-if="show_clear_filter" @click="clearFilter">{{ $t('Clear') }}</button>
                        </div>
                        <div class="col-auto col-md-auto offset-2 align-items-end ms-auto">
                            <div class="form-field page-heading-search-field mb-0">
                                <div class="field-icon">
                                    <input type="search" class="form-control form-control-sm form-control-solid"
                                        :placeholder="search_placeholder" v-model="form.search_query">
                                    <div class="icon">
                                    <Icon icon="fa6-solid:magnifying-glass"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                    </div>
            
            </div>
            <div v-if="form.is_listing">
                <ListingSkeleton />
            </div>
            <div v-else class="table-responsive">
                <table class="table table-list-data table-hover">
                    <thead class="bg-light">
                        <tr>
                            <th scope="col" width="10%">{{ $t("Terminal") }}</th>
                            <th scope="col" width="10%">{{ $t("Opened At") }}</th>
                            <th scope="col" width="10%">{{ $t("Closed At") }}</th>
                            <th scope="col" width="10%">{{ $t("System Opening/Closing Cash") }}</th>
                            <th scope="col" width="10%">{{ $t("Manual OPening/Closing Cash") }}</th>
                            <th scope="col" width="10%">{{ $t("System Closing Credit") }}</th>
                            <th scope="col" width="10%">{{ $t("Status") }}</th>
                            <th scope="col" width="10%">{{ $t("Opened By") }}</th>
                        </tr>
                    </thead>
                    <tbody> 
                        <tr v-if="business_registers != ''" v-for="(business_register,branch_index) in business_registers" :key="branch_index" >
                            <td>{{ business_register.terminal?.terminal_name }}</td>
                            <td>{{ business_register.opening_datetime_label ?? '-' }}</td>
                            <td>{{ business_register.closing_datetime ?? '-' }} </td>
                            <td>{{ business_register.system_opening_cash }} / {{ business_register.system_closing_cash ?? ' -' }}</td>
                            <td>{{ business_register.manual_opening_cash }} / {{ business_register.manual_closing_cash ?? ' -' }}</td>
                            <td>{{ business_register.system_closing_credit ?? ' -' }}</td>
                            <td>
                              <span v-if="business_register.closing_datetime == null" class="badge badge-success">{{ $t("Opened") }}</span>
                              <span v-else class="text-muted">{{ $t("Closed") }}</span>
                            </td>
                            <td>{{ business_register.user.name }}</td>
                        </tr>
                        <tr v-else>
                            <td class="text-center py-3" colspan="8">{{ $t("No Data Found") }}</td>
                        </tr>
                        
                    </tbody>
                </table>
            </div>
            <div class="data-footer">
                <div class="row align-items-center justify-content-between">
                    <div class="col-auto">
                        <PaginateLimit @paginate_limit_update="paginate_limit_update" :pagination="pagination" />
                    </div>
                    <div class="col-auto">                      
                        <Bootstrap5Pagination :data="pagination" :limit="5"  @pagination-change-page="getBusinessRegisters" />
                    </div>
                </div>
            </div>
        </div>
        
    </DefaultLayout>
</template>

<script setup>

import { ref , onMounted, reactive, watch, computed } from 'vue';

import { Bootstrap5Pagination } from 'laravel-vue-pagination';
import VueDatePicker from '@vuepic/vue-datepicker';
import { endOfMonth,  startOfMonth, subMonths , startOfWeek, endOfWeek } from 'date-fns';
import { useAuthStore } from '@/stores/auth';
import useGlobalFunctions from '@/composables/global_functions.js';
import { useI18n } from 'vue-i18n'

const { t } = useI18n();
const { isAuthorized } = useGlobalFunctions();

const auth = useAuthStore();

const currency_symbol = computed(() => {
    return auth.user.currency.symbol;
})

const initialState = {
    server_messages: {
    type: "",
    messages: "",
    },
    is_listing: false,

    // form data   
    search_query : ref("")
};
const form = reactive({ ...initialState });

/* Filters */
const show_filter = ref(false);
const initial_filters = reactive({
    terminal_id : ref(""),
    date_type: ref(1),
    dates : ref(["",""]),
});
const filters = reactive({ ...initial_filters });
const show_clear_filter = ref(false);

async function filterList() {
  if (JSON.stringify(filters) != JSON.stringify(initial_filters)) {
    show_clear_filter.value = true;
  }
  show_filter.value = false;
  await getBusinessRegisters();
}


function clearFilter() {
  Object.assign(filters, initial_filters);
  show_clear_filter.value = false;
  getBusinessRegisters();
}

const terminals = ref([]);
const search_placeholder = t("Search by terminal")
onMounted(() => {
    checkPermissions();

    getBusinessRegisters()
});

watch(() =>
    form.search_query, _.debounce( () => {
      getBusinessRegisters();
    },500),
);
watch(filters, () => {
    filterList();
    getBusinessRegisters();
},{ deep: true });
const business_registers = ref([]);
const pagination = ref([]);
const presetDates = ref([
  { label: 'Today', value: [new Date(), new Date()] },
  { label: 'This Week', value: [startOfWeek(new Date()), endOfWeek(new Date())] },
  { label: 'This Month', value: [startOfMonth(new Date()), endOfMonth(new Date())] },
  {
    label: 'Last Month',
    value: [startOfMonth(subMonths(new Date(), 1)), endOfMonth(subMonths(new Date(), 1))],
  },
]);

async function getBusinessRegisters(page = 1){

    form.is_listing = true;

    await axios.get('/api/v2/business_registers', { params : {
            page : page,
            paginate_limit : paginate_limit.value,
            search_query : form.search_query,
            filter: filters,
        } }).then( (response) => {
            
        business_registers.value = response.data.data;
        pagination.value = response.data.pagination;
        terminals.value = response.data.terminals;
        form.is_listing = false;
        
    }).catch((error) => {
        form.server_messages.type = "error";
        form.server_messages.messages = error;
        form.is_listing = false;
        console.log(error);
    });

}

const paginate_limit = ref();
async function paginate_limit_update(value){
    paginate_limit.value = value;
    await getBusinessRegisters();
}

async function fetchFilterData() {
  show_filter.value = !show_filter.value;
}
/* Checking permissions */
const permissions = ref({
    write : false,
    delete : false,
});

function checkPermissions(){
    permissions.value  = {
        write : isAuthorized('A_WRITE_BUSINESS_REGISTER'),
        delete : isAuthorized('A_DELETE_BUSINESS_REGISTER'),
    };
}

</script>