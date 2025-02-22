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
            <h5 class="fw-bold">{{ $t("Mail Templates") }}</h5>
          </div>
        </div>
      </div>
    </template>
    <div class="content">
      <div class="row">
        <!-- <div class="col-3"></div> -->
        <div class="col-12">
          <ListingSkeleton v-if="form.is_listing" />
          <div v-else class="table-responsive">
            <table class="table table-list-data table-hover">
              <thead class="bg-light">
                <tr>
                  <th scope="col">{{ $t("Name") }}</th>
                  <th scope="col" width="10%">{{ $t("Action") }}</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-if="mail_templates != ''"
                  v-for="(mail_template, mail_template_index) in mail_templates"
                  :key="mail_template_index"
                >
                  <td>
                    {{ mail_template.template_name }}
                  </td>
                  <td>
                    <a class="mx-2" href="#">
                      <Icon
                        icon="fa6-solid:pen"
                        class="fs-5 text-default"
                        @click="editMailTemplate(mail_template.id)"
                      />
                    </a>
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
} from "vue";

import { useI18n } from "vue-i18n";
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

const form = reactive({ ...initialState });
onMounted(() => {
  getMailTemplates();
});

watch(
  () => form.search_query,
  _.debounce(() => {
    getMailTemplates();
  }, 500)
);

const mail_templates = ref([]);
const pagination = ref([]);

async function getMailTemplates(page = 1) {
  form.is_listing = true;

  await axios
    .get("/api/mail_templates", {
      params: {
        page: page,
        paginate_limit: paginate_limit.value,
        search_query: form.search_query,
      },
    })
    .then((response) => {
      form.is_listing = false;
      mail_templates.value = response.data.data;
      pagination.value = response.data.pagination;
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
  await getMailTemplates();
}
function editMailTemplate(id) {
  router.push("/mail_template/edit/" + id);
}
</script>
