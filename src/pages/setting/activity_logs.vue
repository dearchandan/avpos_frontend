  <template>
   <DefaultLayout>

    <template v-slot:subheader>
          <div class="header-nav-wrap">
              <div class="row align-items-center">
                  <div class="col-auto">
                      <div class="header-back-link">
                          <router-link class="text-primary" to="/settings" ><Icon icon="fa6-solid:chevron-left"  /> {{ $t('Settings') }}</router-link>
                      </div>
                  </div>
                  <div class="col-auto">
                      <h5 class="fw-bold">{{ $t('Activity Logs') }}</h5>
                  </div>
              </div>
          </div>
      </template>

    
    <div class="content">
      <div class="page-heading">
        <div class="row align-items-end justify-content-between">
            <div class="col-md order-2 order-md-1">
              <div class="row g-3">
                  <div class="col-6 col-md-4 col-lg-3">
                    <VMultiSelect
                        name="user"
                        :label="t('Users')"
                        :placeholder="t('Select User')"
                        :text="'value'"
                        :value="'key'"
                        :options="users"
                        v-model="filters.user"
                        mode="single"
                          :no_class="false"
                          :height_sm="true"
                    />
                  </div>
                  <div class="col-6 col-md-4 col-lg-3">
                    <VMultiSelect 
                          v-model="filters.action_type"
                          name="action_types" 
                          :text="'value'" 
                          :value="'key'" 
                          mode="single"
                          :options="action_types"
                          :no_class="false"
                          :height_sm="true"
                          :label="t('Action')"
                          :placeholder="t('Select Action')"
                      />
                  </div>
                  <div class="col-6 col-md-4 col-lg-3">
                    <VMultiSelect 
                          v-model="filters.section"
                          name="action_types" 
                          :text="'key'" 
                          :value="'value'" 
                          mode="single"
                          :options="section_types"
                          :no_class="false"
                          :height_sm="true"
                          :label="t('Section')"
                          :placeholder="t('Select Section')"
                      />
                  </div>

              </div>
            </div>
            <div class="col-md-auto order-1 order-md-2 mb-3 mb-md-0">
                <div class="row">
                    <div class="col-lg-4">
                      <div class="form-field page-heading-search-field mb-0">
                        <div class="field-icon">
                          <input type="search" class="form-control form-control-sm form-control-solid" :placeholder="search_placeholder" v-model="form.search_query">
                          <div class="icon"><Icon icon="fa6-solid:magnifying-glass" /></div>
                        </div>
                      </div>
                    </div>
                  <!-- goto: no need of this for now but will be needed in future -->
                  <div class="col text-end">
                    <a href="#" class="btn btn-sm btn-light-primary2" data-bs-toggle="modal" @click="openAddActivityLogModal" data-bs-target="#addActivityLogModal">
                      + {{ $t("New Activity Log") }}</a>
                  </div>
              </div>
            </div>
          </div>

      </div>
      <ListingSkeleton v-if="form.is_listing" />
      <div v-else class="table-responsive" >
        <table class="table table-list-data table-hover">
          <thead class="bg-light">
          <tr>
            <th scope="col" width="60%">{{ $t('Description') }}</th>
            <th scope="col" width="10%">{{ $t('Event') }}</th>
            <th scope="col" width="15%" >{{ $t('User') }}</th>
            <th scope="col" width="15%">{{ $t('Created At') }}</th>
          </tr>
          </thead>
          <tbody>
          <tr v-if="activity_logs != ''" v-for="(activity_log,activity_log_index) in activity_logs" :key="activity_log_index">
            <td  role="button" data-bs-toggle="modal" data-bs-target="#viewActivityLogModal" @click="openViewActivityLogModal(activity_log)">
              {{  activity_log.description  }}
            </td>
            <td role="button" data-bs-toggle="modal" data-bs-target="#viewActivityLogModal" @click="openViewActivityLogModal(activity_log)">
              <span class="badge badge-success" v-if="activity_log.event == 'created'">{{ activity_log.event }}</span>
              <span class="badge badge-danger" v-if="activity_log.event == 'deleted'">{{ activity_log.event }}</span>
              <span class="badge badge-warning" v-if="activity_log.event == 'updated'">{{ activity_log.event }}</span>
              <span class="badge badge-primary" v-if="activity_log.event == 'custom'">{{ activity_log.event }}</span>
            </td>
            <td role="button" data-bs-toggle="modal" data-bs-target="#viewActivityLogModal" @click="openViewActivityLogModal(activity_log)">{{  activity_log.user?.name  }}</td>
            <td role="button" data-bs-toggle="modal" data-bs-target="#viewActivityLogModal" @click="openViewActivityLogModal(activity_log)">{{  activity_log.time_ago  }}</td>
      
          </tr>
          <tr v-else>
            <td class="text-center py-3" colspan="7">{{ $t('No Data Found') }}</td>
          </tr>
          </tbody>
        </table>
      </div>
      <div class="data-footer">
        <div class="row align-items-center justify-content-md-between justify-content-center g-3">
          <div class="col-auto">
            <PaginateLimit @paginate_limit_update="paginate_limit_update" :pagination="pagination" />
          </div>
          <div class="col-auto">
            <Bootstrap5Pagination :data="pagination" :limit="5"  @pagination-change-page="getActivityLogs" />
          </div>
        </div>
      </div>
    </div>

    <AsyncAddActivityLog :show_add_activity_log_modal="show_add_activity_log_modal" @closeAddActivityLogModal="closeAddActivityLogModal" />

    <AsyncViewActivityLog :show_view_activity_log_modal="show_view_activity_log_modal" :activity_log="shown_activity_log" @closeViewActivityLogModal="closeViewActivityLogModal" />

  </DefaultLayout>
</template>

<script setup>

import { ref , onMounted, reactive, watch, computed, defineAsyncComponent } from 'vue';

import { Bootstrap5Pagination } from 'laravel-vue-pagination'
import PaginateLimit from '@/components/common/PaginateLimit.vue'
import { useI18n } from 'vue-i18n'
import useGlobal from '@/composables/global.js';


const { action_types,section_types } = useGlobal();
const { t } = useI18n();
const AsyncAddActivityLog = defineAsyncComponent( () => import('@/components/activity_log/AddActivityLog.vue') );
const AsyncViewActivityLog = defineAsyncComponent( () => import('@/components/activity_log/ViewActivityLog.vue') );
const show_add_activity_log_modal = ref(false);
const initialState = {
  server_messages: {
    type: "",
    messages: "",
  },
  is_listing: false,

  // form data
  search_query : ref("")
};

const search_placeholder = t("Search by name, type..")
const form = reactive({ ...initialState });

onMounted(() => {
  getActivityLogs();
  getUsers();
});

watch(() =>
        form.search_query, _.debounce( () => {
      getActivityLogs();
    },500),
);
const initial_filters = reactive({
    user : ref(""),
    action_type : ref(""),
    section : ref("")
});
const filters = reactive({ ...initial_filters });
watch(filters, () => {
    getActivityLogs();
},{ deep: true });

const activity_logs = ref([]);
const pagination = ref([]);

async function getActivityLogs(page = 1){

  form.is_listing = true;

  await axios.get('/api/v2/activity_logs', { params : {
      page : page,
      paginate_limit : paginate_limit.value,
      search_query : form.search_query,
      filters: filters,
    } }).then( (response) => {

    activity_logs.value = response.data.data.data;
    pagination.value = response.data.data.pagination;
    form.is_listing = false;

  }).catch((error) => {
    form.server_messages.type = "error";
    form.server_messages.messages = error;
    form.is_listing = false;
    console.log(error);
  });

}

const users = ref([]);

async function getUsers() {

  let user_data = await axios.get('api/v2/users/dropdown');
  user_data = user_data.data.data;
  _.forEach(user_data, (item) => {
    let template = {
      'key': item.id,
      'value': item?.name
    };
    users.value.push(template);
  })
}
const paginate_limit = ref();
async function paginate_limit_update(value){
  paginate_limit.value = value;
  await getActivityLogs();
}

const show_view_activity_log_modal = ref(false);

const shown_activity_log = ref([]);

function closeAddActivityLogModal(){
    show_add_activity_log_modal.value = false;
    getActivityLogs(); 
}

function openViewActivityLogModal(activity_log){
    show_view_activity_log_modal.value = true;
    shown_activity_log.value = activity_log;
}

function closeViewActivityLogModal(){
  show_view_activity_log_modal.value = false;
}


</script>