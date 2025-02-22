<template>
  <DefaultLayout>
    <template v-slot:subheader>
      <div class="header-nav-wrap">
        <div class="row align-items-center">
          <div class="col-auto">
            <div class="header-back-link">
              <router-link class="text-primary" to="/branches"
                ><Icon icon="fa6-solid:chevron-left" />
                {{ $t("Branches") }}</router-link
              >
            </div>
          </div>
          <div class="col-auto">
            <h5 class="fw-bold" v-if="slack == undefined || slack == ''">
              {{ $t("Add Branch") }}
            </h5>
            <h5 class="fw-bold" v-else>{{ $t("Edit Branch") }}</h5>
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
        @submit="saveBranch"
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
                        name="name_ar"
                        v-model="form.name_ar"
                        :label="labels.name_ar"
                      />
                    </div>
                    <div class="col-md-3">
                      <VTextInput
                        type="email"
                        name="email"
                        v-model="form.email"
                        :label="labels.email"
                      />
                    </div>

                    <div class="col-md-3">
                      <label>{{ $t("Upload Logo") }}</label>
                      <div class="input-group input-file-group">
                        <input
                          class="form-control form-control-solid"
                          name="image"
                          type="file"
                          id="formFile"
                          accept="image/jpg, image/jpeg, image/png"
                          @change="selectFile"
                        />
                        <label
                          class="btn btn-light-primary min-width-0 mb-0"
                          for="formFile"
                          >{{ $t("Upload") }}</label
                        >
                      </div>
                    </div>

                    <div class="col-md-3">
                      <VTextInput
                        type="text"
                        name="phone"
                        v-model="form.phone"
                        :label="labels.phone"
                      />
                    </div>
                    <!-- </div>

                                            <div class="row"> -->

                    <!-- <div class="col-md-3">
                                                    <VTextInput
                                                        type="text" 
                                                        name="vat_registration_name"
                                                        v-model="form.vat_registration_name"
                                                        :label="labels.vat_registration_name"
                                                    />
                                                </div>
                                                
                                                <div class="col-md-3">
                                                    <VTextInput
                                                        type="text" 
                                                        name="vat_registration_number"
                                                        v-model="form.vat_registration_number"
                                                        :label="labels.vat_registration_number"
                                                    />
                                                </div>
                                                 -->
                    <div class="col-md-3">
                      <VTextInput
                        type="text"
                        name="gst_number"
                        v-model="form.gst_number"
                        :label="labels.gst_number"
                      />
                    </div>

                    <div class="col-md-3">
                      <div class="form-field">
                        <label for="" class="form-label">{{
                          $t("Default View")
                        }}</label>
                        <select
                          class="form-control form-control-sm form-control-solid"
                          v-model="form.default_view"
                        >
                          <option
                            value="DASHBOARD"
                            :selected="
                              form.default_view == 'DASHBOARD' ||
                              form.default_view == undefined
                            "
                          >
                            {{ $t("Dashboard") }}
                          </option>
                          <option value="INVENTORY">{{ $t("Inventory") }}</option>
                          <option value="POS">{{ $t("POS") }}</option>
                          <option value="INVOICING">{{ $t("Invoicing") }}</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-12 mb-4">
                <div class="card">
                  <h5 class="pb-3">{{ $t("Address") }}</h5>
                  <div class="row">
                    <div class="col-md-3">
                      <VTextInput
                        type="text"
                        name="first_address_line"
                        v-model="form.first_address_line"
                        :label="labels.first_address_line"
                      />
                    </div>
                    <div class="col-md-3">
                      <VTextInput
                        type="text"
                        name="second_address_line"
                        v-model="form.second_address_line"
                        :label="labels.second_address_line"
                      />
                    </div>
                    <div class="col-md-3">
                      <VTextInput
                        type="text"
                        name="district"
                        v-model="form.district"
                        :label="labels.district"
                      />
                    </div>
                    <div class="col-md-3">
                      <VTextInput
                        type="text"
                        name="city"
                        v-model="form.city"
                        :label="labels.city"
                      />
                    </div>
                    <div class="col-md-3">
                      <VTextInput
                        type="text"
                        name="pincode"
                        v-model="form.pincode"
                        :label="labels.pincode"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-12 mb-4">
                <div class="card">
                  <h5 class="pb-3">{{ $t("Branch Setting") }}</h5>
                  <div class="row">
                    <div class="col-md-3">
                      <VTextInput
                        type="text"
                        name="vat_registration_name"
                        v-model="form.vat_registration_name"
                        :label="labels.tax_registration_name"
                      />
                    </div>
                    <div class="col-md-3">
                      <VTextInput
                        type="text"
                        name="vat_registration_number"
                        v-model="form.vat_registration_number"
                        :label="labels.tax_registration_number"
                      />
                    </div>
                    <div class="col-md-3 mt-4">
                      <div class="form-field">
                        <div class="form-check">
                          <label for="tax_inclusive_pricing">
                            <input
                              class="form-check-input mt-1"
                              type="checkbox"
                              role="switch"
                              id="tax_inclusive_pricing"
                              v-model="form.tax_inclusive_pricing"
                              :checked="form.tax_inclusive_pricing"
                            />
                            <span class="fs-5">{{
                              $t("Tax Inclusive Pricing")
                            }}</span>
                          </label>
                        </div>
                      </div>
                    </div>
                    <div class="col-md-3 mt-4">
                      <div class="form-field">
                        <div class="form-check">
                          <label for="enable_order_return">
                            <input
                              class="form-check-input mt-1"
                              type="checkbox"
                              id="enable_order_return"
                              v-model="form.enable_order_return"
                              :checked="form.enable_order_return"
                            />
                            <span class="fs-5"
                              >{{ $t("Enable Order Return") }}
                            </span>
                          </label>
                        </div>
                        <small
                          ><i
                            >You can enter number of hours under which the order
                            will be allowed to return, keep it blank to make all
                            orders refundable</i
                          ></small
                        >
                      </div>
                    </div>
                    <div class="col-md-3" v-if="form.enable_order_return">
                      <VTextInput
                        type="number"
                        name="order_return_period"
                        v-model="form.order_return_period"
                        :label="labels.order_return_period"
                        min="0"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div class="col-md-12 mb-4">
                <div class="card">
                  <h5 class="pb-3">{{ $t("Policies") }}</h5>
                  <div class="row">
                    <div class="col-md-4">
                      <VTextArea
                        name="invoice_policy"
                        :label="labels.invoice_policy"
                        v-model="form.invoice_policy"
                      />
                    </div>
                    <div class="col-md-4">
                      <VTextArea
                        name="pos_policy"
                        :label="labels.pos_policy"
                        v-model="form.pos_policy"
                      />
                    </div>
                    <div class="col-md-4">
                      <VTextArea
                        name="purchase_policy"
                        :label="labels.purchase_policy"
                        v-model="form.purchase_policy"
                      />
                    </div>
                    <div class="col-md-4">
                      <VTextArea
                        name="quotation_policy"
                        :label="labels.quotation_policy"
                        v-model="form.quotation_policy"
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

    <EditFormSkeleton v-else />
  </DefaultLayout>
</template>

<script setup>
import { ref, reactive } from "vue";
import { Form } from "vee-validate";
import * as yup from "yup";
import ClipLoader from "vue-spinner/src/ClipLoader.vue";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();

const { t } = useI18n();
const initialState = {
  server_messages: {
    type: "",
    messages: "",
  },
  is_submitting: false,

  // form data
  name: "",
  name_ar: "",
  email: "",
  phone: "",
  logo: "",
  vat_registration_name: "",
  vat_registration_number: "",
  gst_number: "",
  default_view: "DASHBOARD",
  first_address_line: "",
  second_address_line: "",
  district: "",
  city: "",
  pincode: "",
  branch_slack: "",
  tax_registration_number: "",
  tax_registration_name: "",
  tax_inclusive_pricing: false,
  enable_order_return: false,
  order_return_period: 0,
  invoice_policy: "",
  pos_policy: "",
  purchase_policy: "",
  quotation_policy: "",
};
const labels = ref({
  name: t("Branch Name"),
  name_ar: t("Branch Name") + " (" + t("Arabic") + ")",
  email: t("Branch Email"),
  phone: t("Branch Phone"),
  vat_registration_name: t("VAT Registration Name"),
  vat_registration_number: t("VAT Registration Number"),
  gst_number: t("GST Number"),
  first_address_line: t("Address Line 1"),
  second_address_line: t("Address Line 2"),
  district: t("District"),
  city: t("City"),
  pincode: t("Pincode/Zipcode"),
  tax_registration_name: t("Tax Registration Name"),
  tax_registration_number: t("Tax Registration Number"),
  order_return_period: t("Enter Return Period (In Hours)"),
  invoice_policy: t("Invoice Policy"),
  pos_policy: t("POS Policy"),
  purchase_policy: t("Purchase Policy"),
  quotation_policy: t("Quotation Policy"),
});

const form = reactive({ ...initialState });

const schema = yup.object({
  name: yup
    .string()
    .required(t("name is required", { name: t("Branch Name") }))
    .min(
      3,
      t("name must be at least n characters", {
        name: t("Branch Name"),
        number: 3,
      })
    ),
  phone: yup
    .string()
    .matches(
      /^(?:[0-9]{9,10})?$/,
      t("Mobile number must be number and should be 9 or 10 digits")
    ),
  invoice_policy: yup
    .string()
    .nullable(true)
    .max(1000, t("Must not be grater than 1000 characters")),
  pos_policy: yup
    .string()
    .nullable(true)
    .max(1000, t("Must not be grater than 1000 characters")),
  quotation_policy: yup
    .string()
    .nullable(true)
    .max(1000, t("Must not be grater than 1000 characters")),
  purchase_policy: yup
    .string()
    .nullable(true)
    .max(1000, t("Must not be grater than 1000 characters")),
    vat_registration_number: yup
    .string()
    .nullable() // Allows null or empty value
    .matches(/^3\d{13}3$/, 'VAT registration number must start and end with 3, and be exactly 15 digits') // Ensure first and last digits are 3
    .test('is-valid-length', 'VAT registration number must be exactly 15 digits if provided', (value) => {
      // Check if value is either null, empty, or exactly 15 digits
      return value === null || value === '' || value.length === 15;
    }),
});

const route = useRoute();
const slack = route.params.slack;

async function selectFile(e) {
  form.logo = e.target.files[0];
}

onMounted(() => {
  if (!_.isUndefined(slack)) getBranch();
});
const branch = ref([]);
const is_loaded = ref(false);

async function getBranch() {
  await axios
    .get("/api/branch", {
      params: {
        slack: slack,
      },
    })
    .then((response) => {
      branch.value = response.data.data;
      if (response.data.data) {
        form.branch_slack = response.data.data.slack;
        form.name = response.data.data.name;
        form.name_ar = response.data.data.name_ar;
        form.email = response.data.data.email;
        form.default_view = response.data.data.default_view;
        form.district = response.data.data.district;
        form.pincode = response.data.data.pincode;
        form.city = response.data.data.city;
        form.first_address_line = response.data.data.first_address_line;
        form.second_address_line = response.data.data.second_address_line;
        form.phone = response.data.data.phone;
        form.gst_number = response.data.data.gst_number;
        form.vat_registration_name = response.data.data.tax_registration_name;
        form.vat_registration_number =
          response.data.data.tax_registration_number;
        form.tax_inclusive_pricing = response.data.data.tax_inclusive_pricing;
        form.enable_order_return = response.data.data.enable_order_return;

        form.order_return_period =
          response.data.data.order_return_period != null
            ? response.data.data.order_return_period
            : 0;
        form.invoice_policy = response.data.data.invoice_policy;
        form.pos_policy = response.data.data.pos_policy;
        form.purchase_policy = response.data.data.purchase_policy;
        form.quotation_policy = response.data.data.quotation_policy;
      }
      is_loaded.value = true;
    })
    .catch((error) => {
      form.server_messages.type = "error";
      form.server_messages.messages = error;
      // console.log(error);
    });
}

async function saveBranch() {
  form.is_submitting = true;

  var form_data = new FormData();

  // var form_fields = JSON.stringify(form);
  var form_fields = JSON.stringify({
    name: form.name,
    name_ar: form.name_ar,
    email: form.email,
    phone: form.phone,
    vat_registration_name: form.vat_registration_name,
    vat_registration_number: form.vat_registration_number,
    gst_number: form.gst_number,
    default_view: form.default_view,
    first_address_line: form.first_address_line,
    second_address_line: form.second_address_line,
    district: form.district,
    city: form.city,
    pincode: form.pincode,
    tax_inclusive_pricing: form.tax_inclusive_pricing,
    enable_order_return: form.enable_order_return,
    order_return_period: form.order_return_period,
    invoice_policy: form.invoice_policy,
    pos_policy: form.pos_policy,
    purchase_policy: form.purchase_policy,
    quotation_policy: form.quotation_policy,
    branch_slack: form.branch_slack,
  });
  // console.log('form_fields =',form_fields);
  form_data.append("form_fields", form_fields);
  form_data.append("logo", form.logo);

  // form_data.append("name", form.name);
  // form_data.append("name_ar", form.name_ar);
  // form_data.append("email", form.email);
  // form_data.append("phone", form.phone);
  // form_data.append("vat_registration_name", form.vat_registration_name);
  // form_data.append("vat_registration_number", form.vat_registration_number);
  // form_data.append("gst_number", form.gst_number);
  // form_data.append("default_view", form.default_view);
  // form_data.append("first_address_line", form.first_address_line);
  // form_data.append("second_address_line", form.second_address_line);
  // form_data.append("district", form.district);
  // form_data.append("city", form.city);
  // form_data.append("pincode", form.pincode);
  // form_data.append("tax_inclusive_pricing", form.tax_inclusive_pricing);
  // form_data.append("enable_order_return", form.enable_order_return);
  // form_data.append("order_return_period", form.order_return_period);
  // form_data.append("invoice_policy", form.invoice_policy);
  // form_data.append("branch_slack", form.branch_slack);
  var submit_url =
    form.branch_slack != "" && form.branch_slack != undefined
      ? "/api/branch/update"
      : "/api/branch/save";

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

        authStore.refresh().then(() => {
          resetData();
          router.push("/branches");
        });
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
