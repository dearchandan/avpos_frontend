<template>
    <DefaultLayout>

        <template v-slot:subheader>
            <InventoryMenu />
        </template>
        
        <div class="content">
            <div class="page-heading">

                <div class="row align-items-center justify-content-between mb-3">
                    <div class="col-auto">
                        <h2 class="mb-0">{{ $t('Multiple Prices') }}</h2>
                    </div>
                    <div class="col-auto" v-if="permissions.write">
                        <router-link class="btn btn-sm btn-light-primary" to="/multiple_price/add" >+ {{ $t('New Multiple Price') }}</router-link>
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
                            <th scope="col" width="80%">{{ $t('Name') }}</th>
                            <th scope="col" width="10%">{{ $t('Active') }}</th>
                            <th scope="col" class="text-end" width="5%" v-if="permissions.write || permissions.delete">{{ $t('Action') }}</th>
                        </tr>
                    </thead>
                    <tbody> 
                        <tr v-if="multiple_prices != ''" v-for="(multiple_price,branch_index) in multiple_prices" :key="branch_index" >
                            <td @click="editMultiplePrice(multiple_price.slack)" role="button">
                                <div>
                                    <span class="fw-bold highlighted-list-item">{{  multiple_price.name  }}</span>
                                    <br>
                                    <small class="text-muted">Name(Ar): {{ multiple_price.name_ar }}</small>
                                </div>
                            </td>
                            <td>
                                <div class="form-feild">
                                    <div class="form-check form-switch form-switch-2">
                                        <input class="form-check-input" type="checkbox" role="switch" id="Status_id" @change="changeStatus(multiple_price.slack)" :checked="multiple_price.status == 1">
                                    </div>
                                </div>
                            </td>
                          <td class="text-end" v-if="permissions.write || permissions.delete">
                            <ActionButtonGroup :permissions="permissions" @edit="editMultiplePrice" @delete="deleteMultiplePrice" :slack="multiple_price.slack" />
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
                        <Bootstrap5Pagination :data="pagination" :limit="5"  @pagination-change-page="getMultiplePrices" />
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



const show_add_branch_modal = ref(false);

function openAddMultiplePriceModal(){
    show_add_branch_modal.value = true; 
}
function closeAddMultiplePriceModal(){
    show_add_branch_modal.value = false;
    getMultiplePrices();
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
const search_placeholder = t("Search by name, name ar..")
const form = reactive({ ...initialState });

onMounted(() => {
  checkPermissions();
  getMultiplePrices()
});

watch(() => 
    form.search_query, _.debounce( () => {
            getMultiplePrices();
    },500),
);

const multiple_prices = ref([]);
const pagination = ref([]);

async function getMultiplePrices(page = 1){

    form.is_listing = true;

    await axios.get('/api/v2/multiple_prices/list', { params : {
            page : page,
            paginate_limit : paginate_limit.value,
            search_query : form.search_query,
        } }).then( (response) => {
            
        multiple_prices.value = response.data.data;
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
    await getMultiplePrices();
}

async function changeStatus(slack){
    
    var form_data = new FormData();
    form_data.append('slack',slack);

    await axios.post('/api/multiple_price/update_status', form_data).then( (response) => {

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

function editMultiplePrice(slack){
  router.push('/multiple_price/edit/'+slack);
}

async function deleteMultiplePrice(slack){

  var is_confirmed = false;

  await Swal.fire({
    title: t('Do you want to delete this Multiple Price?'),
    showCancelButton: true,
    confirmButtonText: t('Yes, Delete'),
    cancelButtonText: t('Cancel'),
    confirmButtonColor: '#d33',
  }).then( (result) => {
    if(result.isConfirmed){
      is_confirmed = true;
    }
  });

  if(is_confirmed){

    await axios.post('/api/multiple_price/delete',{
      slack : slack
    }).then( (response) => {

      if(response.data.status_code == 200) {

        Swal.fire(response.data.msg);
        getMultiplePrices();

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
    write : isAuthorized('A_WRITE_MULTIPLE_PRICE'),
    delete : isAuthorized('A_DELETE_MULTIPLE_PRICE'),
  };
}

</script>