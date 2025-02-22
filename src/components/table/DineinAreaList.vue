<template>
  <div>
    <h5 class="pb-2">{{ $t("Dine-In Areas") }}</h5>

    <div class="form-field page-heading-search-field">
      <div class="field-icon">
        <input
          type="search"
          class="form-control form-control-solid"
          :placeholder="search_placeholder"
          v-model="form.search_query"
        />
        <div class="icon">
          <Icon icon="fa6-solid:magnifying-glass" />
        </div>
      </div>
    </div>
    <ListingSkeleton v-if="form.is_listing" />
    <div v-else class="table-responsive">
      <table class="table table-list-data table-hover">
        <thead class="bg-light">
          <tr>
            <th scope="col" width="15%">{{ $t("Dine In Area") }}</th>
            <!-- <th scope="col" width="15%">{{ $t("No. of Tables") }}</th> -->
            <th scope="col" width="5%">{{ $t("Active") }}</th>
            <th
              scope="col"
              class="text-end"
              width="10%"
              v-if="
                isAuthorized('A_WRITE_TABLE') || isAuthorized('A_DELETE_TABLE')
              "
            >
              {{ $t("Action") }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-if="dinein_areas != ''"
            v-for="(area, area_index) in dinein_areas"
            :key="area_index"
          >
            <td>
              <div>
                <span class="highlighted-list-item">{{ area.name }}</span>
              </div>
            </td>
            <!-- <td>{{ area.tables.length }}</td> -->

            <td>
              <div class="form-feild">
                <div class="form-check form-switch form-switch-2">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    role="switch"
                    id="Status_id"
                    @change="changeStatus(area.slack)"
                    :checked="area.status == 1"
                  />
                </div>
              </div>
            </td>
            <td
              class="text-end"
              v-if="
                isAuthorized('A_WRITE_TABLE') || isAuthorized('A_DELETE_TABLE')
              "
            >
              <!-- <div class="dropdown">
                                <button class="btn btn-icon btn-sm btn-light dropdown-toggle arrow-none" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    <Icon icon="fa6-solid:ellipsis-vertical" />
                                </button>
                                <ul class="dropdown-menu">
                                    <li><a v-if="isAuthorized('A_WRITE_TABLE')" class="dropdown-item" href="#"  @click="openAddDineinAreaModal(area)" >{{ $t('Edit') }}</a></li>
                                    <li>
                                        <a v-if="isAuthorized('A_DELETE_TABLE')" class="dropdown-item" href="#" @click="deleteDineinArea(area.slack)">{{ $t('Delete') }}</a>
                                    </li>
                                </ul>
                            </div> -->

              <ActionButtonGroup
                :permissions="permissions"
                :slack="area.slack"
                @delete="deleteDineinArea"
                @editModal="openAddDineinAreaModal"
                :edit_modal_data="area"
              />
            </td>
          </tr>

          <tr v-else>
            <td class="text-center py-3" colspan="8">
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
            @pagination-change-page="getDineinAreas"
          />
        </div>
      </div>
    </div>
  </div>

  <AsyncAddAreaForm
    @closeAddAreaModal="getDineinAreas"
    @closeModal="closeModal"
    :edit_area_data="edit_area_data"
  />
</template>

<script setup>
import { Bootstrap5Pagination } from "laravel-vue-pagination";
import { useAuthStore } from "@/stores/auth";
import BeatLoader from "vue-spinner/src/BeatLoader.vue";
import useGlobalFunctions from "@/composables/global_functions.js";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const { isAuthorized } = useGlobalFunctions();

const initialState = {
  server_messages: {
    type: "",
    messages: "",
  },
  is_listing: false,

  // form data
  search_query: ref(""),
};
const search_placeholder = t("search dine in area by name");
const form = reactive({ ...initialState });
const edit_area_data = ref([]);

onMounted(() => {
  checkPermissions();
  getDineinAreas();
});

watch(
  () => form.search_query,
  _.debounce(() => {
    getDineinAreas();
  }, 500)
);

function openAddDineinAreaModal(editdata = "") {
  edit_area_data.value = editdata;
  //show_add_category_modal.value = true;
  $("#addAreaModal").modal("show");
}

const dinein_areas = ref([]);
const pagination = ref([]);

async function getDineinAreas(page = 1) {
  form.is_listing = true;

  await axios
    .get("/api/v2/dinein_areas", {
      params: {
        page: page,
        paginate_limit: paginate_limit.value,
        search_query: form.search_query,
      },
    })
    .then((response) => {
      dinein_areas.value = response.data.data;
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
  await getDineinAreas();
}

async function changeStatus(slack) {
  var form_data = new FormData();
  form_data.append("slack", slack);

  await axios
    .post("/api/dinein_area/update_status", form_data)
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

async function deleteDineinArea(slack) {
  var is_confirmed = false;

  await Swal.fire({
    title: t("Do you want to delete this item?"),
    showCancelButton: true,
    confirmButtonText: t("Yes, Delete"),
    cancelButtonText: t("Cancel"),
    confirmButtonColor: "#d33",
  }).then((result) => {
    if (result.isConfirmed) {
      is_confirmed = true;
    }
  });

  if (is_confirmed) {
    await axios
      .post("/api/dinein_area/delete", {
        slack: slack,
      })
      .then((response) => {
        if (response.data.status_code == 200) {
          toast.success(response.data.msg);
          getDineinAreas();
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
    write: isAuthorized("A_WRITE_TABLE"),
    delete: isAuthorized("A_DELETE_TABLE"),
  };
}

const AsyncAddAreaForm = defineAsyncComponent(() =>
  import("@/components/table/AddAreaForm.vue")
);
function closeModal() {
  edit_area_data.value = [];
}
</script>
