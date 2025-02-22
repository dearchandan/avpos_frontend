<template>
  <DefaultLayout>
    <template v-slot:subheader>
      <div class="header-nav-wrap">
        <div class="row align-items-center">
          <div class="col-auto">
            <div class="header-back-link">
              <router-link class="text-primary" to="/discounts"
                ><Icon icon="fa6-solid:chevron-left" />
                {{ $t("Discounts") }}</router-link
              >
            </div>
          </div>
          <div class="col-auto">
            <h5 class="fw-bold" v-if="slack == '' || slack == undefined">
              {{ $t("Add Discount") }}
            </h5>
            <h5 class="fw-bold" v-else>{{ $t("Edit Discount") }}</h5>
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
        @submit="saveDiscount"
        enctype="multipart/form-data"
        :initial-values="form"
        v-slot="{ setFieldValue, values }"
      >
        <div class="row card-strash">
          <div class="py-3" v-if="server_messages.messages != ''">
            <ServerMessage :server_messages="server_messages" />
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
                        :label="labels.name"
                        :required="true"
                        v-model="form.name"
                      />
                    </div>

                    <div class="col-6 col-md-4 col-lg-3">
                      <VTextInput
                        type="text"
                        name="name_ar"
                        :label="labels.name_ar"
                        v-model="form.name_ar"
                      />
                    </div>

                    <div class="col-12 col-md-4 col-lg-3">
                      <div class="form-field">
                        <label for="" class="pb-2"
                          >{{ $t("Discount Type") }}<em>*</em></label
                        >
                        <br />
                        <label
                          v-for="(option, index) in discount_type_options"
                          class="label me-3"
                          :key="index"
                        >
                          <Field
                            class="form-check-input me-1"
                            name="type"
                            type="radio"
                            :id="index"
                            v-model="form.type"
                            :value="option.value"
                          />
                          {{ option.name }}
                        </label>
                        <!-- <ErrorMessage :name="name" as="div" class="error"></ErrorMessage> -->
                      </div>
                    </div>

                    <div class="col-12 col-md-4 col-lg-3">
                      <VTextInput
                        type="text"
                        name="value"
                        :label="
                          values.type == 1
                            ? labels.discount_percentage
                            : labels.discount_amount
                        "
                        :required="true"
                        v-model="form.value"
                      />
                    </div>

                    <div class="col-12 col-md-4 col-lg-3">
                      <div class="form-field">
                        <label for="" class="pb-2"
                          >{{ $t("Applies To") }}
                        </label>
                        <br />
                        <label
                          v-for="(option, index) in applies_to_options"
                          class="label me-3"
                          :key="index"
                        >
                          <Field
                            class="form-check-input me-1"
                            name="applies_to"
                            type="radio"
                            :id="index"
                            :value="option.value"
                          />
                          {{ option.name }}
                        </label>
                        <!-- <ErrorMessage :name="name" as="div" class="error"></ErrorMessage> -->
                      </div>
                    </div>

                    <!-- <div class="col-6 col-md-4 col-lg-3" v-show="values.applies_to == 2">
                      <VTextInput
                        type="number"
                        name="minimum_order_amount"
                        :label="labels.minimum_order_amount"
                        tooltip="Total order amount should be more than this to avail the discount"
                        v-model="form.minimum_order_amount"
                      />
                    </div> -->
<!-- 
                    <div class="col-6 col-md-4 col-lg-3"
                      v-show="values.type == 1 && values.applies_to == 2"
                    >
                      <VTextInput
                        type="number"
                        name="maximum_discount_amount"
                        :label="labels.maximum_discount_amount"
                        v-model="form.maximum_discount_amount"
                      />
                    </div> -->
                    <div class="col-6 col-md-4 col-lg-3">
                      <VSelectInput
                        name="type"
                        :label="'Is Unlimited?'"
                        required
                        :options="discount_quantity_options"
                        v-model="form.is_unlimited_quantity"
                        size="normal"
                        @change="updateDiscountQuantity"
                      />
                    </div>
                    <div class="col-6 col-md-4 col-lg-3" v-if="form.is_unlimited_quantity == 0">
                      <VTextInput
                        type="number"
                        name="available_discount_quantity"
                        :label="labels.discount_quantity"
                        v-model="form.available_discount_quantity"
                      />
                    </div>
                    <div class="col-6 col-md-4 col-lg-3">
                      <div class="form-field">
                        <label for="" class="form-label"
                          >{{ $t("Date Range") }}
                          <VTooltip
                            message="Keeping dates unselected will make it applicable always"
                          />
                        </label>
                        <VueDatePicker
                          range
                          v-model="form.date_range"
                          :format="'dd-MM-yyyy'"
                          :enable-time-picker="false" input-class-name="form-control form-control-solid"
                        />
                      </div>
                    </div>

                    <!-- <div class="col-md-3">
                                                    <div class="form-field">
                                                        <div class="form-check form-switch form-switch-2 pt-4">
                                                            <Field class="form-check-input me-2" type="checkbox" role="switch" name="is_taxable" id="is_taxable" :unchecked-value="0" :value="values.is_taxable" @change="(event) => setFieldValue('is_taxable', event.target.checked)" />
                                                             {{ $t('Is Taxable') }} </div>
                                                    </div>
                                                </div> -->

                    <div class="col-6 col-md-4 col-lg-3">
                      <div class="form-field">
                        <div class="form-check form-switch pt-md-4">
                          <Field
                            class="form-check-input me-2"
                            type="checkbox"
                            role="switch"
                            name="status"
                            id="status"
                            :unchecked-value="false"
                            :value="true"
                            v-model="form.status"
                            @change="
                              (event) =>
                                setFieldValue('status', event.target.checked)
                            "
                          />
                          {{ $t("Active") }}
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

    <AddDiscountSkeleton v-else />
  </DefaultLayout>
</template>

<script setup>
import DefaultLayout from "@/layouts/DefaultLayout.vue";
import { ref, reactive } from "vue";
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import VTextInput from "@/components/common/VTextInput.vue";
import VRadio from "@/components/common/VRadio.vue";

import { useAuthStore } from "@/stores/auth";
import ClipLoader from "vue-spinner/src/ClipLoader.vue";
import VueDatePicker from "@vuepic/vue-datepicker";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const route = useRoute();
const slack = route.params.slack;
const server_messages = reactive({
  type: "",
  messages: "",
});
const labels = ref({
  name: t("Discount Name"),
  name_ar: t("Discount Name (Arabic)"),
  discount_percentage: t("Discount Percentage"),
  discount_amount: t("Discount Amount"),
  minimum_order_amount: t("Minimum Order Amount"),
  maximum_discount_amount: t("Maximum Discount Amount"),
  discount_quantity: t("Discount Quantity"),
});
const initialState = {
  is_submitting: false,

  // form data
  name: "",
  name_ar: "",
  type: 1,
  value: "",
  applies_to: 1,
  minimum_order_amount: "",
  maximum_discount_amount: "",
  available_discount_quantity: "",
  date_range: "",
  is_taxable: 1,
  status: true,
  slack: "",
  is_unlimited_quantity: 1
};

const form = reactive({ ...initialState });

const schema = yup.object({
  name: yup
    .string()
    .required(t("name is required", { name: t("Discount Name") }))
    .min(
      2,
      t("name must be at least n characters", { name: t("Name"), number: 2 })
    ),
  //discount_type: yup.string().required().label('discount type'),
  value: yup
    .number()
    .typeError(t("must be a number", { name: t("Value") }))
    .required(t("name is required", { name: t("Value") }))
    .min(
      1,
      t("must be greater than or equal to n", { name: t("Value"), number: 1 })
    ),
  //applies_to: yup.string().required().label('applies to'),
});
onMounted(() => {
  if (slack != "" && slack != undefined) getDiscount();
});
watch(
  () => form.value,
  (newValue) => {
    console.log(form.type,'type');
    if (form.type == 1 && form.value > 100) {
      form.value = 100;
    }else{
      form.value = newValue;
    }
  }
);
watch(
  () => form.type,
  (newValue) => {
    if (form.type == 1 && form.value > 100) {
      form.value = 100;
    }
  }
);

const discount_type_options = [
  {
    name: "Percentage",
    value: 1,
  },
  {
    name: "Flat",
    value: 2,
  },
];

const applies_to_options = [
  {
    name: "Inventory",
    value: 1,
  },
  {
    name: "Order",
    value: 2,
  },
];

const discount_quantity_options = [
  {
    name: "Unlimited",
    id: 1,
  },
  {
    name: "Limited",
    id: 0,
  },
];
const start_datetime = computed(() => {
  if (form.date_range != null && form.date_range[0] != null) {
    return moment(form.date_range[0]).format("YYYY-MM-DD HH:mm");
  } else {
    return "";
  }
});

const end_datetime = computed(() => {
  if (form.date_range != null && form.date_range[1] != null) {
    return moment(form.date_range[1]).format("YYYY-MM-DD HH:mm");
  } else {
    return "";
  }
});
async function updateDiscountQuantity(){
  if(slack == "" || slack == undefined){
    if(form.is_unlimited_quantity == 1)
    {
      form.available_discount_quantity = '';
    }
    else{
      if(form.available_discount_quantity==null || form.available_discount_quantity=='')
        form.available_discount_quantity = 0;
    }
  }
  else if(slack != "" || slack != undefined)
  {
    if(form.is_unlimited_quantity != 1 && (form.available_discount_quantity=='' || form.available_discount_quantity == null))
    {
        form.available_discount_quantity = 0;
    }
  }
}
async function saveDiscount(values) {
  form.is_submitting = true;

  var form_data = new FormData();
  form_data.append("name", values.name);
  form_data.append("name_ar", values.name_ar);
  form_data.append("type", values.type);
  form_data.append("value", values.value);
  form_data.append("applies_to", values.applies_to);
  form_data.append(
    "minimum_order_amount",
    values.minimum_order_amount != null ? values.minimum_order_amount : 0
  );
  form_data.append(
    "maximum_discount_amount",
    values.maximum_discount_amount != null ? values.maximum_discount_amount : 0
  );
  if(form.is_unlimited_quantity == 1){
      form_data.append(
      "available_discount_quantity",
      ''
    );
  }
  else{
    form_data.append(
      "available_discount_quantity",
      values.available_discount_quantity
    );
  }
  form_data.append(
      "is_unlimited_quantity",
      form.is_unlimited_quantity
    );
  form_data.append("start_datetime", start_datetime.value);
  form_data.append("end_datetime", end_datetime.value);
  form_data.append("is_taxable", values.is_taxable);
  form_data.append("status", values.status);
  form_data.append("slack", slack);
  var submit_url =
    slack != "" && slack != undefined
      ? "/api/discount/update"
      : "/api/discount/save";

  await axios
    .post(submit_url, form_data)
    .then((response) => {
      if (response.data.status_code == 200) {
        toast.success(response.data.msg);
        form.is_submitting = false;

        router.push("/discounts");
        resetData();
      } else {
        try {
          server_messages.type = "error";
          server_messages.messages = JSON.parse(response.data.msg);
        } catch (err) {
          server_messages.type = "error";
          server_messages.messages = response.data.msg;
        }
        form.is_submitting = false;
      }
    })
    .catch((error) => {
      server_messages.type = "error";
      server_messages.messages = error;
      form.is_submitting = false;
      console.log(error);
    });
}

function resetData() {
  Object.assign(form, form);
}

const is_loaded = ref(false);
async function getDiscount() {
  let response = await axios.get("/api/discount", {
    params: {
      slack: slack,
    },
  });
  
  form.name = response.data.data.discount.name;
  form.name_ar = response.data.data.discount.name_ar;
  form.type = response.data.data.discount.type;
  form.value = response.data.data.discount.value;
  form.applies_to = response.data.data.discount.applies_to;
  form.minimum_order_amount = response.data.data.discount.minimum_order_amount;
  form.maximum_discount_amount = response.data.data.discount.maximum_discount_amount;
  form.available_discount_quantity = response.data.data.discount.available_discount_quantity;
  form.date_range = response.data.data.discount.date_range;
  form.is_taxable = response.data.data.discount.is_taxable;
  form.status = response.data.data.discount.status == 1?true:false;
  form.slack = response.data.data.discount.slack;
  form.is_unlimited_quantity = response.data.data.discount.available_discount_quantity!=null && response.data.data.discount.available_discount_quantity.toString()!='' && response.data.data.discount.available_discount_quantity.toString() !=null?0:1;
  form.date_range = "";
  form.date_range = [
    new Date(String(response.data.data.discount.start_datetime)),
    new Date(String(response.data.data.discount.end_datetime)),
  ];
  is_loaded.value = true;
}
</script>
