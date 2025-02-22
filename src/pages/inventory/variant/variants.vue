<template>
    <DefaultLayout>

        <template v-slot:subheader>
            <InventoryMenu />
        </template>
        
        <div class="content">
            <div class="page-heading">

                <div class="row align-items-center justify-content-between mb-3">
                    <div class="col-auto">
                        <h2 class="mb-md-0">{{ $t('Variants') }}</h2>
                    </div>
                    <div class="col-md-auto">
                        <div class="row align-items-center justify-content-between">
                            <div class="col col-md-auto">
                                <div class="form-field mb-0">
                                    <div class="field-icon">
                                        <input type="search" class="form-control form-control-sm form-control-shadow" :placeholder="search_placeholder" v-model="form.search_query">
                                        <div class="icon"><Icon icon="fa6-solid:magnifying-glass" /></div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-auto" v-if="permissions.write">
                                <a href="#" class="btn btn-sm btn-light-primary2" data-bs-toggle="modal" @click="openAddVariantModal()" data-bs-target="#addVariantModal">+ {{ $t('New Variant') }}</a>
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
                            <th scope="col" width="20%">{{ $t("Name") }}</th>
                            <th scope="col" width="25%">{{ $t("Name (Arabic)") }}</th>
                            <th scope="col" width="10%">{{ $t("Created At") }}</th>
                            <th scope="col" class="text-end" width="10%">{{ $t("Action") }}</th>
                        </tr>
                    </thead>
                    <tbody> 
                        <tr v-if="variants != ''" v-for="(variant,variant_index) in variants" :key="variant_index" >
                            <td>
                                <div>
                                    <span class="fw-bold highlighted-list-item">{{  variant.name  }}</span>
                                </div>
                            </td>
                            <td>
                                <div>
                                    <span class="fw-bold highlighted-list-item">{{  variant.name_ar  }}</span>
                                </div>
                            </td>
                            <td>{{ variant.created_at_label }}</td>
                            <td class="text-end">
                                <!-- <div class="dropdown">
                                    <button class="btn btn-icon btn-sm btn-light dropdown-toggle arrow-none" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        <Icon icon="fa6-solid:ellipsis-vertical" />
                                    </button>
                                    <ul class="dropdown-menu">
                                        <li><a class="dropdown-item" href="#" data-bs-toggle="modal" @click="openAddVariantModal(variant)" data-bs-target="#addVariantModal">{{ $t('Edit') }}</a></li>
                                        <li>
                                            <a class="dropdown-item" href="#" @click="deleteVariant(variant.slack)">{{ $t('Delete') }}</a>
                                        </li>
                                    </ul>
                                </div> -->
                                <ActionButtonGroup :permissions="permissions"  @delete="deleteVariant" @editModal="openAddVariantModal" :slack="variant.slack" :edit_modal_data="variant" :edit_modal_target="'#addVariantModal'" />
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
                        <Bootstrap5Pagination :data="pagination" :limit="5"  @pagination-change-page="getVariants" />
                    </div>
                </div>
            </div>
        </div>
        
        <AsyncAddVariant :show_add_variant_modal="show_add_variant_modal" @closeAddVariantModal="closeAddVariantModal" :edit_data="edit_data" />
        
    </DefaultLayout>
</template>

<script setup>

import { ref , onMounted, reactive, watch, defineAsyncComponent } from 'vue';
import { Bootstrap5Pagination } from 'laravel-vue-pagination';
import { useI18n } from 'vue-i18n'
import useGlobalFunctions from '@/composables/global_functions.js';

const { isAuthorized } = useGlobalFunctions();
const { t } = useI18n();
const AsyncAddVariant = defineAsyncComponent( () => import('@/components/variant/AddVariant.vue') );

const show_add_variant_modal = ref(false);

const edit_data = ref([]);

function openAddVariantModal(editdata = ''){
    edit_data.value = editdata;
    show_add_variant_modal.value = true; 
}
function closeAddVariantModal(){
    show_add_variant_modal.value = false;
    getVariants(); 
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
const search_placeholder = t("search by name, name(arabic)...")
const form = reactive({ ...initialState });

onMounted(() => {
    getVariants()
    checkPermissions();
});

watch(() => 
    form.search_query, _.debounce( () => {
        getVariants();
    },300),
);
/* Checking permissions */
const permissions = ref({
    write : false,
    delete : false,
});

function checkPermissions(){
    permissions.value  = {
        write : isAuthorized('A_WRITE_PRODUCT'),
        delete : isAuthorized('A_DELETE_PRODUCT'),
    };
}
/* LIST */

const variants = ref([]);
const pagination = ref([]);

async function getVariants(page = 1){

    form.is_listing = true;

    await axios.get('/api/variants', { params : {
            page : page,
            paginate_limit : paginate_limit.value,
            search_query : form.search_query,
        } }).then( (response) => {
            
        variants.value = response.data.data;
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
    await getVariants();
}

/* VIEW */

async function deleteVariant(slack){

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

        await axios.post('/api/variant/delete',{
            slack : slack
        }).then( (response) => {
            
        if(response.data.status_code == 200) {
            
            toast.success(response.data.msg);
            getVariants();

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

function viewVariant(slack){
    router.push('/variant/'+slack);
}

</script>