<template>
    <div>
        
        

        <div class="page-heading">
            <div class="row align-items-center justify-content-between">
                <div class="col-auto">
                    <h5 class="mb-0">{{ $t('Invoices') }}</h5>
                </div>
                <div class="col-auto">
                    <button type="button" class="btn btn-sm btn-success" @click="exportExcel()"
                        :disabled="filter.is_exporting">
                        <clip-loader v-if="filter.is_exporting" :color="'white'" :size="'20px'" class="pt-2 pe-2">  </clip-loader>
                        <span class="pt-0" v-if="filter.is_exporting">
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
                      <th scope="col" width="10%">{{ $t('Invoice No.') }}</th>
                      <th scope="col" width="10%">{{ $t('Ref. Number') }}</th>
                      <th scope="col" width="10%">{{ $t('Invoice Date') }}</th>
                      <th scope="col" width="10%">{{ $t('Amount') }}</th>
                      <th scope="col" width="10%">{{ $t('Status') }}</th>
                    </tr>
                </thead>
                <tbody> 
                    <tr v-if="invoices != ''" v-for="(invoice,table_index) in invoices" :key="table_index" >
                      <td><a @click="viewInvoice(invoice.slack)" href="javascript:;"># {{ invoice.invoice_number }}</a></td>
                      <td>{{ invoice.reference_no>0?invoice.reference_no:'--' }} </td>
                      <td>{{ invoice.invoice_date_label }}</td>
                      <td>{{ invoice.grand_product_amount }} {{  currency_symbol  }}</td>
                      <td>
                        <span v-if="invoice.status==0" class="badge badge-primary">{{ $t('Draft') }}</span>
                        <span v-if="invoice.status==1" class="badge badge-success">{{ $t('Paid') }}</span>
                        <span v-if="invoice.status==2" class="badge badge-warning">{{ $t('Partial Paid') }}</span>
                        <div v-if="invoice.status==3">
                          <span v-if="invoice.returned_status==0" class="badge badge-secondary">{{ $t('Partial Returned') }}</span>
                          <span v-if="invoice.returned_status==1" class="badge badge-secondary">{{ $t('Returned') }}</span>
                        </div>
                      </td>
                    </tr>
                    <tr v-else>
                        <td class="text-center py-3" colspan="5">{{ $t('No Data Found') }}</td>
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
                    <Bootstrap5Pagination :data="pagination" :limit="5"  @pagination-change-page="getInvoices" />
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
const search_placeholder = t("search Invoices by invoice no., reference no., amount")
const form = reactive({ ...initialState });
const props = defineProps(['customer_slack']);
onMounted(() => {
    getInvoices()
});

watch(() => 
    form.search_query, _.debounce( () => {
            getInvoices();
    },500),
);

function viewInvoice(slack) {
  const routeData = router.resolve('/invoice/' + slack);
  window.open(routeData.href, '_blank');
}

const initial_filters = reactive({
  customer : props.customer_slack,
  is_exporting : false,
});
const filter = reactive({ ...initial_filters });


const invoices = ref([]);
const pagination = ref([]);

async function getInvoices(page = 1){

    form.is_listing = true;

    await axios.get('/api/invoices', { params : {
            page : page,
            paginate_limit : paginate_limit.value,
            search_query : form.search_query,
            filter: filter,
        } }).then( (response) => {
            
        invoices.value = response.data.data;
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
    await getInvoices();
}

async function exportExcel(){

    filter.is_exporting = true;
    // filter.dates[0] = moment(filter.dates[0]).format('YYYY-MM-DD');
    // filter.dates[1] = moment(filter.dates[1]).format('YYYY-MM-DD');
    await axios.get('/api/customer/invoices_export_excel', { params : {
            filter: filter,
    }}).then( (response) => {

    if(response.data.status_code == 200) {

        filter.is_exporting = false;
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
        filter.is_exporting = false;
        console.log(error);
    });
}


</script>