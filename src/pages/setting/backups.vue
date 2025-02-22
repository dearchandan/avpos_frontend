<template>
  <DefaultLayout>
    <template v-slot:subheader>
      <div class="header-nav-wrap">
        <div class="row align-items-center">
          <div class="col-auto">
            <div class="header-back-link">
              <router-link class="text-primary" to="/settings"
                ><Icon icon="fa6-solid:chevron-left" />
                {{ $t("Settings") }}</router-link
              >
            </div>
          </div>
          <div class="col-auto">
            <h5 class="fw-bold">{{ $t("Backups") }}</h5>
          </div>
        </div>
      </div>
    </template>

    <div class="content">
      <div class="page-heading">
        <div class="row align-items-center justify-content-between">
          <div class="col-12 py-3" v-if="form.server_messages.messages != ''">
            <ServerMessage :server_messages="form.server_messages" />
          </div>
          <div class="col-auto">
            <p class="text-center mb-2 mb-md-0">
              {{ $t("You can keep a maximum of 5 database backups") }}
            </p>
            <!-- <p class="text-center mb-2 mb-md-0">{{ $t("Backup are created daily per environment and contain a site's files and database.") }}</p> -->
          </div>
          <div class="col-auto">
            <div class="row g-2 g-md-3 justify-content-center">
              <div class="col-auto">
                <button
                  type="button"
                  v-if="form.is_downloading"
                  class="btn btn-sm btn-light-primary"
                  data-bs-toggle="modal"
                  disabled
                >
                  {{ $t("Take Backup on Server") }}
                  <beat-loader color="gray" :size="'15px'" class="pt-2 pe-2">
                  </beat-loader>
                </button>
                <button
                  type="button"
                  v-else
                  class="btn btn-sm btn-light-primary"
                  data-bs-toggle="modal"
                  @click="openAddBackupModal('on_server')"
                  data-bs-target="#addBackupModal"
                >
                  {{ $t("Take Backup on Server") }}
                </button>
              </div>
              <div class="col-auto">
                <button
                  type="button"
                  v-if="form.is_downloading"
                  class="btn btn-sm btn-primary"
                  disabled
                >
                  {{ $t("Download on My Device") }}
                  <beat-loader color="gray" :size="'15px'" class="pt-2 pe-2">
                  </beat-loader>
                </button>
                <button
                  type="button"
                  v-else
                  class="btn btn-sm btn-primary"
                  @click="openAddBackupModal('on_local')"
                >
                  {{ $t("Download on My Device") }}
                </button>
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
              <th scope="col">{{ $t("Date & Time") }}</th>
              <th scope="col">{{ $t("Backup Name") }}</th>
              <th scope="col" width="10%">{{ $t("Size In MB") }}</th>
              <th scope="col" class="text-end" width="10%">
                {{ $t("Action") }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-if="backups != ''"
              v-for="(backup, backup_index) in backups"
              :key="backup_index"
            >
              <td>{{ backup.created_at_label }}</td>
              <td>{{ backup.file_name }}</td>
              <td>{{ backup.file_size }} {{ $t("MB") }}</td>
              <td class="text-end">
                <div class="dropdown">
                  <button
                    class="btn btn-icon btn-sm btn-light dropdown-toggle arrow-none"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <Icon icon="fa6-solid:ellipsis-vertical" />
                  </button>
                  <ul class="dropdown-menu">
                    <li>
                      <a
                        class="dropdown-item"
                        href="javascript:void(0)"
                        @click="deleteBackup(backup.id, backup.file_name)"
                        >{{ $t("Delete") }}</a
                      >
                    </li>
                    <li>
                      <a
                        class="dropdown-item"
                        :href="backup.download_url"
                        download
                        >{{ $t("Download") }}</a
                      >
                    </li>
                  </ul>
                </div>
              </td>
            </tr>
            <tr v-else>
              <td colspan="5" class="text-center">
                <b>{{ $t("No Data Found") }} </b>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="data-footer"></div>
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
const AsyncViewBackup = defineAsyncComponent(() =>
  import("@/components/measurement/ViewMeasurement.vue")
);
const authStore = useAuthStore();

const show_add_measurement_modal = ref(false);
const edit_data = ref([]);
const paginate_limit = ref();

const initialState = {
  server_messages: {
    type: "",
    messages: "",
  },
  is_listing: false,
  is_downloading: false,

  // form data
  search_query: ref(""),
};

const form = reactive({ ...initialState });

onMounted(() => {
  getBackups();
});

async function openAddBackupModal(export_loc) {
  var is_confirmed = false;
  var warning_box_msg = t("Do you want to backup the database to the server?");
  if (export_loc == "on_local") {
    var warning_box_msg = t(
      "Do you want to backup the database to the local device?"
    );
  }
  form.server_messages.type = "";
  form.server_messages.messages = "";
  await Swal.fire({
    title: "Warning!",
    icon: "warning",
    text: warning_box_msg,
    showCancelButton: true,
    confirmButtonText: t("Yes, Backup"),
    confirmButtonColor: "#198754",
    cancelButtonText: t("Cancel"),
  }).then((result) => {
    if (result.isConfirmed) {
      is_confirmed = true;
    }
  });
  if (is_confirmed) {
    form.is_downloading = true;
    await axios
      .post("/api/backup/save", {
        export_location: export_loc,
      })
      .then((response) => {
        console.log(response.data);
        if (response.data.status_code == 200) {
          form.is_downloading = false;
          var response_data = response.data.data;
          // console.log(response_data.download_url);
          // return;
          var sql_dump_msg = "";
          if (response_data.sql_dump_staus == 0) {
            sql_dump_msg = "Success";
            if (export_loc == "on_local") {
              const link = document.createElement("a");
              link.target = "_blank";
              link.href = response_data.download_url;
              document.body.appendChild(link);
              link.click();
              console.log("link", link);
            }
          } else if (response_data.sql_dump_staus == 1) {
            sql_dump_msg = "Warning";
            form.server_messages.type = "error";
            form.server_messages.messages = sql_dump_msg;
          } else if (response_data.sql_dump_staus == 2) {
            sql_dump_msg = "Wrong Command";
            form.server_messages.type = "error";
            form.server_messages.messages = sql_dump_msg;
          }
          Swal.fire(response.data.msg);
          getBackups();
        } else {
          form.is_downloading = false;
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
        form.is_downloading = false;
        form.server_messages.type = "error";
        form.server_messages.messages = error;
        console.log(error);
      });
  } else {
    form.is_downloading = false;
  }
}

const backups = ref([]);

async function getBackups() {
  form.is_listing = true;
  await axios
    .get("/api/backups")
    .then((response) => {
      backups.value = response.data.data;
      form.is_listing = false;
    })
    .catch((error) => {
      form.server_messages.type = "error";
      form.server_messages.messages = error;
      form.is_listing = false;
      console.log(error);
    });
}

async function deleteBackup(backup_id, file_name) {
  var is_confirmed = false;

  await Swal.fire({
    title: "Warning!",
    icon: "warning",
    text:
      t("Do you want to delete this Backup with the file name :") +
      " " +
      file_name +
      " ?",
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
      .post("/api/backup/delete", {
        backup_id: backup_id,
      })
      .then((response) => {
        if (response.data.status_code == 200) {
          Swal.fire(response.data.msg);
          getBackups();
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
</script>
