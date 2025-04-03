<template>
  <div
    class="modal hide"
    id="editSubscriptionModal"
    tabindex="-1"
    aria-labelledby="Add Custom Field"
    aria-modal="true"
    role="dialog"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
  >
    <div class="modal-dialog modal-md modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ $t("Edit Subscription") }}</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
            @click="closeModal"
          ></button>
        </div>
        <div class="modal-body">
          <Form
            :validation-schema="schema"
            @submit="editSubscription"
            enctype="multipart/form-data"
            :initial-values="form"
            id="add_custom_field_form"
          >
            <div class="row">
              <div class="col-12">
                <h6>Subscription</h6>
              </div>
              <div class="col-6">
                <VTextInput
                    type="date"
                    name="start_date"
                    v-model="form.start_date"
                    :label="labels.start_date"
                    :required="true"
                    :readonly="true"
                    :disabled="true"
                />
              </div>
              <div class="col-6">
                <VTextInput
                    type="date"
                    name="end_date"
                    v-model="form.end_date"
                    :label="labels.end_date"
                    :required="true"
                />
              </div>
              <div class="col-12">
                <h6>Addons</h6>
              </div>
              <div class="col-12">
                <div class="row" v-if="form.addons.length>0" v-for="(addon,index) in form.addons" :key="index">
                  <div class="col-6">
                    <label class="pt-4">{{ addon.constant_name }}</label>
                  </div>
                  <div class="col-6">
                    <VTextInput
                        type="number"
                        :name="'addons['+index+'].limit_value'"
                        v-model="addon.limit_value"
                        :label="''"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div class="mt-2 text-end">
              <button
                type="submit"
                class="btn btn-danger"
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
                  {{ $t("Updating...") }}
                </span>
                <span class="pt-0" v-else> {{ $t("Update") }} </span>
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
import { useAuthStore } from "@/stores/auth";
import ClipLoader from "vue-spinner/src/ClipLoader.vue";
import { useI18n } from "vue-i18n";
import useGlobalFunctions from "@/composables/global_functions.js";

const props = defineProps(["subscription"]);
const subscription = toRef(props, "subscription");
const subscriptionData = ref('');

const { getRoundedValue } = useGlobalFunctions();

const { t } = useI18n();
const labels = ref({
  start_date: t("Start Date"),
  end_date: t("End Date"),
});
const initialState = {
  server_messages: {
    type: "",
    messages: "",
  },
  is_saving: false,

  // form data
  start_date:"",
  end_date: "",
  subscription_slack: "",
  addons:[]
};

const form = reactive({ ...initialState });
const authStore = useAuthStore();
const addons = ref([]);

onUpdated(() => {
  subscriptionData.value = props.subscription;
  console.log(subscriptionData.value);
  form.subscription_slack = subscriptionData.value.slack;
  form.start_date = subscriptionData.value.start_date;
  form.end_date = subscriptionData.value.end_date;

  form.addons = [];
  for(var i = 0;i < subscriptionData.value.user_addons.length;i++)
  {
    if(subscriptionData.value.user_addons[i].addon_master.value_type==1){
      let addon_tmp = reactive({
        id: subscriptionData.value.user_addons[i].id,
        constant_name: subscriptionData.value.user_addons[i].addon_master.constant_name,
        limit_value: subscriptionData.value.user_addons[i].limit_value,
      });
      form.addons.push(addon_tmp);
    }
  }
});

const schema = yup.object({
  start_date: yup
    .string()
    .required(t("name is required", { name: t("Start Date") })),
  end_date: yup
    .string()
    .required(t("name is required", { name: t("End Date") })),
});

const emit = defineEmits(["closeEditSubscriptionModal"]);

function closeModal() {
  resetData();
  emit("closeEditSubscriptionModal");
}

async function editSubscription() {

  form.is_saving = true;

  var form_data = new FormData();
  form_data.append("subscription_slack", form.subscription_slack);
  form_data.append("start_date", form.start_date);
  form_data.append("end_date", form.end_date);
  form_data.append("addons", JSON.stringify(form.addons));

  await axios
    .post('/api/v2/user/subscription/admin_update', form_data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((response) => {

      if (response.data.status_code == 200) {
        toast.success(response.data.msg);
        form.is_saving = false;
        closeModal();
        getSubscriptionDetail();
      } else {
        try {
          form.server_messages.type = "error";
          form.server_messages.messages = JSON.parse(response.data.msg);
        } catch (err) {
          form.server_messages.type = "error";
          form.server_messages.messages = response.data.msg;
        }
        form.is_saving = false;
      }
    })
    .catch((error) => {
      form.server_messages.type = "error";
      form.server_messages.messages = error;
      form.is_saving = false;
      console.log(error);
    });
}

function resetData() {
  Object.assign(form, initialState);
}

</script>
