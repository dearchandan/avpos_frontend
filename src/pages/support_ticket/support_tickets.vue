<template>
  <DefaultLayout>
    <template v-slot:subheader>
      <div class="header-nav-wrap">
        <div class="row align-items-center">
          <!-- <div class="col-auto">
                        <div class="header-back-link">
                            <router-link class="text-primary" to="/settings" ><Icon icon="fa6-solid:chevron-left"  /> {{ $t('Settings') }}</router-link>
                        </div>
                    </div> -->
          <div class="col-auto">
            <h5 class="fw-bold">{{ $t("Support Tickets") }}</h5>
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
                <router-link
                  class="btn btn-sm btn-light-primary"
                  to="/support_ticket/add"
                  >+ {{ $t("New Support Ticket") }}</router-link
                >
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
                            <label class="form-label">{{
                              $t("Priority")
                            }}</label>
                            <select
                              class="form-control form-control-sm form-control-solid"
                              v-model="filter.priority"
                            >
                              <option value="">{{ $t("All") }}</option>
                              <option value="LOW">{{ $t("LOW") }}</option>
                              <option value="MEDIUM">{{ $t("MEDIUM") }}</option>
                              <option value="HIGH">{{ $t("HIGH") }}</option>
                            </select>
                          </div>
                        </div>
                        <div class="col-6">
                          <div class="form-field">
                            <label class="form-label">{{
                              $t("Device Type")
                            }}</label>
                            <select
                              class="form-control form-control-sm form-control-solid"
                              v-model="filter.reporting_platform"
                            >
                              <option value="">{{ $t("All") }}</option>
                              <option value="WEB">{{ $t("WEB") }}</option>
                              <option value="'WOSUL_EASY">
                                {{ $t("WOSUL EASY") }}
                              </option>
                              <option value="IPAD">{{ $t("IPAD") }}</option>
                            </select>
                          </div>
                        </div>
                        <div class="col-6">
                          <div class="form-field">
                            <label class="form-label">{{
                              $t("Ticket Type")
                            }}</label>
                            <select
                              class="form-control form-control-sm form-control-solid"
                              v-model="filter.ticket_type"
                            >
                              <option value="">{{ $t("All") }}</option>
                              <option value="INQUIRY">
                                {{ $t("Inquiry") }}
                              </option>
                              <option value="SUGGESTION">
                                {{ $t("Suggestion") }}
                              </option>
                              <option value="COMPLAINT">
                                {{ $t("Complaint") }}
                              </option>
                              <option value="TECHNICAL_PROBLEM">
                                {{ $t("Technical Problem") }}
                              </option>
                              <option value="TECHNICAL_SUPPORT">
                                {{ $t("Technical Support") }}
                              </option>
                            </select>
                          </div>
                        </div>
                        <div class="col-6">
                          <div class="form-field">
                            <label class="form-label">{{ $t("Status") }}</label>
                            <select
                              class="form-control form-control-sm form-control-solid"
                              v-model="filter.status"
                            >
                              <option value="">{{ $t("All") }}</option>
                              <option value="0">{{ $t("Open") }}</option>
                              <option value="1">{{ $t("Processing") }}</option>
                              <option value="2">{{ $t("Closed") }}</option>
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
              <th scope="col" width="40%">{{ $t("Title") }}</th>
              <th scope="col" width="18%">{{ $t("Merchant Name") }}</th>
              <th scope="col" width="12%">{{ $t("Ticket Type") }}</th>
              <th scope="col" width="10%">{{ $t("Priority") }}</th>
              <th scope="col" width="10%">{{ $t("Reporting Date") }}</th>
              <th
                scope="col"
                class="text-center"
                width="10%"
                v-if="permissions.write && permissions.delete"
              >
                {{ $t("Status") }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-if="support_tickets != ''"
              v-for="(support_ticket, branch_index) in support_tickets"
              :key="branch_index"
            >
              <td @click="viewSupportTicket(support_ticket.id)" role="button">
                {{ support_ticket.title }}
              </td>
              <td @click="viewSupportTicket(support_ticket.id)" role="button">
                {{ support_ticket.merchant_name }}
              </td>
              <td @click="viewSupportTicket(support_ticket.id)" role="button">
                <span
                  v-if="support_ticket.ticket_type == 'INQUIRY'"
                  class="badge badge-info"
                  >{{ $t("Inquiry") }}</span
                >
                <span
                  v-if="support_ticket.ticket_type == 'SUGGESTION'"
                  class="badge badge-primary"
                  >{{ $t("Suggestion") }}</span
                >
                <span
                  v-if="support_ticket.ticket_type == 'COMPLAINT'"
                  class="badge badge-warning"
                  >{{ $t("Complaint") }}</span
                >
                <span
                  v-if="support_ticket.ticket_type == 'TECHNICAL_PROBLEM'"
                  class="badge badge-danger"
                  >{{ $t("Technical Problem") }}</span
                >
                <span
                  v-if="support_ticket.ticket_type == 'TECHNICAL_SUPPORT'"
                  class="badge badge-danger"
                  >{{ $t("Technical Support") }}</span
                >
              </td>
              <td>
                <span v-if="support_ticket.priority == 'LOW'" class="text-dark">
                  {{ support_ticket.priority }}
                </span>
                <span
                  v-if="support_ticket.priority == 'MEDIUM'"
                  class="text-primary"
                  >{{ support_ticket.priority }}</span
                >
                <span
                  v-if="support_ticket.priority == 'HIGH'"
                  class="text-danger"
                >
                  <strong>{{ support_ticket.priority }} </strong></span
                >
              </td>
              <td @click="viewSupportTicket(support_ticket.id)" role="button">
                {{ support_ticket.reporting_date }}
              </td>
              <td
                class="text-end"
                v-if="permissions.write && permissions.delete"
              >
                <select
                  class="form-select form-select-solid"
                  v-model="support_ticket.status"
                  @change="
                    changeStatus(support_ticket.id, support_ticket.status)
                  "
                >
                  <option
                    value="0"
                    :disabled="
                      support_ticket.status == 1 || support_ticket.status == 2
                    "
                  >
                    {{ $t("Open") }}
                  </option>
                  <option value="1" :disabled="support_ticket.status == 2">
                    {{ $t("Processing") }}
                  </option>
                  <option value="2">{{ $t("Closed") }}</option>
                </select>
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
              @pagination-change-page="getSupportTickets"
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
import useGlobalFunctions from "@/composables/global_functions.js";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const { isAuthorized } = useGlobalFunctions();

const authStore = useAuthStore();

const initialState = {
  server_messages: {
    type: "",
    messages: "",
  },
  is_listing: false,

  // form data
  search_query: ref(""),
};
const search_placeholder = t("Search by name, arabic name, price..");
const form = reactive({ ...initialState });

onMounted(() => {
  checkPermissions();
  getSupportTickets();
});

watch(
  () => form.search_query,
  _.debounce(() => {
    getSupportTickets();
  }, 500)
);

const support_tickets = ref([]);
const pagination = ref([]);

async function getSupportTickets(page = 1) {
  form.is_listing = true;

  await axios
    .get("/api/support_tickets", {
      params: {
        page: page,
        paginate_limit: paginate_limit.value,
        search_query: form.search_query,
        filter: filter,
      },
    })
    .then((response) => {
      support_tickets.value = response.data.data;
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
  await getSupportTickets();
}

function viewSupportTicket(ticket_id) {
  router.push("/support_ticket/" + ticket_id);
}

async function changeStatus(ticket_id, status) {
  var is_status_confirmed = false;

  await Swal.fire({
    title: "Warning!",
    text: "Are you sure want to update Ticket Status?",
    icon: "warning",
    confirmButtonText: "Proceed",
    cancelButtonText: "Cancel",
    showCancelButton: true,
  }).then((result) => {
    if (result.isConfirmed) {
      is_status_confirmed = true;
    }
  });

  if (is_status_confirmed) {
    var form_data = new FormData();
    form_data.append("ticket_id", ticket_id);
    form_data.append("status", status);

    await axios
      .post("/api/support_ticket/update_status", form_data)
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
}

//Code for Filter
const show_filter = ref(false);
const initial_filter = reactive({
  reporting_platform: "",
  ticket_type: "",
  priority: "",
  status: "",
});
const filter = reactive({ ...initial_filter });
// var initial_filter = JSON.stringify(JSON.parse(JSON.stringify(filter)));
const show_clear_filter = ref(false);

async function filterList() {
  if (JSON.stringify(filter) != JSON.stringify(initial_filter)) {
    show_clear_filter.value = true;
  }
  show_filter.value = false;
  await getSupportTickets();
}

async function fetchFilterData() {
  show_filter.value = !show_filter.value;
}

function clearFilter() {
  Object.assign(filter, initial_filter);
  show_clear_filter.value = false;
  getSupportTickets();
}
//End filter code

// function editSupportTicket(slack)
// {
//   router.push('/support_ticket/edit/'+slack);
// }

// async function deleteSupportTicket(slack){

//   var is_confirmed = false;

//   await Swal.fire({
//     title: t('Do you want to delete this Support Ticket?'),
//     showCancelButton: true,
//     confirmButtonText: t('Yes, Delete'),
//     confirmButtonColor: '#d33',
//     cancelButtonText: t('Cancel'),
//   }).then( (result) => {
//     if(result.isConfirmed){
//       is_confirmed = true;
//     }
//   });

//   if(is_confirmed){

//     await axios.post('/api/support_ticket/delete',{
//       slack : slack
//     }).then( (response) => {

//       if(response.data.status_code == 200) {

//         Swal.fire(response.data.msg);
//         getSupportTickets();

//       }else{
//         try{
//           form.server_messages.type = "error";
//           form.server_messages.messages = JSON.parse(response.data.msg);
//         }catch(err){
//           form.server_messages.type = "error";
//           form.server_messages.messages = response.data.msg;
//         }
//       }

//     }).catch((error) => {
//       form.server_messages.type = "error";
//       form.server_messages.messages = error;
//       console.log(error);
//     });
//   }

// }

/* Checking permissions */
const permissions = ref({
  write: false,
  delete: false,
});

function checkPermissions() {
  permissions.value = {
    write: isAuthorized("A_WRITE_SUPPORT_TICKET"),
    delete: isAuthorized("A_DELETE_SUPPORT_TICKET"),
  };
}
</script>
