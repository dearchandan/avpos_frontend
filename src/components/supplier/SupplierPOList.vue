<template>
    <div>
        
        <h5 class="pb-2">{{ $t('Purchase Orders') }}</h5>

<!--        <div class="page-heading">
            <div class="row align-items-center justify-content-between">
                <div class="col-12">
                    <div class="row align-items-center">
                        <div class="col-12">
                            <div class="form-field page-heading-search-field mb-0">
                                <div class="field-icon">
                                    <input type="search" class="form-control form-control-solid" :placeholder="search_placeholder" v-model="form.search_query">
                                    <div class="icon"><Icon icon="fa6-solid:magnifying-glass" /></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>-->
        <ListingSkeleton v-if="form.is_listing" />
        <div v-else class="table-responsive">
            
            <table class="table table-list-data table-hover">
                <thead class="bg-light">
                    <tr>
                      <th scope="col" width="10%">{{ $t('PO No.') }}</th>
                      <th scope="col" width="10%">{{ $t('PO Ref No.') }}</th>
                      <th scope="col" width="10%">{{ $t('PO Date') }}</th>
                      <th scope="col" width="10%">{{ $t('PO Due Date') }}</th>
                      <th scope="col" width="10%">{{ $t('Amount') }}</th>
                      <th scope="col" width="10%">{{ $t('Approval Status') }}</th>
                      <th scope="col" width="10%">{{ $t('Delivery Status') }}</th>
                    </tr>
                </thead>
                <tbody> 
                    <tr v-if="purchase_orders != ''" v-for="(purchase_order,table_index) in purchase_orders" :key="table_index" >
                      <td><a @click="viewOrder(purchase_order.slack)" href="javascript:;"># {{ purchase_order.po_number }}</a></td>
                      <td>{{ purchase_order.reference_no }}</td>
                      <td>{{ purchase_order.po_date_label }}</td>
                      <td>{{ purchase_order.po_due_date_label }}</td>
                      <td>{{ purchase_order.grand_product_amount }}</td>
                      <td>
                        <span v-if="purchase_order.approval_status==0" class="badge badge-primary">{{ $t('Draft') }}</span>
                        <span v-if="purchase_order.approval_status==1" class="badge badge-success">{{ $t('Approved') }}</span>
                        <span v-if="purchase_order.approval_status==2" class="badge badge-danger">{{ $t('Rejected') }}</span>
                        <span v-if="purchase_order.approval_status==3" class="badge badge-warning">{{ $t('Cancelled') }}</span>
                      </td>
                      <td>
                        <span v-if="purchase_order.delivery_status==0" class="badge badge-primary">{{ $t('Undelivered') }}</span>
                        <span v-if="purchase_order.delivery_status==1" class="badge badge-warning">{{ $t('Partial Delivered') }}</span>
                        <span v-if="purchase_order.delivery_status==2" class="badge badge-success">{{ $t('Close/Delivered') }}</span>
                      </td>

                    </tr>
                    <tr v-else>
                        <td class="text-center py-3" colspan="7">{{ $t('No Data Found') }}</td>
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
                    <Bootstrap5Pagination :data="pagination" :limit="5"  @pagination-change-page="getOrders" />
                </div>
            </div>
        </div>
    </div>

</template>

<script setup>
import { Bootstrap5Pagination } from 'laravel-vue-pagination';
import { useAuthStore } from '@/stores/auth';
import BeatLoader from 'vue-spinner/src/BeatLoader.vue'
import { useI18n } from 'vue-i18n'
import {computed, reactive, ref} from "vue";
const { t } = useI18n();


const authStore = useAuthStore();

const currency_symbol = computed(() => {
  return authStore.user.currency.symbol;
})

const initialState = {
    server_messages: {
    type: "",
    messages: "",
    },
    is_listing: false,

    // form data   
    search_query : ref("")
};
const search_placeholder = t("search purchase orders by purchase order no., amount")
const form = reactive({ ...initialState });
const props = defineProps(['customer_slack']);
onMounted(() => {
    getOrders()
});

watch(() => 
    form.search_query, _.debounce( () => {
            getOrders();
    },500),
);

function viewOrder(slack) {
  const routeData = router.resolve('/purchase_order/' + slack);
  window.open(routeData.href, '_blank');
}

const initial_filters = reactive({
  customer_slack : props.customer_slack,
});
const filters = reactive({ ...initial_filters });

const purchase_orders = ref([]);
const pagination = ref([]);

async function getOrders(page = 1){

    form.is_listing = true;

    await axios.get('/api/purchase_orders', { params : {
            page : page,
            paginate_limit : paginate_limit.value,
            search_query : form.search_query,
            filters: filters,
        } }).then( (response) => {
            
        purchase_orders.value = response.data.data;
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
    await getOrders();
}

</script>