<template>
  <DefaultLayout>
    <template v-slot:subheader>
      <RestaurantMenu />
    </template>
    <div class="content">
      <div class="page-heading pt-2">
        <div class="row align-items-center">
          <div class="col-md-4 col-lg-3">
            <div class="form-field mb-0">
              <label>{{ $t("Date Range") }}</label>

              <VueDatePicker
                range
                :preset-dates="presetDates"
                v-model="filters.reservation_dates"
                :format="'dd-MM-yyyy'"
                :enable-time-picker="false"
                                      input-class-name="form-control-solid form-control form-control-sm"
              >
                <template
                  #preset-date-range-button="{ label, value, presetDate }"
                >
                  <span
                    role="button"
                    :tabindex="0"
                    @click="presetDate(value)"
                    @keyup.enter.prevent="presetDate(value)"
                    @keyup.space.prevent="presetDate(value)"
                  >
                    {{ label }}
                  </span>
                </template>
              </VueDatePicker>

            </div>
          </div>
        </div>
      </div>
      <div v-if="!form.is_listing"> 
        <div class="table-responsive">
          <table class="table table-list-data table-hover">
            <thead class="bg-light">
              <tr>
                <th scope="col" width="15%">{{ $t("Date & Time") }}</th>
                <th scope="col" width="10%">{{ $t("Person Detail") }}</th>
                <th scope="col" width="10%">
                  {{ $t("Check In Status (Checked In)") }}
                </th>
                <th scope="col" width="10%">{{ $t("Check In Time") }}</th>
                <th scope="col" width="10%">{{ $t("Booked Table") }}</th>
                <th scope="col" width="5%">{{ $t("Seats") }}</th>
                <th scope="col" width="10%">{{ $t("Reserved At") }}</th>
                <th scope="col" class="text-end" width="20%">
                  {{ $t("Action") }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-if="reservations != ''"
                v-for="(reservation, reservation_index) in reservations"
                :key="reservation_index"
              >
                <td role="button">
                  {{ reservation.reservation_date_formatted }}
                  {{ reservation.reservation_time_formatted }}
                </td>
                <td role="button">
                  {{ reservation.person_contact }}
                  <br v-if="reservation.person_name != ''" />
                  {{ reservation.person_name }}
                </td>
                <td role="button">
                  {{
                    reservation.checked_in_at != "" &&
                    reservation.checked_in_at != null
                      ? "Checked In"
                      : ""
                  }}
                </td>
                <td role="button">
                  {{ reservation.checked_in_at_formatted }}
                </td>
                <td role="button">
                  {{ reservation.table?.name }}
                </td>
                <td role="button">
                  {{ reservation.reserved_seats }}
                </td>
                <td>
                  {{ reservation.reserved_at }}
                </td>
                <td class="text-end">
                  <div>
                    <a
                      v-if="
                        reservation.is_check_in_time &&
                        reservation.checked_in_at == null
                      "
                      class="btn btn-sm btn-success"
                      href="#"
                      @click="checkIn(reservation.id)"
                      >{{ $t("Check-In") }}</a
                    >
                    <a
                      v-if="reservation.checked_in_at == null"
                      class="ms-1 btn btn-sm btn-warning"
                      href="#"
                      @click="cancelBooking(reservation.id)"
                      :class="[reservation.is_check_in_time ? 'w-40' : '']"
                      >{{ $t("Cancel") }}</a
                    >
                    <a
                      v-else
                      href="#"
                      class="btn btn-sm ms-1"
                      :class="[
                        reservation.spent_minutes > 45
                          ? 'btn-danger'
                          : 'btn-success',
                      ]"
                      @click="cancelBooking(reservation.id)"
                      >{{ $t("Free Table") }}</a
                    >
                  </div>
                  <!-- <div class="dropdown">
                                    <button class="btn btn-icon btn-sm btn-light dropdown-toggle arrow-none" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        <Icon icon="fa6-solid:ellipsis-vertical" />
                                    </button>
                                    <ul class="dropdown-menu">
                                        <li><a v-if="permissions.write" class="dropdown-item" href="#" @click="editProduct(product.slack)">{{ $t('Edit') }}</a></li>
                                        <li><a v-if="permissions.write" class="dropdown-item" href="#" @click="cloneProduct(product.slack)">{{ $t('Clone') }}</a></li>
                                        <a v-if="permissions.delete" class="dropdown-item" href="#" @click="deleteProduct(product.slack)">{{ $t('Delete') }}</a>
                                    </ul>
                                </div> -->
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
                @pagination-change-page="getReservations"
              />
            </div>
          </div>
        </div>
      </div>
      <ListingSkeleton v-else />
    </div>
  </DefaultLayout>
</template>
<script setup>
import { Bootstrap5Pagination } from "laravel-vue-pagination";
import VueDatePicker from "@vuepic/vue-datepicker";
import BeatLoader from "vue-spinner/src/BeatLoader.vue";
import { useAuthStore } from "@/stores/auth";
import useGlobalFunctions from "@/composables/global_functions.js";
import { useI18n } from "vue-i18n";
import {
  endOfMonth,
  endOfYear,
  startOfMonth,
  startOfYear,
  subMonths,
} from "date-fns";

const { t } = useI18n();
const { isAuthorized } = useGlobalFunctions();
const presetDates = ref([
  { label: "Today", value: [new Date(), new Date()] },
  {
    label: "This month",
    value: [startOfMonth(new Date()), endOfMonth(new Date())],
  },
  {
    label: "Last month",
    value: [
      startOfMonth(subMonths(new Date(), 1)),
      endOfMonth(subMonths(new Date(), 1)),
    ],
  },
  {
    label: "This year",
    value: [startOfYear(new Date()), endOfYear(new Date())],
  },
]);

onMounted(() => {
  getReservations();
});

const auth = useAuthStore();

const initialState = {
  server_messages: {
    type: "",
    messages: "",
  },
  is_listing: false,

  // form data
  search_query: ref(""),
};
const form = reactive({ ...initialState });
/* Filters */
const initial_filters = reactive({
  reservation_dates: ref([startOfMonth(new Date()), endOfMonth(new Date())]),
});
const filters = reactive({ ...initial_filters });

const reservations = ref([]);
const pagination = ref([]);

const paginate_limit = ref();

watch(
  filters,
  () => {
    getReservations();
  },
  { deep: true }
);

async function getReservations(page = 1) {
  form.is_listing = true;

  await axios
    .post("/api/reservations", {
      page: page,
      paginate_limit: paginate_limit.value,
      filters: filters,
    })
    .then((response) => {
      reservations.value = response.data.data;
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

async function paginate_limit_update(value) {
  paginate_limit.value = value;
  await getReservations();
}

async function cancelBooking(id) {
  var form_data = new FormData();
  form_data.append("reservation_id", id);

  await axios
    .post("/api/cashier/cancel_table_booking", form_data)
    .then((response) => {
      if (response.data.status_code == 200) {
        toast.success(response.data.msg);
        getReservations();
      } else {
        toast.error(response.data.msg);
      }
    })
    .catch((error) => {
      form.server_messages.type = "error";
      form.server_messages.messages = error;
      form.is_processing = false;
      console.log(error);
    });
}

async function checkIn(id) {
  var form_data = new FormData();
  form_data.append("reservation_id", id);

  await axios
    .post("/api/cashier/check_in_table", form_data)
    .then((response) => {
      if (response.data.status_code == 200) {
        toast.success(response.data.msg);
        getReservations();
      } else {
        toast.error(response.data.msg);
      }
    })
    .catch((error) => {
      form.server_messages.type = "error";
      form.server_messages.messages = error;
      form.is_processing = false;
      console.log(error);
    });
}
</script>
