<template>
    <DefaultLayout>

        <template v-slot:subheader>
            <InventoryMenu />
        </template>

        <div class="content">
            <div class="page-heading">

                <div class="row align-items-center justify-content-between mb-3">
                    <div class="col-auto">
                        <h2 class="mb-0">{{ $t('Discounts') }}</h2>
                    </div>
                    <div class="col-auto col-md-auto">
                        <div class="row align-items-center justify-content-between">
                            <div class="col col-md-auto">
                                <div class="form-field page-heading-search-field mb-0">
                                    <div class="field-icon">
                                        <input type="search" class="form-control form-control-sm form-control-solid" :placeholder="search_placeholder" v-model="form.search_query">
                                        <div class="icon"><Icon icon="fa6-solid:magnifying-glass" /></div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-auto" v-if="permissions.write">
                                <router-link class="btn btn-sm btn-light-primary2" to="/discount/add" >+ {{ $t('New Discount') }}</router-link>
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
                            <th scope="col" width="10%">{{ $t('Discount') }}</th>
                            <th scope="col" width="10%">{{ $t('Value') }}</th>
                            <th scope="col" width="10%">{{ $t('Branches') }}</th>
                            <th scope="col" width="10%">{{ $t('Applies To') }}</th>
                            <!-- <th scope="col" width="10%">Inventory</th> -->
                            <!-- <th scope="col" width="10%">{{ $t('Min. Order Amt.') }}</th> -->
                            <!-- <th scope="col" width="10%">{{ $t('Max. Discount Amt.') }}</th> -->
                            <th scope="col" width="10%">{{ $t('Remaining Qty.') }}.</th>
                            <th scope="col" width="10%">{{ $t('Created At') }}</th>
                            <th scope="col" width="10%">{{ $t('Active') }}</th>
                            <th scope="col" class="text-end" width="5%" v-if="permissions.write || permissions.delete">{{ $t('Action') }}</th>
                        </tr>
                    </thead>
                    <tbody> 
                        <tr v-if="discounts != ''" v-for="(discount,discount_index) in discounts" :key="discount_index"  >
                            <td @click="viewDiscount(discount.slack)" role="button" :class=" { 'border-start border-5 border-success' : discount.is_running } ">
                                <div :class=" { 'text-success' : discount.is_running } ">
                                    <span class="fw-bold highlighted-list-item">{{  discount.name  }}</span>
                                    <span v-if="discount.name_ar != ''">
                                        <br>
                                        <small class="text-muted">{{ discount.name_ar }}</small>
                                    </span>
                                </div>
                            </td>
                            <td @click="viewDiscount(discount.slack)" role="button">{{ discount.value }} {{ discount.type_text }} </td>
                            <td @click="viewDiscount(discount.slack)" role="button">
                                <span v-if="discount.branches_count == 0" class="text-success"> {{ $t('All Branches') }} </span>
                                <span href="#" v-else> {{ discount.branches_count  }} <span v-if="discount.branches_count > 1">{{ $t('Branches') }}</span> <span v-else>{{ $t('Branch') }}</span> </span>
                            </td>
                            <td @click="viewDiscount(discount.slack)" role="button">
                                <span class="text-warning" v-if="discount.applies_to == 1">{{ discount.inventory_type_text }}</span>
                                <span class="text-success" v-if="discount.applies_to == 2">{{ $t('Order') }}</span>
                            </td>
                            <!-- <td @click="viewDiscount(discount.slack)" role="button">{{ discount.minimum_order_amount }}</td> -->
                            <!-- <td @click="viewDiscount(discount.slack)" role="button">{{ discount.maximum_discount_amount }}</td> -->
                            <td @click="viewDiscount(discount.slack)" role="button">{{ discount.remaining_discount_quantity }}</td>
                            <td @click="viewDiscount(discount.slack)" role="button">{{ discount.created_at_label }}</td>
                            <td>
                                <div class="form-feild">
                                    <div class="form-check form-switch form-switch-2">
                                        <input class="form-check-input" type="checkbox" role="switch" id="Status_id" @change="changeStatus(discount.slack)" :checked="discount.status == 1">
                                    </div>
                                </div>
                            </td>
                            <td class="text-end" v-if="permissions.write || permissions.delete">
                                <ActionButtonGroup :permissions="permissions" @edit="editDiscount" @delete="deleteDiscount" :slack="discount.slack" />
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
                        <Bootstrap5Pagination :data="pagination" :limit="5"  @pagination-change-page="getDiscounts" />
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
import { useI18n } from 'vue-i18n'
import useGlobalFunctions from '@/composables/global_functions.js';
const { isAuthorized } = useGlobalFunctions();

const { t } = useI18n();
const authStore = useAuthStore();



const show_add_discount_modal = ref(false);

function openAddDiscountModal(){
    show_add_discount_modal.value = true; 
}
function closeAddDiscountModal(){
    show_add_discount_modal.value = false;
    getDiscounts(); 
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
const search_placeholder = t("Search by name or value")
const form = reactive({ ...initialState });

onMounted(() => {
    checkPermissions();
    getDiscounts()
});

watch(() => 
    form.search_query, _.debounce( () => {
            getDiscounts();
    },500),
);

const discounts = ref([]);
const pagination = ref([]);

async function getDiscounts(page = 1){

    form.is_listing = true;

    await axios.get('/api/v2/discounts', { params : {
            page : page,
            paginate_limit : paginate_limit.value,
            search_query : form.search_query,
        } }).then( (response) => {
            
        discounts.value = response.data.data;
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
    await getDiscounts();
}

async function changeStatus(slack){
    
    var form_data = new FormData();
    form_data.append('slack',slack);

    await axios.post('/api/discount/update_status', form_data).then( (response) => {

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

function viewDiscount(slack){
    router.push('/discount/'+slack);
}

function editDiscount(slack)
{
    router.push('/discount/edit/'+slack);
}

async function deleteDiscount(slack){

    var is_confirmed = false;

    await Swal.fire({
        title: t('Do you want to delete this item?'),
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

        await axios.post('/api/discount/delete',{
            slack : slack
        }).then( (response) => {
            
        if(response.data.status_code == 200) {
            
            toast.success(response.data.msg);
            getDiscounts();

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
        write : isAuthorized('A_WRITE_DISCOUNT'),
        delete : isAuthorized('A_DELETE_DISCOUNT'),
    };
}

</script>