<template>
    <div>
        

       <div class="page-heading">
            <div class="row align-items-center justify-content-between">
                <div class="col-auto">
                    <h5 class="mb-0">{{ $t('Orders') }}</h5>
                </div>
                <div class="col-auto">
                    <button type="button" class="btn btn-sm btn-success" @click="exportExcel()"
                        :disabled="filters.is_exporting">
                        <clip-loader v-if="filters.is_exporting" :color="'white'" :size="'20px'" class="pt-2 pe-2">  </clip-loader>
                        <span class="pt-0" v-if="filters.is_exporting">
                            {{ $t("Exporting...")  }}
                        </span>
                        <span class="pt-0" v-else>
                            {{ $t("Export Excel")  }}
                        </span> 
                    </button>
                </div>
            </div>
        </div>
        <ListingSkeleton v-if="form.is_listing" />
        <div v-else class="table-responsive">
            
            <table class="table table-list-data table-hover">
                <thead class="bg-light">
                    <tr>
                      <th scope="col" width="10%">{{ $t('Order No.') }}</th>
                      <th scope="col" width="10%">{{ $t('Order Date') }}</th>
                      <th scope="col" width="10%">{{ $t('Amount') }}</th>
                      <th scope="col" width="10%">{{ $t('Payment Method') }}</th>
                      <th scope="col" width="10%">{{ $t('Order Type') }}</th>
                      <th scope="col" width="10%">{{ $t('Status') }}</th>
                    </tr>
                </thead>
                <tbody> 
                    <tr v-if="orders != ''" v-for="(order,table_index) in orders" :key="table_index" >
                      <td><a @click="viewOrder(order.slack)" href="javascript:;"># {{ order.order_number }}</a></td>
                      <td>{{ order.business_date_label }}</td>
                      <td> <span v-if="order.returned_status == 0">{{ order.grand_amount_after_returned }} {{  currency_symbol  }}</span>  <s class="text-muted" v-if="order.grand_amount_after_returned != order.grand_product_amount">{{ order.grand_product_amount }} {{  currency_symbol  }}</s> </td>
                      <td>{{ order.payment_method_name }}</td>
                      <td>
                        <span v-if="order.order_type == 1">{{ $t('Take Away') }}</span>
                        <span v-if="order.order_type == 2">{{ $t('Dine In') }}</span>
                      </td>
                      <td>
                        <span v-if="order.order_status==0" class="badge badge-primary">{{ $t('Open') }}</span>
                        <span v-if="order.order_status==1" class="badge badge-success">{{ $t('Closed') }}</span>
                        <span v-if="order.order_status==2" class="badge badge-warning">{{ $t('In Kitchen') }}</span>
                        <span v-if="order.order_status==3" class="badge badge-danger">{{ $t('On Hold') }}</span>
                        <span v-if="order.order_status==4" class="badge badge-danger">{{ $t('Hold & In Kitchen') }}</span>
                        <span v-if="order.order_status==5 && order.returned_status == 0" class="badge badge-info">Partial Returned</span>
                        <span v-if="order.order_status==5 && order.returned_status == 1" class="badge badge-secondary">Returned</span>
                        <span v-if="order.order_status==6" class="badge badge-danger"><s>Cancelled</s></span>
                      </td>
                    </tr>
                    <tr v-else>
                        <td class="text-center py-3" colspan="6">{{ $t('No Data Found') }}</td>
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
    search_query : ref(""),
    
};
const search_placeholder = t("search orders by order no., amount")
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
  const routeData = router.resolve('/order/' + slack);
  window.open(routeData.href, '_blank');
}

const initial_filters = {
  customer_slack : props.customer_slack,
  is_exporting : false,
};
const filters = reactive({ ...initial_filters });

const orders = ref([]);
const pagination = ref([]);

async function getOrders(page = 1){
    form.is_listing = true;
    await axios.get('/api/orders', { params : {
            page : page,
            paginate_limit : paginate_limit.value,
            search_query : form.search_query,
            filters: filters,
        } }).then( (response) => {
            
        orders.value = response.data.data.orders;
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

async function exportExcel(){

    filters.is_exporting = true;
    // filter.dates[0] = moment(filter.dates[0]).format('YYYY-MM-DD');
    // filter.dates[1] = moment(filter.dates[1]).format('YYYY-MM-DD');
    await axios.get('/api/customer/orders_export_excel', { params : {
            filter: filters,
    }}).then( (response) => {

    if(response.data.status_code == 200) {

        filters.is_exporting = false;
        const link = document.createElement('a');
        link.target='_blank';
        link.href = response.data.data.file;
        document.body.appendChild(link);
        link.click();

    }else{
        try{
            form.server_messages.type = "error";
            form.server_messages.messages = JSON.parse(response.data.msg);
        }catch(err){
            form.server_messages.type = "error";
            form.server_messages.messages = response.data.msg;
        }
        filter.is_exporting = false;
    }

    }).catch((error) => {
        form.server_messages.type = "error";
        form.server_messages.messages = error;
        form.is_exporting = false;
        console.log(error);
    });
}


</script>