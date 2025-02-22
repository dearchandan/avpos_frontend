<template>
  <DefaultLayout>
    <div
      class="content withoutsubmenu-content"
      v-if="stats != ''"
    >
      <AlertStats
        :revenue_data="revenue_data"
        :data="alert_data"
        :general_stats="general_stats"
        :inventory_stats="inventory_stats"
        :currency_symbol="currency_symbol"
      />
      <div class="row mb-4 justify-content-between align-items-center">
        <!-- <div class="col-3">
                <VSelectInput
                    name="branches" 
                    :label="select_branch_label" 
                    :placeholder="select_branch_placeholder" 
                    :text="'name'" 
                    :value="'id'" 
                    :mode="'single'"
                    :options="branches"
                    v-model="filter.selected_branch"
                    @change="fetchStats"
                    :size="'normal'"
                />
            </div> -->
        <div class="col-md-auto text-center">
          <ul
            class="nav nav-tabs rounded-tabs"
            id="myTab"
            role="tablist"
            v-if="
              authStore.user.user_type == 2 ||
              (authStore.user.branches && authStore.user.branches.length > 1)
            "
          >
            <li class="nav-item" role="presentation">
              <button
                :class="
                  filter.dashboard_type == 'my_dashboard'
                    ? 'nav-link active'
                    : 'nav-link'
                "
                type="button"
                role="tab"
                aria-selected="false"
                tabindex="-1"
                @click="switchDashboard('my_dashboard')"
              >
                {{ $t("My Dashboard") }}
              </button>
            </li>
            <li class="nav-item" role="presentation">
              <button
                :class="
                  filter.dashboard_type == 'master'
                    ? 'nav-link active'
                    : 'nav-link'
                "
                type="button"
                role="tab"
                aria-selected="false"
                tabindex="-1"
                @click="switchDashboard('master')"
              >
                {{ $t("Master Dashboard") }}
              </button>
            </li>
          </ul>
        </div>
        <div class="col-md-3">
          <div class="form-field mb-0">
            <div class="row align-items-center gx-3">
              <div class="col-auto">
                <label for="" class="form-label mb-0"
                  >{{ $t("Select Dates") }}
                </label>
              </div>
              <div class="col">
                <VueDatePicker
                  range
                  :preset-dates="presetDates"
                  v-model="filter.dates"
                  :format="'dd-MM-yyyy'"
                  :enable-time-picker="false"
                  @update:model-value="fetchStats"
                >
                  <template
                    #preset-date-range-button="{ label, value, presetDate }"
                  >
                    <span
                      role="button"
                      :tabindex="0"
                      @click="presetDate(value)"
                      @keyup.enter.prevent="presetDate(value)"
                      @keyup.space.prevent="presetDate(value)"
                    >
                      {{ label }}
                    </span>
                  </template>
                </VueDatePicker>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-lg-8">
          <div class="card" style="min-height: 400px">
            <div class="mb-3">
              <div class="row">
                <div class="col-12">
                  <span class="fs-5 fw-bold">{{
                    $t("Sales Trend Of The Month")
                  }}</span>
                </div>
              </div>
            </div>

            <SalesTrendChart :data="sales_trend_data" />
          </div>
        </div>

        <div class="col-md-6 col-lg-4">
          <div class="card" style="min-height: 400px">
            <div class="mb-3">
              <div class="row">
                <div class="col-12">
                  <span class="fs-5 fw-bold">{{
                    $t("Bestselling Categories")
                  }}</span>
                </div>
              </div>
            </div>

            <BestSellingCategoriesChart
              class="pt-5"
              :data="best_selling_categories_data"
            />
          </div>
        </div>
      </div>

      <div class="row mb-5">
        <div class="col-md-6 col-lg-4">
          <div class="card" style="min-height: 340px">
            <div class="mb-3">
              <div class="row">
                <div class="col-12">
                  <span class="fs-5 fw-bold">{{
                    $t("Bestselling Products")
                  }}</span>
                </div>
              </div>
            </div>

            <BestSellingProductsChart :data="best_selling_products_data" />
          </div>
        </div>

        <div class="col-md-6 col-lg-4">
          <div class="bg-white p-4" style="min-height: 340px">
            <div class="mb-3">
              <div class="row">
                <div class="col-12">
                  <span class="fs-5 fw-bold">{{
                    $t("Active/Inactive Products")
                  }}</span>
                </div>
              </div>
            </div>

            <ProductActiveInactiveChart :data="product_stats" />
          </div>
        </div>
        <div class="col-md-6 col-lg-4">
          <div class="bg-white p-4" style="min-height: 340px">
            <div class="mb-3">
              <div class="row">
                <div class="col-12">
                  <span class="fs-5 fw-bold">{{
                    $t("Quantity In Hand/To be received")
                  }}</span>
                </div>
              </div>
            </div>

            <QuantityChart :data="quantity_stats" />
          </div>
        </div>

        <!-- </div>
            <div class="row mb-5"> -->
      </div>

      <div class="row mt-3">
        <div class="col-md-3">
          <div class="card" style="min-height: 430px">
            <div class="row align-items-center gx-2">
              <!-- <div class="col">
                <div class="fs-5 fw-bold">{{ $t("Products") }}</div>
              </div> -->
              <!-- <div class="col-auto">
                                <input type="date" lang="en" name="" autocomplete="off" class="form-control form-control-solid form-control-sm">
                            </div>
                            <div class="col-auto">
                                <button type="button" class="btn btn-sm btn-icon btn-light">
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <g clip-path="url(#clip0_860_4)">
                                        <path d="M15.3335 2.66669V6.66669H11.3335" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                        <path d="M0.666504 13.3333V9.33331H4.6665" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                        <path d="M2.33984 6.00001C2.67795 5.04453 3.25259 4.19028 4.01015 3.51696C4.7677 2.84363 5.68348 2.37319 6.67203 2.14952C7.66058 1.92584 8.68967 1.95624 9.6633 2.23786C10.6369 2.51948 11.5233 3.04315 12.2398 3.76001L15.3332 6.66668M0.666504 9.33334L3.75984 12.24C4.47634 12.9569 5.36275 13.4805 6.33638 13.7622C7.31 14.0438 8.3391 14.0742 9.32765 13.8505C10.3162 13.6268 11.232 13.1564 11.9895 12.4831C12.7471 11.8097 13.3217 10.9555 13.6598 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                        </g>
                                        <defs>
                                        <clipPath id="clip0_860_4">
                                        <rect width="16" height="16" fill="white"/>
                                        </clipPath>
                                        </defs>
                                    </svg>
                                </button>
                            </div> -->
            </div>
            <OrderProducts
              :top_selling_products="top_selling_products"
              :low_selling_products="low_selling_products"
            />
          </div>
        </div>
        <div class="col-md-3">
          <div class="card" style="min-height: 430px">
            <div class="mb-3">
              <div class="row">
                <div class="col-12">
                  <span class="fs-5 fw-bold">{{ $t("Low Stock") }}</span>
                </div>
              </div>
            </div>

            <div
              class="table-responsive low_stock_div"
              v-on:scroll="scrollFunction"
            >
              <LowStockProducts :data="low_stock_data" />
            </div>
          </div>
        </div>
        <div class="col-lg-3">
          <div class="card" style="min-height: 430px">
            <div class="mb-3">
              <div class="row">
                <div class="col-12">
                  <span class="fs-5 fw-bold">{{
                    $t("Recent Transactions")
                  }}</span>
                </div>
              </div>
            </div>
            <div class="table-responsive">
              <RecentTransactions :data="recent_transactions_data" />
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card" style="min-height: 430px">
            <div class="mb-3">
              <div class="row">
                <div class="col-12">
                  <span class="fs-5 fw-bold">{{
                    $t("Top Orders Of The Month")
                  }}</span>
                </div>
              </div>
            </div>

            <div class="table-responsive">
              <TopOrders :data="top_orders_data" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <DashboardSkeleton v-else />
  </DefaultLayout>
</template>

<script setup>
import DefaultLayout from "@/layouts/DefaultLayout.vue";
import { useAuthStore } from "@/stores/auth";
import VueDatePicker from "@vuepic/vue-datepicker";
import {
  endOfMonth,
  endOfYear,
  startOfMonth,
  startOfYear,
  subMonths,
} from "date-fns";
import { useI18n } from "vue-i18n";
import useGlobalFunctions from "@/composables/global_functions.js";

const { t } = useI18n();

const authStore = useAuthStore();

const presetDates = ref([
  { label: "Today", value: [new Date(), new Date()] },
  {
    label: "This month",
    value: [startOfMonth(new Date()), endOfMonth(new Date())],
  },
  {
    label: "Last month",
    value: [
      startOfMonth(subMonths(new Date(), 1)),
      endOfMonth(subMonths(new Date(), 1)),
    ],
  },
  {
    label: "This year",
    value: [startOfYear(new Date()), endOfYear(new Date())],
  },
]);

const initial_filter = reactive({
  server_messages: {
    type: "",
    messages: "",
  },
  is_submitting: false,
  dates: ref([startOfMonth(new Date()), endOfMonth(new Date())]),
  dashboard_type: ref("my_dashboard"),
});
const filter = reactive({ ...initial_filter });

onMounted(() => {
  fetchStats();
  fetchLowStockProducts();
});

const currency_symbol = computed(() => {
  return authStore.user.currency.symbol;
});

const branches = computed(() => {
  return authStore.user.branches;
});

const stats = ref("");

const sales_trend_data = ref("");
const best_selling_categories_data = ref("");
const best_selling_products_data = ref("");
const recent_transactions_data = ref("");
const top_orders_data = ref("");
const low_stock_data = ref("");
const alert_data = ref("");
const revenue_data = ref("");
const product_stats = ref("");
const quantity_stats = ref("");
const top_selling_products = ref("");
const low_selling_products = ref("");
const general_stats = ref("");
const inventory_stats = ref("");

const page = ref(1);
const last_page = ref(1);
const scrolled = ref(false);
const select_branch_label = t("Select Branch");
const select_branch_placeholder = t("All Branches");

async function fetchStats() {
  var response = await axios.post("api/dashboard/stats", {
    filter: filter,
  });

  stats.value = response.data;

  general_stats.value = stats.value.general_stats;
  inventory_stats.value = stats.value.inventory_stats;
  sales_trend_data.value = stats.value.sales_trend;
  best_selling_categories_data.value = stats.value.bestselling_categories;
  best_selling_products_data.value = stats.value.bestselling_products;
  recent_transactions_data.value = stats.value.recent_transactions;
  top_orders_data.value = stats.value.top_orders;
  alert_data.value = stats.value.alert;
  revenue_data.value = stats.value.revenue_data;
  product_stats.value = stats.value.product_stats;
  quantity_stats.value = stats.value.quantity_stats;
  top_selling_products.value = stats.value.top_selling_products;
  low_selling_products.value = stats.value.low_selling_products;
}

//  async function fetchProducts(){

//     var response = await axios.post('api/dashboard/products');

//     //stats.value = response.data;
//     //console.log(response.data)

// }
async function fetchLowStockProducts() {
  var response = await axios.post("api/dashboard/low_stock_products", {
    page: page.value,
  });

  last_page.value = response.data.products.last_page;
  if (page.value == 1) low_stock_data.value = [];

  if (page.value == 1) {
    low_stock_data.value = response.data.products.data;
  } else if (page.value <= last_page.value) {
    for (var i = 0; i < response.data.products.data.length; i++) {
      low_stock_data.value.push(response.data.products.data[i]);
    }
  }
  page.value = parseInt(page.value) + 1;
}
function scrollFunction() {
  if (page.value <= last_page.value) {
    if (!scrolled.value) {
      scrolled.value = true;
      fetchLowStockProducts();
      setTimeout(() => (scrolled.value = false), 2000);
    }
  }
}
function switchDashboard($type) {
  filter.dashboard_type = $type;
  fetchStats();
}
</script>

<style scoped>
.big-icon {
  font-size: 40px;
}
.chart-container {
  height: 300px; /* Adjust the height to your desired value */
}
.box-shadow {
  box-shadow: 6px 6px 30px rgba(0, 0, 0, 0.1);
}
.low_stock_div {
  max-height: 250px;
  overflow-y: auto;
}
</style>
