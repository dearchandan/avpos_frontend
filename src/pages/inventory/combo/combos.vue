<template>
    <DefaultLayout>

        <template v-slot:subheader>
            <InventoryMenu />
        </template>
        <div class="content">
            <div class="page-heading">
                <div class="row align-items-center justify-content-between">
                    <div class="col-auto">
                        <div class="row align-items-center">
                            <div class="col-auto" v-if="permissions.write">
                                <router-link class="btn btn-sm btn-light-primary" to="/combos/add">+ {{ $t('New Combo') }}
                                </router-link>
                            </div>
                        </div>
                    </div>
                    <div class="col-auto">
                        <div class="row align-items-center">
                            <div class="col-auto">
                                <div class="form-field page-heading-search-field mb-0">
                                <div class="field-icon">
                                    <input type="search" class="form-control form-control-sm form-control-shadow"
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
                                    <!-- <div class="row gx-3">
                                        <div class="col-12">
                                        <div class="form-field">
                                            <label for="" class="form-label">Quotation Date</label>
                                            <VueDatePicker range v-model="filter.quotation_dates" :format="'dd-MM-yyyy'"
                                                        :enable-time-picker="false"/>
                                        </div>
                                        </div>
                                    </div> -->
                                    <!-- <div class="row gx-3">
                                        <div class="col-12">
                                        <div class="form-field">
                                            <label for="" class="form-label">Quotation Due Date</label>
                                            <VueDatePicker range v-model="filter.quotation_due_dates" :format="'dd-MM-yyyy'"
                                                        :enable-time-picker="false"/>
                                        </div>
                                        </div>
                                    </div> -->
                                    <!-- <div class="row gx-3">
                                        <div class="col-12">
                                        <VSelect
                                            name="customer"
                                            label="Customer"
                                            v-model="filter.customer"
                                            placeholder="--Select Customer--"
                                            :options="customers"
                                        />
                                        </div>
                                    </div> -->
                                    <div class="row gx-3">
                                        <div class="col-12">
                                        <div class="form-field">
                                            <label for="" class="form-label">{{ $t('Status') }}</label>
                                            <select class="form-control form-control-sm form-control-solid" v-model="filter.status">
                                            <option value="">{{ $t('All') }}</option>
                                            <option value="1">{{ $t('Active') }}</option>
                                            <option value="0">{{ $t('Inactive') }}</option>
                                            </select>
                                        </div>
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
                <div class="row py-3">
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
                            <th scope="col" width="5%">{{ $t('Image') }}</th>
                            <th scope="col" width="15%">{{ $t('Name') }}</th>
                            <th scope="col" width="10%">{{ $t('Price') }}</th>
                            <th scope="col" width="10%">{{ $t('Tax Amount') }} </th>
                            <th scope="col" width="10%">{{ $t('Total Amount') }}</th>
                            <!-- <th scope="col" width="10%">Updated At</th> -->
                            <th scope="col" width="5%">{{ $t('Active') }}</th>
                            <th scope="col" class="text-end" width="5%" v-if="permissions.write && permissions.delete">{{ $t('Action') }}</th>
                        </tr>
                    </thead>
                    <tbody> 
                        <tr v-if="combos != ''" v-for="(combo,combo_index) in combos" :key="combo_index" >
                            <td @click="viewCombo(combo.slack)" role="button"><img :src="combo.image" alt="" class="listing-image img img-thumbnail rounded-circle"></td>
                            <td @click="viewCombo(combo.slack)" role="button">
                                <div>
                                    <span class="fw-bold highlighted-list-item">{{  combo.name  }}</span>
                                </div>
                            </td>
                           
                            <td @click="viewCombo(combo.slack)" role="button">
                                {{ combo.price }}
                                    <!-- <span v-if="product.type == 1" >
                                    </span>
                                    <span v-else  >
                                        Recipe
                                    </span> -->
                            </td>
                            <td @click="viewCombo(combo.slack)" role="button">
                                {{ combo.tax_amount }}
                            </td>
                            <td @click="viewCombo(combo.slack)" role="button">
                                
                                {{ combo.amount }}
                                
                            </td>
                            
                            <td>
                                <div class="form-feild">
                                    <div class="form-check form-switch form-switch-2">
                                        <input class="form-check-input" type="checkbox" role="switch" id="Status_id" @change="changeStatus(combo.slack)" :checked="combo.status == 1">
                                    </div>
                                </div>
                            </td>
                            <td class="text-end" v-if="permissions.write && permissions.delete">
                                <div class="dropdown">
                                    <button class="btn btn-icon btn-sm btn-light dropdown-toggle arrow-none" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        <Icon icon="fa6-solid:ellipsis-vertical" />
                                    </button>
                                    <ul class="dropdown-menu">
                                        <li v-if="permissions.write"><a class="dropdown-item" href="#" @click="editCombo(combo.slack)">{{ $t('Edit') }}</a></li>
                                        <li v-if="permissions.delete"><a class="dropdown-item" href="javascript:void(0);" @click="deleteCombo(combo.slack)">{{ $t('Delete') }}</a></li>
                                    </ul>
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
                        <Bootstrap5Pagination :data="pagination" :limit="5"  @pagination-change-page="getCombos" />
                    </div>
                </div>
            </div>

        </div>
    </DefaultLayout>
</template>

<script setup>
import { ref , onMounted, reactive, watch, defineComponent, computed } from 'vue';
import { Bootstrap5Pagination } from 'laravel-vue-pagination';
import BeatLoader from 'vue-spinner/src/BeatLoader.vue'
import useGlobalFunctions from '@/composables/global_functions.js';
import { useI18n } from 'vue-i18n'

const { t } = useI18n();
const { isAuthorized } = useGlobalFunctions();

const initialState = {
    server_messages: {
    type: "",
    messages: "",
    },
    is_listing: false,

    // form data   
    search_query : ref("")
};
const search_placeholder = t("Search by name, price, total amount..")
const form = reactive({ ...initialState });

onMounted(() => {
    
    checkPermissions();

    getCombos()

});

watch(() => 
    form.search_query, _.debounce( () => {
            getCombos();
    },500),
);

const combos = ref([]);
const pagination = ref([]);

async function getCombos(page = 1){

    form.is_listing = true;

    await axios.get('/api/combos', { params : {
            page : page,
            paginate_limit : paginate_limit.value,
            search_query : form.search_query,
            filter: filter,
        } }).then( (response) => {
            
        combos.value = response.data.data;
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
    await getCombos();
}

async function changeStatus(slack){
    
    var form_data = new FormData();
    form_data.append('slack',slack);

    await axios.post('/api/combo/update_status', form_data).then( (response) => {

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

async function deleteCombo(slack) {

  var is_confirmed = false;

  await Swal.fire({
    title: t('Do you want to delete this combo?'),
    showCancelButton: true,
    confirmButtonText: t('Yes, Delete'),
    confirmButtonColor: '#d33',
    cancelButtonText: t('Cancel'),
  }).then((result) => {
    if (result.isConfirmed) {
      is_confirmed = true;
    }
  });

  if (is_confirmed) {

    await axios.post('/api/combo/delete', {
      slack: slack
    }).then((response) => {

      if (response.data.status_code == 200) {

        toast.success(response.data.msg);
        getCombos();

      } else {
        try {
          form.server_messages.type = "error";
          form.server_messages.messages = JSON.parse(response.data.msg);
        } catch (err) {
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

function viewCombo(slack) {
  router.push('/combo/' + slack);
}
function editCombo(slack)
{
    router.push('/combos/edit/' + slack);
}

const show_filter = ref(false);
const initial_filter = reactive({
  status: ref(""),
});
const filter = reactive({...initial_filter});
const show_clear_filter = ref(false);

async function fetchFilterData() {
  show_filter.value = !show_filter.value;
}

async function filterList() {
  if (JSON.stringify(filter) != JSON.stringify(initial_filter)) {
    show_clear_filter.value = true;
  }
  show_filter.value = false;
  await getCombos();
}
function clearFilter() {
  Object.assign(filter, initial_filter);
  show_clear_filter.value = false;
  getCombos();
}


/* Checking permissions */
const permissions = ref({
    write : false,
    delete : false,
});

function checkPermissions(){
    permissions.value  = {
        write : isAuthorized('A_WRITE_COMBO'),
        delete : isAuthorized('A_DELETE_COMBO'),
    };
}

</script>