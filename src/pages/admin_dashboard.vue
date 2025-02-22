<template>
  <DefaultLayout>
    <div class="content" style="margin-top: -40px !important"  v-if="stats != ''">
      <div class="row">
        <div class="col-md-6 col-lg-5">
          <div class="row">
            <div class="col-6 col-md-6 col-lg-6">
              <div class="darshboard-counter card">
                <h6>{{ $t("Total Revenue") }}</h6>
                <h3 class="text-primary">
                  {{ stats.total_order_amount }} {{ currency_symbol }}
                </h3>
              </div>
            </div>

            <div class="col-6 col-md-6 col-lg-6">
              <div class="darshboard-counter card">
                <h6>{{ $t("Orders") }}</h6>
                <h3 class="text-primary">{{ stats.total_orders }}</h3>
              </div>
            </div>

            <div class="col-6 col-md-6 col-lg-6">
              <div class="darshboard-counter card">
                <h6>{{ $t("Total Merchants") }}</h6>
                <h3 class="text-primary">{{ stats.total_merchants }}</h3>
              </div>
            </div>

            <div class="col-6 col-md-6 col-lg-6">
              <div class="darshboard-counter card">
                <h6>{{ $t("Active Merchants") }}</h6>
                <h3 class="text-primary">{{ stats.total_active_merchants }}</h3>
              </div>
            </div>

            <div class="col-6 col-md-6 col-lg-6">
              <div class="darshboard-counter card">
                <h6>{{ $t("Merchant Registered In Last Month") }}</h6>
                <h3 class="text-primary">
                  {{ stats.total_merchants_last_month }}
                </h3>
              </div>
            </div>

            <div class="col-6 col-md-6 col-lg-6">
              <div class="darshboard-counter card">
                <h6>{{ $t("Merchant Registered In This Month") }}</h6>
                <h3 class="text-primary">
                  {{ stats.total_merchants_this_month }}
                </h3>
              </div>
            </div>

            <div class="col-6 col-md-6 col-lg-6">
              <div class="darshboard-counter card">
                <h6>{{ $t("Total Subscriptions") }}</h6>
                <h3 class="text-primary">{{ stats.total_subscriptions }}</h3>
              </div>
            </div>

            <div class="col-6 col-md-6 col-lg-6">
              <div class="darshboard-counter card">
                <h6>{{ $t("Total Devices") }}</h6>
                <h3 class="text-primary">{{ stats.total_devices }}</h3>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-6 col-lg-7">
          <div class="card" style="min-height: 400px">
            <div class="mb-3">
              <div class="row">
                <div class="col-12">
                  <div class="row justify-content-between">
                    <div class="col-auto">
                      <span class="fs-5 fw-bold">{{
                        $t("Merchants Growth by Months")
                      }}</span>
                    </div>
                    <div class="col-auto col-md-3">
                      <VueDatePicker
                        v-model="filter.chart_year"
                        year-picker
                        @update:model-value="changeMerchantChartYear()"
                      >
                      </VueDatePicker>
                    </div>
                  </div>

                  <div class="card pt-3" v-if="merchant_growth_chart != null">
                    <LineChart :data="merchant_growth_chart" />
                  </div>
                </div>
              </div>
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
const { t } = useI18n();

const authStore = useAuthStore();

const currency_symbol = computed(() => {
  return authStore.user.currency.symbol;
});

const branches = computed(() => {
  return authStore.user.branches;
});

const initial_filter = reactive({
  server_messages: {
    type: "",
    messages: "",
  },
  is_submitting: false,
  dates: ref([startOfMonth(new Date()), endOfMonth(new Date())]),
  chart_year: new Date().getFullYear(),
});
const filter = reactive({ ...initial_filter });

const stats = ref("");
const chart = ref("");
const years = ref("");
const merchant_growth_chart = ref("");

onMounted(() => {
  fetchStats();
  changeMerchantChartYear();
});

async function fetchStats() {
  await axios
    .post("api/admin/dashboard/stats")
    .then((response) => {
      if (response.status == 200) {
        stats.value = response.data.stats;
      }
    })
    .catch((error) => {
      //console.log(JSON.parse(error.response.data.message));
      // var error_json = JSON.parse(error.response.data.message);
    });
}

async function changeMerchantChartYear() {
  var formData = new FormData();
  formData.append("year", filter.chart_year);
  await axios
    .post("api/admin/dashboard/get_merchant_growth_data", formData)
    .then((response) => {
      if (response.data.status_code == 200) {
        merchant_growth_chart.value = response.data.data;
      }
    })
    .catch((error) => {
      console.log(JSON.parse(error));
    });
}
</script>
