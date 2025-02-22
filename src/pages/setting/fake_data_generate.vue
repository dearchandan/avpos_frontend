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
            <h5 class="fw-bold">{{ $t("Fake Data Generation") }}</h5>
          </div>
        </div>
      </div>
    </template>

    <div class="content py-4">
      <div class="py-3" v-if="form.server_messages.messages != ''">
        <ServerMessage :server_messages="form.server_messages" />
      </div>

      <div class="row">
        <div class="col-12">
          <DataResetSkeleton v-if="form.is_listing" />
          <div class="" v-else>
            
            <div class="form-feild card mb-0" v-if="form.merchant_id != '' && form.user_data_exists == 1">
              <div class="col-12">
                <span class="fs-4" >{{ $t("Current data of your account")}}</span>
                <ul class=" " >
                  <li v-for="(list, index) in form.merchants_data_counts" v-bind:key="index">
                    <div class="ps-2 pt-3">
                      <span  v-if="index === 'Terminals'">{{ list[0].terminal_count }} -- {{ index }}</span>
                      <span  v-else>{{ list }} -- {{ index }}</span>
                    </div>
                  </li>
                </ul>
                <div class="fs-5 mt-3 text-danger"> {{ $t("Note: You can not generate fake data as the data exists in your account.")}}</div>
              </div>
            </div>

            <div class="form-feild card" v-if="form.user_data_exists == 0">
              <div class="col-12">
                <span class="fs-4" >{{ $t("Following key details will be generated for fake data")}}</span>
                <ul class=" " >
                  <!-- <li v-for="(list, index) in form.merchants_data_counts" v-bind:key="index">
                    <div class="ps-2 pt-3">
                      <span >{{ index }}</span>
                    </div>
                  </li> -->
                  <li><div class="ps-2 pt-3"><span >2 -- {{ $t("Branches")}}</span></div></li>
                  <li><div class="ps-2 pt-3"><span >2 -- {{ $t("Terminals in each Branch")}}</span></div></li>
                  <li><div class="ps-2 pt-3"><span >5 -- {{ $t("Customers in each Branch")}}</span></div></li>
                  <li><div class="ps-2 pt-3"><span >3 -- {{ $t("Suppliers in each Branch")}}</span></div></li>
                  <li><div class="ps-2 pt-3"><span >4 -- {{ $t("Discounts in each Branch")}}</span></div></li>
                  <li><div class="ps-2 pt-3"><span >4 -- {{ $t("Categories in each Branch")}}</span></div></li>
                  <li><div class="ps-2 pt-3"><span >100 -- {{ $t("Products in each Categories")}}</span></div></li>
                  <li><div class="ps-2 pt-3"><span >2 -- {{ $t("Modifiers only for Recipe type products")}}</span></div></li>
                  <!-- <li><div class="ps-2 pt-3"><span >4 -- {{ $t("Variants in each Branch")}}</span></div></li> -->
                  <li><div class="ps-2 pt-3"><span >{{ $t("Product mapping with Category")}}</span></div></li>
                  <li><div class="ps-2 pt-3"><span >{{ $t("Branch wise Product inventory")}}</span></div></li>
                  <li><div class="ps-2 pt-3"><span >{{ $t("Product mapping with Supplier")}}</span></div></li>
                  <li><div class="ps-2 pt-3"><span >{{ $t("Product mapping with Modifier")}}</span></div></li>
                  <li><div class="ps-2 pt-3"><span >{{ $t("Product mapping with Ingredient (If any Ingredients created)")}}</span></div></li>
                  <!-- <li><div class="ps-2 pt-3"><span >{{ $t("Product mapping with Variant")}}</span></div></li> -->
                  <li><div class="ps-2 pt-3"><span >{{ $t("Discount mapping with Products (If any Discount have specific product discounts)")}}</span></div></li>
                  <li><div class="ps-2 pt-3"><span >{{ $t("Discount mapping with Branches (If any Discount have specific branch discounts)")}}</span></div></li>
                </ul>
              </div>
            </div>

            <div class="form-field pt-4">
              <div class="col-12 text-center">
                <button type="button" class="btn btn-success btn-md" @click="fake_data_generate()" v-if="form.user_data_exists == 0"
                  :disabled="form.is_submitting" >
                  <span v-if="form.is_submitting">{{ $t("Generating Data..") }}</span>
                  <span v-else>{{ $t("Generate Data") }}</span>
                  <beat-loader color="white" :size="'15px'" class="pt-2 pe-2" v-show="form.is_submitting" ></beat-loader>
                </button>
                
                <button type="button" v-show="form.user_data_exists == 1" class="btn btn-danger btn-md" 
                  :disabled="form.is_submitting" @click="clear_user_data()" >
                  <span v-if="form.is_submitting">{{ $t("Deleting all Data..") }}</span>
                  <span v-else>{{ $t("Delete all Data") }}</span>
                  <beat-loader color="white" :size="'15px'" class="pt-2 pe-2" v-show="form.is_submitting" ></beat-loader>
                </button>
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
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const authStore = useAuthStore();

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
  user_data_exists: 0,

  search_query: ref(""),
};

const form = reactive({ ...initialState });

const merchant_id = computed(() => {
  return _.isUndefined(authStore) ? authStore.user.merchant.id : "";
});

onMounted(() => {
  if (authStore.isMerchant) {
    form.merchant_id = authStore.user.merchant.id;
    getDataCounts();
  }
});


async function getDataCounts() {
  form.is_listing = true;
  await axios
    .get("/api/fake_data_generate/counts" 
    // ,{ params: {
    //     merchant_id: form.merchant_id,
    //   }, }
    )
    .then((response) => {
      if (response.data.status_code == 200) {
        form.merchants_data_counts = response.data.data.counts;
        form.user_data_exists = response.data.data.user_data_exists;
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

async function fake_data_generate() {
  if (form.merchant_id != "") {
    var is_confirmed = false;
    form.server_messages.type = "";
    form.server_messages.messages = "";
    await Swal.fire({
      title: "Warning!",
      icon: "warning",
      text: t("The above mensioned Key details will generate Fake Data. Do you want to continue?"),
      showCancelButton: true,
      confirmButtonText: t("Yes, Continue"),
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
      // form_data.append("merchant_id", form.merchant_id);
      await axios
        .post("/api/fake_data_generate/dump")
        .then((response) => {
          if (response.data.status_code == 200) {
            Swal.fire(response.data.msg);
            authStore.refresh();
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

async function clear_user_data() {
  if (form.merchant_id != "") {
    var is_confirmed = false;
    form.server_messages.type = "";
    form.server_messages.messages = "";
    await Swal.fire({
      title: "Warning!",
      icon: "warning",
      // text: t("The above mensioned key details data will be deleted. Do you want to continue?"),
      showCancelButton: true,
      html: `
        <b class="text-danger">The above mensioned key details data will be deleted. Do you want to continue? </b>
        `,
      confirmButtonText: t("Yes, Continue"),
      confirmButtonColor: "#dc3545",
      cancelButtonText: t("Cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        is_confirmed = true;
      }
    });
    if (is_confirmed) {
      form.is_submitting = true;
      var form_data = new FormData();
      // form_data.append("merchant_id", form.merchant_id);
      await axios
        .post("/api/clear_user_data")
        .then((response) => {
          if (response.data.status_code == 200) {
            Swal.fire(response.data.msg);
            authStore.refresh();
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
