<template>
      <div class="content">
      <div class="page-heading position-relative">
        <div class="row align-items-center justify-content-between mb-3">
          <div class="col-auto">
            <h2 class="mb-0">{{ $t("Users") }}</h2>
          </div>
          <div class="col-auto">
            <a :href="merchant.slack+'/user/add'" class="btn btn-sm btn-light-primary2">+ New User</a>
          </div>
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
            </tr>
          </thead>
          <tbody>
            <tr
              v-if="users != ''"
              v-for="(user, branch_index) in users"
              :key="branch_index"
            >
              <td>
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
              <td>{{ user.email }}</td>
              <td>
                <span v-if="user.role">
                  {{ user.role.name }} ({{ user.role.role_type_text }})
                </span>
              </td>
              <td> {{ user.phone }}</td>
              <td> {{ user.login_code }}</td>
              <td>{{ user.joining_date }}</td>
              <td>{{ user.created_at_label }}</td>
              <td class="text-center">
                <span v-if="user.status == 0" class="text-danger">{{ $t("Inactive") }}</span>
                <span v-if="user.status == 1" class="text-success">{{ $t("Active") }}</span>
                <span v-if="user.status == 2" class="text-warning">{{ $t("Hold") }}</span>
                <span v-if="user.status == 3" class="text-danger">{{ $t("Left") }}</span>
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
</template>

<script setup>
import { ref, onMounted, reactive, watch, defineComponent } from "vue";
import { useI18n } from "vue-i18n";
import { Bootstrap5Pagination } from "laravel-vue-pagination";
import VueDatePicker from "@vuepic/vue-datepicker";

const { t } = useI18n();

const props = defineProps(["merchant"]);
const merchant = toRef(props, "merchant");

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
  getUsers();
  getRoles();
});

watch(
  () => form.search_query,
  _.debounce(() => {
    getUsers();
  }, 500)
);
const labels = ref({
  role: t("Role"),
  select_role: t("Select Role"),
});

const users = ref([]);
const pagination = ref([]);

async function getUsers(page = 1) {
  form.is_listing = true;

  await axios
    .post("/api/merchant/users", {
        page: page,
        paginate_limit: paginate_limit.value,
        search_query: form.search_query,
        merchant_id: merchant.value.id,
        filter: filter
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
  let role_data = await axios.post("api/merchant/roles", { merchant_id: merchant.value.id});
  role_data = role_data.data.data;
  _.forEach(role_data, (item) => {
    let template = {
      key: item.slack,
      value: item.name,
    };
    roles.value.push(template);
  });
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


function clearFilter() {
  Object.assign(filter, initial_filter);
  show_clear_filter.value = false;
  getUsers();
}
//End filter code

</script>
