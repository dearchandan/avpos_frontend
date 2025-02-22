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
                      <h5 class="fw-bold">{{ $t('Measurements') }}</h5>
                  </div>
              </div>
          </div>
      </template>

    
    <div class="content">
      <div class="page-heading">
        <div class="row align-items-center justify-content-end">
          <div class="col-auto">
            <div class="form-field page-heading-search-field mb-0">
              <div class="field-icon">
                <input type="search" class="form-control form-control-sm form-control-solid" :placeholder="search_placeholder" v-model="form.search_query">
                <div class="icon"><Icon icon="fa6-solid:magnifying-glass" /></div>
              </div>
            </div>
          </div>
          <div class="col-auto">
              <a href="#" class="btn btn-sm btn-light-primary2" data-bs-toggle="modal" @click="openAddMeasurementModal" data-bs-target="#addMeasurementModal">
                  + {{ $t("New Measurement") }}</a>
          </div>
          
        </div>

      </div>
      <ListingSkeleton v-if="form.is_listing" />
      <div v-else class="table-responsive" >
        <table class="table table-list-data table-hover">
          <thead class="bg-light">
          <tr>
            <th scope="col" >{{ $t('Name') }}</th>
            <th scope="col">{{ $t('Constant') }}</th>
            <th scope="col" width="10%">{{ $t('Active') }}</th>
            <th scope="col" width="10%" class="text-end">{{ $t('Action') }}</th>
          </tr>
          </thead>
          <tbody>
          <tr v-if="measurements != ''" v-for="(measurement,measurement_index) in measurements" :key="measurement_index">
            <td  role="button" data-bs-toggle="modal" data-bs-target="#viewMeasurementModal" @click="openViewMeasurementModal(measurement)">
              <div>
                <span class="fw-bold highlighted-list-item">{{  measurement.name  }}</span>
              </div>
            </td>
            <td role="button" data-bs-toggle="modal" data-bs-target="#viewMeasurementModal" @click="openViewMeasurementModal(measurement)">{{  measurement.constant  }}</td>
            <td>
              <div class="form-field">
                <div class="form-check form-switch form-switch-2">
                  <input class="form-check-input" type="checkbox" role="switch" id="Status_id" @change="changeStatus(measurement.slack)" :checked="measurement.status == 1" v-if="measurement.merchant_id>0">
                </div>
              </div>
            </td>
            <td class="text-end">
              <div class="dropdown" v-if="measurement.merchant_id>0">
                <button class="btn btn-icon btn-sm btn-light dropdown-toggle arrow-none" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                  <Icon icon="fa6-solid:ellipsis-vertical" />
                </button>
                <ul class="dropdown-menu">
                  <li><a class="dropdown-item" href="#" data-bs-toggle="modal" @click="openAddMeasurementModal(measurement)" data-bs-target="#addMeasurementModal">{{ $t('Edit') }}</a></li>
                  <li><a class="dropdown-item" href="#" data-bs-toggle="modal" @click="openAddConversionModal(measurement.slack)" data-bs-target="#addConversionModal">{{ $t('Conversion') }}</a></li>
                  <li>
                    <a class="dropdown-item" href="#" @click="deleteMeasurement(measurement.slack)">{{ $t('Delete') }}</a>
                  </li>
                </ul>
              </div>
            </td>
          </tr>
          <tr v-else>
            <td class="text-center py-3" colspan="7">{{ $t('No Data Found') }}</td>
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
            <Bootstrap5Pagination :data="pagination" :limit="5"  @pagination-change-page="getMeasurements" />
          </div>
        </div>
      </div>
    </div>

    <AsyncAddMeasurement :show_add_measurement_modal="show_add_measurement_modal" @closeAddMeasurementModal="closeAddMeasurementModal" :edit_data="edit_data" />

    <AsyncAddConversion :show_add_conversion_modal="show_add_conversion_modal" :measurement_slack="shown_slack" @closeAddConversionModal="closeAddConversionModal" />

    <AsyncViewMeasurement :show_view_measurement_modal="show_view_measurement_modal" :measurement="shown_measurement" @closeViewMeasurementModal="closeViewMeasurementModal" />

  </DefaultLayout>
</template>

<script setup>

import { ref , onMounted, reactive, watch, computed, defineAsyncComponent } from 'vue';

import { Bootstrap5Pagination } from 'laravel-vue-pagination'
import { useAuthStore } from '@/stores/auth'
import PaginateLimit from '@/components/common/PaginateLimit.vue'
import VueDatePicker from '@vuepic/vue-datepicker'
import BeatLoader from 'vue-spinner/src/BeatLoader.vue'
import SettingMenu from '@/components/common/SettingMenu.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n();
const AsyncAddMeasurement = defineAsyncComponent( () => import('@/components/measurement/AddMeasurement.vue') );
const AsyncViewMeasurement = defineAsyncComponent( () => import('@/components/measurement/ViewMeasurement.vue') );
const AsyncAddConversion = defineAsyncComponent( () => import('@/components/measurement/AddConversion.vue') );


const authStore = useAuthStore();



const show_add_measurement_modal = ref(false);
const show_add_conversion_modal = ref(false);
const edit_data = ref([]);

function openAddMeasurementModal(editdata = ''){
  edit_data.value = editdata;
  show_add_measurement_modal.value = true;
}
function closeAddMeasurementModal(){
  show_add_measurement_modal.value = false;
  getMeasurements();
}

const shown_slack =  ref('');
function openAddConversionModal(slack){
  shown_slack.value = slack;
  show_add_conversion_modal.value = true;
}
function closeAddConversionModal(){
  shown_slack.value = "";
  show_add_conversion_modal.value = false;
  getMeasurements();
}

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
  getMeasurements()
});

watch(() =>
        form.search_query, _.debounce( () => {
      getMeasurements();
    },500),
);

const measurements = ref([]);
const pagination = ref([]);

async function getMeasurements(page = 1){

  form.is_listing = true;

  await axios.get('/api/v2/measurements', { params : {
      page : page,
      paginate_limit : paginate_limit.value,
      search_query : form.search_query,
    } }).then( (response) => {

    measurements.value = response.data.data;
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
  await getMeasurements();
}

async function changeStatus(slack){

  var form_data = new FormData();
  form_data.append('slack',slack);

  await axios.post('/api/measurement/update_status', form_data).then( (response) => {

    if(response.data.status_code == 200) {

      toast.success(response.data.msg);
      getMeasurements();
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

const show_view_measurement_modal = ref(false);

const shown_measurement = ref([]);

function openViewMeasurementModal(measurement){
  show_view_measurement_modal.value = true;
  shown_measurement.value = measurement;
}

function closeViewMeasurementModal(){
  show_view_measurement_modal.value = false;
}


async function deleteMeasurement(slack){

  var is_confirmed = false;

  await Swal.fire({
    title: t('Do you want to delete this Measurement?'),
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

    await axios.post('/api/measurement/delete',{
      slack : slack
    }).then( (response) => {

      if(response.data.status_code == 200) {

        Swal.fire(response.data.msg);
        getMeasurements();

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
</script>