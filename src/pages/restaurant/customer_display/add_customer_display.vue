<template>
  <DefaultLayout>
    <template v-slot:subheader>
      <div class="header-nav-wrap">
        <div class="row align-items-center">
          <div class="col-auto">
            <div class="header-back-link">
              <router-link class="text-primary" to="/customer_displays">
                <Icon icon="fa6-solid:chevron-left" />
                {{ $t("CDSs") }}
              </router-link>
            </div>
          </div>
          <div class="col-auto">
            <h5 class="fw-bold" v-if="slack == '' || slack == undefined">
              {{ $t("Add CDS") }}
            </h5>
            <h5 class="fw-bold" v-else>{{ $t("Edit CDS") }}</h5>
          </div>
        </div>
      </div>
    </template>
    <div class="content" v-if="slack == '' || slack == undefined || (slack != '' && is_loaded)">
      <Form
        :validation-schema="schema"
        @submit="saveCustomerDisplay"
        enctype="multipart/form-data"
        :initial-values="form"
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
                    <div class="col-md-3">
                      <VTextInput
                        type="text"
                        name="name"
                        v-model="form.name"
                        :label="labels.name"
                        :required="true"
                      />
                    </div>
                    <div class="col-md-3">
                      <VTextInput
                        type="text"
                        name="activation_code"
                        v-model="form.activation_code"
                        :label="labels.activation_code"
                        :required="true"
                        :aria-disabled="true"
                        :readonly="true"
                      />
                    </div>
                    <div class="col-md-3">
                      <VSelect
                        v-model="form.terminal"
                        name="terminal"
                        :label="labels.terminal"
                        :options="terminals"
                        required
                        placeholder="Select Terminal"
                      />
                    </div>
                    <div class="col-md-3 pt-md-2">
                      <div class="form-field pt-md-2">
                        <div class="form-check form-switch pt-md-4">
                          <input
                            class="form-check-input me-2"
                            type="checkbox"
                            role="switch"
                            id="status"
                            checked
                            v-model="form.status"
                          />
                          <label class="form-check-label" for="status">{{
                            $t("Active")
                          }}</label>
                        </div>
                      </div>
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
            ></clip-loader>
            <span class="pt-0" v-if="form.is_submitting">{{
              $t("Saving...")
            }}</span>
            <span class="pt-0" v-else>{{ $t("Save") }}</span>
          </button>
        </div>
      </Form>
    </div>
    
    <EditFormSmallSkeleton v-else />
  </DefaultLayout>
</template>

<script setup>
import DefaultLayout from "@/layouts/DefaultLayout.vue";
import { ref, reactive, onMounted } from "vue";
import { Form } from "vee-validate";
import * as yup from "yup";
import VTextInput from "@/components/common/VTextInput.vue";

import { useAuthStore } from "@/stores/auth";
import ClipLoader from "vue-spinner/src/ClipLoader.vue";
import VSelect from "@/components/common/VSelect.vue";

import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const route = useRoute();
const slack = route.params.slack;
const labels = ref({
  name: t("CDS Name"),
  activation_code: t("Activation Code"),
  terminal: t("Select Terminal"),
});
const initialState = {
  server_messages: {
    type: "",
    messages: "",
  },
  is_submitting: false,

  // form data
  name: "",
  activation_code: "",
  terminal: "",
  status: true,
  cds_slack: "",
};

const form = reactive({ ...initialState });

const schema = yup.object({
  name: yup
    .string()
    .required(t("name is required", { name: t("CDS Name") }))
    .min(
      3,
      t("name must be at least n characters", {
        name: t("CDS Name"),
        number: 3,
      })
    ),
  terminal: yup
    .string()
    .required(t("name is required", { name: t("Terminal") })),
});

const customer_display = ref([]);
const terminals = ref([]);

onMounted(() => {
  if (slack != "" && slack != undefined) getCustomerDisplay();

  getCustomerDispalyAddData();
});

const is_loaded = ref(false);
async function getCustomerDispalyAddData() {
  var form_data = new FormData();
  form_data.append("slack", slack != undefined && slack != "" ? slack : "");
  let add_data = await axios.post("api/customer_display/add", form_data);
  if (slack == "" || slack == undefined)
    form.activation_code = add_data.data.data.activation_code;
  let terminal_data = add_data.data.data.terminals;
  _.forEach(terminal_data, (item) => {
    let template = {
      key: item.slack,
      value: item.terminal_name,
    };
    terminals.value.push(template);
  });
  is_loaded.value = true;
}

async function saveCustomerDisplay() {
  form.is_submitting = true;

  var form_data = new FormData();
  form_data.append("name", form.name);
  form_data.append("activation_code", form.activation_code);
  form_data.append("status", form.status);
  form_data.append("terminal", form.terminal);
  form_data.append("cds_slack", form.cds_slack);
  var submit_url =
    form.cds_slack != "" && form.cds_slack != undefined
      ? "/api/customer_display/update"
      : "/api/customer_display/save";
  await axios
    .post(submit_url, form_data)
    .then((response) => {
      if (response.data.status_code == 200) {
        toast.success(response.data.msg);
        form.is_submitting = false;

        // resetData();
        router.push("/customer_displays");
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

async function getCustomerDisplay() {
  await axios
    .get("/api/customer_display", {
      params: {
        slack: slack,
      },
    })
    .then((response) => {
      customer_display.value = response.data.data.customer_display;
      if (response.data.data.customer_display) {
        form.cds_slack = response.data.data.customer_display.slack;
        form.name = response.data.data.customer_display.name;
        form.terminal = response.data.data.customer_display.terminal
          ? response.data.data.customer_display.terminal.slack
          : "";
        form.status =
          response.data.data.customer_display.status == 1 ? true : false;
        form.activation_code =
          response.data.data.customer_display.activation_code;
      }
    })
    .catch((error) => {
      form.server_messages.type = "error";
      form.server_messages.messages = error;
      console.log(error);
    });
}
</script>
