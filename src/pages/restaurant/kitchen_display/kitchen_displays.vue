<template>
    <DefaultLayout>

        <template v-slot:subheader>
            <RestaurantMenu />
        </template>
        
        <div class="content">
            <div class="page-heading">
                <div class="row align-items-center justify-content-between">
                    <div class="col-auto">
                        <h2 class="mb-0">{{ $t('KDS') }}</h2>
                    </div>
                    <div class="col-auto">
                        <div class="row align-items-center">
                            <div class="col-auto">
                                <div class="row align-items-center">
                                
                                    <div class="col-auto">
                                        
                                        <div class="dropdown filter-dropdown">
                                            
                                            <div class="dropdown-menu p-0" style="min-width: 150px;">
                                                    <div class="dropdown-item">An item</div>
                                                    <div class="dropdown-item">A second item</div>
                                                    <div class="dropdown-item">A third item</div>
                                                    <div class="dropdown-item">A fourth item</div>
                                                    <div class="dropdown-item">And a fifth one</div>
                                            </div>
                                        </div>

                                    </div>
                                    <div class="col-auto">
                                        <div class="form-field page-heading-search-field mb-0">
                                            <div class="field-icon">
                                                <input type="search" class="form-control form-control-sm form-control-solid" :placeholder="search_placeholder" v-model="form.search_query">
                                                <div class="icon"><Icon icon="fa6-solid:magnifying-glass" /></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                            </div>
                            <div class="col-auto" v-if="permissions.write">
                                <router-link class="btn btn-sm btn-light-primary2" to="/kitchen_display/add" >+ {{ $t('New KDS') }}</router-link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ListingSkeleton v-if="form.is_listing" />
            <div v-else class="table-responsive">
                <table class="table table-list-data table-hover">
                    <thead class="bg-light">
                        <tr>
                            <th scope="col">{{ $t('KDS Name') }}</th>
                            <th scope="col">{{ $t('Activation Code') }}</th>
                            <th scope="col" width="10%">{{ $t('Active') }}</th>
                            <th scope="col" class="text-end" width="5%" v-if="permissions.write || permissions.delete">{{ $t('Action') }}</th>
                        </tr>
                    </thead>
                    <tbody> 
                        <tr v-if="kitchen_displays != ''" v-for="(kitchen_display,branch_index) in kitchen_displays" :key="branch_index" >
                            <td @click="viewKitchenDisplay(kitchen_display.slack)" role="button">
                                <div>
                                    <span class="fw-bold highlighted-list-item">{{  kitchen_display.name  }}</span>
                                </div>
                            </td>
                            <td class="fs-5 ls-wider text-primary"> {{ kitchen_display.activation_code }} </td>
                            <td>
                                <div class="form-feild">
                                    <div class="form-check form-switch form-switch-2">
                                        <input class="form-check-input" type="checkbox" role="switch" id="Status_id" @change="changeStatus(kitchen_display.slack)" :checked="kitchen_display.status == 1">
                                    </div>
                                </div>
                            </td>
                            <td class="text-end" v-if="permissions.write || permissions.delete">
                                <!-- <div class="dropdown">
                                    <button class="btn btn-icon btn-sm btn-light dropdown-toggle arrow-none" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        <Icon icon="fa6-solid:ellipsis-vertical" />
                                    </button>
                                  <ul class="dropdown-menu">
                                    <li v-if="permissions.write">
                                        <a class="dropdown-item" href="#" @click="editKitchenDisplay(kitchen_display.slack)">{{ $t('Edit') }}</a>
                                    </li>
                                    <li v-if="permissions.delete">
                                      <a class="dropdown-item" href="#" @click="deleteKitchenDisplay(kitchen_display.slack)">{{ $t('Delete') }}</a>
                                    </li>
                                  </ul>
                                </div> -->
                                <ActionButtonGroup  :permissions="permissions" :slack="kitchen_display.slack" @delete="deleteKitchenDisplay"  @edit="editKitchenDisplay" />
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
                        <Bootstrap5Pagination :data="pagination" :limit="5"  @pagination-change-page="getKitchenDisplays" />
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
import { useI18n } from 'vue-i18n'
import useGlobalFunctions from '@/composables/global_functions.js';
import { useCashierStore } from '@/stores/cashierStore';
const cashierStore = useCashierStore();

const { isAuthorized } = useGlobalFunctions();


const { t } = useI18n();
const authStore = useAuthStore();



const show_add_branch_modal = ref(false);

function openAddKitchenDisplayModal(){
    show_add_branch_modal.value = true; 
}
function closeAddKitchenDisplayModal(){
    show_add_branch_modal.value = false;
    getKitchenDisplays();
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
const search_placeholder = t("Search by KDS name..")
const form = reactive({ ...initialState });

onMounted(() => {
    checkPermissions();
    getKitchenDisplays();
});

watch(() => 
    form.search_query, _.debounce( () => {
            getKitchenDisplays();
    },500),
);

const kitchen_displays = ref([]);
const pagination = ref([]);

async function getKitchenDisplays(page = 1){

    form.is_listing = true;

    await axios.get('/api/v2/kitchen_displays', { params : {
            page : page,
            paginate_limit : paginate_limit.value,
            search_query : form.search_query,
        } }).then( (response) => {
            
        kitchen_displays.value = response.data.data;
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
    await getKitchenDisplays();
}

async function changeStatus(slack){
    
    var form_data = new FormData();
    form_data.append('slack',slack);

    await axios.post('/api/kitchen_display/update_status', form_data).then( (response) => {

        if(response.data.status_code == 200) {
            
          toast.success(response.data.msg);
          cashierStore.getSettings();
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

function viewKitchenDisplay(slack){
    router.push('/kitchen_display/'+slack);
}
function editKitchenDisplay(slack)
{
    router.push('/kitchen_display/edit/'+slack);
}

async function deleteKitchenDisplay(slack){

  var is_confirmed = false;

  await Swal.fire({
    title: t('Do you want to delete this KDS?'),
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

    await axios.post('/api/kitchen_display/delete',{
      slack : slack
    }).then( (response) => {

      if(response.data.status_code == 200) {

        Swal.fire(response.data.msg);
        getKitchenDisplays();

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
        write : isAuthorized('A_WRITE_KITCHEN_DISPLAY'),
        delete : isAuthorized('A_DELETE_KITCHEN_DISPLAY'),
    };
}

</script>