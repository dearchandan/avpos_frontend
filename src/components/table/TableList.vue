<template>
    <div>
        
        <h5 class="pb-2">{{ $t('Tables') }}</h5>

            <div class="form-field page-heading-search-field">
                <div class="field-icon">
                    <input type="search" class="form-control form-control-solid" :placeholder="search_placeholder" v-model="form.search_query">
                    <div class="icon"><Icon icon="fa6-solid:magnifying-glass" /></div>
                </div>
            </div>
        <ListingSkeleton v-if="form.is_listing" />
        <div v-else class="table-responsive">
            
            <table class="table table-list-data table-hover">
                <thead class="bg-light">
                    <tr>
                        <th scope="col" width="15%">{{ $t('Table') }}</th>
                        <!-- <th scope="col" width="15%">Type</th> -->
                        <th scope="col" width="10%">{{ $t('Area') }}</th>
                        <th scope="col" width="10%">{{ $t('Capacity') }}</th>
                        <!-- <th scope="col" width="5%">{{ $t('Is Occupied') }}</th> -->
                        <th scope="col" class="text-end" width="10%" v-if="permissions.write || permissions.delete">{{ $t('Action') }}</th>
                    </tr>
                </thead>
                <tbody> 
                    <tr v-if="tables != ''" v-for="(table,table_index) in tables" :key="table_index" >
                        <td>
                            <div>
                                <span class="highlighted-list-item">{{  table.name!=null?table.name:''  }}</span>
                            </div>
                        </td>
                        <!-- <td>
                            <span v-if="table.type == 1"><Icon icon="cil:rectangle" :style="{ fontSize: '28px' }" /></span>
                            <span v-if="table.type == 2"><Icon icon="cil:circle" :style="{ fontSize: '28px' }" /></span>
                        </td> -->
                        <td>{{ table.dinein_area!=null?table.dinein_area.name:'' }}</td>
                        <td> <strong>{{ table.table_capacity }}</strong>  Persons</td>
                   
                        <!-- <td>
                            <div class="form-feild">
                                <div class="form-check form-switch form-switch-2">
                                    <input class="form-check-input" type="checkbox" role="switch" id="Status_id" @change="changeStatus(table.slack)" :checked="table.status"> 
                                </div>
                            </div>
                        </td> -->
                        <td class="text-end" v-if="permissions.write || permissions.delete">
                            <!-- <div class="dropdown">
                                <button class="btn btn-icon btn-sm btn-light dropdown-toggle arrow-none" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    <Icon icon="fa6-solid:ellipsis-vertical" />
                                </button>
                                <ul class="dropdown-menu">
                                    <li v-if="permissions.write">
                                        <a class="dropdown-item" href="#" @click="openTableAreaModal(table)">{{ $t('Edit') }}</a>
                                    </li>
                                    <li v-if="permissions.delete">
                                        <a class="dropdown-item" href="#" @click="deleteTable(table.slack)">{{ $t('Delete') }}</a>
                                    </li>
                                </ul>
                            </div> -->
                            <ActionButtonGroup  :permissions="permissions" :slack="table.slack" @delete="deleteTable"  @editModal="openTableAreaModal" :edit_modal_data="table" />
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
                    <Bootstrap5Pagination :data="pagination" :limit="5"  @pagination-change-page="getTables" />
                </div>
            </div>
        </div>
    </div>

    <AsyncAddTableForm @closeAddTableModal="getTables" @closeModal="closeModal" :edit_table_data="edit_table_data" :dinein_areas="dinein_areas" />

</template>

<script setup>


import { Bootstrap5Pagination } from 'laravel-vue-pagination';
import { useAuthStore } from '@/stores/auth';
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
const search_placeholder = t("search tables by name, capacity")
const form = reactive({ ...initialState });
const edit_table_data = ref([]);
const props = defineProps(['dinein_areas']); 
const dinein_areas = ref([]);
onMounted(() => {
    checkPermissions();
    getTables()
});

watch(() => 
    form.search_query, _.debounce( () => {
            getTables();
    },500),
);
watchEffect(() => {
     if(props.dinein_areas != undefined){
        dinein_areas.value = props.dinein_areas;
    }
});

const tables = ref([]);
const pagination = ref([]);

async function getTables(page = 1){

    form.is_listing = true;

    await axios.get('/api/v2/tables', { params : {
            page : page,
            paginate_limit : paginate_limit.value,
            search_query : form.search_query,
        } }).then( (response) => {
            
        tables.value = response.data.data;
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
    await getTables();
}

async function changeStatus(slack){
    
    var form_data = new FormData();
    form_data.append('slack',slack);

    await axios.post('/api/table/update_status', form_data).then( (response) => {

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


async function deleteTable(slack){

    var is_confirmed = false;

    await Swal.fire({
        title: t("Do you want to delete this item?"),
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

        await axios.post('/api/table/delete',{
            slack : slack
        }).then( (response) => {
            
        if(response.data.status_code == 200) {
            
            toast.success(response.data.msg);
            getTables();

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

function openTableAreaModal(editdata = ""){
    edit_table_data.value = editdata;
    //show_add_category_modal.value = true;
    $('#addTableModal').modal('show'); 
}
const AsyncAddTableForm = defineAsyncComponent( () => import('@/components/table/AddTableForm.vue') );


/* Checking permissions */
const permissions = ref({
    write : false,
    delete : false,
});

function checkPermissions(){
    permissions.value  = {
        write : isAuthorized('A_WRITE_TABLE'),
        delete : isAuthorized('A_DELETE_TABLE'),
    };
}

function closeModal(){
     edit_table_data.value =  [];
}
</script>