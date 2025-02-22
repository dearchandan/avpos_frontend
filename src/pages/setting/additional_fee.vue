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
                      <h5 class="fw-bold">{{ $t('Additional Fee') }}</h5>
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
            <a href="#" class="btn btn-sm btn-light-primary2" data-bs-toggle="modal" @click="openAddAdditionalFeeModal" data-bs-target="#addAdditionalFeeModal">
                  + {{ $t("New Additional Fee") }}</a>
          </div>
        </div>

      </div>
      <ListingSkeleton v-if="form.is_listing" />
      <div v-else class="table-responsive" >
        <table class="table table-list-data table-hover">
          <thead class="bg-light">
          <tr>
            <th scope="col" >{{ $t('Name') }}</th>
            <th scope="col" >{{ $t('Value') }}</th>
            <th scope="col" width="10%">{{ $t('Active') }}</th>
            <th scope="col" width="10%" class="text-end">{{ $t('Action') }}</th>
          </tr>
          </thead>
          <tbody>
          <tr v-if="additional_fees != ''" v-for="(additional_fee,additional_fee_index) in additional_fees" :key="additional_fee_index">
            <td>
              <div>
                <span class="fw-bold highlighted-list-item">{{  additional_fee.name  }}</span>
                <br v-if="additional_fee.name_ar != ''">
                <span v-if="additional_fee.name_ar != ''">{{  additional_fee.name_ar  }}</span>
              </div>
            </td>
            <td>
              {{ additional_fee.value }}
              <span v-if="additional_fee.type == 1">%</span>
              <span v-else> {{ currency_symbol }} </span>
            </td>
            <td>
              <span v-if="additional_fee.status == 1" class="badge badge-success">Active</span>
              <span v-else class="badge badge-danger">Inactive</span>
            </td>
            <td class="text-end">
              <div class="dropdown" v-if="additional_fee.merchant_id>0">
                <button class="btn btn-icon btn-sm btn-light dropdown-toggle arrow-none" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                  <Icon icon="fa6-solid:ellipsis-vertical" />
                </button>
                <ul class="dropdown-menu">
                  <li><a class="dropdown-item" href="#" data-bs-toggle="modal" @click="openAddAdditionalFeeModal(additional_fee)" data-bs-target="#addAdditionalFeeModal">{{ $t('Edit') }}</a></li>
                  <li>
                    <a class="dropdown-item" href="#" @click="deleteAdditionalFee(additional_fee.slack)">{{ $t('Delete') }}</a>
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
            <Bootstrap5Pagination :data="pagination" :limit="5"  @pagination-change-page="getAdditionalFee" />
          </div>
        </div>
      </div>
    </div>

    <AsyncAddAdditionalFee :show_add_additional_fee_modal="show_add_additional_fee_modal" @closeAddAdditionalFeeModal="closeAddAdditionalFeeModal" :edit_data="edit_data" />

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
const AsyncAddAdditionalFee = defineAsyncComponent( () => import('@/components/additional_fee/AddAdditionalFee.vue') );

const authStore = useAuthStore();

const currency_symbol = computed(() => {
    return authStore.user.currency.symbol;
})


const show_add_additional_fee_modal = ref(false);
const edit_data = ref([]);

function openAddAdditionalFeeModal(editdata = ''){
  edit_data.value = editdata;
  show_add_additional_fee_modal.value = true;
}
function closeAddAdditionalFeeModal(){
  show_add_additional_fee_modal.value = false;
  getAdditionalFee();
}

const shown_slack =  ref('');

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
  getAdditionalFee()
});

watch(() =>
        form.search_query, _.debounce( () => {
      getAdditionalFee();
    },500),
);

const additional_fees = ref([]);
const pagination = ref([]);

async function getAdditionalFee(page = 1){

  form.is_listing = true;

  await axios.get('/api/additional_fees', { params : {
      page : page,
      paginate_limit : paginate_limit.value,
      search_query : form.search_query,
    } }).then( (response) => {

    additional_fees.value = response.data.data;
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
  await getAdditionalFee();
}

async function deleteAdditionalFee(slack){

  var is_confirmed = false;

  await Swal.fire({
    title: t('Do you want to delete this AdditionalFee?'),
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

    await axios.post('/api/additional_fee/delete',{
      slack : slack
    }).then( (response) => {

      if(response.data.status_code == 200) {

        Swal.fire(response.data.msg);
        getAdditionalFee();

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