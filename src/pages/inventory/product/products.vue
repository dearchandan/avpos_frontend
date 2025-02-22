<template>
    <DefaultLayout>

        <template v-slot:subheader>
            <InventoryMenu />
        </template>
        
        <div class="content">
            <div class="page-heading">
                <div class="row align-items-center justify-content-between mb-3">
                    <div class="col-auto">
                        <h2 class="mb-0">{{ $t('Products') }}</h2>
                    </div>
                    <div class="col-auto">
                        <div v-if="permissions.write">
                            <router-link class="btn btn-sm btn-light-primary2" to="/product/add" id="step2" >+ {{ $t('New Product') }}</router-link>
                        </div>
                        <!-- <div v-if="permissions.write">
                         <a href="javascript:;" data-bs-toggle="modal" :data-bs-target="'#addProductModal'" class="btn btn-sm btn-light-primary2"> + {{ $t('New Product') }}</a>
                        </div> -->
                    </div>
                </div>

                <div class="row align-items-center justify-content-between g-3">
                    <div class="col col-lg-auto order-2 order-md-1">
                        <div class="row g-3">
                            <div class="col col-md-auto label-none">
                                <!-- <VSelect
                                    v-model="filter.category"
                                    name="" 
                                    placeholder="All Categories"
                                    :options="categories"
                                    @change="filterList"
                                    :height_sm="true"
                                /> -->
                                <AsyncCategorySearch
                                    @select-category="addItem"
                                    :height_sm="true"
                                    :limit=5
                                />
                            </div>
                            <div class="col-6 col-md-auto d-none d-md-block">
                                <div class="dropdown filter-dropdown">
                                    <button type="button" class="btn btn-sm btn-light-primary font-weight-normal" @click="fetchSortData" >
                                        <svg width="20" height="12" viewBox="0 0 20 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M4.61109 11.3889C4.82588 11.6037 5.17412 11.6037 5.38891 11.3889L8.88909 7.88873C9.10388 7.67394 9.10388 7.3257 8.88909 7.11091C8.6743 6.89612 8.32606 6.89612 8.11127 7.11091L5 10.2222L1.88873 7.11091C1.67394 6.89612 1.3257 6.89612 1.11091 7.11091C0.896124 7.3257 0.896124 7.67394 1.11091 7.88873L4.61109 11.3889ZM4.45 1L4.45 11L5.55 11L5.55 1L4.45 1Z" fill="currentColor"/>
                                        <path d="M14.6111 0.611092C14.8259 0.396303 15.1741 0.396303 15.3889 0.611092L18.8891 4.11127C19.1039 4.32606 19.1039 4.6743 18.8891 4.88909C18.6743 5.10388 18.3261 5.10388 18.1113 4.88909L15 1.77782L11.8887 4.88909C11.6739 5.10388 11.3257 5.10388 11.1109 4.88909C10.8961 4.6743 10.8961 4.32606 11.1109 4.11127L14.6111 0.611092ZM14.45 11L14.45 1L15.55 1L15.55 11L14.45 11Z" fill="currentColor"/>
                                        </svg> Sort By
                                        <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
                                        </svg>
                                    </button>
                                    <div :class="is_sort_rendering ? 'show' : ''" class="dropdown-menu p-0" style="min-width: 150px;">
                                        <li class="dropdown-item" @click="applySort('name','ASC')">{{ $t('Sort by') }} (A-Z)</li>
                                        <li class="dropdown-item" @click="applySort('name','DESC')">{{ $t('Sort by') }} (Z-A)</li>
                                        <li class="dropdown-item" @click="applySort('created_at','DESC')">{{ $t('Sort by Added Date') }}</li>
                                        <li class="dropdown-item" @click="applySort('updated_at','DESC')">{{ $t('Sort By Last Modified Date') }}</li>
                                        <li class="dropdown-item" @click="applySort('quantity','DESC')">{{ $t('Sort By Inventory Size (Max)') }}</li>
                                    </div>
                                </div>
                            </div>
                            <div class="col-auto col-md-auto" @click="fetchFilterData">
                                <button class="btn btn-sm btn-light-primary font-weight-normal" type="button" data-bs-toggle="collapse" data-bs-target="#subFilter" aria-expanded="false" aria-controls="collapseExample">
                                    <svg width="13" height="14" viewBox="0 0 13 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M0.464286 2.33333H7.03022C7.23775 3.136 7.95879 3.73333 8.82143 3.73333C9.68407 3.73333 10.4051 3.136 10.6126 2.33333H12.5357C12.792 2.33333 13 2.12427 13 1.86667C13 1.60907 12.792 1.4 12.5357 1.4H10.6126C10.4051 0.597333 9.68407 0 8.82143 0C7.95879 0 7.23775 0.597333 7.03022 1.4H0.464286C0.208 1.4 0 1.60907 0 1.86667C0 2.12427 0.208 2.33333 0.464286 2.33333ZM8.82143 0.933333C9.33354 0.933333 9.75 1.35193 9.75 1.86667C9.75 2.3814 9.33354 2.8 8.82143 2.8C8.30932 2.8 7.89286 2.3814 7.89286 1.86667C7.89286 1.35193 8.30932 0.933333 8.82143 0.933333ZM12.5357 11.6667H10.6126C10.4051 10.864 9.68407 10.2667 8.82143 10.2667C7.95879 10.2667 7.23775 10.864 7.03022 11.6667H0.464286C0.208 11.6667 0 11.8757 0 12.1333C0 12.3909 0.208 12.6 0.464286 12.6H7.03022C7.23775 13.4027 7.95879 14 8.82143 14C9.68407 14 10.4051 13.4027 10.6126 12.6H12.5357C12.792 12.6 13 12.3909 13 12.1333C13 11.8757 12.792 11.6667 12.5357 11.6667ZM8.82143 13.0667C8.30932 13.0667 7.89286 12.6481 7.89286 12.1333C7.89286 11.6186 8.30932 11.2 8.82143 11.2C9.33354 11.2 9.75 11.6186 9.75 12.1333C9.75 12.6481 9.33354 13.0667 8.82143 13.0667ZM12.5357 6.53333H5.5055C5.29797 5.73067 4.57693 5.13333 3.71429 5.13333C2.85164 5.13333 2.13061 5.73067 1.92307 6.53333H0.464286C0.208 6.53333 0 6.7424 0 7C0 7.2576 0.208 7.46667 0.464286 7.46667H1.92307C2.13061 8.26933 2.85164 8.86667 3.71429 8.86667C4.57693 8.86667 5.29797 8.26933 5.5055 7.46667H12.5357C12.792 7.46667 13 7.2576 13 7C13 6.7424 12.792 6.53333 12.5357 6.53333ZM3.71429 7.93333C3.20218 7.93333 2.78571 7.51473 2.78571 7C2.78571 6.48527 3.20218 6.06667 3.71429 6.06667C4.22639 6.06667 4.64286 6.48527 4.64286 7C4.64286 7.51473 4.22639 7.93333 3.71429 7.93333Z" fill="currentColor"/>
                                    </svg>
                                    {{ $t('Filters') }} <span class="badge" id="filter_count_badge" v-show="form.filter_count > 0"> {{ form.filter_count }} </span>
                                </button>
                            </div>
                            <div class="col-auto col-md-auto" >
                                <button class="btn btn-sm btn-light-danger" v-if="show_clear_filter" @click="clearFilter"> {{ $t('Clear') }} </button>
                            </div>
                        </div>
                    </div>
                    <div class="col-12 col-md-4 col-lg-3 order-1 order-md-2">
                        <div class="form-field mb-0">
                            <div class="field-icon">
                                <input type="search" class="form-control form-control-sm form-control-solid" :placeholder="search_placeholder" v-model="form.search_query">
                                <div class="icon"><Icon icon="fa6-solid:magnifying-glass" /></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="collapse" id="subFilter">
                    <div class="sub-filter">
                        <div class="row align-items-end g-3">
<!--                            <div class="col-6 col-md-auto">
                              <div class="form-field">
                                <label for="" class="form-label">{{ $t('Inventory Type') }}</label>
                                <select class="form-select form-select-sm form-select-solid" v-model="filter.is_all_products" @change="filterList">
                                  <option value="">{{ $t('My Inventory') }}</option>
                                  <option value="1">{{ $t('All Products') }}</option>
                                </select>
                              </div>
                            </div>-->
                            <div class="col-6 col-md-auto">
                                <div class="form-field">
                                    <label for="" class="form-label">{{ $t('Date') }}</label>
                                    <VueDatePicker range v-model="filter.dates" :format="'dd-MM-yyyy'" 
                                    :enable-time-picker="false" input-class-name="form-control form-control-solid form-control-sm" 
                                    @update:model-value="filterList()"/>
                                </div>
                            </div>
                            <div class="col-6 col-md-auto">
                                <div class="form-field">
                                    <label for="" class="form-label">{{ $t('Type') }}</label>
                                    <select class="form-select form-select-sm form-select-solid" v-model="filter.type" @change="filterList">
                                        <option value="" >{{ $t('All') }}</option>
                                        <option value="1">{{ $t('Product') }}</option>
                                        <option value="2">{{ $t('Recipe') }}</option>
                                    </select>
                                </div>
                            </div>
                            <div class="col-6 col-md-auto">
                                <div class="form-field">
                                    <label for="" class="form-label">{{ $t('Stock Type') }}</label>
                                    <select class="form-select form-select-sm form-select-solid" v-model="filter.stock_type" @change="filterList">
                                        <option value="" >{{ $t('All') }}</option>
                                        <option value="1">{{ $t('Below Alert Limit') }}</option>
                                        <option value="2">{{ $t('Out Of Stock') }}</option>
                                            
                                    </select>
                                </div>
                            </div>
                            <div class="col-6 col-md-auto">
                                <div class="form-field">
                                    <label for="" class="form-label">{{ $t('Status') }}</label>
                                    <select class="form-select form-select-sm form-select-solid" v-model="filter.status" @change="filterList">
                                        <option value="" >{{ $t('All') }}</option>
                                        <option value="1">{{ $t('Active') }}</option>
                                        <option value="0">{{ $t('Inactive') }}</option>
                                    </select>
                                </div>
                            </div>
                            <div class="col-6 col-md-auto d-none d-md-block">
                                <div class="form-field">
                                    <label for="" class="form-label">{{ $t('Created By') }}</label>
                                    <select class="form-select form-select-sm form-select-solid" v-model="filter.created_by"  @change="filterList">
                                        <option value="" >{{ $t('All') }}</option>
                                        <option v-for="(user,user_index) in filter_created_by_users" :key="user_index" :value="user.slack">{{ user.name }}</option>
                                    </select>
                                </div>
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
                            <th scope="col" width="5%">{{ $t('Image') }}</th>
                            <th scope="col" width="15%">{{ $t('Product') }}</th>
                            <th scope="col" width="10%">{{ $t('Type') }}</th>
                            <th scope="col" width="10%">{{ $t('Price Type') }}</th>
                            <th scope="col" width="10%">{{ $t('Qty.') }}</th>
                            <th scope="col" width="10%">{{ $t('Sale Price') }} <VTooltip v-show="is_other_taxes_and_fee_enabled" message="The Sale Price Is Inclusive Of Other Taxes and Product Taxes (VAT) " />  </th>
                            <!-- <th scope="col" width="10%">{{ $t('Categories') }} </th> -->
                            <th scope="col" width="10%">{{ $t('Taxes') }}</th>
                            <th scope="col" width="5%">{{ $t('Active') }}</th>
                            <th scope="col" class="text-end" width="5%" v-if="permissions.write && permissions.delete">{{ $t('Action') }}</th>
                        </tr>
                    </thead>
                    <tbody> 
                        <tr v-if="products != ''" v-for="(product,product_index) in products" :key="product_index" >
                            <td @click="viewProduct(product.slack)" role="button"><img v-lazy="product.image_path" alt="" class="listing-image img img-thumbnail rounded-circle"></td>
                            <td @click="viewProduct(product.slack)" role="button">
                                <div class="row align-items-center">
                                    <div class="col-auto">
                                        <div>
                                            <span class="fw-bold highlighted-list-item">{{  product.name  }}</span>
                                        </div>
                                    </div>
                                    <div class="col-auto">
                                        <div class="row gx-2">
                                            <!-- <div class="col-auto" v-if="product.product_variants.length > 0">
                                                <div class="t-icon" v-tippy="t('Variants Product')">
                                                    <img src="/src/assets/images/product-icon/variants-product-icon.svg" alt=""/>
                                                </div>
                                            </div> -->
                                            <!-- <div class="col-auto" v-if="product.has_modifiers">
                                                <div class="t-icon" v-tippy="t('Modifier Product')">
                                                    <img src="/src/assets/images/product-icon/modifier-product-icon.svg" alt=""/>
                                                </div>
                                            </div> -->
                                            <!-- <div class="col-auto">
                                                <div class="t-icon" v-tippy="t('Combo Product')">
                                                    <img src="/src/assets/images/product-icon/combo-product-icon.svg" alt=""/>
                                                </div>
                                            </div> -->
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <small class="text-muted">{{ product.name_ar }}</small>
                                    <!-- <small class="text-primary" v-if="product.product_variants.length > 0">has {{  product.product_variants.length  }} variant(s)  </small> -->
                                </div>
                            </td>
                            <td @click="viewProduct(product.slack)" role="button">
                                    <span v-if="product.type == 1" class="badge badge-primary" >
                                        {{ $t(product.type_text)  }}
                                    </span>
                                    <span v-if="product.type == 2" class="badge badge-secondary" >
                                        {{ $t(product.type_text)  }}
                                    </span>
                                    <span v-if="product.type == 4" class="badge badge-info" >
                                        {{ $t(product.type_text)  }}
                                    </span>
                            </td>
                            <td @click="viewProduct(product.slack)" role="button">
                                {{ $t(product.price_type_text) }}
                            </td>
                            <td @click="viewProduct(product.slack)" role="button">
                                <span v-if="product.this_branch_inventory">
                                    <span v-if="product.is_stockable" :class="{ 'text-danger' : product.this_branch_inventory.quantity == 0 }, { 'text-warning' : product.this_branch_inventory.quantity <= product.this_branch_inventory.alert_quantity }">
                                        
                                        {{ product.this_branch_inventory.quantity }}

                                        <!-- <span class="text-muted" v-if="product.stock_measurement_unit">{{ product.stock_measurement_unit.abbreviation }}</span>
                                        <span v-else class="text-muted">{{ $t('Units') }}</span> -->
                                    </span>
                                    <span v-else class="badge badge-secondary" >
                                        {{ $t('Unstockable') }} </span>
                                </span>
                                <span v-else>-</span>
                            </td>
                            <td @click="viewProduct(product.slack)" role="button">
                                
                                <span v-if="product.this_branch_inventory">
                                    {{ product.this_branch_inventory.sale_price + ' ' + currency_symbol }}   
                                    <!-- <span class="text-muted" v-if="product.is_stockable">
                                        {{ $t('Per') }} {{ product.stock_measurement_unit_abbreviation }}
                                    </span>
                                    <span class="text-muted" v-else>{{ $t('Per Unit') }}</span> -->
                                </span>
                                <span v-else>-</span>
                                
                            </td>
                            <!-- <td @click="viewProduct(product.slack)" role="button">
                                <span v-for="(cat,index) in product.product_categories" :key="index">
                                    <span v-if="cat.category">{{ cat.category.name  }}</span>
                                    <span v-if="index < product.product_categories.length - 1">, </span>
                                </span>
                            </td> -->
                            <td @click="viewProduct(product.slack)" role="button"> 
                                <span v-if="product.tax">
                                    {{  product.tax.name }}
                                </span>
                                <span v-else class="text-muted" >
                                    -
                                </span>
                            </td>
                            <td>
                                <div class="form-feild">
                                    <div class="form-check form-switch form-switch-2">
                                        <input class="form-check-input" type="checkbox" role="switch" id="Status_id" @change="changeStatus(product.slack)" :checked="product.status == 1">
                                    </div>
                                </div>
                            </td>
                            <td class="text-end" v-if="permissions.write || permissions.delete">
                               <ActionButtonGroup :permissions="permissions" @clone="cloneProduct" @delete="deleteProduct" @edit="editProduct" :slack="product.slack" />
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
                        <Bootstrap5Pagination :data="pagination" :limit=5 @pagination-change-page="getProducts" />
                    </div>
                </div>
            </div>

        </div>
        
    </DefaultLayout>

    <!-- <div class="modal hide" id="addProductModal" tabindex="-1" aria-labelledby="Add Product" aria-modal="true"
       role="dialog"  data-bs-backdrop="static" data-bs-keyboard="false">
        <div class="modal-dialog modal-dialog-centered modal-md">
            <div class="modal-content">
                <div class="modal-header">
                <h5 class="modal-title fs-5">{{ $t('Add Product') }}</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="closeModal" id="close_btn"></button>
                </div>
                <div class="modal-body">
                    <AddProductModal @closeProductModal="closeProductModal" @getProducts="getProducts" />
                </div>
            </div>
        </div>
    </div> -->

</template>

<script setup>

import { Bootstrap5Pagination } from 'laravel-vue-pagination';
import VueDatePicker from '@vuepic/vue-datepicker';
import { useAuthStore } from '@/stores/auth';
import useGlobalFunctions from '@/composables/global_functions.js';
import { useI18n } from 'vue-i18n'

const { t } = useI18n();
const { isAuthorized } = useGlobalFunctions();

onMounted(() => {
    
    checkPermissions();

    getProducts();
    
    //loadCategory();
    
});

/* Checking permissions */
const permissions = ref({
    write : false,
    delete : false,
});
const AsyncCategorySearch = defineAsyncComponent(() => import('@/components/common/CategorySearch.vue'));
function checkPermissions(){
    permissions.value  = {
        write : isAuthorized('A_WRITE_PRODUCT'),
        delete : isAuthorized('A_DELETE_PRODUCT'),
    };
}

const authStore = useAuthStore();

const currency_symbol = computed(() => {
    return authStore.user.currency.symbol;
})

const is_other_taxes_and_fee_enabled = computed(() => {
    return authStore.IsOtherTaxesAndFeeEnabled;
})

const initialState = {
    server_messages: {
    type: "",
    messages: "",
    },
    is_listing: false,

    // form data   
    search_query : ref(""),
    filter_count: 0, 
};
const search_placeholder = t("Search by name")
const form = reactive({ ...initialState });

watch(() => 
    form.search_query, _.debounce( () => {
            getProducts();
    },500),
);

const products = ref([]);
const pagination = ref([]);

async function getProducts(page = 1){

    form.is_listing = true;

    await axios.get('/api/v2/products', { params : {
            page : page,
            paginate_limit : paginate_limit.value,
            search_query : form.search_query,
            filter: filter,
            sort: sort,
        } }).then( (response) => {
        
        products.value = response.data.data.data;
        pagination.value = response.data.data.pagination;
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
    await getProducts();
}

async function changeStatus(slack){
    
    var form_data = new FormData();
    form_data.append('slack',slack);

    await axios.post('/api/product/update_status', form_data).then( (response) => {

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

function viewProduct(slack){
    router.push('/product/'+slack);
}

function editProduct(slack){
    router.push('/product/add/'+slack);
}

function cloneProduct(slack){
    router.push('/product/clone/'+slack);
}
function closeProductModal(){
    $("#addProductModal").modal('hide')
}
const show_filter = ref(false);

const initial_filter = reactive({
    is_all_products : ref(""),
    dates : ref(),
    status : ref(""),
    type : ref(""),
    price_type : ref(""),
    stock_type : ref(""),
    category : ref(""),
    created_by : ref(""),
});
const filter = reactive({ ...initial_filter });

const initial_sort = reactive({
    sort_by: ref(""),
    sort_type: ref("")
})

const sort = reactive({ ...initial_sort });

// var initial_filter = JSON.stringify(JSON.parse(JSON.stringify(filter)));
const show_clear_filter = ref(false);
const show_clear_sort = ref(false);
// initial_filter
async function filterList(){
    form.filter_count = 0;
    if(JSON.stringify(filter) != JSON.stringify()){
        show_clear_filter.value = true;
    }
    _.forEach(filter, (item,index) => {
        if(item != '' && item != undefined && index != 'category'){
            form.filter_count = form.filter_count + 1;
        }
    });
    show_filter.value = false;
    await getProducts();
}

const is_sort_rendering = ref(false);

function fetchSortData()
{
    is_sort_rendering.value = !is_sort_rendering.value;
}

const filter_created_by_users = ref([]);
const is_filter_rendering = ref(false);
function applySort(sort_by,sort_type)
{
    sort.sort_by = sort_by;
    sort.sort_type = sort_type;
    is_sort_rendering.value = false;
    show_clear_sort.value = true;
    getProducts();
}
async function fetchFilterData(){
    show_filter.value = !show_filter.value;

    if(show_filter.value){

        is_filter_rendering.value = true;
    
        await axios.get('/api/product/created_by_users').then( (response) => {
    
            filter_created_by_users.value = response.data.data;
            is_filter_rendering.value = false;
            
        }).catch((error) => {
            form.server_messages.type = "error";
            form.server_messages.messages = error;
            is_filter_rendering.value = false;
            console.log(error);
        });
        
    }

}

function clearFilter(){
    Object.assign(filter, initial_filter);
    show_clear_filter.value = false;
    form.filter_count = 0;
    getProducts();
}

function clearSort(){
    Object.assign(sort, initial_sort);
    show_clear_sort.value = false;
    getProducts();
}

async function deleteProduct(slack){

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

        await axios.post('/api/product/delete',{
            slack : slack
        }).then( (response) => {
            
        if(response.data.status_code == 200) {
            
            toast.success(response.data.msg);
            getProducts();

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

const categories = ref([]);
async function loadCategory(){
    let category_data = await axios.get('api/categories/all');
        category_data = category_data.data.data;
        _.forEach(category_data, (item) => {
            let template = {
                'key': item.id,
                'value': item.name,
                'id': item.slack,
            };
            categories.value.push(template);
        })
}

function addItem(clicked_category){
    filter.category = clicked_category.id;
    filterList()
}

</script>