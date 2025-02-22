<template>
  <div>

    <h5 class="pb-2">{{ $t('Applied History') }}</h5>

           <div class="page-heading d-none d-md-block">
                <div class="row align-items-center justify-content-between">
                    <div class="col-12">
                        <div class="row align-items-center">
                            <div class="col-12">
                                <div class="form-field page-heading-search-field mb-0">
                                    <!-- <div class="field-icon">
                                        <input type="search" class="form-control form-control-solid" :placeholder="search_placeholder" v-model="form.search_query">
                                        <div class="icon"><Icon icon="fa6-solid:magnifying-glass" /></div>
                                    </div> -->
                                    <div class="">
                                      <div class="row align-items-center ">
                                        <div class="col-md-4 form-field">
                                          <label for="">{{ $t('Date Range') }}</label>
                                          <VueDatePicker 
                                            range :format="'dd-MM-yyyy'"
                                            v-model="form.business_dates" 
                                            :enable-time-picker="false"
                                            max-range="90"
                                            multi-calendars=""
                                            :preset-dates="presetDates" 
                                             input-class-name="form-control form-control-solid"
                                          >
                                          <template #preset-date-range-button="{ label, value, presetDate }">
                                            <span 
                                                role="button"
                                                :tabindex="0"
                                                @click="presetDate(value)"
                                                @keyup.enter.prevent="presetDate(value)"
                                                @keyup.space.prevent="presetDate(value)">
                                              {{ label }}
                                            </span>
                                          </template>
                                        </VueDatePicker>
                                        </div>
                                        <div class="col-2">
                                          <VTextInput 
                                                type="number"
                                                v-model="form.min_price"
                                                name="order_type" 
                                                :label="t('Min Price')"
                                            />
                                        </div>
                                        <div class="col-2">
                                          <VTextInput 
                                                type="number"
                                                v-model="form.max_price"
                                                name="sale_types" 
                                                :label="t('Max Price')" 
                                            />
                                        </div>
                                        <div class="col-4" >
                                          <div class="row align-items-center">
                                            <div class="col-12">
                                              <div class="form-field page-heading-search-field mb-0 pt-md-3">
                                                <div class="field-icon">
                                                  <input type="search" class="form-control form-control-solid"
                                                        :placeholder="search_placeholder" v-model="form.search_query">
                                                  <div class="icon">
                                                    <Icon icon="fa6-solid:magnifying-glass"/>
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
                </div>
            </div>
    <ListingSkeleton v-if="form.is_listing" />
    <div v-else class="table-responsive">

      <table class="table table-list-data table-hover">
        <thead class="bg-light">
        <tr>
          <th scope="col" width="10%">{{ $t('Order No.') }}</th>
          <th scope="col" width="10%">{{ $t('Product Name') }}</th>
          <th scope="col" width="10%">{{ $t('Price Before Discount') }}</th>
          <th scope="col" width="10%">{{ $t('Discount') }}</th>
          <th scope="col" width="10%">{{ $t('Price After Discount') }}</th>
          <th scope="col" width="10%">{{ $t('Applied At') }}</th>
          <th scope="col" width="10%">{{ $t('Applied By') }}</th>
        </tr>
        </thead>
        <tbody>
        <tr v-if="discount_histories != ''" v-for="(discount_history,table_index) in discount_histories" :key="table_index" >
          <td><a @click="viewOrder(discount_history.order.slack)" href="javascript:;"># {{ discount_history.order.order_number }}</a></td>
          <td>{{ discount_history.product_name }} </td>
          <td>{{ discount_history.product_price_before_discount }} {{  currency_symbol  }}</td>
          <td>{{ discount_history.product_discount }} {{  currency_symbol  }}</td>
          <td>{{ discount_history.subtotal_after_product_discount }} {{  currency_symbol  }}</td>
          <td>{{ discount_history.created_at_label }} </td>
          <td>{{ discount_history.created_by.name }} </td>
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
          <Bootstrap5Pagination :data="pagination" :limit="5"  @pagination-change-page="getDiscountHistory" />
        </div>
      </div>
    </div>
  </div>

</template>

<script setup>
import { Bootstrap5Pagination } from 'laravel-vue-pagination';
import { useAuthStore } from '@/stores/auth';
import VueDatePicker from '@vuepic/vue-datepicker';
import BeatLoader from 'vue-spinner/src/BeatLoader.vue'
import { useI18n } from 'vue-i18n'
import {computed, reactive, ref} from "vue";
const { t } = useI18n();

const authStore = useAuthStore();

const props = defineProps(['discount_slack']);

const initial_filters = reactive({
  discount_slack : props.discount_slack,
});
const filter = reactive({ ...initial_filters });

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
  business_dates : ref([new Date(), new Date()]),
  min_price : ref(""),
  max_price : ref(""),
};
const search_placeholder = t("search by order no., product name etc")
const form = reactive({ ...initialState });

onMounted(() => {
  getDiscountHistory()
});

watch(() =>
        form.business_dates, _.debounce( () => {
      getDiscountHistory();
    },500),
);
watch(() =>
        form.min_price, _.debounce( () => {
      getDiscountHistory();
    },500),
);
watch(() =>
        form.max_price, _.debounce( () => {
      getDiscountHistory();
    },500),
);
watch(() =>
        form.search_query, _.debounce( () => {
      getDiscountHistory();
    },500),
);

function viewOrder(slack) {
  const routeData = router.resolve('/order/' + slack);
  window.open(routeData.href, '_blank');
}


const discount_histories = ref([]);
const pagination = ref([]);

async function getDiscountHistory(page = 1){

  form.is_listing = true;

  await axios.get('/api/discount/history', { params : {
      page : page,
      paginate_limit : paginate_limit.value,
      search_query : form.search_query,
      min_price : form.min_price,
      max_price : form.max_price,
      business_dates : form.business_dates,
      filter: filter,
    } }).then( (response) => {

    discount_histories.value = response.data.data;
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
  await getDiscountHistory();
}

</script>