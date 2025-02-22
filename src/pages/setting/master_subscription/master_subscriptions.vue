<template>
    <DefaultLayout>

      <template v-slot:subheader>
            <div class="header-nav-wrap">
                <div class="row align-items-center">
                    <!-- <div class="col-auto">
                        <div class="header-back-link">
                            <router-link class="text-primary" to="/settings" ><Icon icon="fa6-solid:chevron-left"  /> {{ $t('Settings') }}</router-link>
                        </div>
                    </div> -->
                    <div class="col-auto">
                        <h5 class="fw-bold">{{ $t('Subscriptions') }}</h5>
                    </div>
                </div>
            </div>
        </template>


      <div class="content">
        <div class="page-heading">
          <div class="row align-items-center justify-content-between">
            <div class="col-auto">
              <div class="row align-items-center">
                <div class="col-auto" v-if="permissions.write">
                  <router-link class="btn btn-sm btn-light-primary" to="/master_subscription/add" >+ {{ $t('New Subscription') }}</router-link>
                </div>
              </div>
            </div>
            <div class="col-auto">
              <div class="row align-items-center">
                <div class="col-auto">
                  <div class="form-field page-heading-search-field mb-0">
                    <div class="field-icon">
                      <input type="search" class="form-control form-control-sm form-control-shadow"
                             :placeholder="search_placeholder" v-model="form.search_query">
                      <div class="icon">
                        <Icon icon="fa6-solid:magnifying-glass"/>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-auto">
                  <div class="dropdown filter-dropdown">
                    <button type="button" class="btn btn-sm btn-icon btn-light-primary" data-bs-auto-close="outside"
                            @click="fetchFilterData">
                      <Icon icon="fa6-solid:filter"/>
                    </button>

                    <div :class="show_filter ? 'show' : ''" class="dropdown-menu p-3 w-365" id="filter_box"
                         style="position: absolute; inset: 0px auto auto 0px; margin: 0px; transform: translate3d(-310px, 36px, 0px);">
                      <form>
                        <div class="row gx-3">
                          <div class="col-12">
                            <div class="form-field">
                              <label class="form-label">{{ $t('Created Date') }}</label>
                              <VueDatePicker range v-model="filter.created_date" :format="'dd-MM-yyyy'" :enable-time-picker="false"/>
                            </div>
                          </div>
                        </div>
                        <div class="row gx-3">
                          <div class="col-6">
                            <VSelect
                                name="country"
                                label="Country"
                                v-model="filter.country"
                                placeholder="--Select Country--"
                                :options="countries"
                            />
                          </div>
                          <div class="col-6">
                            <div class="form-field">
                              <label class="form-label">{{ $t('Device Type') }}</label>
                              <select class="form-control form-control-sm form-control-solid" v-model="filter.device_type">
                                <option value="1">{{ $t('All') }}</option>
                                <option value="2">{{ $t('Web Devices') }}</option>
                                <option value="3">{{ $t('Mobile Devices') }}</option>
                              </select>
                            </div>
                          </div>
                          <div class="col-6">
                            <div class="form-field">
                              <label class="form-label">{{ $t('Subscription For') }}</label>
                              <select class="form-control form-control-sm form-control-solid" v-model="filter.subscription_for">
                                <option value="">{{ $t('All') }}</option>
                                <option value="1">{{ $t('Wosul') }}</option>
                                <option value="2">{{ $t('Alhamrani') }}</option>
                              </select>
                            </div>
                          </div>
                          <div class="col-6">
                            <div class="form-field">
                              <label class="form-label">{{ $t('Status') }}</label>
                              <select class="form-control form-control-sm form-control-solid" v-model="filter.status">
                                <option value="">{{ $t('All') }}</option>
                                <option value="1">{{ $t('Active') }}</option>
                                <option value="0">{{ $t('Inactive') }}</option>
                              </select>
                            </div>
                          </div>
                        </div>
                        <button type="button" @click="filterList" class="btn btn-sm btn-primary w-100">{{ $t('Filter') }}</button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
          <div class="row py-3">
            <div class="col-12 text-end">
              <button class="badge badge-danger btn-sm" v-if="show_clear_filter" @click="clearFilter">{{ $t('Clear Filters') }}
              </button>
            </div>
          </div>
        </div>
        <ListingSkeleton v-if="form.is_listing" />
        <div v-else class="table-responsive">
          <table class="table table-list-data table-hover">
            <thead class="bg-light">
            <tr>
              <th scope="col" width="20%">{{ $t('Name') }}</th>
              <th scope="col" width="10%">{{ $t('Category') }}</th>
              <th scope="col" width="10%">{{ $t('Device Type') }}</th>
              <th scope="col" width="10%">{{ $t('Subscription For') }}</th>
              <th scope="col" width="10%">{{ $t('Country') }}</th>
              <!-- <th scope="col" width="10%">{{ $t('Price Type') }}</th> -->
              <!-- <th scope="col" width="10%">{{ $t('Created At') }}</th> -->
              <th scope="col" width="10%" class="text-end">{{ $t('Price') }}</th>
              <th scope="col" width="5%">{{ $t('Active') }}</th>
              <th scope="col" class="text-end" width="5%" v-if="permissions.write && permissions.delete">{{ $t('Action') }}</th>
            </tr>
            </thead>
            <tbody>
            <tr v-if="subscriptions != ''" v-for="(subscription,branch_index) in subscriptions" :key="branch_index" >
              <td>
                <div>
                  <span class="fw-bold highlighted-list-item">{{  subscription.name  }}</span>
                  <br>
                  <small class="text-muted">{{ subscription.name_ar }}</small>
                </div>
              </td>
              <td>
                <span v-if="subscription.subscription_category==1">{{ $t('Plan') }}</span>
                <span v-else-if="subscription.subscription_category==2">{{ $t('Service') }}</span>
              </td>
              <td>
                <span v-if="subscription.device_type==1">{{ $t('All') }}</span>
                <span v-else-if="subscription.device_type==2">{{ $t('Web Devices') }}</span>
                <span v-else>{{ $t('Mobile Devices') }}</span>
              </td>
              <td>
                <span v-if="subscription.subscription_for==1">{{ $t('Wosul') }}</span>
                <span v-else>{{ $t('Alhamrani') }}</span>
              </td>
              <td>{{ subscription.country.name }}</td>
              <!-- <td>
                <span v-if="subscription.price_type==1">{{ $t('Inclusive Tax') }}</span>
                <span v-else>{{ $t('Exclusive Tax') }}</span>
              </td> -->
              <!-- <td>{{ subscription.created_at_label }}</td> -->
             
              <td class="text-end">
                
                <span v-if="subscription.is_trial" class="badge badge-info"> {{ subscription.trial_days }} {{ $t("Days Fee Trial") }} </span>
                <span v-else>
                  {{ subscription.payable_amount }} {{ subscription.currency.symbol }} 
                </span>
              
              </td>
              <td>
                <div class="form-feild">
                  <div class="form-check form-switch form-switch-2">
                    <input class="form-check-input" type="checkbox" role="switch" id="Status_id" @change="changeStatus(subscription.slack)" :checked="subscription.status == 1">
                  </div>
                </div>
              </td>
              <td class="text-end" v-if="permissions.write && permissions.delete">
                    <ActionButtonGroup :permissions="permissions" @delete="deleteSubscription" @edit="editSubscription" :slack="subscription.slack" />                
              </td>
            </tr>
            <tr v-else>
              <td class="text-center py-3" colspan="11">{{ $t('No Data Found') }}</td>
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
              <Bootstrap5Pagination :data="pagination" @pagination-change-page="getSubscriptions" />
            </div>
          </div>
        </div>
      </div>


  </DefaultLayout>
</template>

<script setup>

import { ref , onMounted, reactive, watch, defineComponent, computed } from 'vue';

import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { Bootstrap5Pagination } from 'laravel-vue-pagination';
import { useAuthStore } from '@/stores/auth';
import PaginateLimit from '@/components/common/PaginateLimit.vue';
import VueDatePicker from '@vuepic/vue-datepicker';
import useGlobalFunctions from '@/composables/global_functions.js';
import { useI18n } from 'vue-i18n'

const { t } = useI18n();
const { isAuthorized } = useGlobalFunctions();

const authStore = useAuthStore();

const initialState = {
  server_messages: {
    type: "",
    messages: "",
  },
  is_listing: false,

  // form data
  search_query : ref("")
};
const search_placeholder = t("Search by name, arabic name, price..")
const form = reactive({ ...initialState });

onMounted(() => {
  checkPermissions();
  getSubscriptions()
  getCountries()
});

watch(() =>
        form.search_query, _.debounce( () => {
      getSubscriptions();
    },500),
);

const subscriptions = ref([]);
const pagination = ref([]);

async function getSubscriptions(page = 1){

  form.is_listing = true;

  await axios.get('/api/subscriptions', { params : {
      page : page,
      paginate_limit : paginate_limit.value,
      search_query : form.search_query,
      filter: filter,
    } }).then( (response) => {

    subscriptions.value = response.data.data;
    pagination.value = response.data.pagination;
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
  await getSubscriptions();
}

const countries = ref([]);
async function getCountries(){
  countries.value = [];
  let country_data = await axios.get('api/countries/all');
  country_data = country_data.data.data;
  _.forEach(country_data, (item) => {
    let template = {
      'key': item.slack,
      'value': item.name,
    };
    countries.value.push(template);
  })
}


async function changeStatus(slack){

  var form_data = new FormData();
  form_data.append('slack',slack);

  await axios.post('/api/subscription/update_status', form_data).then( (response) => {

    if(response.data.status_code == 200) {

      toast.success(response.data.msg);

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


//Code for Filter
const show_filter = ref(false);
const initial_filter = reactive({
  created_date: ref(),
  status: ref(""),
  country: ref(""),
  device_type: ref(""),
  subscription_for: ref(""),
});
const filter = reactive({...initial_filter});
// var initial_filter = JSON.stringify(JSON.parse(JSON.stringify(filter)));
const show_clear_filter = ref(false);

async function filterList() {
  if (JSON.stringify(filter) != JSON.stringify(initial_filter)) {
    show_clear_filter.value = true;
  }
  show_filter.value = false;
  await getSubscriptions();
}

async function fetchFilterData() {
  show_filter.value = !show_filter.value;
}

function clearFilter() {
  Object.assign(filter, initial_filter);
  show_clear_filter.value = false;
  getSubscriptions();
}
//End filter code

function editSubscription(slack)
{
  router.push('/master_subscription/edit/'+slack);
}

async function deleteSubscription(slack){

  var is_confirmed = false;

  await Swal.fire({
    title: t('Do you want to delete this Subscription?'),
    showCancelButton: true,
    confirmButtonText: t('Yes, Delete'),
    confirmButtonColor: '#d33',
    cancelButtonText: t('Cancel'),
  }).then( (result) => {
    if(result.isConfirmed){
      is_confirmed = true;
    }
  });

  if(is_confirmed){

    await axios.post('/api/subscription/delete',{
      slack : slack
    }).then( (response) => {

      if(response.data.status_code == 200) {

        Swal.fire(response.data.msg);
        getSubscriptions();

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

}


/* Checking permissions */
const permissions = ref({
  write : false,
  delete : false,
});

function checkPermissions(){
  permissions.value  = {
    write : isAuthorized('A_WRITE_SUBSCRIPTION'),
    delete : isAuthorized('A_DELETE_SUBSCRIPTION'),
  };
}

</script>