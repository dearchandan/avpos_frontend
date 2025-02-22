<template>
  <DefaultLayout>
    <template v-slot:subheader>
      <div class="header-nav-wrap">
        <div class="row align-items-center">
          <div class="col-auto">
            <h5 class="fw-bold">{{ $t("Merchants") }}</h5>
          </div>
        </div>
      </div>
    </template>

    <div class="content">
      <div class="page-heading">
        <div class="row align-items-center justify-content-between">
          <div class="col-auto">
                <div class="row align-items-center">
                    <div class="col-auto" v-if="permissions.write">
                        <router-link class="btn btn-sm btn-light-primary" to="/merchant/add" >+ {{ $t('New Merchant') }}</router-link>
                    </div>
                </div>
            </div>
          <div class="col-auto">
            <div class="row align-items-center">
              <div class="col-auto">
                <div class="form-field page-heading-search-field mb-0">
                  <div class="field-icon">
                    <input
                      type="search"
                      class="form-control form-control-sm form-control-shadow"
                      :placeholder="search_placeholder"
                      v-model="form.search_query"
                    />
                    <div class="icon">
                      <Icon icon="fa6-solid:magnifying-glass" />
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-auto">
                <div class="dropdown filter-dropdown">
                  <button
                    type="button"
                    class="btn btn-sm btn-icon btn-light-primary"
                    data-bs-auto-close="outside"
                    @click="fetchFilterData"
                  >
                    <Icon icon="fa6-solid:filter" />
                  </button>

                  <div
                    :class="show_filter ? 'show' : ''"
                    class="dropdown-menu p-3 w-365"
                    id="filter_box"
                    style="
                      position: absolute;
                      inset: 0px auto auto 0px;
                      margin: 0px;
                      transform: translate3d(-310px, 36px, 0px);
                    "
                  >
                    <form>
                      <div class="row gx-3">
                        <div class="col-12">
                          <div class="form-field">
                            <label class="form-label">{{
                              $t("Created Date")
                            }}</label>
                            <VueDatePicker
                              range
                              v-model="filter.created_date"
                              :format="'dd-MM-yyyy'"
                              :enable-time-picker="false"
                            />
                          </div>
                        </div>
                      </div>
                      <div class="row gx-3">
                        <div class="col-6">
                          <div class="form-field">
                            <label class="form-label">{{ $t("Status") }}</label>
                            <select
                              class="form-control form-control-sm form-control-solid"
                              v-model="filter.status"
                            >
                              <option value="">{{ $t("All") }}</option>
                              <option value="1">{{ $t("Active") }}</option>
                              <option value="0">{{ $t("Inactive") }}</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        @click="filterList"
                        class="btn btn-sm btn-primary w-100"
                      >
                        {{ $t("Filter") }}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row py-3">
          <div class="col-12 text-end">
            <button
              class="badge badge-danger btn-sm"
              v-if="show_clear_filter"
              @click="clearFilter"
            >
              {{ $t("Clear Filters") }}
            </button>
          </div>
        </div>
      </div>
      <ListingSkeleton v-if="form.is_listing" />

      <div v-else class="table-responsive">
        <table class="table table-list-data table-hover">
          <thead class="bg-light">
            <tr>
              <th scope="col" width="15%">{{ $t("Merchant Name") }}</th>
              <th scope="col" width="10%">{{ $t("Email") }}</th>
              <!-- <th scope="col" width="10%">{{ $t("Phone") }}</th> -->
              <!-- <th scope="col" width="10%">{{ $t("Business Type") }}</th> -->
              <th scope="col" width="10%">{{ $t("Subscription") }}</th>
              <th scope="col" width="10%">{{ $t("Subscription Ends In") }}</th>
              <th scope="col" width="10%">{{ $t("Subscription Status") }}</th>
              <th scope="col" width="10%">{{ $t("Created At") }}</th>
              <!-- <th scope="col" width="5%">{{ $t('Active') }}</th> -->
              <!-- <th
                scope="col"
                class="text-end"
                width="5%"
                v-if="permissions.write || permissions.delete"
              >
                {{ $t("Action") }}
              </th> -->
            </tr>
          </thead>
          <tbody>
            <tr
              v-if="merchants != ''"
              v-for="(merchant, branch_index) in merchants"
              :key="branch_index"
            >
              <td @click="viewMerchant(merchant.slack)" role="button">
                <span class="fw-bold highlighted-list-item">{{
                  merchant.name
                }}</span>
              </td>
              <td @click="viewMerchant(merchant.slack)" role="button">
                {{ merchant.email }}
              </td>
              <!-- <td @click="viewMerchant(merchant.slack)" role="button">
                {{ merchant.phone }}
              </td> -->
              <!-- <td @click="viewMerchant(merchant.slack)" role="button">
                {{ merchant.business_type }}
              </td> -->
              <td @click="viewMerchant(merchant.slack)" role="button">
                {{ merchant.user_subscription.name }}
              </td>
              <td @click="viewMerchant(merchant.slack)" role="button">
                {{ merchant.user_subscription.active_subscriptions_at }}
              </td>
              <td @click="viewMerchant(merchant.slack)" role="button">
                <span
                  v-if="merchant.user_subscription.status == 0"
                  class="badge badge-primary"
                  >{{ $t("Inactive") }}</span
                >
                <span
                  v-if="merchant.user_subscription.status == 1"
                  class="badge badge-success"
                  >{{ $t("Active") }}</span
                >
                <span
                  v-if="merchant.user_subscription.status == 2"
                  class="badge badge-warning"
                  >{{ $t("On Hold") }}</span
                >
                <span
                  v-if="merchant.user_subscription.status == 3"
                  class="badge badge-info"
                  >{{ $t("Upgraded") }}</span
                >
                <span
                  v-if="merchant.user_subscription.status == 4"
                  class="badge badge-danger"
                  >{{ $t("Expired") }}</span
                >
                <span
                  v-if="![0, 1, 2, 3, 4].includes(merchant.user_subscription.status)"
                  class="badge badge-danger"
                  >{{ $t("Not Subscribed") }}</span
                >
                <!-- {{ merchant.user_subscription.status_text }}  -->
              </td>
              <td @click="viewMerchant(merchant.slack)" role="button">
                {{ merchant.created_at_label }}
              </td>
              <!-- <td>
                                <div class="form-feild">
                                    <div class="form-check form-switch form-switch-2">
                                        <input class="form-check-input" type="checkbox" role="switch" id="Status_id" @change="changeStatus(merchant.slack)" :checked="merchant.status == 1">
                                    </div>
                                </div>
                            </td> -->
              <!-- <td
                class="text-end"
                v-if="permissions.write || permissions.delete"
              >
                <ActionButtonGroup
                  :permissions="permissions"
                  @edit="editMerchant"
                  :slack="merchant.slack"
                />
              </td> -->
            </tr>
            <tr v-else>
              <td class="text-center py-3" colspan="11">
                {{ $t("No Data Found") }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="data-footer">
        <div class="row align-items-center justify-content-between">
          <div class="col-auto">
            <PaginateLimit
              @paginate_limit_update="paginate_limit_update"
              :pagination="pagination"
            />
          </div>
          <div class="col-auto">
            <Bootstrap5Pagination
              :data="pagination"
              :limit="5"
              @pagination-change-page="getMerchants"
            />
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
  defineComponent,
  computed,
} from "vue";

import DefaultLayout from "@/layouts/DefaultLayout.vue";
import { Bootstrap5Pagination } from "laravel-vue-pagination";
import { useAuthStore } from "@/stores/auth";
import PaginateLimit from "@/components/common/PaginateLimit.vue";
import VueDatePicker from "@vuepic/vue-datepicker";
import { useI18n } from "vue-i18n";
import useGlobalFunctions from "@/composables/global_functions.js";

const { isAuthorized } = useGlobalFunctions();

const { t } = useI18n();

const authStore = useAuthStore();

const show_add_branch_modal = ref(false);

function openAddMerchantModal() {
  show_add_branch_modal.value = true;
}
function closeAddMerchantModal() {
  show_add_branch_modal.value = false;
  getMerchants();
}

const initialState = {
  server_messages: {
    type: "",
    messages: "",
  },
  is_listing: false,

  // form data
  search_query: ref(""),
};
const search_placeholder = t("Search by name, email, phone..");
const form = reactive({ ...initialState });

onMounted(() => {
  checkPermissions();

  getMerchants();
});

watch(
  () => form.search_query,
  _.debounce(() => {
    getMerchants();
  }, 500)
);

const merchants = ref([]);
const pagination = ref([]);

async function getMerchants(page = 1) {
  form.is_listing = true;

  await axios
    .get("/api/merchants", {
      params: {
        page: page,
        paginate_limit: paginate_limit.value,
        search_query: form.search_query,
        filter: filter,
      },
    })
    .then((response) => {
      merchants.value = response.data.data;
      pagination.value = response.data.pagination;
      form.is_listing = false;
    })
    .catch((error) => {
      form.server_messages.type = "error";
      form.server_messages.messages = error;
      form.is_listing = false;
      console.log(error);
    });
}

const paginate_limit = ref();
async function paginate_limit_update(value) {
  paginate_limit.value = value;
  await getMerchants();
}

async function changeStatus(slack) {
  var form_data = new FormData();
  form_data.append("slack", slack);

  await axios
    .post("/api/merchant/update_status", form_data)
    .then((response) => {
      if (response.data.status_code == 200) {
        toast.success(response.data.msg);
      } else {
        try {
          form.server_messages.type = "error";
          form.server_messages.messages = JSON.parse(response.data.msg);
        } catch (err) {
          form.server_messages.type = "error";
          form.server_messages.messages = response.data.msg;
        }
      }
    })
    .catch((error) => {
      form.server_messages.type = "error";
      form.server_messages.messages = error;
      console.log(error);
    });
}

//Code for Filter
const show_filter = ref(false);
const initial_filter = reactive({
  created_date: ref(),
  status: ref(""),
  type: ref(""),
});
const filter = reactive({ ...initial_filter });
// var initial_filter = JSON.stringify(JSON.parse(JSON.stringify(filter)));
const show_clear_filter = ref(false);

async function filterList() {
  if (JSON.stringify(filter) != JSON.stringify(initial_filter)) {
    show_clear_filter.value = true;
  }
  show_filter.value = false;
  await getMerchants();
}

async function fetchFilterData() {
  show_filter.value = !show_filter.value;
}

function clearFilter() {
  Object.assign(filter, initial_filter);
  show_clear_filter.value = false;
  getMerchants();
}
//End filter code

function viewMerchant(slack) {
  router.push("/merchant/" + slack);
}
function editMerchant(slack) {
  router.push("/merchant/edit/" + slack);
}

async function deleteMerchant(slack) {
  var is_confirmed = false;

  await Swal.fire({
    title: t("Do you want to delete this Merchant?"),
    showCancelButton: true,
    confirmButtonText: t("Yes, Delete"),
    confirmButtonColor: "#d33",
    cancelButtonText: t("Cancel"),
  }).then((result) => {
    if (result.isConfirmed) {
      is_confirmed = true;
    }
  });

  if (is_confirmed) {
    await axios
      .post("/api/merchant/delete", {
        slack: slack,
      })
      .then((response) => {
        if (response.data.status_code == 200) {
          Swal.fire(response.data.msg);
          getMerchants();
        } else {
          try {
            form.server_messages.type = "error";
            form.server_messages.messages = JSON.parse(response.data.msg);
          } catch (err) {
            form.server_messages.type = "error";
            form.server_messages.messages = response.data.msg;
          }
        }
      })
      .catch((error) => {
        form.server_messages.type = "error";
        form.server_messages.messages = error;
        console.log(error);
      });
  }
}

/* Checking permissions */
const permissions = ref({
  write: false,
  delete: false,
});

function checkPermissions() {
  permissions.value = {
    write: isAuthorized("A_WRITE_MERCHANT"),
    delete: isAuthorized("A_DELETE_MERCHANT"),
  };
}
</script>
