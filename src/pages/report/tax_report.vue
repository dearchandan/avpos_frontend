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
              <h5 class="fw-bold">{{ $t('Tax Report') }}</h5>
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

                    <div class="col-md-4 col-lg-3">
                      <VSelect
                          name="categories"
                          :label="select_category_label"
                          :placeholder="select_category_placeholder"
                          :text="'name'"
                          :value="'id'"
                          :options="categories"
                          v-model="filter.selected_category"

                      />
                    </div>
                    <div class="col-md-4 col-lg-3">
                      <VSelect
                          name="taxes"
                          :label="select_tax_label"
                          :placeholder="select_tax_placeholder"
                          :text="'name'"
                          :value="'id'"
                          :options="taxes"
                          v-model="filter.selected_tax"

                      />
                    </div>

                </div>
                <div class="row mt-3">
                    <div class="col-12 text-end">
                        <button class="btn btn-success ms-3" @click="exportExcel()" :disabled="filter.dates == null">{{ $t('Export Excel') }}</button>
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

const { isAuthorized } = useGlobalFunctions();

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
    selected_branch : ref(),
    selected_terminals : ref([]),
    selected_category : ref([]),
    selected_tax : ref([]),
    is_exporting : false,
});
const filter = reactive({ ...initial_filter });

const select_branch_label = t('Select Branch');
const select_branch_placeholder = t('All Branches');
const select_terminal_label = t('All Terminals');
const select_terminal_placeholder = t('Select Terminals');
const select_category_label = t('Select Category');
const select_category_placeholder = t('All Categories');
const select_tax_label = t('Select Tax');
const select_tax_placeholder = t('All Taxes');

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

onMounted(() => {
  loadCategory();
  loadTax();
});

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

const categories = ref([]);
async function loadCategory(){
  let category_data = await axios.get('api/v2/categories/all');
  category_data = category_data.data.data;
  _.forEach(category_data, (item) => {
    let template = {
      'key': item.slack,
      'value': item.name,
      'id': item.slack,
    };
    categories.value.push(template);
  })
}


const taxes = ref([]);
async function loadTax(){
  let tax_data = await axios.get('api/v2/taxes/all');
  tax_data = tax_data.data.data;
  _.forEach(tax_data, (item) => {
    let template = {
      'key': item.slack,
      'value': item.name,
      'id': item.slack,
    };
    taxes.value.push(template);
  })
}

async function exportExcel(){

    filter.is_exporting = true;
    filter.dates[0] = moment(filter.dates[0]).format('YYYY-MM-DD');
    filter.dates[1] = moment(filter.dates[1]).format('YYYY-MM-DD');
    await axios.get('/api/tax_report/export_excel', { params : {
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

