<template>
  <DefaultLayout>

    <template v-slot:subheader>
      <ManageMenu />
    </template>

    <div class="content">
      <div class="page-heading">
        <div class="row align-items-center justify-content-between">
          <div class="col-auto">
            <div class="row align-items-center">
              <div class="col-auto" v-if="permissions.write">
                <a href="#" class="btn btn-sm btn-light-primary" data-bs-toggle="modal" @click="openAddRoleModal()" data-bs-target="#addRoleModal">+ {{ $t('New Role') }}</a>
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
        <div class="row py-3">
          <div class="col-12 text-end">
            <button class="badge badge-danger btn-sm" v-if="show_clear_filter" @click="clearFilter">{{ $t('Clear Filters') }}</button>
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
            <th scope="col" width="60%">{{ $t('Role') }}</th>
            <th scope="col" width="20%">{{ $t('Role Type') }}</th>
            <th scope="col" width="10%">{{ $t('Active') }}</th>
            <th scope="col" class="text-end" width="10%" v-if="permissions.write && permissions.delete">{{ $t('Action') }}</th>
          </tr>
          </thead>
          <tbody>
          <tr v-if="roles != ''" v-for="(role,role_index) in roles" :key="role_index" >
            <td  role="button" data-bs-toggle="modal" data-bs-target="#viewRoleModal" @click="viewRole(role.slack)">
              <h6>{{  role.name  }} 
                <label v-show="role.role_menus_count != ''" class="text-muted small"> ({{  role.role_menus_count.menu_count }} {{ $t('Permissions') }})</label>
              </h6>
              <span v-show="role.main_menu_access != ''" class="text-muted">
                  <label  v-for="(main_menu,menu_index) in role.main_menu_access" :key="menu_index" class="me-2" >
                    {{ main_menu['name']  }},
                  </label>
              </span>
            </td>
            <td  role="button" data-bs-toggle="modal" data-bs-target="#viewRoleModal" @click="viewRole(role.slack)">{{  role.role_type_text  }}</td>
            <td>
              <div class="form-feild">
                <div class="form-check form-switch form-switch-2">
                  <input class="form-check-input" type="checkbox" role="switch" id="Status_id" @change="changeStatus(role.slack)" :checked="role.status == 1">
                </div>
              </div>
            </td>
            <td class="text-end" v-if="permissions.write && permissions.delete">
              <!-- <div class="dropdown">
                <button class="btn btn-icon btn-sm btn-light dropdown-toggle arrow-none" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                  <Icon icon="fa6-solid:ellipsis-vertical" />
                </button>
                <ul class="dropdown-menu">
                  <li v-if="permissions.write"><a class="dropdown-item" href="#" data-bs-toggle="modal" @click="openAddRoleModal(role)" data-bs-target="#addRoleModal">{{ $t('Edit') }}</a></li>
                  <li v-if="permissions.delete">
                    <a class="dropdown-item" href="#" @click="deleteRole(role.slack)">{{ $t('Delete') }}</a>
                  </li>
                </ul>
              </div> -->
              <ActionButtonGroup  :permissions="permissions"  @delete="deleteRole" :slack="role.slack" @editModal="openAddRoleModal" :edit_modal_data="role" :edit_modal_target="'#addRoleModal'" />
            </td>
          </tr>

          <tr v-else>
            <td class="text-center py-3" colspan="8">{{ $t('No Data Found') }}</td>
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
            <Bootstrap5Pagination :data="pagination" :limit="5"  @pagination-change-page="getRoles" />
          </div>
        </div>
      </div>
    </div>

    <AsyncAddRole  :show_add_role_modal="show_add_role_modal" @closeAddRoleModal="closeAddRoleModal" :edit_data="edit_data" />

  </DefaultLayout>
</template>

<script setup>

import { ref , onMounted, reactive, watch, defineComponent, computed, defineAsyncComponent } from 'vue';
import { Bootstrap5Pagination } from 'laravel-vue-pagination';
import { useAuthStore } from '@/stores/auth';
import VueDatePicker from '@vuepic/vue-datepicker';
import useGlobalFunctions from '@/composables/global_functions.js';
import { useI18n } from 'vue-i18n'
const { t } = useI18n();
const { isAuthorized } = useGlobalFunctions();

const AsyncAddRole = defineAsyncComponent( () => import('@/components/role/AddRole.vue') );

const authStore = useAuthStore();

const show_add_role_modal = ref(false);

const edit_data = ref([]);

function openAddRoleModal(editData=''){
  edit_data.value = editData;
  show_add_role_modal.value = true;
}
function closeAddRoleModal(){
  show_add_role_modal.value = false;
  getRoles();
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
const search_placeholder = t("Search by name...")
const form = reactive({ ...initialState });

onMounted(() => {
  checkPermissions();
  getRoles()
});

watch(() =>
        form.search_query, _.debounce( () => {
      getRoles();
    },500),
);

const roles = ref([]);
const pagination = ref([]);
const show_filter = ref(false);

async function getRoles(page = 1){

  form.is_listing = true;

  await axios.get('/api/roles', { params : {
      page : page,
      paginate_limit : paginate_limit.value,
      search_query : form.search_query,
      filter : filter,
    } }).then( (response) => {

    roles.value = response.data.data;
    console.log('data =',response.data.data[0].role_menus_count.menu_count);
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
  await getRoles();
}

async function changeStatus(slack){

  var form_data = new FormData();
  form_data.append('slack',slack);

  await axios.post('/api/role/update_status', form_data).then( (response) => {

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

const initial_filter = reactive({
  dates : ref(),
  role_type : ref(""),
  status : ref(""),
  created_by : ref(""),
});
const filter = reactive({ ...initial_filter });
// var initial_filter = JSON.stringify(JSON.parse(JSON.stringify(filter)));
const show_clear_filter = ref(false);

async function filterList(){
  if(JSON.stringify(filter) != JSON.stringify(initial_filter)){
    show_clear_filter.value = true;
  }
  show_filter.value = false;
  await getRoles();
}

function viewRole(slack){
  router.push('/role/'+slack);
}

async function deleteRole(slack){

  var is_confirmed = false;

  await Swal.fire({
    title: t('Do you want to delete this role, It withdraw the permission from all users with this role?'),
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

    await axios.post('/api/role/delete',{
      slack : slack
    }).then( (response) => {

      if(response.data.status_code == 200) {

        toast.success(response.data.msg);
        getRoles();

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
        write : isAuthorized('A_WRITE_ROLE'),
        delete : isAuthorized('A_DELETE_ROLE'),
    };
}

</script>