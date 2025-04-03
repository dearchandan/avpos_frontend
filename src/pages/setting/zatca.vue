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
            <h5 class="fw-bold">
              {{ $t("Zatca Settings") }}
            </h5>
          </div>
          <div class="col-auto ms-auto" v-if="is_exists">
            <button
              @click="deleteCompany(slack)"
              class="btn btn-light btn-text-danger ms-2 btn-xs"
              :disabled="form.is_submitting"
            >
              <span v-if="form.is_submitting">
                <clip-loader :color="'white'" :size="'20px'" class="pt-2 pe-2">
                </clip-loader>
                <span class="pt-0">
                  {{ $t("Deleting...") }}
                </span>
              </span>
              <span class="pt-0" v-else>
                {{ $t("Delete Company") }}
              </span>
            </button>
          </div>
        </div>
      </div>
    </template>

    <div class="content">
      <Form
        :validation-schema="schema"
        :initial-values="form"
        @submit="registerCompany"
        enctype="multipart/form-data"
        id="add_customer_form"
        v-if="is_loaded"
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
                        name="commonName"
                        v-model="form.commonName"
                        :label="labels.commonName"
                        :required="true"
                        tooltip="The common name of the company"
                      />
                    </div>
                    <div class="col-6 col-md-4 col-lg-3">
                      <VTextInput
                        type="text"
                        name="organizationName"
                        v-model="form.organizationName"
                        :label="labels.organizationName"
                        :required="true"
                        tooltip="The company name."
                      />
                    </div>
                    <div class="col-6 col-md-4 col-lg-3">
                      <VTextInput
                        type="text"
                        name="organizationUnitName"
                        v-model="form.organizationUnitName"
                        :label="labels.organizationUnitName"
                        :required="true"
                      />
                    </div>
                    <div class="col-6 col-md-4 col-lg-3">
                      <VTextInput
                        type="text"
                        name="countryName"
                        v-model="form.countryName"
                        :label="labels.countryName"
                      />
                    </div>
                    <div class="col-6 col-md-4 col-lg-3">
                      <VTextInput
                        type="text"
                        name="deviceSerialNumber"
                        v-model="form.deviceSerialNumber"
                        :label="labels.deviceSerialNumber"
                        :required="true"
                      />
                    </div>
                    <div class="col-6 col-md-4 col-lg-3">
                      <VTextInput
                        type="text"
                        name="taxRegistrationNumber"
                        v-model="form.taxRegistrationNumber"
                        :label="labels.taxRegistrationNumber"
                        :required="true"
                      />
                    </div>
                    <div class="col-6 col-md-4 col-lg-3">
                      <VTextInput
                        type="text"
                        name="commercialRegistrationNumber"
                        v-model="form.commercialRegistrationNumber"
                        :label="labels.commercialRegistrationNumber"
                        :required="true"
                      />
                    </div>
                    <div class="col-6 col-md-4 col-lg-3">
                      <VSelect
                        name="invoiceType"
                        :label="labels.invoiceType"
                        v-model="form.invoiceType"
                        :options="invoice_type_data"
                        required
                      />
                    </div>
                    <div class="col-6 col-md-4 col-lg-3">
                      <VTextInput
                        type="text"
                        name="businessIndustry"
                        v-model="form.businessIndustry"
                        :label="labels.businessIndustry"
                        :required="true"
                        tooltip="The business industry such as (Technology, Healthcare, Retail)."
                      />
                    </div>
                    <div class="col-6 col-md-4 col-lg-3">
                      <VTextInput
                        type="text"
                        name="otp"
                        v-model="form.otp"
                        :label="labels.otp"
                        :required="true"
                        tooltip="The one-time password of ZATCA Portal that is given from the owner to start sign the invoices."
                      />
                    </div>
                    <div class="col-6 col-md-4 col-lg-3">
                      <VTextInput
                        type="text"
                        name="emailAddress"
                        v-model="form.emailAddress"
                        :label="labels.emailAddress"
                        :required="true"
                      />
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
                        name="addressStreetName"
                        v-model="form.addressStreetName"
                        :label="labels.addressStreetName"
                        :required="true"
                        />
                      </div>
                    <div class="col-6 col-md-4 col-lg-3">
                      <VTextInput
                        type="text"
                        name="addressAdditionalStreetName"
                        v-model="form.addressAdditionalStreetName"
                        :label="labels.addressAdditionalStreetName"
                        :required="true"
                        />
                    </div>
                    <div class="col-6 col-md-4 col-lg-3">
                      <VTextInput
                        type="text"
                        name="addressBuildingNumber"
                        v-model="form.addressBuildingNumber"
                        :label="labels.addressBuildingNumber"
                        :required="true"
                      />
                    </div>
                    <div class="col-6 col-md-4 col-lg-3">
                      <VTextInput
                        type="text"
                        name="addressCityName"
                        v-model="form.addressCityName"
                        :label="labels.addressCityName"
                        :required="true"
                      />
                    </div>
                    <div class="col-6 col-md-4 col-lg-3">
                      <VTextInput
                        type="text"
                        name="addressPostalZone"
                        v-model="form.addressPostalZone"
                        :label="labels.addressPostalZone"
                        :required="true"
                        />
                      </div>
                      <div class="col-6 col-md-4 col-lg-3">
                        <VTextInput
                        type="text"
                        name="addressCountrySubentity"
                        v-model="form.addressCountrySubentity"
                        :label="labels.addressCountrySubentity"
                        :required="true"
                      />
                    </div>
                    <div class="col-6 col-md-4 col-lg-3">
                      <VTextInput
                        type="text"
                        name="addressCitySubdivisionName"
                        v-model="form.addressCitySubdivisionName"
                        :label="labels.addressCitySubdivisionName"
                        :required="true"
                        tooltip="The city subdivision name such as (Naseem, Azizia)."
                      />
                    </div>
                    <div class="col-6 col-md-4 col-lg-3">
                      <VTextInput
                        type="text"
                        name="addressIdentificationCode"
                        v-model="form.addressIdentificationCode"
                        :label="labels.addressIdentificationCode"
                        tooltip="The identification code of the country. By default it's 'SA' "
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="text-end">
          <button type="submit" class="btn btn-primary">
            <clip-loader
              v-if="form.is_submitting"
              :color="'white'"
              :size="'20px'"
              class="pt-2 pe-2"
              :disabled="form.is_submitting"
            >
            </clip-loader>
            <span class="pt-0" v-if="form.is_submitting">
              <span v-if="is_exists">
                {{ $t("Updating...") }}
              </span>
              <span v-else>
                {{ $t("Registering...") }}
              </span>
            </span>
            <span class="pt-0" v-else>
              <span v-if="is_exists">
                {{ $t("Update") }}
              </span>
              <span v-else>
                {{ $t("Register") }}
              </span>
            </span>
          </button>
        </div>
       
      </Form>
      <EditFormSkeleton v-else />
    </div>
  </DefaultLayout>
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

const labels = ref({
  commonName: t("Common Name"),
  organizationName: t("Organization Name"),
  organizationUnitName: t("Organization Unit Name"),
  countryName: t("Country Name"),
  deviceSerialNumber: t("Device Serial Number"),
  taxRegistrationNumber: t("Tax Registration Number (15 Digits)"),
  commercialRegistrationNumber: t("Commercial Registration Number"),
  invoiceType: t("Invoice Type"),
  businessIndustry: t("Business Industry"),
  addressStreetName: t("Street Name"),
  addressAdditionalStreetName: t("Additional Street Name"),
  addressBuildingNumber: t("Building Number"),
  addressCityName: t("City Name"),
  addressPostalZone: t("Postal Zone (5 Digit Number)"),
  addressCountrySubentity: t("Country Subentity"),
  addressCitySubdivisionName: t("Subdivision Name"),
  addressIdentificationCode: t("Identification Code"),
  otp: t("OTP"),
  emailAddress: t("Customer Email"),
});

const initialState = {
    server_messages: {
      type: "",
      messages: "",
    },
    is_submitting: false,

    // form data
    commonName: "",
    organizationName: "",
    organizationUnitName: "",
    countryName: "",
    deviceSerialNumber: "",
    taxRegistrationNumber: "",
    commercialRegistrationNumber: "",
    invoiceType: "1100",
    businessIndustry: "",
    addressStreetName: "",
    addressAdditionalStreetName: "",
    addressBuildingNumber: "",
    addressCityName: "",
    addressPostalZone: "",
    addressCountrySubentity: "",
    addressCitySubdivisionName: "",
    addressIdentificationCode: "",
    otp: "",
    emailAddress: "",
};

const form = reactive({ ...initialState });

const schema = yup.object({
  commonName: yup.string().required(t("Common name is required", { name: t("Common name") })),
  organizationName: yup.string().required(t("Organization name is required", { name: t("Organization name") })),
  organizationUnitName: yup.string().required(t("Organization unit name is required", { name: t("Organization unit name") })),
  deviceSerialNumber: yup.string().required(t("Device serial number is required", { name: t("Device serial number") })),
  commercialRegistrationNumber: yup.string().required(t("Commercial registration number is required", { name: t("Commercial registration number") })),
  taxRegistrationNumber: yup.string().required(t("Tax registration number is required", { name: t("Tax registration number") })),
  invoiceType: yup.string().required(t("Invoice type is required", { name: t("Invoice type") })),
  businessIndustry: yup.string().required(t("Business industry is required", { name: t("Business industry") })),
  addressStreetName: yup.string().required(t("Street name is required", { name: t("Street Name") })),
  addressAdditionalStreetName: yup.string().required(t("Additional Street name is required", { name: t("Additional Street Name") })),
  addressCountrySubentity: yup.string().required(t("Country Subentity is required", { name: t("Country Subentity") })),
  addressBuildingNumber: yup.string().required(t("Building number is required", { name: t("Building number") })),
  addressCityName: yup.string().required(t("City name is required", { name: t("City name") })),
  addressPostalZone: yup.string().required(t("Postal zone is required", { name: t("Postal zone") })),
  addressCitySubdivisionName: yup.string().required(t("City subdivision name is required", { name: t("City subdivision name") })),
  otp: yup.string().required(t("OTP is required", { name: t("OTP") })),
  emailAddress: yup.string().required(t("Email address is required", { name: t("Email address") })),
});

const invoice_type_data = [
  {
    key: "0100",
    value: t("Simplified Invoices (B2C)"),
  },
  {
    key: "1000",
    value: t("Standard Invoices (B2B)"),
  },
  {
    key: "1100",
    value: t("Both Simplified & Standard Invoices"),
  }
];

onMounted(() => {
  getMerchant();
  let route_path = route.path;
});

const is_loaded = ref(false);
const is_exists = ref(false);
const slack = ref('');

async function getMerchant() {
  await axios
    .get("/api/v2/zatca/merchant")
    .then((response) => {

      is_loaded.value = true;

      if (response.data.status_code == 200 || response.data.status_code == 201 ) {
        
        form.commonName = response.data.data.commonName;
        form.organizationName = response.data.data.organizationName;
        form.organizationUnitName = response.data.data.organizationUnitName;
        form.countryName = response.data.data.countryName;
        form.deviceSerialNumber = response.data.data.deviceSerialNumber;
        form.taxRegistrationNumber = response.data.data.taxRegistrationNumber;
        form.commercialRegistrationNumber = response.data.data.commercialRegistrationNumber;
        form.invoiceType = response.data.data.invoiceType;
        form.businessIndustry = response.data.data.businessIndustry;
        form.addressStreetName = response.data.data.addressStreetName;
        form.addressAdditionalStreetName = response.data.data.addressAdditionalStreetName;
        form.addressBuildingNumber = response.data.data.addressBuildingNumber;
        form.addressCityName = response.data.data.addressCityName;
        form.addressPostalZone = response.data.data.addressPostalZone;
        form.addressCountrySubentity = response.data.data.addressCountrySubentity;
        form.addressCitySubdivisionName = response.data.data.addressCitySubdivisionName;
        form.addressIdentificationCode = response.data.data.addressIdentificationCode;
        form.otp = response.data.data.otp;
        form.emailAddress = response.data.data.emailAddress;

        slack.value = response.data.data.slack; 
        is_exists.value = true;

      }
    })
    .catch((error) => {
      form.server_messages.type = "error";
      form.server_messages.messages = error;
      console.log(error);
    });
}
async function registerCompany() {
  
  form.is_submitting = true;

  var form_data = new FormData();
  form_data.append("commonName", form.commonName);
  form_data.append("organizationName", form.organizationName);
  form_data.append("organizationUnitName", form.organizationUnitName);
  form_data.append("countryName", form.countryName || '');
  form_data.append("deviceSerialNumber", form.deviceSerialNumber);
  form_data.append("taxRegistrationNumber", form.taxRegistrationNumber);
  form_data.append("commercialRegistrationNumber", form.commercialRegistrationNumber);
  form_data.append("invoiceType", form.invoiceType);
  form_data.append("businessIndustry", form.businessIndustry);
  form_data.append("addressStreetName", form.addressStreetName);
  form_data.append("addressAdditionalStreetName", form.addressAdditionalStreetName);
  form_data.append("addressBuildingNumber", form.addressBuildingNumber);
  form_data.append("addressCityName", form.addressCityName);
  form_data.append("addressPostalZone", form.addressPostalZone);
  form_data.append("addressCountrySubentity", form.addressCountrySubentity);
  form_data.append("addressCitySubdivisionName", form.addressCitySubdivisionName);
  form_data.append("addressIdentificationCode", form.addressIdentificationCode || '');
  form_data.append("otp", form.otp);
  form_data.append("emailAddress", form.emailAddress);
  form_data.append("slack", slack.value);

  var submit_url = "/api/v2/zatca/merchant/register";

  await axios
    .post(submit_url, form_data)
    .then((response) => {

      if (response.data.status_code == 200 || response.data.status_code == 201) {
        toast.success(response.data.msg);
        form.is_submitting = false;
      } else {
          form.server_messages.type = "error";
          form.server_messages.messages = (response.data.data) ? response.data.data : response.data.msg;
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

async function deleteCompany() {
  
    var is_confirmed = false;

    await Swal.fire({
      title: t('This action cannot be undone?'),
      showCancelButton: true,
      confirmButtonText: t('Delete'),
      confirmButtonColor: '#d33',
      cancelButtonText: t('Cancel'),
    }).then( (result) => {
      if(result.isConfirmed){
        is_confirmed = true;
      }
    });

  if(is_confirmed){
    
      form.is_submitting = true;
    
      var form_data = new FormData();
      form_data.append("slack", slack.value);
    
      var submit_url = "/api/v2/zatca/merchant/delete";
    
      await axios
        .post(submit_url, form_data)
        .then((response) => {
          if (response.data.status_code == 200 || response.data.status_code == 201) {
            toast.success(response.data.msg);
            form.is_submitting = false;
          } else {
              form.server_messages.type = "error";
              form.server_messages.messages = (response.data.data) ? response.data.data : response.data.msg;
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
}
</script>
