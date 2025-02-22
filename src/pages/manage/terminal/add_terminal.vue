<template>
  <DefaultLayout>
    <template v-slot:subheader>
      <div class="header-nav-wrap">
        <div class="row align-items-center">
          <div class="col-auto">
            <div class="header-back-link">
              <router-link class="text-primary" to="/terminals"
                ><Icon icon="fa6-solid:chevron-left" />
                {{ $t("Terminals") }}</router-link
              >
            </div>
          </div>
          <div class="col-auto">
            <h5 class="fw-bold" v-if="slack == '' || slack == undefined">
              {{ $t("Add Terminal") }}
            </h5>
            <h5 class="fw-bold" v-else>{{ $t("Edit Terminal") }}</h5>
          </div>
        </div>
      </div>
    </template>

    <div
      class="content"
      v-if="slack == '' || slack == undefined || (slack != '' && is_loaded)"
    >
      <Form
        :validation-schema="schema"
        @submit="saveTerminal"
        :initial-values="form"
        enctype="multipart/form-data"
      >
        <div class="row card-strash">
          <div class="py-3" v-if="form.server_messages.messages != ''">
            <ServerMessage :server_messages="form.server_messages" />
          </div>

          <div class="col-md-12">
            <div class="row">
              <div class="col-md-12 mb-4">
                <div class="card">
                  <div class="row">
                    <!--                                    <div class="col-md-3">
                                      <label class="label d-flex">Login Code<span class="text-danger">*</span></label>
                                      <div class="input-group">
                                        <input type="text" class="form-control form-control-solid" placeholder="Login code" aria-label="Login Code" name="login_code" v-model="form.login_code" required>
                                        <button class="btn btn-primary min-width-0" type="button" @click="generateLoginCode">Generate</button>
                                      </div>
                                    </div>-->
                    <div class="col-md-3">
                      <VCodeGenerateTextInput
                        type="text"
                        name="login_code"
                        v-model="form.login_code"
                        :label="labels.login_code"
                        @generate_code="generateCode"
                      />
                    </div>
                    <div class="col-md-3">
                      <VTextInput
                        type="text"
                        name="name"
                        v-model="form.name"
                        :label="labels.name"
                        :required="true"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="text-end">
          <button
            type="submit"
            class="btn btn-primary"
            :disabled="form.is_submitting"
          >
            <clip-loader
              v-if="form.is_submitting"
              :color="'white'"
              :size="'20px'"
              class="pt-2 pe-2"
            >
            </clip-loader>
            <span class="pt-0" v-if="form.is_submitting">
              {{ $t("Saving...") }}
            </span>
            <span class="pt-0" v-else>
              {{ $t("Save") }}
            </span>
          </button>
        </div>
      </Form>
    </div>

    <EditFormSmallSkeleton v-else />
  </DefaultLayout>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { Form } from "vee-validate";
import * as yup from "yup";

import { useAuthStore } from "@/stores/auth";
import ClipLoader from "vue-spinner/src/ClipLoader.vue";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
const authStore = useAuthStore();

const { t } = useI18n();

const route = useRoute();
const slack = route.params.slack;
const labels = ref({
  login_code: t("Login Code"),
  name: t("Name"),
});

const initialState = {
  server_messages: {
    type: "",
    messages: "",
  },
  is_submitting: false,

  // form data
  login_code: "",
  name: "",
  terminal_slack: "",
};

const form = reactive({ ...initialState });

const schema = yup.object({
  login_code: yup.string().matches(/^([0-9]{0,999999999999999999})$/, t('Login Code only accept numbers')).required().label('Login Code'),
  name: yup.string().required(t("name is required", { name: t("Name") })),
});
const terminal = ref([]);

onMounted(() => {
  if (_.isUndefined(slack)) generateCode();
  if (!_.isUndefined(slack)) getTerminal();
});

async function generateCode() {
  let login_code = await axios.post("api/terminal/generate_login_code");
  form.login_code = login_code.data.data.login_code;
}

const is_loaded = ref(false);
async function getTerminal() {
  await axios
    .get("/api/terminal", {
      params: {
        slack: slack,
      },
    })
    .then((response) => {
      terminal.value = response.data.data;

      form.name = response.data.data.terminal_name;
      form.terminal_slack = response.data.data.slack;
      form.login_code = response.data.data.terminal_login_code;

      is_loaded.value = true;
    })
    .catch((error) => {
      form.server_messages.type = "error";
      form.server_messages.messages = error;
      console.log(error);
    });
}

async function saveTerminal() {
  form.is_submitting = true;

  var form_data = new FormData();
  form_data.append("login_code", form.login_code);
  form_data.append("name", form.name);
  form_data.append("terminal_slack", form.terminal_slack);
  var submit_url =
    form.terminal_slack != "" && form.terminal_slack != undefined
      ? "/api/terminal/update"
      : "/api/terminal/save";

  await axios
    .post(submit_url, form_data)
    .then((response) => {
      if (response.data.status_code == 200) {
        toast.success(response.data.msg);
        form.is_submitting = false;
        resetData();

        router.push("/terminals");
      } else {
        try {
          form.server_messages.type = "error";
          form.server_messages.messages = JSON.parse(response.data.msg);
        } catch (err) {
          form.server_messages.type = "error";
          form.server_messages.messages = response.data.msg;
        }
        form.is_submitting = false;
      }
    })
    .catch((error) => {
      form.server_messages.type = "error";
      form.server_messages.messages = error;
      form.is_submitting = false;
      console.log(error);
    });
}

function resetData() {
  Object.assign(form, initialState);
}
</script>
