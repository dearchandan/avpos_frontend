<template>
  <div
    class="modal modal-lg hide"
    id="addAdditionalFeeModal"
    tabindex="-1"
    aria-labelledby="Add Additional Fee"
    aria-modal="true"
    role="dialog"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5
            class="modal-title"
            v-if="form.slack == '' || form.slack == undefined"
          >
            {{ $t("Add Additional Fee") }}
          </h5>
          <h5 class="modal-title" v-else>{{ $t("Update Additional Fee") }}</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
            @click="closeModal"
            id="close_btn"
          ></button>
        </div>
        <div class="modal-body">
          <Form
            :validation-schema="schema"
            @submit="saveAdditionalFee"
            enctype="multipart/form-data"
            :initial-values="form"
            id="frmAdditionalFee"
          >
            <div class="row">
              <div class="col-6">
                <VTextInput
                  type="text"
                  name="name"
                  v-model="form.name"
                  label="Additional Fee Name"
                  :required="true"
                />
              </div>
              <div class="col-6">
                <VTextInput
                  type="text"
                  name="name_ar"
                  v-model="form.name_ar"
                  label="Additional Fee Name (Arabic)"
                />
              </div>
              <div class="col-6">
                <div class="form-field">
                  <label for="" class="pb-3">{{ $t("Type") }}<em>*</em></label>
                  <br />
                  <label
                    v-for="(option, index) in fee_types"
                    class="label"
                    :key="index"
                  >
                    <Field
                      class="form-check-input mx-2"
                      name="type"
                      type="radio"
                      :id="index"
                      v-model="form.type"
                      :value="option.id"
                    />
                    {{ option.name }}
                  </label>
                </div>
              </div>
              <div class="col-6">
                <VTextInput
                  type="text"
                  name="value"
                  :label="
                    form.type == 1
                      ? labels.additional_fees_percentage
                      : labels.additional_fees_amount
                  "
                  :required="true"
                  v-model="form.value"
                />
              </div>
              <div class="col-md-3">
                <div class="form-field">
                  <div class="form-check form-switch form-switch-2 pt-4">
                    <Field
                      class="form-check-input me-2"
                      type="checkbox"
                      role="switch"
                      name="status"
                      id="status"
                      :unchecked-value="false"
                      :value="true"
                      v-model="form.status"
                    />
                    {{ $t("Active") }}
                  </div>
                </div>
              </div>
            </div>

            <AsyncServerMessage
              class="py-3"
              v-if="server_messages.messages != ''"
              :server_messages="server_messages"
            />
            <div class="mt-2 text-end">
              <button
                type="submit"
                class="btn btn-primary"
                :disabled="form.is_saving"
              >
                <clip-loader
                  v-if="form.is_saving"
                  :color="'white'"
                  :size="'20px'"
                  class="pt-2 pe-2"
                >
                </clip-loader>
                <span class="pt-0" v-if="form.is_saving">
                  {{ $t("Saving...") }}
                </span>
                <span class="pt-0" v-else>
                  {{ $t("Save") }}
                </span>
              </button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch, computed } from "vue";
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import VTextInput from "@/components/common/VTextInput.vue";

import { useAuthStore } from "@/stores/auth";
import ClipLoader from "vue-spinner/src/ClipLoader.vue";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const AsyncServerMessage = defineAsyncComponent(() =>
  import("@/components/common/ServerMessage.vue")
);

const fee_types = ref([
  {
    id: 1,
    name: "Percentage",
  },
  {
    id: 2,
    name: "Fix Amount",
  },
]);

const labels = ref({
  name: t("Discount Name"),
  name_ar: t("Discount Name (Arabic)"),
  additional_fees_percentage: t("Fees Percentage"),
  additional_fees_amount: t("Fees Amount"),
  fee_type: t("Product Fee Type"),
  fee_value: t("Product Fee Value"),
});

const server_messages = reactive({
  type: "",
  messages: "",
});

const form = ref({
  is_saving: false,
  is_listing: false,

  // form data
  slack: "",
  name: "",
  name_ar: "",
  type: 1,
  value: "",
  status: true,
});

const authStore = useAuthStore();

const schema = yup.object({
  name: yup
    .string()
    .required(t("name is required", { name: t("Additional Fee Name") }))
    .min(
      3,
      t("name must be at least n characters", {
        name: t("Additional Fee Name"),
        number: 3,
      })
    ),
  status: yup.bool().label("status"),
  value: yup
    .string()
    .required(t("fee value is required", { name: t("Fee value is required") })),
});

const emit = defineEmits(["closeAddAdditionalFeeModal"]);

const props = defineProps({
  show_add_additional_fee_modal: Boolean,
  edit_data: {
    type: [Array, Object],
  },
});

const edit_data = toRef(props, "edit_data");

function closeModal() {
  document.getElementById("frmAdditionalFee").reset();
  resetData();
  document.getElementById("close_btn").click();
  emit("closeAddAdditionalFeeModal");
}

watch(
  () => form.value.type,
  (newValue) => {
    if (form.value.type == 1 && form.value.value > 100) {
      form.value.value = 100;
    }
  }
);
watch(
  () => form.value.value,
  (newValue) => {
    if (form.value.type == 1 && form.value.value > 100) {
      form.value.value = 100;
    } else {
      form.value.value = newValue;
    }
  }
);

watch(() => 
    props.edit_data,(value) => {
        if(value){
            form.value.name = value.name;
            form.value.name_ar = value.name_ar != null?value.name_ar:"";
            form.value.status = value.status == 1?true:false;
            form.value.type = value.type;
            form.value.value = value.value;
            form.value.slack = value.slack;
        }
    }
);

async function saveAdditionalFee() {
  form.value.is_saving = true;

  var form_data = new FormData();
  form_data.append("slack", form.value.slack);
  form_data.append("name", form.value.name);
  form_data.append(
    "name_ar",
    !_.isUndefined(form.value.name_ar) ? form.value.name_ar : ""
  );
  form_data.append("status", form.value.status);
  form_data.append("type", form.value.type);
  form_data.append("value", form.value.value);

  var submit_url =
    form.value.slack != "" && form.value.slack != undefined
      ? "/api/additional_fee/update"
      : "/api/additional_fee/save";
  await axios
    .post(submit_url, form_data)
    .then((response) => {
      if (response.data.status_code == 200) {
        toast.success(response.data.msg);
        server_messages.type = "";
        server_messages.messages = "";
        form.value.is_saving = false;
        closeModal();
      } else {
        try {
          server_messages.type = "error";
          server_messages.messages = JSON.parse(response.data.msg);
        } catch (err) {
          server_messages.type = "error";
          server_messages.messages = response.data.msg;
        }
        form.value.is_saving = false;
      }
    })
    .catch((error) => {
      server_messages.type = "error";
      server_messages.messages = error;
      form.value.is_saving = false;
      console.log(error);
    });
}


function resetData() {
  Object.assign(form, form);
}

</script>
