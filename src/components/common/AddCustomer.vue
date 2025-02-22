<template>
  <Form
    :validation-schema="schema"
    :initial-values="form"
    @submit="saveCustomer"
    enctype="multipart/form-data"
    id="add_customer_form"
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
                <div class="col-6 col-md-4 col-lg-3">
                  <VTextInput
                    type="text"
                    name="name"
                    v-model="form.name"
                    :label="labels.name"
                    :required="true"
                  />
                </div>

                <div class="col-6 col-md-4 col-lg-3">
                  <VTextInput
                    type="text"
                    name="phone"
                    v-model="form.phone"
                    :label="labels.phone"
                    required
                  />
                </div>

                <div class="col-6 col-md-4 col-lg-3">
                  <div class="form-field">
                    <label class="form-label"
                      >{{ $t("Country") }}</label>
                    <select
                      class="form-control form-control-solid"
                      v-model="form.country"
                    >
                      <option value="">{{ $t("Select Country") }}</option>
                      <option
                        v-for="(country, index) in countries"
                        :value="country.slack"
                        :key="index"
                      >
                        {{ country.name }}
                      </option>
                    </select>
                  </div>
                </div>

                <div class="col-6 col-md-4 col-lg-3">
                  <VTextInput
                    type="email"
                    name="email"
                    v-model="form.email"
                    :label="labels.email"
                  />
                </div>


                <div class="col-6 col-md-4 col-lg-3" v-if="form.invoice_path == false && form.quotation_path == false">
                  <div class="form-field">
                    <label>{{ $t("Customer Type") }}</label>
                    <div class="d-flex align-items-center">
                      <label class="me-3 mt-3">
                        <input
                          class="form-check-input me-1"
                          type="radio"
                          name="customer_type"
                          v-model="form.customer_type"
                          :value="2"
                          :checked="
                            form.customer_type == 2 ||
                            form.customer_type == '' ||
                            form.customer_type == undefined
                          "
                        />{{ $t("Walk-In") }}
                      </label>
                      <label class="mt-3">
                        <input
                          class="form-check-input me-1"
                          type="radio"
                          name="customer_type"
                          v-model="form.customer_type"
                          :value="1"
                          :checked="form.customer_type == 1"
                        />{{ $t("Regular") }}
                      </label>
                    </div>
                  </div>
                </div>
                <div class="col-6 col-md-4 col-lg-3">
                  <VTextInput
                    type="text"
                    name="tax_registration_name"
                    v-model="form.tax_registration_name"
                    :label="labels.tax_registration_name"
                  />
                </div>
                <div class="col-6 col-md-4 col-lg-3">
                  <VTextInput
                    type="text"
                    name="tax_registration_number"
                    v-model="form.tax_registration_number"
                    :label="labels.tax_registration_number"
                  />
                </div>

                <div class="col-6 col-md-4 col-lg-3">
                  <VTextInput
                    type="text"
                    name="gst_number"
                    v-model="form.gst_number"
                    :label="labels.gst_number"
                  />
                </div>
                <div class="col-6 col-md-4 col-lg-3">
                  <VTextInput
                    type="date"
                    name="date_of_birth"
                    v-model="form.date_of_birth"
                    :label="labels.date_of_birth"
                  />
                </div>
                <div class="col-6 col-md-4 col-lg-3">
                  <VTextInput
                    type="date"
                    name="date_of_anniversary"
                    v-model="form.date_of_anniversary"
                    :label="labels.date_of_anniversary"
                  />
                </div>
                <div class="col-6 col-md-4 col-lg-3">
                  <VTextInput
                    type="date"
                    name="joining_date"
                    v-model="form.joining_date"
                    :label="labels.joining_date"
                  />
                </div>
                <div class="col-6 col-md-4 col-lg-3">
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
                <div class="col-6 col-md-4 col-lg-3">
                  <VTextInput
                    type="text"
                    name="first_address_line"
                    v-model="form.first_address_line"
                    :label="labels.first_address_line"
                  />
                </div>
                <div class="col-6 col-md-4 col-lg-3">
                  <VTextInput
                    type="text"
                    name="second_address_line"
                    v-model="form.second_address_line"
                    :label="labels.second_address_line"
                  />
                </div>
                <div class="col-6 col-md-4 col-lg-3">
                  <VTextInput
                    type="text"
                    name="city"
                    v-model="form.city"
                    :label="labels.city"
                  />
                </div>
                <div class="col-6 col-md-4 col-lg-3">
                  <VTextInput
                    type="text"
                    name="pincode"
                    v-model="form.pincode"
                    :label="labels.pincode"
                  />
                </div>
                <div class="col-6 col-md-4 col-lg-3">
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
        >
        </clip-loader>
        <span class="pt-0" v-if="form.is_submitting">
          {{ $t("Saving...") }}
        </span>
        <span class="pt-0" v-else> {{ $t("Save") }} </span>
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
import ClipLoader from "vue-spinner/src/ClipLoader.vue";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const route = useRoute();
const slack = route.params.slack;
const labels = ref({
  name: t("Customer Name"),
  email: t("Customer Email"),
  phone: t("Customer Phone"),
  tax_registration_number: t("Tax Registration Number"),
  tax_registration_name: t("Tax Registration Name"),
  gst_number: t("GST Number"),
  date_of_birth: t("Date Of Birth"),
  date_of_anniversary: t("Date Of Anniversary"),
  joining_date: t("Date Of Joining"),
  first_address_line: t("Address Line 1"),
  second_address_line: t("Address Line 2"),
  city: t("City"),
  pincode: t("Pincode/Zipcode"),
  state: t("State"),
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
  customer_type: "",
  tax_registration_number: "",
  tax_registration_name: "",
  gst_number: "",
  date_of_birth: "",
  date_of_anniversary: "",
  joining_date: "",
  status: true,
  first_address_line: "",
  second_address_line: "",
  city: "",
  pincode: "",
  state: "",
  country: "",
  customer_slack: "",
  redirection:"",
  invoice_path: false,
  quotation_path: false,
};

const form = reactive({ ...initialState });

const props = defineProps({
  'redirection': {
    type: String,
    required: false,
    default: '',
  }
});
form.redirection = props.redirection;

const schema = yup.object({
  name: yup.string().required(t("name is required", { name: t("Customer Name") })).min(3, t("name must be at least n characters", {name: t("Customer Name"), number: 3,})).matches(/^[a-zA-Z\u0600-\u06FF\s]+$/,t('Name must be in alphabets')),
  phone: yup.string().matches(/^[0-9]{9,10}$/, t('Mobile number must be 9 or 10 digits')).typeError(t('must be a number',{ name: t('Mobile Number') })).required(t('name is required', { name: t('Mobile Number') })),
});

const countries = ref([]);
const customer = ref([]);
onMounted(() => {
  getCountries();
  if (slack != "" && slack != undefined){
    getCustomer();
  } 
  let route_path = route.path;
  form.invoice_path = route_path.includes("invoice");
  form.quotation_path = route_path.includes("quotation");
  if(form.invoice_path == true || form.quotation_path == true){
    form.customer_type = 1;
  }
});

async function getCountries() {
  await axios
    .get("/api/v2/countries/all")
    .then((response) => {
      if (response.data.status_code == 200) {
        countries.value = response.data.data;
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
const is_loaded = ref(false);
async function getCustomer() {
  await axios
    .get("/api/customer", {
      params: {
        slack: slack,
      },
    })
    .then((response) => {
      customer.value = response.data.data;
      if (response.data.data) {
        form.customer_slack = response.data.data.slack;
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
        form.country = response.data.data.country
          ? response.data.data.country.slack
          : "";
        form.date_of_anniversary = response.data.data.date_of_anniversary;
        form.date_of_birth = response.data.data.date_of_birth;
        form.joining_date = response.data.data.joining_date;
        form.customer_type = response.data.data.type;
        form.status = response.data.data.status == 1 ? true : false;
        is_loaded.value = true;
      }
    })
    .catch((error) => {
      form.server_messages.type = "error";
      form.server_messages.messages = error;
      console.log(error);
    });
}
async function saveCustomer() {
  form.is_submitting = true;

  var form_data = new FormData();
  form_data.append("name", form.name);
  form_data.append("email", form.email!=""?form.email:"");
  form_data.append("phone", form.phone);
  form_data.append("customer_type", (form.invoice_path == true || form.quotation_path == true) ? 1 : form.customer_type);
  form_data.append("tax_registration_number", form.tax_registration_number);
  form_data.append("tax_registration_name", form.tax_registration_name);
  form_data.append("gst_number", form.gst_number);
  form_data.append("date_of_birth", form.date_of_birth);
  form_data.append("date_of_anniversary", form.date_of_anniversary);
  form_data.append("joining_date", form.joining_date);
  form_data.append("status", form.status);
  form_data.append("first_address_line", form.first_address_line);
  form_data.append("second_address_line", form.second_address_line);
  form_data.append("city", form.city);
  form_data.append("pincode", form.pincode);
  form_data.append("state", form.state);
  form_data.append("country", form.country);
  form_data.append("customer_slack", form.customer_slack);
  var submit_url =
    form.customer_slack != "" && form.customer_slack != undefined
      ? "/api/customer/update"
      : "/api/customer/save";

  await axios
    .post(submit_url, form_data)
    .then((response) => {
      if (response.data.status_code == 200) {
        if(form.redirection!=''){
          router.push(form.redirection);
        }
        toast.success(response.data.msg);
        form.is_submitting = false;
        // resetData();
        if(form.invoice_path == true || form.quotation_path == true){
          form.customer_type = 1;
        }
        emit("closeAddCustomerModal");
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

const emit = defineEmits(["closeAddCustomerModal"]);
</script>
