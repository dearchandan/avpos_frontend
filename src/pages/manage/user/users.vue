<template>
  <DefaultLayout>
    <template v-slot:subheader>
      <ManageMenu />
    </template>

    <div class="content">
      <div class="page-heading position-relative">
        <div class="row align-items-center justify-content-between mb-3">
          <div class="col-auto">
            <h2 class="mb-0">{{ $t("Users") }}</h2>
          </div>
          <div class="col-auto" v-if="permissions.write">
            <router-link class="btn btn-sm btn-light-primary2" :class="{ 'disabled' : disable_user_add }" to="/user/add"
              >+ {{ $t("New User") }}</router-link
            >
          </div>
        </div>
        <div class="attention_msg_box" v-if="disable_user_add">
            {{ $t("Upgrade your subscription to add more users,") }}
            <a :href="subscription_page_url" target="_blank"><u>{{  $t("click here") }}</u></a> {{ $t("to see the plans.") }}
        </div>

        <div class="row align-items-end justify-content-between mb-3">
          <div class="col-md-auto">
            <div class="row align-items-end justify-content-between g-3">
              <div class="col-12 col-md-auto">
                <div class="form-field">
                  <label>{{ $t("Created Date") }}</label>
                  <VueDatePicker
                    range
                    v-model="filter.created_date"
                    :format="'dd-MM-yyyy'"
                    :enable-time-picker="false"
                    @update:model-value="filterList()"
                    input-class-name="form-control form-control-solid form-control-sm"
                  />
                </div>
              </div>
              <div class="col-auto">
                <div class="form-field">
                  <label>{{ $t("Status") }}</label>
                  <select
                    class="form-control form-control-sm form-control-solid"
                    v-model="filter.status"
                    @change="filterList"
                  >
                    <option value="">{{ $t("All") }}</option>
                    <option value="0">{{ $t("Inactive") }}</option>
                    <option value="1">{{ $t("Active") }}</option>
                    <option value="2">{{ $t("Hold") }}</option>
                    <option value="3">{{ $t("Left") }}</option>
                  </select>
                </div>
              </div>
              <div class="col-auto">
                <VSelect
                  name="role"
                  :label="labels.role"
                  v-model="filter.role"
                  :placeholder="labels.select_role"
                  :options="roles"
                  :height_sm="true"
                />
              </div>
              <div class="col-auto col-md-auto">
                <button
                  class="btn btn-sm btn-light-danger"
                  v-if="show_clear_filter"
                  @click="clearFilter"
                >
                  {{ $t("Clear") }}
                </button>
              </div>
            </div>
          </div>
          <div class="col-auto">
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
        </div>
      </div>
      <ListingSkeleton v-if="form.is_listing" />
      <div v-else class="table-responsive">
        <table class="table table-list-data table-hover">
          <thead class="bg-light">
            <tr>
              <th scope="col" width="20%">{{ $t("User Name") }}</th>
              <th scope="col" width="15%">{{ $t("Email") }}</th>
              <th scope="col" width="15%">{{ $t("Role") }}</th>
              <th scope="col" width="10%">{{ $t("Phone") }}</th>
              <th scope="col" width="10%">{{ $t("Login Code") }}</th>
              <th scope="col" width="10%">{{ $t("Joining Date") }}</th>
              <th scope="col" width="10%">{{ $t("Created At") }}</th>
              <th scope="col" width="10%">{{ $t("Status") }}</th>
              <th
                scope="col"
                class="text-end"
                width="5%"
                v-if="permissions.write || permissions.delete"
              >
                {{ $t("Action") }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-if="users != ''"
              v-for="(user, branch_index) in users"
              :key="branch_index"
            >
              <td @click="viewUser(user.slack)" role="button">
                <div>
                  <span class="fw-bold highlighted-list-item">{{
                    user.name
                  }}</span>
                  <br />
                  <small class="text-muted"
                    >{{ $t("Code") }}: {{ user.code }}</small
                  >
                </div>
              </td>
              <td @click="viewUser(user.slack)" role="button">
                {{ user.email }}
              </td>
              <td @click="viewUser(user.slack)" role="button">
                <span v-if="user.role">
                  {{ user.role.name }} 
                </span>
              </td>
              <td @click="viewUser(user.slack)" role="button">
                {{ user.phone }}
              </td>
              <td @click="viewUser(user.slack)" role="button">
                {{ user.login_code }}
              </td>
              <td @click="viewUser(user.slack)" role="button">
                {{ user.joining_date }}
              </td>
              <td @click="viewUser(user.slack)" role="button">
                {{ user.created_at_label }}
              </td>
              <td class="text-center">
                <div class="form-field mb-0">
                  <select
                    class="form-control form-control-solid form-control-sm"
                    v-model="user.status"
                    name="approval_status"
                    :id="user.slack"
                    @change="changeStatus($event, user.slack)"
                    :disabled="user.user_type==2"
                  >
                    <option
                      :value="option.key"
                      v-for="(option, index) in status_options"
                      :key="index"
                    >
                      {{ option.value }}
                    </option>
                  </select>
                </div>
              </td>
              <td
                class="text-end"
                v-if="permissions.write || permissions.delete"
              >
                <ActionButtonGroup
                  :permissions="permissions"
                  @edit="editUser"
                  :slack="user.slack"
                  v-if="user.user_type==2"
                />
                <ActionButtonGroup
                  :permissions="permissions"
                  @edit="editUser"
                  @delete="deleteUser"
                  :slack="user.slack"
                  v-else
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
              @pagination-change-page="getUsers"
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
import ManageMenu from "@/components/common/ManageMenu.vue";
import useGlobalFunctions from "@/composables/global_functions.js";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const { isAuthorized } = useGlobalFunctions();

const authStore = useAuthStore();
const labels = ref({
  role: t("Role"),
  select_role: t("Select Role"),
});

const show_add_branch_modal = ref(false);

function openAddUserModal() {
  show_add_branch_modal.value = true;
}
function closeAddUserModal() {
  show_add_branch_modal.value = false;
  getUsers();
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
  getUsers();
  getRoles();
  checkAddonLimit();
});

watch(
  () => form.search_query,
  _.debounce(() => {
    getUsers();
  }, 500)
);

const users = ref([]);
const pagination = ref([]);

const status_options = ref([
  {
    key: "0",
    value: "Inactive",
  },
  {
    key: "1",
    value: "Active",
  },
  {
    key: "2",
    value: "Hold",
  },
  {
    key: "3",
    value: "Left",
  },
]);

async function getUsers(page = 1) {
  form.is_listing = true;

  await axios
    .get("/api/v2/users", {
      params: {
        page: page,
        paginate_limit: paginate_limit.value,
        search_query: form.search_query,
        filter: filter,
      },
    })
    .then((response) => {
      users.value = response.data.data;
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
  await getUsers();
}

const roles = ref([]);
async function getRoles() {
  let role_data = await axios.get("api/v2/roles/all");
  role_data = role_data.data.data;
  _.forEach(role_data, (item) => {
    let template = {
      key: item.slack,
      value: item.name,
    };
    roles.value.push(template);
  });
}

async function changeStatus(event, slack) {
  var form_data = new FormData();
  form_data.append("slack", slack);
  form_data.append("status", event.target.value);

  await axios
    .post("/api/user/update_status", form_data)
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

function viewUser(slack) {
  router.push("/user/" + slack);
}
function editUser(slack) {
  router.push("/user/edit/" + slack);
}
async function deleteUser(slack) {
  var is_confirmed = false;

  await Swal.fire({
    title: t("Do you want to delete this User?"),
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
      .post("/api/user/delete", {
        slack: slack,
      })
      .then((response) => {
        if (response.data.status_code == 200) {
          Swal.fire(response.data.msg);
          getUsers();
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
  created_date: ref(""),
  status: ref(""),
  role: ref(""),
});
const filter = reactive({ ...initial_filter });
const show_clear_filter = ref(false);

watch(
  () => filter.role,
  (value) => {
    filterList();
  }
);
async function filterList() {
  if (JSON.stringify(filter) != JSON.stringify(initial_filter)) {
    show_clear_filter.value = true;
  }
  show_filter.value = false;
  await getUsers();
}

async function fetchFilterData() {
  show_filter.value = !show_filter.value;
}

function clearFilter() {
  Object.assign(filter, initial_filter);
  show_clear_filter.value = false;
  getUsers();
}

//End filter code

/* Checking permissions */
const permissions = ref({
  write: false,
  delete: false,
});

function checkPermissions() {
  permissions.value = {
    write: isAuthorized("A_WRITE_USER"),
    delete: isAuthorized("A_DELETE_USER"),
  };
}

/* Check user addon limit */
const subscription_page_url = import.meta.env
  .VITE_WEBSITE_SUBSCRIPTION_PAGE_URL;

const disable_user_add = ref(false);
async function checkAddonLimit() {
  await axios
    .get("/api/user/check_addon_limit")
    .then((response) => {
      disable_user_add.value = response.data.data.disable_user_add;
    })
    .catch((error) => {
      form.server_messages.type = "error";
      form.server_messages.messages = error;
    });
}
</script>
