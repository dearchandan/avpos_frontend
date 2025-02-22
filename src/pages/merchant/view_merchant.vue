<template>
  <DefaultLayout>
    <template v-slot:subheader>
      <div class="header-nav-wrap">
        <div class="row align-items-center">
          <div class="col-auto">
            <div class="header-back-link">
              <router-link class="text-primary" to="/merchants"
                ><Icon icon="fa6-solid:chevron-left" />
                {{ $t("Merchants") }}</router-link
              >
            </div>
          </div>
          <div class="col-auto">
            <h5 class="fw-bold">{{ merchant.name }}</h5>
          </div>
          <div class="col-auto ms-auto me-0"><a href="#" class="btn btn-danger btn-sm" @click="deleteAccount()">{{ $t("Delete Merchant") }}</a></div>
        </div>
      </div>
    </template>

    <div class="content">
      <div class="row">
        <div class="col-lg-3">
          <div class="card p-3 p-xl-4" v-if="!is_loading">
            <div class="row flex-xl-nowrap align-items-center mb-3">
              <div class="col col-lg-12 col-xl">
                <div class="p-view-head">
                  <h2>
                    {{ merchant.name }}
                  </h2>
                </div>
              </div>
            </div>
            <div
              class="row g-1 flex-nowrap flex-lg-wrap flex-xl-nowrap mb-1 mb-md-3"
            >
              <div class="dv-data">
                <div class="item">
                  <span>{{ $t("Email") }}</span>
                  {{ merchant.email }}
                </div>
                <div class="item">
                  <span>{{ $t("Phone") }}</span>
                  {{ merchant.phone }}
                </div>
                <div class="item">
                  <span>{{ $t("Business Type") }}</span>
                  {{ merchant.business_type }}
                </div>
                <div class="item">
                  <span>{{ $t("VAT Number") }}</span>
                  {{ merchant.vat_number }}
                </div>
                <div class="item">
                  <span>{{ $t("Address") }}</span>
                  {{ merchant.address }}
                </div>
                <div class="item">
                  <span>{{ $t("City") }}</span>
                  {{ merchant.city }}
                </div>
                <div class="item">
                  <span>{{ $t("Postal Code") }}</span>
                  {{ merchant.postal_code }}
                </div>
                <div class="item">
                  <span>{{ $t("State") }}</span>
                  {{ merchant.state }}
                </div>
                <div class="item" v-if="merchant.country">
                  <span>{{ $t("Country") }}</span>
                  {{ merchant.country.name }}
                </div>
                <div class="item">
                  <span>{{ $t("Created At") }}</span>
                  {{ merchant.created_at_label }}
                </div>
                <div class="item">
                  <span>{{ $t("Created By") }}</span>
                  {{ merchant.created_by }}
                </div>
                <div class="item">
                  <span>{{ $t("Updated At") }}</span>
                  {{ merchant.updated_at_label }}
                </div>
                <div class="item">
                  <span>{{ $t("Updated By") }}</span>
                  {{ merchant.updated_by }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-9">
          <ul
            class="nav nav-tabs nav-underline"
            id="myTab"
            role="tablist"
            v-if="merchant != ''"
          >
            <li
              class="nav-item"
              role="presentation"
              v-for="(tab, index) in tabs"
              :key="index"
            >
              <button
                class="nav-link"
                @click="setActive(tab, index)"
                :class="[ active_tab.index == index || (active_tab.index == '' && index == 0)  ? 'active' : '' , (tab.required && tab.count <= 0) ? 'text-danger' : ''  ]"
                type="button"
                role="tab"
                aria-selected="false"
                tabindex="-1"
              >
                {{ tab.value }}
                <span
                  v-if="tab.count >= 0 && tab.key != 'inventory'"
                  class="badge count-badge"
                  :class="[
                    active_tab.index != index
                      ? 'badge-secondary'
                      : 'badge-dark',
                  ]"
                >
                  {{ tab.count }}
                </span>
              </button>
            </li>
          </ul>
          <div class="tab-content" id="myTabContent">
            <AsyncMerchantDashboard v-if="active_tab.index == ''  || active_tab.tab.key == 'dashboard'" :merchant="merchant" :general_stats="general_stats" />
            <AsyncMerchantSubscriptions ref="subscription_modal" v-if="active_tab.tab.key == 'subscriptions'" :merchant="merchant" />
            <AsyncMerchantBranches v-if="active_tab.tab.key == 'branches'" :merchant="merchant" />
            <AsyncMerchantUsers v-if="active_tab.tab.key == 'users'" :merchant="merchant" />
            <AsyncMerchantChangePassword v-if="active_tab.tab.key == 'change_password'" :merchant="merchant" />
          </div>
        </div>
      </div>
    </div>

    <div class="content">
      <div class="page-heading">
        <div class="py-3" v-if="form.server_messages.messages != ''">
          <ServerMessage :server_messages="form.server_messages" />
        </div>
      </div>
    </div>
    <AsyncDeleteAccountModal :merchant_id="merchant.merchant_id" />
  </DefaultLayout>
</template>

<script setup>
import DefaultLayout from "@/layouts/DefaultLayout.vue";
import { ref, reactive, onMounted, defineAsyncComponent } from "vue";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const route = useRoute();
const slack = route.params.slack;

const general_stats = ref("");
const is_loading = ref(false);
const merchant = ref([]);

const AsyncMerchantDashboard = defineAsyncComponent( () => import('@/components/merchant/MerchantDashboard.vue') );
const AsyncMerchantSubscriptions = defineAsyncComponent( () => import('@/components/merchant/MerchantSubscriptions.vue') );
const AsyncMerchantBranches = defineAsyncComponent( () => import('@/components/merchant/MerchantBranches.vue') );
const AsyncMerchantUsers = defineAsyncComponent( () => import('@/components/merchant/MerchantUsers.vue') );
const AsyncMerchantChangePassword = defineAsyncComponent( () => import('@/components/merchant/MerchantChangePassword.vue') );

const initialState = {
  server_messages: {
    type: "",
    messages: "",
  },
};

const form = reactive({ ...initialState });

onMounted(() => {
  getMerchant();
  fetchStats();
});

async function getMerchant() {
  is_loading.value = true;
  await axios
    .post("/api/merchant", { slack: slack })
    .then((response) => {
      merchant.value = response.data.data;
      is_loading.value = false;
    })
    .catch((error) => {
      form.server_messages.type = "error";
      form.server_messages.messages = error;
      is_loading.value = false;
      console.log(error);
    });
}

async function fetchStats() {
  is_loading.value = true;
  await axios
    .post("/api/merchant/stats", { merchant_slack: slack })
    .then((response) => {
      general_stats.value = response.data.data;
    })
    .catch((error) => {
      form.server_messages.type = "error";
      form.server_messages.messages = error;
      is_loading.value = false;
      console.log(error);
    });
}

const tabs = computed(() => {
  let values = [
    {
      key: "dashboard",
      value: t("Dashboard"),
      required: true,
    },
    {
      key: "subscriptions",
      value: t("Subscriptions"),
      required: true,
    },
    {
      key: "branches",
      value: t("Branches"),
      required: true,
    },
    {
      key: "users",
      value: t("Users"),
      required: true,
    },{
      key: "change_password",
      value: t("Change Password"),
      required: true,
    },
  ];

  return values;
});

const active_tab = ref({
  index : '',
  tab : ''
});

const subscription_modal = ref("");
function setActive(tab, index) {
  let template = {
    tab: tab,
    index: index,
  };
  active_tab.value = template;
  if(tab.key == 'subscriptions'){
    subscription_modal.value.getMerchantSubscriptions;
  }
}

function deleteAccount() {
  $("#deleteAccountModal").modal("show");
}

const AsyncDeleteAccountModal = defineAsyncComponent(() =>
  import("@/components/common/DeleteMerchantAccountModal.vue")
);
</script>
