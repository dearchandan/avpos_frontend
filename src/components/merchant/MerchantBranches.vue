<template>
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
                
              </div>
            </div>
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
              <th scope="col" width="10%">{{ $t("Status") }}</th>
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
              <td>
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
              <td >
                {{ branch.email }}
              </td>
              <td >
                {{ branch.phone }}
              </td>
              <td>
                <span v-if="branch.tax_registration_name != null">
                  {{ $t("Vat Name") }}: {{ branch.tax_registration_name }}
                </span>
                <span v-if="branch.tax_registration_number != null">
                  {{ $t("VAT Number") }}: {{ branch.tax_registration_number }}
                </span>
              </td>
              <td>
                {{ branch.gst_number }}
              </td>
              <td>
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
              <td>
                {{ branch.created_at_label }}
              </td>
              <td> 
                <span v-if="branch.status == 1" class="text-success">{{ branch.status_text }}</span>
                <span v-if="branch.status == 0" class="text-danger">{{ branch.status_text }}</span>
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
</template>

<script setup>
import { ref, onMounted, reactive, watch, defineComponent } from "vue";
import { useI18n } from "vue-i18n";
import { Bootstrap5Pagination } from "laravel-vue-pagination";

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
  getBranches();
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
    .post("/api/merchant/branches", {
        page: page,
        paginate_limit: paginate_limit.value,
        search_query: form.search_query,
        merchant_id: merchant.value.id,
        filter: filter,
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


</script>