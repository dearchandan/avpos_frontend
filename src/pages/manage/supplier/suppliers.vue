<template>
    <DefaultLayout>

        <template v-slot:subheader>
            <ManageMenu />
        </template>
        
        <div class="content">
            <div class="page-heading">

              <div class="row align-items-center justify-content-between mb-3">
                <div class="col-auto">
                    <h2 class="mb-0">{{ $t('Suppliers') }}</h2>
                </div>
                <div class="col-auto" v-if="permissions.write">
                  <router-link class="btn btn-sm btn-light-primary2" to="/supplier/add" >+ {{ $t('New Supplier') }}</router-link>
                </div>
              </div>
        
              <div class="row align-items-end justify-content-between mb-3">
                  <div class="col-md-auto">
                    <div class="row align-items-end justify-content-between g-3">
                        <div class="col-12 col-md-auto">
                          <div class="form-field">
                            <label>{{ $t('Created Date') }}</label>
                            <VueDatePicker range v-model="filter.created_date" :format="'dd-MM-yyyy'" :enable-time-picker="false" @update:model-value="filterList()" input-class-name="form-control form-control-solid form-control-sm"/>
                          </div>
                        </div>
                        <div class="col col-md-auto">
                          <div class="form-field">
                            <label>{{ $t('Status') }}</label>
                            <select class="form-control form-control-sm form-control-solid" v-model="filter.status" @change="filterList">
                              <option value="">{{ $t('All') }}</option>
                              <option value="1">{{ $t('Active') }}</option>
                              <option value="0">{{ $t('Inactive') }}</option>
                            </select>
                            
                          </div>
                        </div>
                        <div class="col col-md-auto">
                          <VSelect
                              name="country"
                              label="Country"
                              v-model="filter.country"
                              placeholder="All"
                              :options="countries"
                                  :height_sm="true"
                          />
                        </div>
                        <div class="col-auto col-md-auto" >
                            <button class="btn btn-sm btn-light-danger" v-if="show_clear_filter" @click="clearFilter"> {{ $t('Clear') }} </button>
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
            <div v-if="form.is_listing">
              <ListingSkeleton />
            </div>
            <div v-else class="table-responsive">
                <table class="table table-list-data table-hover">
                    <thead class="bg-light">
                        <tr>
                            <th scope="col" width="20%">{{ $t('Supplier Name') }}</th>
                            <th scope="col" width="15%">{{ $t('Email') }}</th>
                            <th scope="col" width="10%">{{ $t('Phone') }}</th>
                            <th scope="col" width="10%">{{ $t('VAT') }}</th>
                            <th scope="col" width="10%">{{ $t('GST Number') }}</th>
                            <th scope="col" width="10%">{{ $t('Created At') }}</th>
                            <th scope="col" width="10%">{{ $t('Active') }}</th>
                            <th scope="col" class="text-end" width="5%" v-if="permissions.write || permissions.delete">{{ $t('Action') }}</th>
                        </tr>
                    </thead>
                    <tbody> 
                        <tr v-if="suppliers != ''" v-for="(supplier,branch_index) in suppliers" :key="branch_index" >
                            <td @click="viewSupplier(supplier.slack)" role="button">
                                <div>
                                    <span class="fw-bold highlighted-list-item">{{  supplier.name  }}</span>
                                    <br>
                                    <small class="text-muted">Code: {{ supplier.code }}</small>
                                </div>
                            </td>
                            <td @click="viewSupplier(supplier.slack)" role="button">{{ supplier.email }}</td>
                            <td @click="viewSupplier(supplier.slack)" role="button">{{ supplier.phone }}</td>
                            <td @click="viewSupplier(supplier.slack)" role="button">{{ supplier.vat_number }}</td>
                            <td @click="viewSupplier(supplier.slack)" role="button"> {{ supplier.gst_number }} </td>
                            <td @click="viewSupplier(supplier.slack)" role="button">{{ supplier.created_at_label }}</td>
                            <td>
                                <div class="form-feild">
                                    <div class="form-check form-switch form-switch-2">
                                        <input class="form-check-input" type="checkbox" role="switch" id="Status_id" @change="changeStatus(supplier.slack)" :checked="supplier.status == 1">
                                    </div>
                                </div>
                            </td>
                            <td class="text-end" v-if="permissions.write || permissions.delete">
                                <ActionButtonGroup :permissions="permissions" @edit="editSupplier" @delete="deleteSupplier" :slack="supplier.slack" />
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
                        <Bootstrap5Pagination :data="pagination" :limit="5"  @pagination-change-page="getSuppliers" />
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
import ManageMenu from '@/components/common/ManageMenu.vue'
import useGlobalFunctions from '@/composables/global_functions.js';
import { useI18n } from 'vue-i18n'

const { t } = useI18n();
const { isAuthorized } = useGlobalFunctions();

const authStore = useAuthStore();



const show_add_branch_modal = ref(false);

function openAddSupplierModal(){
    show_add_branch_modal.value = true; 
}
function closeAddSupplierModal(){
    show_add_branch_modal.value = false;
    getSuppliers();
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
const search_placeholder = t("Search by name, email, phone..")
const form = reactive({ ...initialState });

onMounted(() => {
  checkPermissions();
  getSuppliers()
  getCountries()
});

watch(() => 
    form.search_query, _.debounce( () => {
            getSuppliers();
    },500),
);

const suppliers = ref([]);
const pagination = ref([]);

async function getSuppliers(page = 1){

    form.is_listing = true;

    await axios.get('/api/v2/suppliers', { params : {
            page : page,
            paginate_limit : paginate_limit.value,
            search_query : form.search_query,
            filter: filter,
        } }).then( (response) => {
            
        suppliers.value = response.data.data;
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
    await getSuppliers();
}

const countries = ref([]);
async function getCountries(){
  countries.value = [];
  let country_data = await axios.get('api/v2/countries/all');
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

    await axios.post('/api/supplier/update_status', form_data).then( (response) => {

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
});
const filter = reactive({...initial_filter});

watch(() => 
    filter.country, (value) => {
      filterList();
    },
);

const show_clear_filter = ref(false);

async function filterList() {
  if (JSON.stringify(filter) != JSON.stringify(initial_filter)) {
    show_clear_filter.value = true;
  }
  show_filter.value = false;
  await getSuppliers();
}

async function fetchFilterData() {
  show_filter.value = !show_filter.value;
}

function clearFilter() {
  Object.assign(filter, initial_filter);
  show_clear_filter.value = false;
  getSuppliers();
}
//End filter code

function viewSupplier(slack){
    router.push('/supplier/'+slack);
}
function editSupplier(slack)
{
  router.push('/supplier/edit/'+slack);
}

async function deleteSupplier(slack){

  var is_confirmed = false;

  await Swal.fire({
    title: t('Do you want to delete this Supplier?'),
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

    await axios.post('/api/supplier/delete',{
      slack : slack
    }).then( (response) => {

      if(response.data.status_code == 200) {

        Swal.fire(response.data.msg);
        getSuppliers();

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
        write : isAuthorized('A_WRITE_SUPPLIER'),
        delete : isAuthorized('A_DELETE_SUPPLIER'),
    };
}

</script>