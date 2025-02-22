<template>
  <DefaultLayout>
    <template v-slot:subheader>
      <div class="header-nav-wrap">
        <div class="row align-items-center">
          <div class="col-auto">
            <h5 class="fw-bold">{{ $t("Notifications") }}</h5>
          </div>
        </div>
      </div>
    </template>

    <div class="content">
      <div class="page-heading">
        <div class="row align-items-center justify-content-between">
          <div class="col-auto">
            <div class="row align-items-center">
              <p class="text-danger" v-if="unread_notification_count > 0">
                {{ unread_notification_count }}
                {{ $t("Unread notifications") }}
              </p>
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
            </div>
          </div>
        </div>
      </div>
      <ListingSkeleton v-if="form.is_listing" />
      <div v-else>
        <div class="table-responsive">
          <table class="table table-list-data table-hover">
            <thead class="bg-light">
              <tr>
                <th scope="col" width="60%">{{ $t("Notification") }}</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-if="notifications != ''"
                v-for="(item, notification_index) in notifications"
                :key="notification_index"
              >
                <td
                  role="button"
                  @click="readNotification(item)"
                  :class="[ !item.is_read ? 'bg-light' : '', item.is_time_sensitive ? 'text-danger' : 'text-primary' ]"
                >
                  {{ item.notification }} <Icon v-if="item.is_time_sensitive" icon="material-symbols:alarm-outline" />
                  <br />
                  <small>{{ item.time_ago }}</small>
                </td>
              </tr>
              <tr v-else>
                <td class="text-center py-3" colspan="7">
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
                @pagination-change-page="getNotifications"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <AsyncListReleaseDetailModal :release_version="release_version" />

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

import { Bootstrap5Pagination } from "laravel-vue-pagination";
import PaginateLimit from "@/components/common/PaginateLimit.vue";
import { useI18n } from "vue-i18n";
import { useNotificationStore } from "@/stores/notificationStore";

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

const search_placeholder = t("Search notifications..");
const form = reactive({ ...initialState });

onMounted(() => {
  getNotifications();
});

watch(
  () => form.search_query,
  _.debounce(() => {
    getNotifications();
  }, 500)
);

const notifications = ref([]);
const pagination = ref([]);

async function getNotifications(page = 1) {
  form.is_listing = true;

  await axios
    .get("/api/v2/notifications", {
      params: {
        page: page,
        paginate_limit: paginate_limit.value,
        search_query: form.search_query,
      },
    })
    .then((response) => {
      notifications.value = response.data.data.notifications.data;
      pagination.value = response.data.data.notifications.pagination;
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
  await getNotifications();
}

const notificationStore = useNotificationStore();
const unread_notification_count = computed(() => {
  return notificationStore.unread_notification_count;
});

const show_view_notification_modal = ref(false);

const shown_notification = ref([]);

function redirectToURL(url) {
  router.push(url);
}

function closeViewNotificationModal() {
  show_view_notification_modal.value = false;
}

const AsyncListReleaseDetailModal = defineAsyncComponent(() =>
  import("@/components/common/ListReleaseDetailModal.vue")
);
const release_version = ref('');
async function readNotification(item) {
  let form_data = new FormData();
  form_data.append("notification_id", item.id);
  axios.post("/api/v2/notification/read", form_data).then((resp) => {
    if (resp.data.status_code == 200) {
      if (item.url != undefined && item.url != "") {
        location.href = item.url;
      }else if(item.name == 'VERSION_RELEASED'){
          release_version.value = resp.data.data.release_version;
          $('#listReleaseDetailModal').modal('show');
      }
    }
  });
}
</script>
