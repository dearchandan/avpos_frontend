<template>
    <DefaultLayout>

      <template v-slot:subheader>
        <SubscriptionMenu />
      </template>

      <div class="content">
        <div class="page-heading">
          <div class="row align-items-center justify-content-between">
            <div class="col-auto">
              <div class="row align-items-center">

              </div>
            </div>
            <div class="col-auto">
              <div class="row align-items-center">
                <div class="col-auto">
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
                              <label class="form-label">{{ $t('Start Date') }}</label>
                              <VueDatePicker range v-model="filter.start_date" :format="'dd-MM-yyyy'" :enable-time-picker="false" input-class-name="form-control form-control-solid form-control-sm"/>
                            </div>
                          </div>
                          <div class="col-12">
                            <div class="form-field">
                              <label class="form-label">{{ $t('End Date') }}</label>
                              <VueDatePicker range v-model="filter.end_date" :format="'dd-MM-yyyy'" :enable-time-picker="false" input-class-name="form-control form-control-solid form-control-sm"/>
                            </div>
                          </div>
                        </div>
                        <div class="col-12">
                          <div class="form-field">
                            <label class="form-label">{{ $t('Status') }}</label>
                            <select class="form-control form-control-sm form-control-solid" v-model="filter.status">
                              <option value="">{{ $t('All') }}</option>
                              <option value="0">{{ $t('Inactive') }}</option>
                              <option value="1">{{ $t('Active') }}</option>
                              <option value="2">{{ $t('On Hold') }}</option>
                              <option value="3">{{ $t('Expired') }}</option>
                            </select>
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
          <div class="row">
            <div class="col-12 text-end">
              <button class="badge badge-danger btn-sm" v-if="show_clear_filter" @click="clearFilter">{{ $t('Clear Filters') }}
              </button>
            </div>
          </div>
        </div>
        <div v-if="form.is_listing">
          <beat-loader color="gray" :size="'15px'" class="pt-2 pe-2">  </beat-loader>
        </div>
        <div v-else class="table-responsive">
          <table class="table table-list-data table-hover">
            <thead class="bg-light">
            <tr>
              <th scope="col" width="20%">{{ $t('Plan Name') }}</th>
              <th scope="col" width="10%">{{ $t('	Subscription Period') }}</th>
              <th scope="col" width="10%">{{ $t('Days Left') }}</th>
              <th scope="col" width="10%" class="text-end">{{ $t('Amount') }}</th>
              <th scope="col" width="10%" class="text-center">{{ $t('Status') }}</th>
              <th scope="col" width="10%" class="text-center">{{ $t("Purchased At") }}</th>
            </tr>
            </thead>
            <tbody>
            <tr v-if="my_subscriptions != ''" v-for="(my_subscription,branch_index) in my_subscriptions" :key="branch_index" >
              <td>
                <div>
                  <span class="fw-bold highlighted-list-item" :class="{ 'text-success' : my_subscription.running_status == 'Running' }">{{  my_subscription.subscription.name  }}</span>
                  <br>
                  <small class="text-muted">{{ my_subscription.subscription.name_ar }}</small>
                </div>
              </td>
              <td>{{ my_subscription.start_date_label }} - {{ my_subscription.end_date_label }}</td>
              <td><span v-if="my_subscription.status == 1">{{ my_subscription.days_left }}  {{ $t('Days') }}</span>
                <span v-else>-</span> </td>
              <td class="text-end">{{ my_subscription.payable_amount }}</td>
              <td class="text-center">
                <span
                    v-if="my_subscription.running_status == 'Awaiting'"
                    class="badge badge-warning"
                >
                      {{ my_subscription.running_status }}
                    </span>
                <span
                    v-if="my_subscription.running_status == 'Running'"
                    class="badge badge-success"
                >
                      {{ my_subscription.running_status }}
                    </span>
                <span
                    v-if="my_subscription.running_status == 'Expired'"
                    class="badge badge-muted"
                >
                      {{ my_subscription.running_status }}</span
                >
              </td>
              <td>{{ my_subscription.created_at_label }}</td>
            </tr>
            <tr v-else>
              <td class="text-center py-3" colspan="6">{{ $t('No Data Found') }}</td>
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
              <Bootstrap5Pagination :data="pagination" @pagination-change-page="getMySubscriptions" />
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
import BeatLoader from 'vue-spinner/src/BeatLoader.vue'
import ManageMenu from '@/components/common/ManageMenu.vue'
import useGlobalFunctions from '@/composables/global_functions.js';
import { useI18n } from 'vue-i18n'

const { t } = useI18n();
const { isAuthorized } = useGlobalFunctions();

const authStore = useAuthStore();

const authUser = computed(() => {
  return authStore.user;
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
const search_placeholder = t("Search by name, price..")
const form = reactive({ ...initialState });

onMounted(() => {
  checkPermissions();
  getMySubscriptions()
});

watch(() =>
    form.search_query, _.debounce( () => {
      getMySubscriptions();
    },500),
);

const my_subscriptions = ref([]);
const pagination = ref([]);

async function getMySubscriptions(page = 1){

  form.is_listing = true;

  await axios.get('/api/v2/my_subscriptions', { params : {
      page : page,
      paginate_limit : paginate_limit.value,
      search_query : form.search_query,
      filter: filter,
    } }).then( (response) => {

    my_subscriptions.value = response.data.data;
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
  await getMySubscriptions();
}

//Code for Filter
const show_filter = ref(false);
const initial_filter = reactive({
  start_date: ref(),
  end_date: ref(),
  status: ref(""),
});
const filter = reactive({...initial_filter});
// var initial_filter = JSON.stringify(JSON.parse(JSON.stringify(filter)));
const show_clear_filter = ref(false);

async function filterList() {
  if (JSON.stringify(filter) != JSON.stringify(initial_filter)) {
    show_clear_filter.value = true;
  }
  show_filter.value = false;
  await getMySubscriptions();
}

async function fetchFilterData() {
  show_filter.value = !show_filter.value;
}

function clearFilter() {
  Object.assign(filter, initial_filter);
  show_clear_filter.value = false;
  getMySubscriptions();
}
//End filter code

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