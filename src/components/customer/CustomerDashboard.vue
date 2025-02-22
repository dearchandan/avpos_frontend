<template>
    <div>
        <h5 class="pb-2">{{ $t('Dashboard') }}</h5>

        <ListingSkeleton v-if="form.is_listing" />            
              
        <div v-else class="row">
            <div class="col-12">
                <div class="card">
                    <!--  order  -->
                    <div class="row">
                        <div class="col-md-4 col-lg-3">
                            <div class=" ">
                                <div class="card">
                                    <div class="d-flex align-items-start flex-column box-content">
                                        <div class="p-2 theme-color-blue">
                                            {{ $t("Total No. of Orders") }}
                                        </div>
                                        <div class="mt-auto p-2">
                                            <span class="text-headline">
                                                <h4 class="theme-color-blue">{{ count_data.total_order }}</h4>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-4 col-lg-3">
                            <div class=" ">
                                <div class="card">
                                    <div class="d-flex align-items-start flex-column box-content">
                                        <div class="p-2 theme-color-blue">
                                            {{ $t("Total Order Amount(SAR)") }}
                                        </div>
                                        <div class="mt-auto p-2">
                                            <span class="text-headline">
                                                <h4 class="theme-color-blue">{{ parseFloat(count_data.total_order_amount).toFixed(2) }}</h4>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-4 col-lg-3">
                            <div class=" ">
                                <div class="card">
                                    <div class="d-flex align-items-start flex-column box-content">
                                        <div class="p-2 theme-color-blue">
                                            {{ $t("Total No. of Returned Orders") }}
                                        </div>
                                        <div class="mt-auto p-2">
                                            <span class="text-headline">
                                                <h4 class="theme-color-blue">{{ count_data.total_return_order }}</h4>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-4 col-lg-3">
                            <div class=" ">
                                <div class="card">
                                    <div class="d-flex align-items-start flex-column box-content">
                                        <div class="p-2 theme-color-blue">
                                            {{ $t("Total Returned Order Amount(SAR)") }}
                                        </div>
                                        <div class="mt-auto p-2">
                                            <span class="text-headline">
                                                <h4 class="theme-color-blue">{{ parseFloat(count_data.total_return_order_amount).toFixed(2) }}</h4>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!--  invoice  -->
                        <div class="col-md-4 col-lg-3">
                            <div class=" ">
                                <div class="card">
                                    <div class="d-flex align-items-start flex-column box-content">
                                        <div class="p-2 theme-color-blue">
                                            {{ $t("Total No. of Invoices") }}
                                        </div>
                                        <div class="mt-auto p-2">
                                            <span class="text-headline">
                                                <h4 class="theme-color-blue">{{ count_data.total_invoice }}</h4>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-4 col-lg-3">
                            <div class=" ">
                                <div class="card">
                                    <div class="d-flex align-items-start flex-column box-content">
                                        <div class="p-2 theme-color-blue">
                                            {{ $t("Total Invoice Amount(SAR)") }}
                                        </div>
                                        <div class="mt-auto p-2">
                                            <span class="text-headline">
                                                <h4 class="theme-color-blue">{{ parseFloat(count_data.total_invoice_amount).toFixed(2)}}</h4>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-4 col-lg-3">
                            <div class=" ">
                                <div class="card">
                                    <div class="d-flex align-items-start flex-column box-content">
                                        <div class="p-2 theme-color-blue">
                                            {{ $t("Total No. of Returned Invoices") }}
                                        </div>
                                        <div class="mt-auto p-2">
                                            <span class="text-headline">
                                                <h4 class="theme-color-blue">{{ count_data.total_return_invoice }}</h4>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-4 col-lg-3">
                            <div class=" ">
                                <div class="card">
                                    <div class="d-flex align-items-start flex-column box-content">
                                        <div class="p-2 theme-color-blue">
                                            {{ $t("Total Returned Invoice Amount(SAR)") }}
                                        </div>
                                        <div class="mt-auto p-2">
                                            <span class="text-headline">
                                                <h4 class="theme-color-blue">{{ parseFloat(count_data.total_return_invoice_amount).toFixed(2) }}</h4>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!--  other  -->
                        <div class="col-md-4 col-lg-3">
                            <div class=" ">
                                <div class="card">
                                    <div class="d-flex align-items-start flex-column box-content">
                                        <div class="p-2 theme-color-blue">
                                            {{ $t("Last Order On") }}
                                        </div>
                                        <div class="mt-auto p-2">
                                            <span class="text-headline">
                                                <h4 class="theme-color-blue">{{ count_data.last_order_date }}</h4>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-4 col-lg-3">
                            <div class=" ">
                                <div class="card">
                                    <div class="d-flex align-items-start flex-column box-content">
                                        <div class="p-2 theme-color-blue">
                                            {{ $t("Favorite Product") }}
                                        </div>
                                        <div class="mt-auto p-2">
                                            <span class="text-headline">
                                                <h4 class="theme-color-blue">{{ count_data.fav_product }}</h4>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-4 col-lg-3">
                            <div class=" ">
                                <div class="card">
                                    <div class="d-flex align-items-start flex-column box-content">
                                        <div class="p-2 theme-color-blue">
                                            {{ $t("Favourite Branch") }}
                                        </div>
                                        <div class="mt-auto p-2">
                                            <span class="text-headline">
                                                <h4 class="theme-color-blue">{{ count_data.fav_store }}</h4>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-8 col-lg-6">
                            <div class=" ">
                                <div class="card">
                                    <div class="d-flex align-items-start flex-column box-content">
                                        <div class="row">
                                            <div class="col-lg-4">
                                                <div class="p-2 theme-color-blue">
                                                    {{ $t("Pending Invoices") }}
                                                </div>
                                                <div class="mt-auto p-2">
                                                    <span class="text-headline">
                                                        <h4 class="theme-color-blue">{{ count_data.pending_invoice }}</h4>
                                                    </span>
                                                </div>
                                            </div>
                                            <div class="col-lg-4">
                                                <div class="p-2 theme-color-blue">
                                                    {{ $t("Closed Invoices") }}
                                                </div>
                                                <div class="mt-auto p-2">
                                                    <span class="text-headline">
                                                        <h4 class="theme-color-blue">{{ count_data.closed_invoice }}</h4>
                                                    </span>
                                                </div>
                                            </div>
                                            <div class="col-lg-4">
                                                <div class="p-2 theme-color-blue">
                                                    {{ $t("Partial Invoices") }}
                                                </div>
                                                <div class="mt-auto p-2">
                                                    <span class="text-headline">
                                                        <h4 class="theme-color-blue">{{ count_data.partial_pay_invoice }}</h4>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
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
const search_placeholder = t("search orders by order no., amount")
const form = reactive({ ...initialState });
const props = defineProps(['customer_slack']);
onMounted(() => {
    getDashboardCounts();
});

watch(() => 
    form.search_query, _.debounce( () => {
        // getDashboardCounts();
    },5000),
);

// function viewOrder(slack) {
//   const routeData = router.resolve('/order/' + slack);
//   window.open(routeData.href, '_blank');
// }

const initial_filters = {
  customer_slack : props.customer_slack,
};
const filters = reactive({ ...initial_filters });

const count_data = ref([]);
const pagination = ref([]);

async function getDashboardCounts(page = 1){

    form.is_listing = true;
    console.log('customer counts starts =', filters.customer_slack);
    await axios.get('/api/customer/dashboard_counts', { params : {
        slack : filters.customer_slack,
        } }).then( (response) => {
        count_data.value = response.data.data.count_data;
        // pagination.value = response.data.pagination;
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