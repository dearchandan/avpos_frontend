<template>
  <DefaultLayout>

      <template v-slot:subheader>
        <ManageMenu />
      </template>
      
      <div class="content">
          <div class="page-heading">
              <div class="row align-items-center justify-content-between">
                <div class="col-auto">
                    <h2 class="mb-0">{{ $t('Terminals') }}</h2>
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
                            <router-link class="btn btn-sm btn-light-primary2" to="/terminal/add" v-if="permissions.write">+ {{ $t('New Terminal') }}</router-link>
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
                        <th scope="col" width="15%">{{ $t('Name') }}</th>
                        <th scope="col" width="5%">{{ $t('Series') }}</th>
                        <th scope="col" width="10%">{{ $t('Activation Code') }}</th>
                        <th scope="col" width="10%">{{ $t('Linked Device') }}</th>
                        <th scope="col" width="10%">{{ $t('Registered At') }}</th>
                        <th scope="col" width="10%">{{ $t('Availability Status') }}</th>
                        <th scope="col" width="10%">{{ $t('Is Active') }}</th>
                        <th scope="col" class="text-end" width="5%" v-if="permissions.write || permissions.delete">{{ $t('Action') }}</th>
                      </tr>
                  </thead>
                  <tbody> 
                      <tr v-if="terminals != ''" v-for="(terminal,branch_index) in terminals" :key="branch_index" >
                        <td @click="viewTerminal(terminal.slack)" role="button" :class=" { 'border-start border-5 fw-bold' : terminal.logged_user_id == authStore.user.id } ">
                          <div><span class=" highlighted-list-item">{{ terminal.terminal_name }}</span>   </div>
                        </td>
                        <td @click="viewTerminal(terminal.slack)" role="button"> {{ terminal.code }} </td>
                        <td class="fs-5 ls-wider text-dark"> {{ terminal.terminal_login_code }} </td>
                        <td @click="viewTerminal(terminal.slack)" role="button"> {{ terminal.registered_device_id }} </td>
                        <td @click="viewTerminal(terminal.slack)" role="button">{{ terminal.registered_at_label }}</td>
                        <td @click="viewTerminal(terminal.slack)" role="button">
                          <span class=" mx-2 rounded rounded-3" v-if="terminal.logged_user_id != null">
                            <span class="text-success" v-if="terminal.logged_user_id == authStore.user.id">Opened By You</span>
                            <span v-else>Opened by {{ authStore.user.name  }} </span>
                          </span>
                          <span class="badge badge-success mx-2 rounded rounded-3" v-else>Available</span>
                        </td>
                        <td>
                          <div class="form-feild" v-if="terminal.logged_user_id == null">
                            <div class="form-check form-switch form-switch-2">
                              <input class="form-check-input" type="checkbox" role="switch" id="Status_id" @change="changeStatus(terminal.slack)" :checked="terminal.status == 1">
                            </div>
                          </div>
                        </td>
                        <td class="text-end" v-if="permissions.write || permissions.delete">
                            <!-- <div class="dropdown">
                                <button class="btn btn-icon btn-sm btn-light dropdown-toggle arrow-none" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    <Icon icon="fa6-solid:ellipsis-vertical" />
                                </button>
                              <ul class="dropdown-menu">
                                <li>
                                  <a v-if="permissions.write && terminal.logged_user_id != null" class="dropdown-item text-danger" href="#" @click="forceCloseTerminal(terminal)">{{ $t('Force Close') }}</a>
                                  <a v-if="permissions.write" class="dropdown-item" href="#" @click="editTerminal(terminal.slack)">{{ $t('Edit') }}</a>
                                  <a v-if="permissions.delete" class="dropdown-item" href="#" @click="deleteTerminal(terminal.slack)">{{ $t('Delete') }}</a>
                                </li>
                              </ul>
                            </div>   -->
                            <div class="row flex-nowrap gx-2 text-end">
                              <div class="col-auto" >
                                  <a v-if="permissions && permissions.write" class="btn btn-icon btn-xs btn-light" href="#" @click="editTerminal(terminal.slack)" >
                                      <Icon icon="fa6-solid:pen"  />
                                  </a>
                              </div>
                              <div class="col-auto" v-if="permissions.write && terminal.logged_user_id != null">
                                  <a class="btn btn-icon btn-xs btn-light-danger" href="#" @click="forceCloseTerminal(terminal)" >
                                      <Icon icon="fa6-solid:arrow-right-from-bracket"  />
                                  </a>
                              </div>
                              
                              <!-- <div class="col-auto" >
                                  <a v-if="permissions && permissions.delete" class="btn btn-icon btn-xs btn-light-danger" href="#" @click="deleteTerminal(terminal.slack)">
                                      <Icon icon="fa6-regular:trash-can" />
                                  </a>
                              </div> -->
                            </div>
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
                      <Bootstrap5Pagination :data="pagination" :limit="5"  @pagination-change-page="getTerminals" />
                  </div>
              </div>
          </div>
      </div>

      <AsyncCloseRegister />
      
  </DefaultLayout>
</template>

<script setup>

import { ref , onMounted, reactive, watch, defineComponent, computed } from 'vue';

import { Bootstrap5Pagination } from 'laravel-vue-pagination';
import { useAuthStore } from '@/stores/auth';
import VueDatePicker from '@vuepic/vue-datepicker';
import useGlobalFunctions from '@/composables/global_functions.js';
import { useI18n } from 'vue-i18n'

const { t } = useI18n();
const { isAuthorized } = useGlobalFunctions();

const authStore = useAuthStore();



const show_add_branch_modal = ref(false);
const labels = ref({

branch : t('Branch'),
select_branch : t('Select Branch'),
});
function openAddTerminalModal(){
  show_add_branch_modal.value = true; 
}
function closeAddTerminalModal(){
  show_add_branch_modal.value = false;
  getTerminals();
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
const search_placeholder = t("Search by name, code")
const form = reactive({ ...initialState });

onMounted(() => {
checkPermissions();
getTerminals()
// getBranches()
});

watch(() => 
  form.search_query, _.debounce( () => {
          getTerminals();
  },500),
);

const terminals = ref([]);
const pagination = ref([]);

async function getTerminals(page = 1){

  form.is_listing = true;

  await axios.get('/api/v2/terminals', { params : {
          page : page,
          paginate_limit : paginate_limit.value,
          search_query : form.search_query,
          filter: filter,
      } }).then( (response) => {
          
      terminals.value = response.data.data;
      pagination.value = response.data.pagination;
      form.is_listing = false;
      
  }).catch((error) => {
      form.server_messages.type = "error";
      form.server_messages.messages = error;
      form.is_listing = false;
      console.log(error);
  });

}

const branches = ref([]);
async function getBranches(){
let branch_data = await axios.post('api/user_branches');
branch_data = branch_data.data.data.branches;
_.forEach(branch_data, (item) => {
  let template = {
    'key': item.slack,
    'value': item.name,
  };
  branches.value.push(template);
})
}


const paginate_limit = ref();
async function paginate_limit_update(value){
  paginate_limit.value = value;
  await getTerminals();
}

async function changeStatus(slack){

var form_data = new FormData();
form_data.append('slack',slack);

await axios.post('/api/terminal/update_status', form_data).then( (response) => {

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
branch: ref(""),
mode: ref(""),
type: ref(""),
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
await getTerminals();
}

async function fetchFilterData() {
show_filter.value = !show_filter.value;
}

function clearFilter() {
Object.assign(filter, initial_filter);
show_clear_filter.value = false;
getTerminals();
}
//End filter code

function viewTerminal(slack){
  router.push('/terminal/'+slack);
}
function editTerminal(slack)
{
  router.push('/terminal/edit/'+slack);
}

async function deleteTerminal(slack){

var is_confirmed = false;

await Swal.fire({
  title: t('Do you want to delete this Terminal?'),
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

  await axios.post('/api/terminal/delete',{
    slack : slack
  }).then( (response) => {

    if(response.data.status_code == 200) {

      Swal.fire(response.data.msg);
      getTerminals();

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

async function forceCloseTerminal(terminal){

var msg_title =  t('Are you sure you want to close the opened terminal?');  

if(terminal.terminal_mode == 2){
  msg_title = t('Warning: Closing an opened terminal from offline device will discard all your unsynchronized data from the device?');
}

var is_confirmed = false;

await Swal.fire({
  title: msg_title,
  showCancelButton: true,
  confirmButtonText: t('Yes, Close'),
  confirmButtonColor: '#d33',
  cancelButtonText: t('Cancel'),
}).then( (result) => {
  if(result.isConfirmed){
    is_confirmed = true;
  }
});

if(is_confirmed){

  await axios.post('/api/terminal/close',{
    terminal_id : terminal.id
  }).then( (response) => {

    if(response.data.status_code == 200) {

      Swal.fire(response.data.msg);


      if(response.data.data.terminal_user_id == authStore.user.id){
        //router.push({name: 'login'});
        //authStore.logout()
        getTerminals();
      }else{
        getTerminals();
      }

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
      write : isAuthorized('A_WRITE_TERMINAL'),
      delete : isAuthorized('A_DELETE_TERMINAL'),
  };
}

const AsyncCloseRegister = defineAsyncComponent( () => import('@/components/cashier/CloseRegister.vue') );


</script>