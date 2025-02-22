<template>
  <div
    class="modal hide"
    id="renewSubscriptionModal"
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
          <h5 class="modal-title">{{ $t("Renew Subscription") }}</h5>
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
            @submit="renewSubscription"
            enctype="multipart/form-data"
            :initial-values="form"
            id="add_custom_field_form"
          >
            <div class="row">
              <div class="col-md-12" v-if="form.is_type_show==true">
                <div class="form-field">
                  <div class="radio-wrap mb-3">
                    <input type="radio" name="type" value="OLD" v-model="form.type" class="form-check-input me-2" id="old" @click="setType">
                    <label class="label" for="old">{{ $t('Renew last subscribed subscription?') }}</label>
                  </div>
                  <div class="radio-wrap mb-3">
                    <input type="radio" name="type" value="NEW" v-model="form.type" class="form-check-input me-2" id="new" @click="setType">
                    <label class="label" for="new">{{ $t('Renew fresh subscription?') }}</label>
                  </div>
                </div>
              </div>
              <div class="col-md-12">
                <VSelectInput
                  name="subscription"
                  :label="labels.subscription"
                  v-model="form.subscription_id"
                  :placeholder="labels.subscription"
                  :options="subscriptions"
                  required
                  @change="calculatePrice"
                  :disabled="form.type=='OLD'"
                />
              </div>

              <div class="col-12" v-if="selected_addons!=null">
                <ul class="prepoint">
                  <li v-for="(addon, index) in selected_addons">{{ addon.name }}</li>
                </ul>
              </div>

              <div class="col-12">
                <div class="form-field">
                  <label class="label d-flex align-items-center">{{ $t("Payment Receipt") }}<span class="text-danger">*</span></label>
                  <div class="input-group input-file-group">
                    <Field
                        class="form-control form-control-solid"
                        name="payment_receipt"
                        type="file"
                        id="formFile"
                        accept="image/jpg, image/jpeg, image/png, application/pdf"
                        @change="selectFile"
                    />
                    <label
                        class="btn btn-light-primary min-width-0 mb-0"
                        for="formFile"
                    >{{ $t("Upload") }}</label>

                  </div>
                  <ErrorMessage name="payment_receipt" as="div" class="error"></ErrorMessage>
                </div>
              </div>

              <div class="col-12">
                <VSelectInput
                  name="coupon"
                  :label="labels.coupon"
                  v-model="form.coupon_id"
                  :placeholder="labels.coupon"
                  :options="coupons"
                  @change="calculatePrice"
                />
              </div>
              <div class="col-6">
                <VSelectInput
                    name="payment_mode_id"
                    :label="labels.payment_mode"
                    v-model="form.payment_mode_id"
                    :placeholder="labels.payment_mode"
                    :options="payment_modes"
                    required
                />
              </div>

              <div class="col-6">
                <VSelectInput
                    name="payment_status"
                    :label="labels.payment_status"
                    v-model="form.payment_status"
                    :placeholder="labels.payment_mode"
                    :options="payment_statuses"
                    required
                />
              </div>
              <div class="col-md-12">
                <div class="form-field">
                  <label>{{ $t("Note") }}</label>
                  <textarea
                      class="form-control form-control-solid p-3"
                      name="description"
                      v-model="form.note"
                      :label="labels.note"
                      cols="3"
                  ></textarea>
                </div>
              </div>
              <div class="col-12">
                <div class="row">
                  <div class="col-5"></div>
                  <div class="col-7">
                    <div class="checkout-data-table">
                        <table class="table px-2">
                          <tbody>
                            <tr>
                              <td>{{ $t("Subscription") }}</td>
                              <td align="right">
                                <b>{{ getRoundedValue(pricing.subscription_price) }} {{ $t('SAR') }}</b>
                              </td>
                            </tr>
                            <tr v-if="pricing.addon_price > 0" >
                              <td>{{ $t("Additional Addon") }}</td>
                              <td align="right">
                                <b>{{ getRoundedValue(pricing.addon_price) }} {{ $t('SAR') }}</b>
                              </td>
                            </tr>
                            <tr v-if="pricing.discount > 0">
                              <td class="text-success">- {{ $t("Discount") }}</td>
                              <td align="right" class="text-success">
                                <b>{{ getRoundedValue(pricing.discount) }} {{ $t('SAR') }}</b>
                              </td>
                            </tr>
                            <tr v-if="pricing.tax > 0">
                              <td>{{ $t("Tax") }}</td>
                              <td align="right">
                                <b>{{ getRoundedValue(pricing.tax) }} {{ $t('SAR') }}</b>
                              </td>
                            </tr>
                            <tr>
                              <td>{{ $t("Amount") }}</td>
                              <td align="right">
                                <b>{{ getRoundedValue(pricing.amount) }} {{ $t('SAR') }}</b>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
               
                  </div>
                </div>
              </div>
            </div>
<!--            <div class="py-3" v-if="form.server_messages.messages != ''">
              <ServerMessage :server_messages="form.server_messages" />
            </div>-->
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
                <span class="pt-0" v-else> {{ $t("Renew") }} </span>
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

const props = defineProps(["merchant", "edit_data"]);
const merchant = toRef(props, "merchant");
const edit_data = toRef(props, "edit_data");

const { getRoundedValue } = useGlobalFunctions();

const { t } = useI18n();
const labels = ref({
  subscription: t("Select Subscription Plan"),
  coupon: t("Apply Coupon"),
  payment_mode: t("Select Payment Mode"),
  payment_status: t("Select Payment Status"),
  note: t("Note"),
});
const initialState = {
  server_messages: {
    type: "",
    messages: "",
  },
  is_saving: false,

  // form data
  is_type_show:true,
  type: "OLD",
  subscription_id: "",
  coupon_id: "",
  payment_mode_id: "",
  payment_status: 0,
  note: "",
  payment_receipt:null
};

const form = reactive({ ...initialState });

const authStore = useAuthStore();

const schema = yup.object({
  subscription: yup
    .string()
    .required(t("name is required", { name: t("Subscription") })),
  payment_mode_id: yup
    .string()
    .required(t("name is required", { name: t("Payment Mode") })),
  payment_receipt: yup
    .mixed()
    .required(t("name is required", { name: t("Payment Receipt") })),
});

const emit = defineEmits(["closeRenewSubscriptionModal"]);

function closeModal() {
  resetData();
  emit("closeRenewSubscriptionModal");
}

//  watch(() =>
//          props.edit_data,(value) => {
//        if(value){
//          form.custom_field_slack = value.slack;
//        }
//      }
//  );

defineExpose({
  getRenewalDetails,
});

onMounted(() => {
  getRenewalDetails();
  getLastSubscription();
});

const payment_statuses = ref([]);
const subscriptions = ref([]);
const addons = ref([]);
const coupons = ref([]);
const payment_modes = ref([]);

async function getRenewalDetails() {
  await axios
    .get("api/v2/subscription/renewal_details")
    .then((response) => {
      if (response.data.status_code == 200) {

        subscriptions.value = response.data.data.subscriptions;
        coupons.value = response.data.data.coupons;
        payment_modes.value = response.data.data.payment_modes;
        payment_statuses.value = response.data.data.payment_statuses;

        _.forEach(response.data.data.addons, (item) => {
          let template = {
            is_selected: false,
            id: item.id,
            name: item.name,
            constant_name: item.constant_name,
            type: item.type,
            value_type: item.value_type,
            price: item.price,
            period: 0, // Period in months
            limit: 0, // branches and user limits
          };
          addons.value.push(template);
        });

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
    });
}

const last_subscription = ref([]);
const last_subscription_addons = ref([]);
const selected_addons = ref([]);
const additional_addon_charge = ref([]);
async function getLastSubscription(){
  selected_addons.value = [];
  await axios
      .get("api/v2/user/last_subscription_detail",{ params: { id: merchant.value.id } })
      .then((response) => {
        if (response.data.status_code == 200) {
          if(response.data.data.subscription!=null && response.data.data.subscription.subscription.is_trial==0){
            form.subscription_id = response.data.data.subscription.subscription_id;
            last_subscription.value = response.data.data.subscription
            _.forEach(response.data.data.subscription.user_addons, (item) => {
              let template = {
                id: item.addon_master.id,
                name: item.addon_master.value_type==1?item.addon_master.name+' - '+parseInt(item.limit_value):item.addon_master.name,
                constant_name: item.addon_master.constant_name,
                type: item.addon_master.type,
                value_type: item.addon_master.value_type,
                price: item.addon_master.price,
                period: item.addon_master.type==1?12:1, // Period in months
                limit: item.addon_master.type==1?12:item.limit_value, // branches and user limits
              };
              last_subscription_addons.value.push(template);
              selected_addons.value.push(template);
              additional_addon_charge.value = response.data.data.additional_addon_charge;
            });
            calculatePrice();
          }else{
            form.is_type_show=false;
            form.type="NEW";
            additional_addon_charge.value = 0;
          }
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
      });
}

async function setType(event){
  var optionText = event.target.value;
  if(optionText=='NEW'){
    form.subscription_id ='';
    selected_addons.value = [];
    pricing.subscription_price = 0;
    pricing.addon_price = 0;
    pricing.discount = 0;
    pricing.tax = 0;
    pricing.amount = 0;
  }else{
    getLastSubscription();
  }
}

async function renewSubscription() {

  form.is_saving = true;

  var form_data = new FormData();
  form_data.append("user_id", merchant.value.id);
  form_data.append("type", form.type);
  form_data.append("subscription_id", form.subscription_id);
  form_data.append("selected_addons", JSON.stringify(selected_addons.value));
  form_data.append("payment_receipt", form.payment_receipt);
  form_data.append("coupon_id", form.coupon_id);
  form_data.append("payment_mode_id", form.payment_mode_id);
  form_data.append("payment_status", form.payment_status);
  form_data.append("note", form.note);

  await axios
    .post('/api/v2/user/subscription/renew', form_data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((response) => {

      if (response.data.status_code == 200) {
        toast.success(response.data.msg);
        form.is_saving = false;
        closeModal();
        getLastSubscription();
        $("#formFile").val('');
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

const pricing = reactive({
  subscription_price: 0,
  addon_price: 0,
  discount: 0,
  tax: 0,
  amount: 0,
});

function calculatePrice() {
  var amount = 0;

  /* Subscription Price */
  let subscription = _.find(subscriptions.value, (item) => {
    return item.id == form.subscription_id;
  });
  amount = parseFloat(subscription.price);
  pricing.subscription_price = parseFloat(amount);

  /* Addon Price */
  var addon_price = 0;
  if(subscription.addons!=null && form.type=='NEW'){
    selected_addons.value = [];
    _.forEach(subscription.addons, (item) => {
      let template = {
        id: item.addon.id,
        name: item.addon.value_type==1?item.addon.name+' - '+parseInt(item.limit_value):item.addon.name,
        constant_name: item.addon.constant_name,
        type: item.addon.type,
        value_type: item.addon.value_type,
        price: item.addon.price,
        period: item.addon.type==1?12:1, // Period in months
        limit: item.limit_value, // branches and user limits
      };
      selected_addons.value.push(template);

      /*if (item.addon.value_type == 2) {
        if (item.addon.type == 1) {
          addon_price += parseFloat(item.addon.price) * parseFloat(item.addon.period);
        } else {
          addon_price += parseFloat(item.addon.price);
        }
      } else {
        addon_price += parseFloat(item.addon.price) * parseFloat(item.addon.limit);
      }*/
    });
  }else{
    addon_price += additional_addon_charge.value;
  }
  pricing.addon_price = parseFloat(addon_price);
  amount += parseFloat(addon_price);
  /* Coupon Price */
  let selected_coupon = _.find(coupons.value, (item) => {
    return item.id == form.coupon_id;
  });

  var coupon_discount = 0;
  if (selected_coupon != undefined) {
    if (selected_coupon.type == 1) {
      // Percent
      coupon_discount = (parseFloat(amount) * parseFloat(selected_coupon.value)) /
          100;
    } else {
      // Flat
      coupon_discount = parseFloat(selected_coupon.value);
    }
  }
  pricing.discount = coupon_discount;
  amount -= parseFloat(coupon_discount);

  /* Tax */
  var tax = 0;
  if (subscription.tax_percentage > 0) {
    tax = (parseFloat(amount) * parseFloat(subscription.tax_percentage)) / 100;
  }
  pricing.tax = parseFloat(tax);
  amount += parseFloat(tax);

  pricing.amount = parseFloat(amount);
}

async function selectFile(e) {
  form.payment_receipt = e.target.files[0];
}
</script>
