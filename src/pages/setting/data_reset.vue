<template>
  <DefaultLayout>
    <template v-slot:subheader>
      <div class="header-nav-wrap">
        <div class="row align-items-center">
          <div class="col-auto">
            <div class="header-back-link">
              <router-link class="text-primary" to="/settings">
                <Icon icon="fa6-solid:chevron-left" /> {{ $t("Settings") }}
              </router-link>
            </div>
          </div>
          <div class="col-auto">
            <h5 class="fw-bold">{{ $t("Data Reset") }}</h5>
          </div>
        </div>
      </div>
    </template>

    <div class="content py-5">
      <div class="py-3" v-if="form.server_messages.messages != ''">
        <ServerMessage :server_messages="form.server_messages" />
      </div>

      <div class="row">
        <div class="col-12">
          <DataResetSkeleton v-if="form.is_listing" />
          <div class="" v-else>
            
            <div class="form-feild card" v-if="authStore.isAdmin">
              <div class="col-12 py-3">
                <label for="tax_inclusive_pricing">
                  <span class="fs-5">{{ $t("Select Merchant") }}</span>
                  <select
                    class="form-control form-control-solid w-100 mt-2"
                    v-model="form.merchant_id"
                    @change="getDataCounts()"
                    style="min-width: 200vh;"
                  >
                    <option
                      v-if="Object.keys(form.merchants_list).length == 0"
                      selected
                    >
                      {{ $t("Merchants data not found!") }}
                    </option>
                    <option
                      v-else
                      v-for="(list, index) in form.merchants_list"
                      :value="list.id"
                      v-bind:key="index"
                    >
                      {{ list.name }}
                    </option>
                  </select>
                </label>
              </div>
            </div>

            <div class="form-feild card" v-if="form.merchant_id != ''">
              <div class="col-12 py-3">
                <div class="form-check">
                  <label for="categories_products">
                    <input
                      class="form-check-input mt-1"
                      type="checkbox"
                      role="switch"
                      id="categories_products"
                      v-model="form.categories_products"
                      :checked="form.categories_products"
                    />
                    <span class="fs-4">{{
                      $t("Categories and Products")
                    }}</span>
                    <ul class=" ">
                      <li v-for="(list, index) in form.merchants_data_counts">
                        <div
                          class="ps-2 pt-3"
                          v-if="
                            index === 'Products' ||
                            index === 'Product Ingredients' ||
                            index === 'Categories' ||
                            index === 'Combos'
                          "
                        >
                          <span>{{ list }} {{ index }}</span>
                        </div>
                      </li>
                    </ul>
                  </label>
                </div>
              </div>
            </div>
            <div class="form-feild card" v-if="form.merchant_id != ''">
              <div class="col-12 py-3">
                <div class="form-check">
                  <label for="products">
                    <input
                      class="form-check-input mt-1"
                      type="checkbox"
                      role="switch"
                      id="products"
                      v-model="form.products"
                      :checked="form.products"
                    />
                    <span class="fs-4">{{ $t("Only Products") }}</span>
                    <ul class=" ">
                      <li v-for="(list, index) in form.merchants_data_counts">
                        <div
                          class="ps-2 pt-3"
                          v-if="
                            index === 'Products' ||
                            index === 'Product Ingredients' 
                          "
                        >
                          <span>{{ list }} {{ index }}</span>
                        </div>
                      </li>
                    </ul>
                  </label>
                </div>
              </div>
            </div>
            <div class="form-feild card" v-if="authStore.isAdmin && form.merchant_id != ''">
              <div class="col-12 py-3">
                <div class="form-check">
                  <label for="purchases_quotations">
                    <input
                      class="form-check-input mt-1"
                      type="checkbox"
                      role="switch"
                      id="purchases_quotations"
                      v-model="form.purchases_quotations"
                      :checked="form.purchases_quotations"
                    />
                    <span class="fs-4">{{
                      $t("Purchases and Quotations")
                    }}</span>
                    <ul class=" ">
                      <li v-for="(list, index) in form.merchants_data_counts">
                        <div
                          class="ps-2 pt-3"
                          v-if="
                            index === 'Purchases' ||
                            index === 'Purchase Returns' ||
                            index === 'Quotations' 
                          "
                        >
                          <span>{{ list }} {{ index }}</span>
                        </div>
                      </li>
                    </ul>
                  </label>
                </div>
              </div>
            </div>

            <div class="form-feild card" v-if="authStore.isAdmin && form.merchant_id != ''">
              <div class="col-12 py-3">
                <div class="form-check">
                  <label for="sales_returns">
                    <input
                      class="form-check-input mt-1"
                      type="checkbox"
                      role="switch"
                      id="sales_returns"
                      v-model="form.sales_returns"
                      :checked="form.sales_returns"
                    />
                    <span class="fs-4">{{ $t("Sales and Returns") }}</span>
                   
                    <ul class=" ">
                      <li v-for="(list, index) in form.merchants_data_counts">
                        <div
                          class="ps-2 pt-3"
                          v-if="
                            index === 'Orders' ||
                            index === 'Order Returns' ||
                            index === 'Invoices' || 
                            index === 'Invoice Returns' || 
                            index === 'Transactions' 
                          "
                        >
                          <span>{{ list }} {{ index }}</span>
                        </div>
                      </li>
                    </ul>
                  </label>
                </div>
              </div>
            </div>

            <div class="form-feild card"  v-if="form.merchant_id != ''">
              <div class="col-12 py-3">
                <div class="form-check">
                  <label for="restaurant_data">
                    <input
                      class="form-check-input mt-1"
                      type="checkbox"
                      role="switch"
                      id="restaurant_data"
                      v-model="form.restaurant_data"
                      :checked="form.restaurant_data"
                    />
                    <span class="fs-4">{{ $t("Restaurant Data") }}</span>
                    <ul class=" ">
                      <li v-for="(list, index) in form.merchants_data_counts">
                        <div
                          class="ps-2 pt-3"
                          v-if="
                            index === 'Kitchen Tables' 
                          "
                        >
                          <span>{{ list }} {{ index }}</span>
                        </div>
                      </li>
                    </ul>
                  </label>
                </div>
              </div>
            </div>

            <div class="form-feild card" v-if="authStore.isAdmin && form.merchant_id != ''">
              <div class="col-12 py-3">
                <div class="form-check">
                  <label for="stock_transfers">
                    <input
                      class="form-check-input mt-1"
                      type="checkbox"
                      role="switch"
                      id="stock_transfers"
                      v-model="form.stock_transfers"
                      :checked="form.stock_transfers"
                    />
                    <span class="fs-4">{{ $t("Stock Transfers") }}</span>
                  </label>
                </div>
              </div>
            </div>

            <div class="form-feild card" v-if="form.merchant_id != ''">
              <div class="col-12 py-3">
                <div class="form-check">
                  <label for="customers_suppliers">
                    <input
                      class="form-check-input mt-1"
                      type="checkbox"
                      id="customers_suppliers"
                      v-model="form.customers_suppliers"
                      :checked="form.customers_suppliers"
                    />
                    <span class="fs-4">{{
                      $t("Customers and Suppliers")
                    }}</span>
                  </label>
                </div>
              </div>
            </div>

            <div class="form-field pt-4">
              <div class="col-12">
                <button
                  type="button"
                  class="btn btn-danger btn-md"
                  :disabled="form.is_submitting"
                  @click="data_reset()"
                >
                  {{ $t("Reset") }}
                </button>
                <beat-loader
                  color="gray"
                  :size="'15px'"
                  class="pt-2 pe-2"
                  v-show="form.is_submitting"
                >
                </beat-loader>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup>
import {
  ref,
  onMounted,
  reactive,
  watch,
  computed,
  defineAsyncComponent,
} from "vue";

import { useAuthStore } from "@/stores/auth";
import BeatLoader from "vue-spinner/src/BeatLoader.vue";
import SettingMenu from "@/components/common/SettingMenu.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const AsyncViewBackup = defineAsyncComponent(() =>
  import("@/components/measurement/ViewMeasurement.vue")
);
const authStore = useAuthStore();

const show_add_measurement_modal = ref(false);
const edit_data = ref([]);
const paginate_limit = ref();

const initialState = {
  server_messages: {
    type: "",
    messages: "",
  },
  is_submitting: false,
  // form data
  categories_products: false,
  products: false,
  purchases_quotations: false,
  sales_returns: false,
  restaurant_data: false,
  stock_transfers: false,
  customers_suppliers: false,
  merchant_id: "",
  merchants_list: [],
  merchants_data_counts: [],

  search_query: ref(""),
};

const form = reactive({ ...initialState });

const merchant_id = computed(() => {
  return _.isUndefined(authStore) ? authStore.user.merchant.id : "";
});

onMounted(() => {
  if (authStore.isAdmin) {
    getMerchantsList();
  }
  if (authStore.isMerchant) {
    form.merchant_id = authStore.user.merchant.id;
    getDataCounts();
  }
});

// watch(() =>
//         form.search_query, _.debounce( () => {
//       getBackups();
//     },500),
// );

async function getMerchantsList() {
  form.is_listing = true;
  await axios
    .get("/api/data_reset")
    .then((response) => {
      form.merchants_list = response.data.data.merchants_list;
      console.log(form.merchants_list, response.data.data);
      form.is_listing = false;
      form.server_messages.type = "";
      form.server_messages.messages = "";
    })
    .catch((error) => {
      form.server_messages.type = "error";
      form.server_messages.messages = error;
      form.is_listing = false;
      console.log(error);
    });
}

async function getDataCounts() {
  form.is_listing = true;
  await axios
    .get("/api/data_reset/counts", {
      params: {
        merchant_id: form.merchant_id,
      },
    })
    .then((response) => {
      if (response.data.status_code == 200) {
        form.merchants_data_counts = response.data.data;
        // console.log( response.data.data);
        form.is_listing = false;
        form.server_messages.type = "";
        form.server_messages.messages = "";
      } else {
        form.server_messages.type = "error";
        form.server_messages.messages = JSON.parse(response.data.msg);
        form.is_listing = false;
        console.log(response.data.msg);
      }
    })
    .catch((error) => {
      form.server_messages.type = "error";
      form.server_messages.messages = error;
      form.is_listing = false;
      console.log(error);
    });
}

async function data_reset() {
  if (form.merchant_id != "") {
    var is_confirmed = false;
    form.server_messages.type = "";
    form.server_messages.messages = "";
    await Swal.fire({
      title: "Warning!",
      icon: "warning",
      text: t("Do you want to reset the selected data?"),
      showCancelButton: true,
      confirmButtonText: t("Yes, Reset"),
      confirmButtonColor: "#198754",
      cancelButtonText: t("Cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        is_confirmed = true;
      }
    });
    if (is_confirmed) {
      form.is_submitting = true;
      var form_data = new FormData();
      form_data.append("merchant_id", form.merchant_id);
      form_data.append("categories_products", form.categories_products);
      form_data.append("products", form.products);
      form_data.append("purchases_quotations", form.purchases_quotations);
      form_data.append("sales_returns", form.sales_returns);
      form_data.append("restaurant_data", form.restaurant_data);
      form_data.append("stock_transfers", form.stock_transfers);
      form_data.append("customers_suppliers", form.customers_suppliers);

      await axios
        .post("/api/data_reset/reset", form_data)
        .then((response) => {
          console.log(response.data);
          if (response.data.status_code == 200) {
            Swal.fire(response.data.msg);
            getDataCounts();
          } else {
            try {
              form.server_messages.type = "error";
              form.server_messages.messages = JSON.parse(response.data.msg);
            } catch (err) {
              form.server_messages.type = "error";
              form.server_messages.messages = response.data.msg;
            }
          }
          form.is_submitting = false;
        })
        .catch((error) => {
          form.is_submitting = false;
          form.server_messages.type = "error";
          form.server_messages.messages = error;
          console.log(error);
        });
    }
  } else {
    form.server_messages.type = "error";
    form.server_messages.messages = t("Please select any Merchant first!");
  }
}
</script>
