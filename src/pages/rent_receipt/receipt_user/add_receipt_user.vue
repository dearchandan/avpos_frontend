<template>
  <DefaultLayout>
    <template v-slot:subheader>
      <div class="header-nav-wrap">
        <div class="row align-items-center">
          <div class="col-auto">
            <div class="header-back-link">
              <router-link class="text-primary" to="/voucher_users"
              ><Icon icon="fa6-solid:chevron-left" />
                {{ $t("Rent Receipt Users") }}</router-link
              >
            </div>
          </div>
          <div class="col-auto">
            <h5 class="fw-bold" v-if="slack == undefined || slack == ''">
              {{ $t("Add Rent Receipt User") }}
            </h5>
            <h5 class="fw-bold" v-else>{{ $t("Edit Rent Receipt User") }}</h5>
          </div>
        </div>
      </div>
    </template>

    <div class="content" v-if="slack == '' || slack == undefined || (slack != '' && is_loaded)">
      <Form
          :validation-schema="schema"
          @submit="saveRentReceiptUser"
          enctype="multipart/form-data"
          :initial-values="form"
      >
        <div class="row card-strash">
          <div class="py-3" v-if="form.server_messages.messages != ''">
            <ServerMessage :server_messages="form.server_messages" />
          </div>

          <div class="col-md-12">
            <div class="row">
              <div class="col-md-12">
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
                          name="iqama_or_passport_number"
                          v-model="form.iqama_or_passport_number"
                          :label="labels.iqama_or_passport_number"
                          :required="true"
                      />
                    </div>

                    <div class="col-md-3">
                      <VTextInput
                          type="text"
                          name="country"
                          v-model="form.country"
                          :label="labels.country"
                          :required="true"
                      />
                    </div>
                    <div class="col-md-3">
                      <div class="form-field pt-2">
                        <div class="form-check form-switch pt-4">
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
    <EditFormSkeleton v-else />
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
  name: t("Name"),
  iqama_or_passport_number: t("IQAMA/Passport No."),
  country: t("Country"),
});
const initialState = {
  server_messages: {
    type: "",
    messages: "",
  },
  is_submitting: false,

  // form data
  name: "",
  iqama_or_passport_number: "",
  country: "",
  status: true,
};

const form = reactive({ ...initialState });

let schema = yup.object({
  name: yup.string().required(t("name is required", { name: t("Name") })),
  iqama_or_passport_number: yup.string().required(t("name is required", { name: t("IQAMA/Passport No.") })),
  country: yup.string().required(t("name is required", { name: t("Country") }))
});

onMounted(() => {
  if (slack != "" && slack != undefined){
    getRentReceiptUser();
  }
});


const is_loaded = ref(false);
async function getRentReceiptUser() {
  let response = await axios.get("/api/voucher_user", {
    params: {
      slack: slack,
      type: 2,
    },
  });
  if (response.data.data) {
    form.rent_receipt_user_slack = response.data.data.slack;
    form.name = response.data.data.name;
    form.iqama_or_passport_number = response.data.data.iqama_or_passport_number;
    form.country = response.data.data.country;
    form.status = response.data.data.status == 1 ? true : false;
  }
  is_loaded.value = true;
}

async function saveRentReceiptUser() {
  form.is_submitting = true;

  var form_data = new FormData();
  form_data.append("name", form.name);
  form_data.append("iqama_or_passport_number", form.iqama_or_passport_number);
  form_data.append("country", form.country);
  form_data.append("status", form.status);
  form_data.append("type", 2);
  form_data.append("slack", form.rent_receipt_user_slack);
  var submit_url =
      form.rent_receipt_user_slack != "" && form.rent_receipt_user_slack != undefined
          ? "/api/voucher_user/update"
          : "/api/voucher_user/save";

  await axios
      .post(submit_url, form_data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        if (response.data.status_code == 200) {
          toast.success(response.data.msg);
          form.is_submitting = false;

          router.push("/rent_receipt_users");
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
