<template>
      <Form
        :validation-schema="schema"
        @submit="saveSupplier"
        enctype="multipart/form-data"
        :initial-values="form"
        v-if="slack == '' || slack == undefined || (slack != '' && is_loaded)"
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
                    <div class="col-md-6 col-lg-3">
                      <VTextInput
                        type="text"
                        name="name"
                        v-model="form.name"
                        :label="labels.name"
                        :required="true"
                      />
                    </div>

                    <div class="col-md-6 col-lg-3">
                      <VSelect
                        name="country"
                        :label="labels.country"
                        v-model="form.country"
                        :placeholder="labels.select_country"
                        :options="countries"
                        :required="true"
                      />
                    </div>

                    <div class="col-md-6 col-lg-3">
                      <VTextInput
                        type="email"
                        name="email"
                        v-model="form.email"
                        :label="labels.email"
                        :required="true"
                      />
                    </div>

                    <div class="col-md-6 col-lg-3">
                      <VTextInput
                        type="text"
                        name="phone"
                        v-model="form.phone"
                        :label="labels.phone"
                        :required="true"
                      />
                    </div>
                    <div class="col-md-6 col-lg-3">
                      <VTextInput
                        type="text"
                        name="tax_registration_name"
                        v-model="form.tax_registration_name"
                        :label="labels.tax_registration_name"
                      />
                    </div>
                    <div class="col-md-6 col-lg-3">
                      <VTextInput
                        type="text"
                        name="tax_registration_number"
                        v-model="form.tax_registration_number"
                        :label="labels.tax_registration_number"
                      />
                    </div>

                    <div class="col-md-6 col-lg-3">
                      <VTextInput
                        type="text"
                        name="gst_number"
                        v-model="form.gst_number"
                        :label="labels.gst_number"
                      />
                    </div>

                    <div class="col-md-6 col-lg-3 pt-2">
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
              <div class="col-md-12 mb-4">
                <div class="card">
                  <h5 class="pb-3">{{ $t("Address") }}</h5>
                  <div class="row">
                    <div class="col-md-6 col-lg-3">
                      <VTextInput
                        type="text"
                        name="first_address_line"
                        v-model="form.first_address_line"
                        :label="labels.first_address_line"
                      />
                    </div>
                    <div class="col-md-6 col-lg-3">
                      <VTextInput
                        type="text"
                        name="second_address_line"
                        v-model="form.second_address_line"
                        :label="labels.second_address_line"
                      />
                    </div>
                    <div class="col-md-6 col-lg-3">
                      <VTextInput
                        type="text"
                        name="city"
                        v-model="form.city"
                        :label="labels.city"
                      />
                    </div>
                    <div class="col-md-6 col-lg-3">
                      <VTextInput
                        type="text"
                        name="pincode"
                        v-model="form.pincode"
                        :label="labels.pincode"
                      />
                    </div>
                    <div class="col-md-6 col-lg-3">
                      <VTextInput
                        type="text"
                        name="state"
                        v-model="form.state"
                        :label="labels.state"
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
            ></clip-loader>
            <span class="pt-0" v-if="form.is_submitting">
              {{ $t("Saving...") }}
            </span>
            <span class="pt-0" v-else>
              {{ $t("Save") }}
            </span>
          </button>
        </div>
      </Form>
  <EditFormSkeleton v-else />
</template>
<script setup>
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
// const slack = route.params.slack;


const labels = ref({
  name: t("Supplier Name"),
  email: t("Supplier Email"),
  phone: t("Supplier Phone"),
  country: t("Country"),
  tax_registration_number: t("Tax Registration Number"),
  tax_registration_name: t("Tax Registration Name"),
  gst_number: t("GST Number"),
  first_address_line: t("Address Line 1"),
  second_address_line: t("Address Line 2"),
  city: t("City"),
  pincode: t("Pincode/Zipcode"),
  state: t("State"),
  select_country: t("Select Country"),
});

const initialState = {
  server_messages: {
    type: "",
    messages: "",
  },
  is_submitting: false,

  // form data
  name: "",
  email: "",
  phone: "",
  tax_registration_number: "",
  tax_registration_name: "",
  gst_number: "",
  status: true,
  first_address_line: "",
  second_address_line: "",
  city: "",
  pincode: "",
  state: "",
  country: "",
  supplier_slack: "",
  redirection:"",
};

const form = reactive({ ...initialState });
const props = defineProps({
  'redirection': {
    type: String,
    required: false,
    default: '',
  },
  'slack': {
    type: String,
    required: false,
    default: '',
  },
  'popupWindow': {
    type: Boolean,
    required: false,
    default: '',
  }
});
form.redirection = props.redirection;
const slack = props.slack;

const schema = yup.object({
  name: yup
    .string()
    .required(t("name is required", { name: t("Supplier Name") }))
    .min(
      3,
      t("name must be at least n characters", {
        name: t("Supplier Name"),
        number: 3,
      })
    ),
  country: yup.string().required(t("name is required", { name: t("Country") })),
  email: yup
    .string()
    .required(t("name is required", { name: t("Email") }))
    .min(
      3,
      t("name must be at least n characters", { name: t("Email"), number: 3 })
    )
    .email(t("must be a valid email", { name: t("Email") })),
    phone: yup.string().matches(/^[0-9]{9,10}$/, t('Mobile number must be 9 or 10 digits')).typeError(t('must be a number',{ name: t('Mobile Number') })).required(t('name is required', { name: t('Mobile Number') })),
});

const countries = ref([]);
const supplier = ref([]);

onMounted(() => {
  getCountries();
  if (slack != undefined) getSupplier();
});

async function getCountries() {
  countries.value = [];
  let country_data = await axios.get("api/v2/countries/all");
  country_data = country_data.data.data;
  _.forEach(country_data, (item) => {
    let template = {
      key: item.slack,
      value: item.name,
    };
    countries.value.push(template);
  });
}

const is_loaded = ref(false);
async function getSupplier() {
  await axios
    .get("/api/supplier", {
      params: {
        slack: slack,
      },
    })
    .then((response) => {
      supplier.value = response.data.data;
      if (response.data.data.slack != undefined) {
        form.supplier_slack = response.data.data.slack;
        form.name = response.data.data.name;
        form.email = response.data.data.email;
        form.city = response.data.data.city;
        form.state = response.data.data.state;
        form.gst_number = response.data.data.gst_number;
        form.tax_registration_number = response.data.data.tax_registration_number;
        form.tax_registration_name = response.data.data.tax_registration_name;
        form.phone = response.data.data.phone;
        form.first_address_line = response.data.data.first_address_line;
        form.second_address_line = response.data.data.second_address_line;
        form.pincode = response.data.data.postal_code;
        form.status = response.data.data.status == 1 ? true : false;
        form.country = response.data.data.supplier
          ? response.data.data.supplier.country.slack
          : "";
        is_loaded.value = true;
      }
    })
    .catch((error) => {
      form.server_messages.type = "error";
      form.server_messages.messages = error;
      console.log(error);
    });
}

async function saveSupplier() {
  form.is_submitting = true;

  var form_data = new FormData();
  form_data.append("name", form.name);
  form_data.append("email", form.email);
  form_data.append("phone", form.phone);
  form_data.append("tax_registration_number", form.tax_registration_number);
  form_data.append("tax_registration_name", form.tax_registration_name);
  form_data.append("gst_number", form.gst_number);
  form_data.append("first_address_line", form.first_address_line);
  form_data.append("second_address_line", form.second_address_line);
  form_data.append("city", form.city);
  form_data.append("pincode", form.pincode);
  form_data.append("state", form.state);
  form_data.append("country", form.country);
  form_data.append("supplier_slack", form.supplier_slack);
  form_data.append("status", form.status);
  var submit_url =
    form.supplier_slack != "" && form.supplier_slack != undefined
      ? "/api/supplier/update"
      : "/api/supplier/save";
  await axios
    .post(submit_url, form_data)
    .then((response) => {
      if (response.data.status_code == 200) {
        toast.success(response.data.msg);
        form.is_submitting = false;
        emit("closeAddSupplierModal");
        resetData();
        if(props.popupWindow == false){
          router.push("/suppliers");
        }
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

const emit = defineEmits(["closeAddSupplierModal"]);
</script>
