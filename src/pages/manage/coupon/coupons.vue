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
                                <router-link class="btn btn-sm btn-light-primary" to="/coupon/add" >+ {{ $t("New Coupon") }}</router-link>
                            </div>
                        </div>
                    </div>
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
                                        <input type="text" class="form-control form-control-sm form-control-shadow" :placeholder="search_placeholder" v-model="form.search_query">
                                        <div class="icon"><Icon icon="fa6-solid:magnifying-glass" /></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                    </div>
                </div>
            </div>
            <div v-if="form.is_listing">
               <beat-loader color="gray" :size="'15px'" class="pt-2 pe-2">  </beat-loader>
            </div>
            <div v-else class="table-responsive">
                <table class="table table-list-data table-hover">
                    <thead class="bg-light">
                        <tr >
                            <th scope="col" width="10%">{{ $t("Coupon") }}</th>
                            <th scope="col" width="10%">{{ $t("Amount/Percentage") }}</th>
                            <th scope="col" width="10%">{{ $t("Branches") }}</th>
                            <th scope="col" width="10%">{{ $t("Available Qty.") }}</th>
                            <th scope="col" width="10%">{{ $t("Customer Type") }}</th>
                            <th scope="col" width="10%">{{ $t("Ends At") }}</th>
                            <th scope="col" width="10%">{{ $t("Status") }}</th>
                            <th scope="col" width="10%">{{ $t("Created At") }}</th>
                            <th scope="col" width="10%">{{ $t("Active") }}</th>
                            <th scope="col" class="text-end" width="5%" v-if="permissions.write || permissions.delete">{{ $t("Action") }}</th>
                        </tr>
                    </thead>
                    <tbody> 
                        <tr v-if="coupons != ''" v-for="(coupon,coupon_index) in coupons" :key="coupon_index"  >
                            <td @click="viewCoupon(coupon.slack)" role="button" :class="{ 'text-muted' : coupon.stage == 'Expired'  }">
                                <div>
                                    <span class="fw-bold highlighted-list-item">{{  coupon.name  }}</span>
                                    
                                    <span v-if="coupon.name_ar != ''">
                                        <br>
                                        <small class="text-muted">{{ coupon.name_ar }}</small>
                                    </span>
                                </div>
                            </td>
                            <td @click="viewCoupon(coupon.slack)" role="button" :class="{ 'text-muted' : coupon.stage == 'Expired'  }">{{ coupon.value }} {{ coupon.type_text }} </td>
                            <td @click="viewCoupon(coupon.slack)" role="button" :class="{ 'text-muted' : coupon.stage == 'Expired'  }">
                                <span v-if="coupon.branches_count == 0"> {{ $t("All Branches") }} </span>
                                <span href="#" v-else> {{ coupon.branches_count  }} <span v-if="coupon.branches_count > 1">{{ $t("Branches") }}</span> <span v-else>{{ $t("Branch") }}</span>  </span>
                            </td>
                            <td @click="viewCoupon(coupon.slack)" role="button" :class="{ 'text-muted' : coupon.stage == 'Expired'  }">{{ coupon.available_quantity }}</td>
                            <td @click="viewCoupon(coupon.slack)" role="button" :class="{ 'text-muted' : coupon.stage == 'Expired'  }">{{ coupon.customer_type_text }}</td>
                            <td @click="viewCoupon(coupon.slack)" role="button" :class="{ 'text-muted' : coupon.stage == 'Expired'  }">{{ coupon.end_datetime_label }}</td>
                            <td @click="viewCoupon(coupon.slack)" role="button" :class="{ 'text-muted' : coupon.stage == 'Expired'  }"> <CouponStage :stage="coupon.stage" /> </td>
                            <td @click="viewCoupon(coupon.slack)" role="button" :class="{ 'text-muted' : coupon.stage == 'Expired'  }">{{ coupon.created_at_label }}</td>
                            <td>
                                <div class="form-feild " >
                                    <div class="form-check form-switch form-switch-2 ">
                                        <input class="form-check-input" :class="{ 'disabled-switch' : coupon.stage == 'Expired' }" type="checkbox" role="switch" id="Status_id" @change="changeStatus(coupon.slack)" :checked="coupon.status == 1">
                                    </div>
                                </div>
                            </td>
                            <td class="text-end" v-if="permissions.write || permissions.delete">                    
                                <ActionButtonGroup :permissions="permissions" @edit="editCoupon" @delete="deleteCoupon" :slack="coupon.slack" />
                            </td>
                        </tr>
                        <tr v-else>
                            <td class="text-center py-3" colspan="11">{{ $t("No Data Found") }}</td>
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
                        <Bootstrap5Pagination :data="pagination" :limit="5"  @pagination-change-page="getCoupons" />
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



const show_add_coupon_modal = ref(false);

function openAddCouponModal(){
    show_add_coupon_modal.value = true; 
}
function closeAddCouponModal(){
    show_add_coupon_modal.value = false;
    getCoupons(); 
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
const search_placeholder = t("Search by name, email, code..")
const form = reactive({ ...initialState });

onMounted(() => {
    checkPermissions();
    getCoupons()
});

watch(() => 
    form.search_query, _.debounce( () => {
            getCoupons();
    },500),
);

const coupons = ref([]);
const pagination = ref([]);

async function getCoupons(page = 1){

    form.is_listing = true;

    await axios.get('/api/coupons', { params : {
            page : page,
            paginate_limit : paginate_limit.value,
            search_query : form.search_query,
        } }).then( (response) => {
            
        coupons.value = response.data.data;
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
    await getCoupons();
}

async function changeStatus(slack){
    
    var form_data = new FormData();
    form_data.append('slack',slack);

    await axios.post('/api/coupon/update_status', form_data).then( (response) => {

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

function viewCoupon(slack){
    router.push('/coupon/'+slack);
}

function editCoupon(slack){
    router.push('/coupon/edit/'+slack);
}

async function deleteCoupon(slack){

    var is_confirmed = false;

    await Swal.fire({
        title:t('Do you want to delete this item?'),
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

        await axios.post('/api/coupon/delete',{
            slack : slack
        }).then( (response) => {
            
        if(response.data.status_code == 200) {
            
            toast.success(response.data.msg);
            getCoupons();

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
        write : isAuthorized('A_WRITE_COUPON'),
        delete : isAuthorized('A_DELETE_COUPON'),
    };
}

</script>

<style scoped>
.disabled-switch:checked{
    background-color: lightgray !important;
    border-color: lightgray !important;
}

</style>