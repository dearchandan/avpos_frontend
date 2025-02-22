<template>
  <DefaultLayout>
    <template v-slot:subheader>
      <ManageMenu />
    </template>

    <div class="content">
      <div class="page-heading">
        <div class="page-heading position-relative">
          <div class="row align-items-center justify-content-between mb-3">
            <div class="col-auto">
              <h2 class="mb-0">{{ $t("Branches") }}</h2>
            </div>
            <div class="col col-md-auto">
              <div class="row align-items-center justify-content-between">
                <div class="col col-md-auto">
                  <div class="form-field mb-0">
                    <!-- <label class="form-label">{{ $t("Deliver Status") }}</label> -->
                    <select
                      class="form-control form-control-sm form-control-solid"
                      v-model="filter.status"
                      @change="filterList"
                    >
                      <option value="">{{ $t("Status") }}</option>
                      <option value="1">{{ $t("Active") }}</option>
                      <option value="0">{{ $t("Inactive") }}</option>
                    </select>
                  </div>
                </div>
                <div class="col col-md-auto d-none d-md-block">
                  <div class="form-field page-heading-search-field mb-0">
                    <div class="field-icon">
                      <input
                        type="search"
                        class="form-control form-control-sm form-control-solid"
                        :placeholder="search_placeholder"
                        v-model="form.search_query"
                      />
                      <div class="icon">
                        <Icon icon="fa6-solid:magnifying-glass" />
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-auto" v-if="permissions.write">
                  <router-link
                    class="btn btn-sm btn-light-primary2"
                    to="/branch/add"
                    :class="{ 'disabled' : disable_branch_add }"
                    >+ {{ $t("New Branch") }}</router-link
                  >
                </div>
              </div>
            </div>
          </div>
          <div class="attention_msg_box" v-if="disable_branch_add">
            {{ $t("Upgrade your subscription to add more branches,") }}
            <a :href="subscription_page_url" target="_blank"><u>{{  $t("click here") }}</u></a> {{ $t("to see the plans.") }}
          </div>
        </div>
      </div>
      <div v-if="form.is_listing">
        <ListingSkeleton />
      </div>
      <div v-else class="table-responsive">
        <table class="table table-list-data table-hover">
          <thead class="bg-light">
            <tr>
              <th scope="col" width="10%">{{ $t("Logo") }}</th>
              <th scope="col" width="20%">{{ $t("Branch Name") }}</th>
              <th scope="col" width="15%">{{ $t("Email") }}</th>
              <th scope="col" width="10%">{{ $t("Phone") }}</th>
              <th scope="col" width="10%">{{ $t("VAT") }}</th>
              <th scope="col" width="10%">{{ $t("GST Number") }}</th>
              <th scope="col" width="10%">{{ $t("Default View") }}</th>
              <th scope="col" width="10%">{{ $t("Created At") }}</th>
              <th scope="col" width="10%">{{ $t("Active") }}</th>
              <th
                scope="col"
                class="text-end"
                width="5%"
                v-if="permissions.write"
              >
                {{ $t("Action") }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-if="branches != ''"
              v-for="(branch, branch_index) in branches"
              :key="branch_index"
            >
              <td @click="viewBranch(branch.slack)" role="button">
                <img
                  v-lazy="branch.logo"
                  alt=""
                  class="listing-image img img-thumbnail rounded-circle"
                />
              </td>
              <td @click="viewBranch(branch.slack)" role="button">
                <div>
                  <span class="fw-bold highlighted-list-item">{{
                    branch.name
                  }}</span>
                  <br />
                  <small class="text-muted"
                    >{{ $t("Code") }}: {{ branch.code }}</small
                  >
                </div>
              </td>
              <td @click="viewBranch(branch.slack)" role="button">
                {{ branch.email }}
              </td>
              <td @click="viewBranch(branch.slack)" role="button">
                {{ branch.phone }}
              </td>
              <td @click="viewBranch(branch.slack)" role="button">
                <span v-if="branch.tax_registration_name != null">
                  {{ $t("Vat Name") }}: {{ branch.tax_registration_name }}
                </span>
                <span v-if="branch.tax_registration_number != null">
                  {{ $t("VAT Number") }}: {{ branch.tax_registration_number }}
                </span>
              </td>
              <td @click="viewBranch(branch.slack)" role="button">
                {{ branch.gst_number }}
              </td>
              <td @click="viewBranch(branch.slack)" role="button">
                <span
                  v-if="
                    branch.default_view == 'POS' ||
                    branch.default_view == 'INVENTORY' ||
                    branch.default_view == 'DASHBOARD'
                  "
                  class="badge badge-success fs-11"
                  >{{ branch.default_view }}</span
                >
                <span
                  v-if="
                    branch.default_view == 'KITCHEN' ||
                    branch.default_view == 'WAITER'
                  "
                  class="badge badge-warning fs-11"
                  >{{ branch.default_view }}</span
                >
              </td>
              <td @click="viewBranch(branch.slack)" role="button">
                {{ branch.created_at_label }}
              </td>
              <td>
                <div class="form-feild">
                  <div class="form-check form-switch form-switch-2">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      role="switch"
                      id="Status_id"
                      @change="changeStatus(branch.slack)"
                      :checked="branch.status == 1"
                      v-if="
                        authStore.user.login_branch != null &&
                        branch.slack == authStore.user.login_branch.slack
                      "
                      disabled
                    />
                    <input
                      class="form-check-input"
                      type="checkbox"
                      role="switch"
                      id="Status_id"
                      @change="changeStatus(branch.slack)"
                      :checked="branch.status == 1"
                      v-else-if="!permissions.write"
                      disabled
                    />
                    <input
                      class="form-check-input"
                      type="checkbox"
                      role="switch"
                      id="Status_id"
                      @change="changeStatus(branch.slack)"
                      :checked="branch.status == 1"
                      v-else
                    />
                  </div>
                </div>
              </td>
              <td class="text-end" v-if="permissions.write">
                <!-- <ActionButtonGroup :permissions="permissions"  @edit="editBranch" :slack="branch.slack" v-if="authStore.user.login_branch!=null && branch.slack == authStore.user.login_branch.slack"  />
                                 <ActionButtonGroup :permissions="permissions"  @delete="deleteBranch" @edit="editBranch" :slack="branch.slack" v-else /> -->
                <ActionButtonGroup
                  :permissions="permissions"
                  @edit="editBranch"
                  :slack="branch.slack"
                />
              </td>
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
              @pagination-change-page="getBranches"
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

import { Bootstrap5Pagination } from "laravel-vue-pagination";
import { useAuthStore } from "@/stores/auth";
import VueDatePicker from "@vuepic/vue-datepicker";
import { useI18n } from "vue-i18n";
import useGlobalFunctions from "@/composables/global_functions.js";

const { isAuthorized } = useGlobalFunctions();

const { t } = useI18n();

const initialState = {
  server_messages: {
    type: "",
    messages: "",
  },
  is_listing: false,

  // form data
  search_query: ref(""),
};
const search_placeholder = t("Search by name, email, code..");
const form = reactive({ ...initialState });
const authStore = useAuthStore();
onMounted(() => {
  checkPermissions();
  getBranches();
  checkAddonLimit();
});

watch(
  () => form.search_query,
  _.debounce(() => {
    getBranches();
  }, 500)
);

const branches = ref([]);
const pagination = ref([]);

async function getBranches(page = 1) {
  form.is_listing = true;

  await axios
    .get("/api/branches", {
      params: {
        page: page,
        paginate_limit: paginate_limit.value,
        search_query: form.search_query,
        filter: filter,
      },
    })
    .then((response) => {
      branches.value = response.data.data;
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
  await getBranches();
}

async function changeStatus(slack) {
  var form_data = new FormData();
  form_data.append("slack", slack);

  await axios
    .post("/api/branch/update_status", form_data)
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

function viewBranch(slack) {
  router.push("/branch/" + slack);
}

function editBranch(slack) {
  router.push("/branch/edit/" + slack);
}

async function deleteBranch(slack) {
  var is_confirmed = false;

  await Swal.fire({
    title: t("Do you want to delete this branch?"),
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
      .post("/api/branch/delete", {
        slack: slack,
      })
      .then((response) => {
        if (response.data.status_code == 200) {
          Swal.fire(response.data.msg);
          getBranches();
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

//Code for Filter
const show_filter = ref(false);
const initial_filter = reactive({
  status: ref(""),
});
const filter = reactive({ ...initial_filter });
// var initial_filter = JSON.stringify(JSON.parse(JSON.stringify(filter)));
const show_clear_filter = ref(false);

async function filterList() {
  if (JSON.stringify(filter) != JSON.stringify(initial_filter)) {
    show_clear_filter.value = true;
  }
  show_filter.value = false;
  await getBranches();
}

async function fetchFilterData() {
  show_filter.value = !show_filter.value;
}

function clearFilter() {
  Object.assign(filter, initial_filter);
  show_clear_filter.value = false;
  getBranches();
}
//End filter code

/* Checking permissions */
const permissions = ref({
  write: false,
  delete: false,
});

function checkPermissions() {
  permissions.value = {
    write: isAuthorized("A_WRITE_BRANCH"),
    delete: isAuthorized("A_DELETE_BRANCH"),
  };
}

/* Check branch addon limit */

const subscription_page_url = import.meta.env.VITE_WEBSITE_SUBSCRIPTION_PAGE_URL;

const disable_branch_add = ref(false);
async function checkAddonLimit() {

  await axios
    .get("/api/branch/check_addon_limit")
    .then((response) => {
        disable_branch_add.value = response.data.data.disable_branch_add;
    })
    .catch((error) => {
      form.server_messages.type = "error";
      form.server_messages.messages = error;
    });
}

</script>
