<template>
    <DefaultLayout>

        <template v-slot:subheader>
            <InventoryMenu />
        </template>
        
        <div class="content">
            <div class="page-heading">

                <div class="row align-items-center justify-content-between mb-3">
                    <div class="col-auto">
                        <h2 class="mb-md-0">{{ $t('Modifiers') }}</h2>
                    </div>
                    <div class="col-md-auto">
                        <div class="row align-items-center justify-content-between">
                            <div class="col col-md-auto">
                                <div class="form-field mb-0">
                                    <div class="field-icon">
                                        <input type="search" class="form-control form-control-sm form-control-solid" :placeholder="search_placeholder" v-model="form.search_query">
                                        <div class="icon"><Icon icon="fa6-solid:magnifying-glass" /></div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-auto" v-if="permissions.write">
                                <a href="#" class="btn btn-sm btn-light-primary2" data-bs-toggle="modal" @click="openAddModifierModal()" data-bs-target="#addModifierModal">+ {{ $t('New Modifier') }}</a>
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
                            <th scope="col" width="90%">{{ $t('Name') }}</th>
                            <th scope="col" class="text-end" width="10%" v-if="permissions.write || permissions.delete">{{ $t('Action') }}</th>
                        </tr>
                    </thead>
                    <tbody> 
                        <tr v-if="modifiers != ''" v-for="(modifier,modifier_index) in modifiers" :key="modifier_index" >
                            <td  role="button" @click="viewModifier(modifier.slack)">
                                <div>
                                    <span class="fw-bold highlighted-list-item">{{  modifier.name  }}</span> 
                                    <!-- <small class="text-primary" v-if="modifier.options.length > 0"> <br> has {{  modifier.options.length  }} options(s) <span v-if="modifier.allow_multiple_selections == 1">with multiple selections</span>   </small> -->
                                </div>
                                <div v-if="modifier.name_ar != null">
                                    {{  modifier.name_ar  }}
                                </div>
                                
                            </td>
                            <td class="text-end" v-if="permissions.write || permissions.delete">
                                <!-- <div class="dropdown">
                                    <button class="btn btn-icon btn-sm btn-light dropdown-toggle arrow-none" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        <Icon icon="fa6-solid:ellipsis-vertical" />
                                    </button>
                                    <ul class="dropdown-menu">
                                        <li v-if="permissions.write"><a class="dropdown-item" href="#" data-bs-toggle="modal" @click="openAddModifierModal(modifier)" data-bs-target="#addModifierModal">{{ $t('Edit') }}</a></li>
                                        <li v-if="permissions.delete">
                                            <a class="dropdown-item" href="#" @click="deleteModifier(modifier.slack)">{{ $t('Delete') }}</a>
                                        </li>
                                    </ul>
                                </div> -->
                                 <ActionButtonGroup :permissions="permissions"  @delete="deleteModifier" @editModal="openAddModifierModal" :slack="modifier.slack" :edit_modal_data="modifier" :edit_modal_target="'#addModifierModal'" />
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
                        <Bootstrap5Pagination :data="pagination" :limit="5"  @pagination-change-page="getModifiers" />
                    </div>
                </div>
            </div>
        </div>
        
        <AsyncAddModifier :show_add_modifier_modal="show_add_modifier_modal" @closeAddModifierModal="closeAddModifierModal" :edit_data="edit_data" />
        
    </DefaultLayout>
</template>

<script setup>

import { ref , onMounted, reactive, watch, defineAsyncComponent } from 'vue';
import { Bootstrap5Pagination } from 'laravel-vue-pagination';
import useGlobalFunctions from '@/composables/global_functions.js';
import { useI18n } from 'vue-i18n'
const { t } = useI18n();
const { isAuthorized } = useGlobalFunctions();


const show_add_modifier_modal = ref(false);
const edit_data = ref([]);

function openAddModifierModal(editdata = ''){
    edit_data.value = editdata;
    show_add_modifier_modal.value = true; 
}
function closeAddModifierModal(){
    show_add_modifier_modal.value = false;
    getModifiers(); 
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
const search_placeholder = t("search by name")
const form = reactive({ ...initialState });

onMounted(() => {

    checkPermissions();

    getModifiers()

});

watch(() => 
    form.search_query, _.debounce( () => {
        getModifiers();
    },300),
);

/* LIST */

const modifiers = ref([]);
const pagination = ref([]);

async function getModifiers(page = 1){

    form.is_listing = true;

    await axios.get('/api/modifiers', { params : {
            page : page,
            paginate_limit : paginate_limit.value,
            search_query : form.search_query,
        } }).then( (response) => {
            
        modifiers.value = response.data.data;
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
    await getModifiers();
}

/* VIEW */

async function deleteModifier(slack){

    var is_confirmed = false;

    await Swal.fire({
        title: t('Do you want to delete this item?'),
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

        await axios.post('/api/modifier/delete',{
            slack : slack
        }).then( (response) => {
            
        if(response.data.status_code == 200) {
            
            toast.success(response.data.msg);
            getModifiers();

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

function viewModifier(slack){
    router.push('/modifier/'+slack);
}


/* Checking permissions */
const permissions = ref({
    write : false,
    delete : false,
});

function checkPermissions(){
    permissions.value  = {
        write : isAuthorized('A_WRITE_MODIFIER'),
        delete : isAuthorized('A_DELETE_MODIFIER'),
    };
}


const AsyncAddModifier = defineAsyncComponent( () => import('@/components/modifier/AddModifier.vue') );

</script>