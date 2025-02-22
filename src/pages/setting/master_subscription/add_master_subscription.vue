<template>
  <DefaultLayout>
    <template v-slot:subheader>
      <div class="header-nav-wrap">
        <div class="row align-items-center">
          <div class="col-auto">
            <div class="header-back-link">
              <router-link class="text-primary" to="/master_subscriptions">
                <Icon icon="fa6-solid:chevron-left" />
                {{ $t("Subscriptions") }}
              </router-link>
            </div>
          </div>
          <div class="col-auto">
            <h5 class="fw-bold" v-if="slack == '' || slack == undefined">
              {{ $t("Add Subscription") }}
            </h5>
            <h5 class="fw-bold" v-else>{{ $t("Edit Subscription") }}</h5>
          </div>
        </div>
      </div>
    </template>

    <div class="content" v-if="slack == '' || slack == undefined || (slack != '' && is_loaded)"
>
      <Form
        :validation-schema="schema"
        v-slot="{ setFieldValue, values }"
        @submit="saveSubscription"
        enctype="multipart/form-data"
        :initial-values="form"
      >
        <div class="row card-strash">
          <AsyncServerMessage
            class="py-3"
            v-if="server_messages.messages != ''"
            :server_messages="server_messages"
          />
          <div class="col-md-12">
            <div class="row">
              <div class="col-md-12 mb-4">
                <div class="card">
                  <div class="row">
                    <h5 class="section-title pb-3 text-muted">
                      {{ $t("Basic Details") }}:
                    </h5>

                    <div class="col-6">
                      <VTextInput
                        type="text"
                        name="name"
                        :label="labels.name"
                        :required="true"
                        v-model="form.name"
                      />
                    </div>

                    <div class="col-6">
                      <VTextInput
                        type="text"
                        name="name_ar"
                        :label="labels.name_ar"
                        v-model="form.name_ar"
                        required
                      />
                    </div>

                    <div class="col-3">
                      <VSelectInput
                        name="subscription_category"
                        :label="labels.subscription_category"
                        required
                        :options="subscription_categories"
                        v-model="form.subscription_category"
                        tooltip="Plan: POS Package, Service: Wosul Pay "
                      />
                    </div>

                    <div class="col-3">
                      <VSelectInput
                        name="device_type"
                        :label="labels.device_type"
                        required
                        :options="device_types"
                        v-model="form.device_type"
                      />
                    </div>

                    <div class="col-3">
                      <VSelectInput
                        name="subscription_for"
                        :label="labels.subscription_for"
                        required
                        :options="subscription_fors"
                        v-model="form.subscription_for"
                      />
                    </div>

                    <div class="col-3">
                      <!-- <VMultiSelect
                          name="country_id"
                          :label="labels.select_country"
                          :text="'name'"
                          :value="'slack'"
                          mode="single"
                          :selected="form.country_id"
                          :options="countries"
                          required
                          v-model="form.country_id"
                      /> -->

                      <VSelectInput
                        name="country_id"
                        :label="labels.select_country"
                        required
                        :options="countries"
                        v-model="form.country_id"
                      />
                    </div>

                    <div class="col-12">
                      <div class="row">
                        <div class="col-3">
                          <VSelectInput
                            v-model="form.is_trial"
                            name="is_trial"
                            :label="labels.is_trial"
                            required
                            :options="is_trial_options"
                          />
                        </div>
                        <div class="col-3" v-if="form.is_trial">
                          <VTextInput
                            type="number"
                            name="trial_days"
                            :label="labels.trial_days"
                            v-model="form.trial_days"
                          />
                        </div>
                        <div class="col-3" v-show="!form.is_trial">
                          <VTextInput
                              type="number"
                              name="subscription_tenure"
                              :label="labels.subscription_tenure"
                              v-model="form.subscription_tenure"
                          />
                        </div>
                        <div class="col-3" v-show="!form.is_trial">
                          <VTextInput
                              type="text"
                              name="offer_name"
                              :label="labels.offer_name"
                              v-model="form.offer_name"
                          />
                        </div>
                        <div class="col-3" v-show="!form.is_trial">
                          <VTextInput
                              type="number"
                              name="strike_through_price"
                              :label="labels.strike_through_price"
                              v-model="form.strike_through_price"
                          />
                        </div>
                        <div class="col-2" v-show="!form.is_trial">
                          <VSelectInput
                            v-model="form.price_type"
                            name="price_type"
                            :label="labels.price_type"
                            required
                            :options="price_types"
                            @change="calculatePrice"
                            :disabled="true"
                          />
                        </div>
                        <div class="col-2" v-show="!form.is_trial">
                          <VTextInput
                            type="number"
                            name="price"
                            :label="labels.price"
                            v-model="form.price"
                            readonly
                          />
                        </div>
<!--                        <div class="col-2" v-show="!form.is_trial">
                          <VTextInput
                              type="text"
                              name="discount_name"
                              :label="labels.discount_name"
                              v-model="form.discount_name"
                          />
                        </div>
                        <div class="col-2" v-show="!form.is_trial">
                          <VSelectInput
                              name="discount_type"
                              :label="labels.discount_type"
                              :options="discount_types"
                              v-model="form.discount_type"
                              @change="calculatePrice"
                          />
                        </div>
                        <div class="col-2" v-show="!form.is_trial">
                          <VTextInput
                              type="number"
                              name="discount_value"
                              :label="labels.discount_value"
                              v-model="form.discount_value"
                              @input="calculatePrice"
                          />
                        </div>-->
                        <div
                          class="col-2"
                          v-show="!form.is_trial"
                        >
                          <VTextInput
                            type="text"
                            name="tax_name"
                            :label="labels.tax_name"
                            v-model="form.tax_name"
                            readonly
                          />
                        </div>
                        <div
                          class="col-2"
                          v-show="!form.is_trial"
                        >
                          <VTextInput
                            type="number"
                            name="tax_percentage"
                            :label="labels.tax_percentage"
                            v-model="form.tax_percentage"
                            @input="calculatePrice"
                            readonly
                          />
                        </div>
                        <div
                          class="col-2"
                          v-show="!form.is_trial"
                        >
                          <VTextInput
                            type="number"
                            name="tax_amount"
                            :label="labels.tax_amount"
                            v-model="form.tax_amount"
                            readonly
                          />
                        </div>
                        <div class="col-2" v-show="!form.is_trial">
                          <VTextInput
                            type="number"
                            name="payable_amount"
                            :label="labels.payable_amount"
                            v-model="form.payable_amount"
                            @input="calculatePrice"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div class="col-3">
                      <div class="form-field mt-2">
                        <div class="form-check form-switch">
                          <Field
                            class="form-check-input me-2"
                            type="checkbox"
                            role="switch"
                            name="status"
                            id="status"
                            :unchecked-value="false"
                            :value="values.status"
                            @change="
                              (event) =>
                                setFieldValue('status', event.target.checked)
                            "
                          />
                          <label class="form-check-label" for="status"
                            >{{ $t("Active") }} <em>*</em>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
       
              <div class="col-md-12 mb-4">
                <div class="card">
                  <div class="row">
                    <h5 class="section-title pb-3 text-muted">
                      {{ $t("Addons") }}
                    </h5>
                    <div
                      class="col-md-3 my-2"
                      v-for="(addon, index) in addon_selected"
                      v-bind:key="index"
                      v-show="(addon.value_type == 1) || (addon.value_type == 2 && addon.constant_name !='PAYMENT_GATEWAY' && addon.constant_name !='WOSUL_PAY') || (addon.constant_name =='PAYMENT_GATEWAY' && is_payment_gateway==true) || (addon.constant_name =='WOSUL_PAY' && is_wosul_pay==true)"
                    >
                      <div class="card p-5 form-check" v-if="addon.value_type == 2">
                        <label class="form-check-label mb-0 mt-3">
                          <input
                            class="form-check-input"
                            type="checkbox"
                            v-model="addon.value"
                            :checked="addon.value"
                            v-bind:value="addon.id"
                            v-bind:id="addon.constant_name"
                            @change="checkSubAddon"
                          />
                          <h6 class="text-primary text-uppercase">
                            {{ addon.name }}
                          </h6>
                          <p class="text-muted">{{ addon.description }}</p>
                          <h6>
                            {{ addon.price }} {{ currency_symbol }}
                              <small v-if="addon.type == 1">/Month </small>
                              <small v-if="addon.type == 2">/Year </small>
                          </h6>
                        </label>
                      </div>
                      <div v-if="addon.value_type == 1" class="card p-5 my-2">
                        <label class="form-check-label mb-0 mt-3">
                          <h6 class="text-primary text-uppercase">
                            {{ addon.name }}
                          </h6>
                          <p class="text-muted mb-0">{{ addon.description }}</p>
                        <VTextInput
                          type="number"
                          :name="addon.constant_name"
                          v-model="addon.value"
                          class="mb-0"
                          :input_group_text="addon.constant_name == 'BRANCH_LIMIT' ? '/Branch' : '/User'"
                        />
                        <h6 class="mt-3" >
                            {{ addon.price }} {{ currency_symbol }}
                              <small v-if="addon.type == 1">/Month </small>
                              <small v-if="addon.type == 2">/Year </small>
                          </h6>
                      </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-12 mb-4">
                <div class="card">
                  <div class="row">
                    <h5 class="section-title pb-3 text-muted">
                      {{ $t("Optional Details") }}
                    </h5>
                    <div class="col-md-6">
                      <label>{{ $t("Description") }}</label>
                      <Field
                        as="textarea"
                        class="form-control form-control-solid p-3"
                        name="description"
                        :label="labels.description"
                        cols="3"
                        rows="2"
                        v-model="form.description"
                      ></Field>
                    </div>

                    <div class="col-md-6">
                      <label>{{ $t("Description (Arabic)") }}</label>
                      <Field
                        as="textarea"
                        class="form-control form-control-solid p-3"
                        name="description_ar"
                        :label="labels.description_ar"
                        cols="3"
                        rows="2"
                        v-model="form.description_ar"
                      ></Field>
                    </div>
                    <input type="hidden" name="slack" />
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
import { ref, reactive, onMounted, defineAsyncComponent, computed } from "vue";
import { useRoute } from "vue-router";
import { Form, Field } from "vee-validate";
import * as yup from "yup";
import { useAuthStore } from "@/stores/auth";
import ClipLoader from "vue-spinner/src/ClipLoader.vue";
import { useI18n } from "vue-i18n";
import useGlobal from "@/composables/global.js";

const { t } = useI18n();
const route = useRoute();
const slack = route.params.slack;
const product = ref([]);

const labels = ref({
  name: t("Subscription Name"),
  name_ar: t("Subscription Name (Arabic)"),
  subscription_category: t("Subscription Category"),
  device_type: t("Device Type"),
  subscription_for: t("Subscription For"),
  select_country: t("Select Country"),
  is_trial: t("Is Trial Subscription"),
  trial_days: t("Trial Days"),
  price_type: t("Price Type"),
  price: t("Price"),
  tax_name: t("Tax Name"),
  tax_percentage: t("Tax(%)"),
  discount_name: t("Discount Name"),
  discount_type: t("Discount Type"),
  discount_value: t("Discount Amount"),
  payable_amount: t("Payable Amount"),
  description: t("Description"),
  description_ar: t("Description (Arabic)"),
  subscription_tenure: t("Subscription Tenure"),
  tax_amount: t("Tax Amount"),
  offer_name: t("Offer Name"),
  strike_through_price: t("Strike Through Price"),
});
const AsyncServerMessage = defineAsyncComponent(() =>
  import("@/components/common/ServerMessage.vue")
);

const auth = useAuthStore();
const currency_symbol = computed(() => {
  return auth.user.currency.symbol;
});

const server_messages = reactive({
  type: "",
  messages: "",
});

const form = ref({
  is_submitting: false,
  // form data (field names must match with database table)
  name: "",
  name_ar: "",
  subscription_category: 1,
  device_type: 1,
  subscription_for: 1,
  country_id: "",
  is_trial: 0,
  trial_days: 7,
  price_type: 1,
  price: "",
  tax_name: "VAT",
  tax_percentage: "15",
  tax_amount: "",
  discount_name: "",
  discount_type: "",
  discount_value: "",
  payable_amount: 0,
  status: true,
  description: "",
  description_ar: "",
  subscription_tenure: "",
  offer_name: "",
  strike_through_price: "",
  slack: "",
});
const addon_selected = ref([]);

const {
  device_types,
  subscription_fors,
  price_types,
  discount_types,
  subscription_categories,
} = useGlobal();

const is_trial_options = ref([
  {
    id: 0,
    name: "No",
  },
  {
    id: 1,
    name: "Yes",
  },
]);

const multiselect = defineComponent(Multiselect);

const schema = yup.object({
  name: yup
    .string()
    .required(t("name is required", { name: t("Subscription Name") }))
    .min(
      3,
      t("name must be at least n characters", {
        name: t("Subscription Name"),
        number: 3,
      })
    ),
  name_ar: yup
    .string()
    .required(t("name is required", { name: t("Subscription Name Ar") }))
    .min(
      3,
      t("name must be at least n characters", {
        name: t("Subscription Name Ar"),
        number: 3,
      })
    ),
  // price: yup.string().required(t('name is required', { name: t('Price') })),
  country_id: yup
    .string()
    .required(t("name is required", { name: t("Country") })),
  payable_amount: yup
    .string()
    .nullable()
    .when("is_trial", {
      is: (is_trial) => is_trial == false,
      then: (schema) =>
        schema.required(t("Payable Amount is required", { name: t("Payable Amount") })),
      otherwise: (schema) => schema.nullable(),
    }),
  tax_name: yup
    .string()
    .nullable()
    .when("price_type", {
      is: (price_type) => price_type == 2,
      then: (schema) =>
        schema.required(t("Tax Name is required", { name: t("Tax Name") })),
      otherwise: (schema) => schema.nullable(),
    }),
  tax_percentage: yup
    .string()
    .nullable()
    .when("price_type", {
      is: (price_type) => price_type == 2,
      then: (schema) =>
        schema.required(t("Tax Percentage is required", { name: t("Tax Percentage") })),
      otherwise: (schema) => schema.nullable(),
    }),
  status: yup.bool().label("status"),
});

onMounted(() => {
  // getFeatures();
  getAddons();
  refreshData();
  if (!_.isUndefined(slack)) {
    getSubscription();
  }
});

const is_loaded = ref(false);
async function getSubscription() {
  let response = await axios.get("/api/subscription_detail/" + slack);
  form.value = response.data.data;
  form.value.country_id = response.data.data.country.slack;
  form.value.description =
    response.data.data.description != null
      ? response.data.data.description
      : "";
  form.value.description_ar =
    response.data.data.description_ar != null
      ? response.data.data.description_ar
      : "";

  if (response.data.data.addons != null) {

    addon_selected.value = [];
    _.forEach(addons.value, (addon) => {
      var addon_value = "";
      _.forEach(response.data.data.addons, (saved_addon) => {
        if (saved_addon.addon_master_id == addon.id) {
          addon_value = addon.value_type==1?saved_addon.limit_value:true;
        }
      });
      let addon_template = {
        id: addon.id,
        constant_name: addon.constant_name,
        name: addon.name,
        name_ar: addon.name_ar,
        description: addon.description,
        type: addon.type,
        value_type: addon.value_type,
        price: addon.price,
        status: addon.status,
        value: addon_value,
      };
      addon_selected.value.push(addon_template);
      checkSubAddon();
    });
  }
  is_loaded.value = true;
}

const is_payment_gateway = ref(false);
const is_wosul_pay = ref(false);
function checkSubAddon(){
  const items = addon_selected.value;
  const is_pos = items.find(item => item.constant_name === 'POS' && item.value === true);
  const is_invoice = items.find(item => item.constant_name === 'INVOICING' && item.value === true);
  const is_wosul_easy = items.find(item => item.constant_name === 'WOSUL_EASY' && item.value === true);

  if (is_pos || is_invoice){
    is_payment_gateway.value = true;
  }else{
    is_payment_gateway.value = false;
  }
  if (is_wosul_easy){
    is_wosul_pay.value = true;
  }else{
    is_wosul_pay.value = false;
  }
}

const features = ref([]);
async function getFeatures() {
  await axios
    .get("/api/subscription_features")
    .then((response) => {
      features.value = response.data;
    })
    .catch((error) => {
      server_messages.type = "error";
      server_messages.messages = error;
      form.value.is_submitting = false;
    });
}

const addons = ref([]);
async function getAddons() {
  await axios.get("/api/subscription_addons").then((response) => {
    addons.value = response.data;
    _.forEach(response.data, (item) => {
      let addon_template = {
        id: item.id,
        constant_name: item.constant_name,
        name: item.name,
        name_ar: item.name_ar,
        description: item.description,
        type: item.type,
        value_type: item.value_type,
        price: item.price,
        status: item.status,
        value: "",
      };
      addon_selected.value.push(addon_template);
    });
  });
}

const props = defineProps(["action"]);
const clone_mode = computed(() => {
  return !_.isUndefined(props.action);
});

const countries = ref([]);
async function refreshData() {
  await axios
    .get("/api/countries")
    .then((response) => {
      //countries.value = response.data.data;
      _.forEach(response.data.data, (item) => {
        countries.value.push({
          id: item.slack,
          name: item.name,
        });
      });
    })
    .catch((error) => {
      server_messages.type = "error";
      server_messages.messages = error;
      form.value.is_submitting = false;
    });
}

async function saveSubscription(values) {
  form.value.is_submitting = true;
  var form_data = new FormData();
  form_data.append("name", values.name);
  form_data.append("name_ar", values.name_ar);
  form_data.append("subscription_category", values.subscription_category);
  form_data.append("device_type", values.device_type);
  form_data.append("subscription_for", values.subscription_for);
  form_data.append("country_id", values.country_id);
  form_data.append("is_trial", values.is_trial);
  form_data.append("trial_days", values.trial_days);
  form_data.append("price_type", values.price_type);
  form_data.append("price", values.price);
  form_data.append("tax_name", values.tax_name);
  form_data.append("subscription_tenure", values.subscription_tenure);
  form_data.append("offer_name", values.offer_name!= null && values.offer_name != "undefined"
      ? values.offer_name
      : '');
  form_data.append("strike_through_price", values.strike_through_price!= null && values.strike_through_price != "undefined"
      ? values.strike_through_price
      : '');
  form_data.append(
    "tax_percentage",
    values.tax_percentage != null && values.tax_percentage != "undefined"
      ? values.tax_percentage
      : 0
  );
  form_data.append("discount_name", values.discount_name!=null && values.discount_name!="undefined"? values.discount_name : '');
  form_data.append(
    "discount_type",
    values.discount_type != null && values.discount_type != "undefined"
      ? values.discount_type
      : 0
  );
  form_data.append("discount_value", values.discount_value);
  form_data.append("payable_amount", values.payable_amount);
  form_data.append("status", values.status);
  form_data.append("description", values.description);
  form_data.append("description_ar", values.description_ar);
  form_data.append("addons", JSON.stringify(addon_selected.value));
  form_data.append("slack", slack);
  var submit_url =
    slack != "" && slack != undefined
      ? "/api/subscription/update"
      : "/api/subscription/save";

  await axios
    .post(submit_url, form_data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((response) => {
      if (response.data.status_code == 200) {
        toast.success(response.data.msg);
        form.value.is_submitting = false;

        resetData();

        router.push("/master_subscriptions");
      } else {
        try {
          server_messages.type = "error";
          server_messages.messages = JSON.parse(response.data.msg);
        } catch (err) {
          server_messages.type = "error";
          server_messages.messages = response.data.msg;
        }
        form.value.is_submitting = false;
      }
    })
    .catch((error) => {
      server_messages.type = "error";
      server_messages.messages = error;
      form.value.is_submitting = false;
    });
}

function resetData() {
  Object.assign(form, form);
}
function calculatePrice(){
  var payable_amount = form.value.payable_amount;
  var tax_percentage = form.value.tax_percentage;
  var price = payable_amount / ((tax_percentage / 100) + 1);
  var tax_amount = payable_amount - parseFloat(price);

  form.value.tax_amount = tax_amount.toFixed(2);
  form.value.price = price.toFixed(2);
}

/*Not in use for now*/
/*function calculatePriceOLD() {
  var price_type = form.value.price_type;
  var price = form.value.price;
  var tax_percentage = form.value.tax_percentage;
  var discount_type = form.value.discount_type;
  var discount_value = form.value.discount_value;
  var tax_amount = 0;
  //calculate the tax
  if (price_type == 2 && price > 0 && tax_percentage > 0) {
    var tax_amount = price * (tax_percentage / 100);
    tax_amount = parseFloat(price) + parseFloat(tax_amount);
  } else {
    tax_amount = price;
  }

  var discount_amount = 0;
  //calculate the discount
  if (discount_type > 0 && discount_value > 0) {
    if (discount_type == 1) {
      discount_amount = tax_amount * (discount_value / 100);
    } else {
      discount_amount = discount_value;
    }
  }

  var payable_amount =
    parseFloat(tax_amount) - parseFloat(discount_amount);
  form.value.payable_amount = payable_amount;
}*/
</script>
