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
                      <h5 class="fw-bold">{{ $t('Payment Method') }}</h5>
                  </div>
              </div>
          </div>
      </template>

    
    <div class="content">
      <div class="page-heading">
        <div class="row align-items-center justify-content-between">
          <div class="col-auto">
            <div class="row align-items-center">
              <div class="col-auto">
                <a href="#" class="btn btn-sm btn-light-primary" data-bs-toggle="modal" @click="openAddPaymentMethodModal" data-bs-target="#addPaymentMethodModal">
                  + {{ $t("New Payment Method") }}</a>
              </div>
            </div>
          </div>
          <div class="col-auto">
            <div class="row align-items-center">


              <div class="col-auto">
                <div class="form-field page-heading-search-field mb-0">
                  <div class="field-icon">
                    <input type="search" class="form-control form-control-sm form-control-shadow" :placeholder="search_placeholder" v-model="form.search_query">
                    <div class="icon"><Icon icon="fa6-solid:magnifying-glass" /></div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
      <div class="py-3" v-if="form.server_messages.messages != ''">
        <ServerMessage :server_messages="form.server_messages" />
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
          <tr v-if="payment_methods != ''" v-for="(payment_method,payment_method_index) in payment_methods" :key="payment_method_index">
            <td  role="button" data-bs-toggle="modal" data-bs-target="#viewPaymentMethodModal" @click="openViewPaymentMethodModal(payment_method)">
              <div>
                <span class="fw-bold highlighted-list-item">{{  payment_method.name  }}</span>
              </div>
            </td>
            <td role="button" data-bs-toggle="modal" data-bs-target="#viewPaymentMethodModal" @click="openViewPaymentMethodModal(payment_method)">{{  payment_method.constant  }}</td>
            <td>
              <div class="form-field">
                <div class="form-check form-switch form-switch-2">
                  <input class="form-check-input" type="checkbox" role="switch" id="Status_id" @change="changeStatus(payment_method.slack)" :checked="payment_method.status == 1" v-if="payment_method.merchant_id>0">
                </div>
              </div>
            </td>
            <td class="text-end">
              <div class="dropdown" v-if="payment_method.merchant_id>0">
                <button class="btn btn-icon btn-sm btn-light dropdown-toggle arrow-none" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                  <Icon icon="fa6-solid:ellipsis-vertical" />
                </button>
                <ul class="dropdown-menu">
                  <li><a class="dropdown-item" href="#" data-bs-toggle="modal" @click="openAddPaymentMethodModal(payment_method)" data-bs-target="#addPaymentMethodModal">{{ $t('Edit') }}</a></li>
                  <li>
                    <a class="dropdown-item" href="#" @click="deletePaymentMethod(payment_method.slack)">{{ $t('Delete') }}</a>
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
            <Bootstrap5Pagination :data="pagination" :limit="5"  @pagination-change-page="getPaymentMethod" />
          </div>
        </div>
      </div>
    </div>

    <AsyncAddPaymentMethod :show_add_payment_method_modal="show_add_payment_method_modal" @closeAddPaymentMethodModal="closeAddPaymentMethodModal" :edit_data="edit_data" />

    <AsyncViewPaymentMethod :show_view_payment_method_modal="show_view_payment_method_modal" :payment_method="shown_payment_method" @closeViewPaymentMethodModal="closeViewPaymentMethodModal" />

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
const AsyncAddPaymentMethod = defineAsyncComponent( () => import('@/components/payment_method/AddPaymentMethod.vue') );
const AsyncViewPaymentMethod = defineAsyncComponent( () => import('@/components/payment_method/ViewPaymentMethod.vue') );



const authStore = useAuthStore();



const show_add_payment_method_modal = ref(false);
const show_add_conversion_modal = ref(false);
const edit_data = ref([]);

function openAddPaymentMethodModal(editdata = ''){
  edit_data.value = editdata;
  show_add_payment_method_modal.value = true;
}
function closeAddPaymentMethodModal(){
  show_add_payment_method_modal.value = false;
  getPaymentMethod();
}

const shown_slack =  ref('');
function openAddConversionModal(slack){
  shown_slack.value = slack;
  show_add_conversion_modal.value = true;
}
function closeAddConversionModal(){
  show_add_conversion_modal.value = false;
  getPaymentMethod();
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

const search_placeholder = t("Search by name..")
const form = reactive({ ...initialState });

onMounted(() => {
  getPaymentMethod()
});

watch(() =>
        form.search_query, _.debounce( () => {
      getPaymentMethod();
    },500),
);

const payment_methods = ref([]);
const pagination = ref([]);

async function getPaymentMethod(page = 1){

  form.is_listing = true;

  await axios.get('/api/payment_methods', { params : {
      page : page,
      paginate_limit : paginate_limit.value,
      search_query : form.search_query,
    } }).then( (response) => {

    payment_methods.value = response.data.data;
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
  await getPaymentMethod();
}

async function changeStatus(slack){

  var form_data = new FormData();
  form_data.append('slack',slack);

  await axios.post('/api/payment_method/update_status', form_data).then( (response) => {

    if(response.data.status_code == 200) {

      toast.success(response.data.msg);
      getPaymentMethod();
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

const show_view_payment_method_modal = ref(false);

const shown_payment_method = ref([]);

function openViewPaymentMethodModal(payment_method){
  show_view_payment_method_modal.value = true;
  shown_payment_method.value = payment_method;
}

function closeViewPaymentMethodModal(){
  show_view_payment_method_modal.value = false;
}


async function deletePaymentMethod(slack){

  var is_confirmed = false;

  await Swal.fire({
    title: t('Do you want to delete this Payment Method?'),
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

    await axios.post('/api/payment_method/delete',{
      slack : slack
    }).then( (response) => {

      if(response.data.status_code == 200) {

        //Swal.fire(response.data.msg);
        toast.success(response.data.msg);
        getPaymentMethod();

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