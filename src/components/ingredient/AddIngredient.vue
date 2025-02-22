<template>
  <Form
    :validation-schema="schema"
    @submit="saveIngredient"
    enctype="multipart/form-data"
    v-slot="{ values, setFieldValue }"
    :initial-values="form"
    v-if="(slack == '' || slack == undefined) || (slack != '' && is_loaded)"
  >
    <div class="row">
      <div class="col-md-12">
        <AsyncServerMessage
          class="py-3"
          v-if="server_messages.messages != ''"
          :server_messages="server_messages"
        />

        <div class="row">
          <div class="col-md-12">
            <div class="card">

              <div class="row mb-5">
                <h4 class="section-title pb-2">
                  {{ $t("Master Ingredient Details") }}:<VTooltip :message="labels.master_ingredient_tooltip" />
                </h4>
                <h5 class="section-title pb-2 text-muted">{{ $t("Basic Details") }}:</h5>

                <div class="col-12 col-md-4 col-lg-3">
                  <VTextInput
                    type="text"
                    name="name"
                    :label="labels.name"
                    :required="true"
                    v-model="form.name"
                  />
                </div>

                <div class="col-12 col-md-4 col-lg-3">
                  <VMultiSelect v-if="category_permissions.write"
                    name="categories"
                    :label="labels.select_categories"
                    :text="'name'"
                    :value="'slack'"
                    :options="categories"
                    required
                    :selected="form.categories"
                    :addModalShow="true"
                    :addModalId="'#addCategoryModal'" 
                  />
                  <VMultiSelect v-else
                    name="categories"
                    :label="labels.select_categories"
                    :text="'name'"
                    :value="'slack'"
                    :options="categories"
                    required
                    :selected="form.categories"
                  />
                </div>

                <div class="col-12 col-md-4 col-lg-3">
                  <VTextInput
                      type="text"
                      name="sale_price"
                      :label="labels.sale_price"
                      :required="true"
                      :input_group_text="
                        values.is_stockable && values.sale_measurement_unit
                          ? currency_symbol +
                            '/ Per ' +
                            form.sale_measurement_unit.abbreviation
                          : currency_symbol + '/ ' + 'Per Unit'
                      "
                      v-model="form.sale_price"
                  />
                </div>

                <div class="col-auto pt-md-3">
                  <div class="form-field pt-3">
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

                <div class="col-auto pt-md-3">
                  <div class="form-field pt-3">
                    <div class="form-check form-switch">
                      <Field
                          class="form-check-input me-2"
                          type="checkbox"
                          role="switch"
                          name="is_stockable"
                          id="is_stockable"
                          :unchecked-value="false"
                          :value="values.is_stockable"
                          @change="
                            (event) =>
                              setFieldValue(
                                'is_stockable',
                                event.target.checked
                              )
                          "
                      />
                      <label class="form-check-label" for="is_stockable"
                      >{{ $t("Is Stockable") }} <em>*</em>
                      </label>
                    </div>
                  </div>
                </div>

                <div class="col-6 col-md-4 col-lg-3" v-if="values.is_stockable">
                  <div class="form-field">
                    <label for=""
                    >{{ $t("Stock Unit") }} <em class="text-danger">*</em>
                      <VTooltip
                          message="Stock unit is your storage unit, i.e sugar can be stored in kilograms "
                      />
                    </label>
                    <Field
                        as="select"
                        name="stock_measurement_unit_id"
                        class="form-control form-control-solid"
                        v-model="form.stock_measurement_unit_id"
                        @change="selectStockExample($event)"
                        :disabled="form.is_quantity_readonly"
                    >
                      <option value="">{{ $t("Units") }}</option>
                      <optgroup
                          v-for="(measurement, index) in measurements"
                          :key="index"
                          :label="
                            measurement.name +
                            ' ' +
                            (measurement.name_ar != '' &&
                            measurement.name_ar != null &&
                            measurement.name_ar != 'null'
                              ? measurement.name_ar
                              : '')
                          "
                      >
                        <option
                            v-for="(unit, unit_index) in measurement.units"
                            :key="unit_index"
                            :value="unit.id"
                        >
                          {{ unit.unit_name }}
                          {{
                            unit.unit_name_ar != "" &&
                            unit.unit_name_ar != null &&
                            unit.unit_name_ar != "null"
                                ? unit.unit_name_ar
                                : ""
                          }}
                        </option>
                      </optgroup>
                    </Field>
                  </div>
                </div>

                <div class="col-6 col-md-4 col-lg-3" v-if="values.is_stockable">
                  <div class="form-field">
                    <label for=""
                    >{{ $t("Sales Unit") }} <em class="text-danger">*</em>
                      <VTooltip
                          message="Sales unit is your selling unit i.e sugar can be sold in grams  "
                      />
                    </label>
                    <Field
                        as="select"
                        name="sale_measurement_unit_id"
                        id="sale_measurement_unit_id"
                        class="form-control form-control-solid"
                        v-model="form.sale_measurement_unit_id"
                    >
                      <option value="">{{ $t("Units") }}</option>
                      <optgroup
                          v-for="(measurement, index) in measurements"
                          :key="index"
                          :label="
                            measurement.name +
                            ' ' +
                            (measurement.name_ar != '' &&
                            measurement.name_ar != null &&
                            measurement.name_ar != 'null'
                              ? measurement.name_ar
                              : '')
                          "
                      >
                        <option
                            v-for="(unit, unit_index) in measurement.units"
                            :key="unit_index"
                            :value="unit.id"
                        >
                          {{ unit.unit_name }}
                          {{
                            unit.unit_name_ar != "" &&
                            unit.unit_name_ar != null &&
                            unit.unit_name_ar != "null"
                                ? unit.unit_name_ar
                                : ""
                          }}
                        </option>
                      </optgroup>
                    </Field>
                  </div>
                </div>

              </div>

              <div class="row">
                <h5 class="section-title pb-2 text-muted">
                  {{ $t("Optional Details") }}:
                </h5>

                <div class="col-12 col-md-4 col-lg-3">
                  <VTextInput
                      type="text"
                      name="name_ar"
                      :label="labels.name_ar"
                      v-model="form.name_ar"
                  />
                </div>

                <div class="col-12 col-md-4 col-lg-3">
                  <div class="form-field">
                    <label>{{ $t("Ingredient Image") }}</label>
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
                </div>

                <div class="col-6 col-md-4 col-lg-2">
                  <VTextInput
                      type="number"
                      name="purchase_price"
                      :label="labels.purchase_price"
                      :input_group_text="
                      values.sale_measurement_unit
                        ? currency_symbol +
                          '/ Per ' +
                          values.sale_measurement_unit.abbreviation
                        : currency_symbol + '/ ' + 'Per Unit'
                    "
                      v-model="form.purchase_price"
                  />
                </div>

                <div class="col-6 col-md-4 col-lg-2">
                  <VTextInput
                      type="number"
                      name="alert_quantity"
                      :label="labels.alert_quantity"
                      v-model="form.alert_quantity"
                  />
                </div>

                <div class="col-6 col-md-4 col-lg-2">
                  <VTextInput
                      type="text"
                      name="upc"
                      :label="labels.upc"
                      v-model="form.upc"
                  />
                </div>

                <div class="col-6 col-md-4 col-lg-3">
                  <VTextInput
                      type="text"
                      name="short_description"
                      :label="labels.short_description"
                      v-model="form.short_description"
                  />
                </div>

                <div class="col-12 col-md-4 col-lg-3">
                  <VTextInput
                      type="text"
                      name="short_description_ar"
                      :label="labels.short_description_ar"
                      v-model="form.short_description_ar"
                  />
                </div>

                <div class="col-12 col-md-4 col-lg-3">
                  <div class="form-field">
                    <label>{{ $t("Description") }}</label>
                    <Field
                        as="textarea"
                        class="form-control form-control-solid text-area"
                        name="description"
                        :label="labels.description"
                        cols="50"
                        rows="4"
                        v-model="form.description"
                    ></Field>
                  </div>
                </div>

                <div class="col-12 col-md-4 col-lg-3">
                  <div class="form-field">
                    <label>{{ $t("Description (Arabic)") }}</label>
                    <Field
                        as="textarea"
                        class="form-control form-control-solid text-area"
                        name="description_ar"
                        :label="labels.description_ar"
                        cols="3"
                        v-model="form.description_ar"
                    ></Field>
                  </div>
                </div>
              </div>

            </div>
          </div>

          <div class="col-md-12">
            <div class="card">
              <div class="row">
                <h5 class="section-title pb-2 text-muted">{{ auth.user.login_branch.name }}'s {{ $t("In Hand Inventory Details") }}:<VTooltip :message="labels.branch_ingredient_tooltip" /></h5>

                <div class="col-6 col-md-3 col-lg-3" v-if="values.is_stockable==true">
                  <VTextInput
                      type="number"
                      name="inventory_quantity"
                      :label="labels.quantity"
                      v-model="values.inventory_quantity"
                      :input_group_text="form.stock_measurement_unit_name"
                      required
                      :readonly="form.is_quantity_readonly"
                  />
                </div>

                <div class="col-6 col-md-3 col-lg-2">
                  <VTextInput
                      type="text"
                      name="inventory_sku"
                      :label="labels.sku"
                      v-model="values.inventory_sku"
                  />
                </div>

                <div class="col-6 col-md-3 col-lg-2" v-if="values.is_stockable==true">
                  <VTextInput
                      type="number"
                      name="inventory_alert_quantity"
                      :label="labels.alert_quantity"
                      v-model="values.inventory_alert_quantity"
                  />
                </div>

                <div class="col-md-auto col-lg-auto">
                  <VRadio
                      type="radio"
                      name="inventory_show_in"
                      v-model="values.inventory_show_in"
                      :label="labels.show_in"
                      :options="show_in_options"
                      @change="
                          (event) =>
                            setFieldValue('inventory_show_in', event.target.value)
                        "
                  />
                </div>

                <div class="col-auto col-lg-auto">
                  <div class="form-field" type="radio">
                    <label class="label"> {{ $t('Is Favorite') }}</label>
                    <div class="form-check form-switch mt-md-3">
                      <input class="form-check-input" name="inventory_is_favorite" type="checkbox" role="switch" id="inventory_is_favorite"  v-model="values.inventory_is_favorite" :checked="form.inventory_is_favorite" @change="
                          (event) =>
                            setFieldValue('inventory_is_favorite', event.target.checked)
                        ">
                    </div>
                  </div>
                </div>

                <div class="col-auto col-lg-auto">
                  <div class="form-field" type="radio">
                    <label class="label"> {{ $t('Status') }}</label>
                    <div class="form-check form-switch mt-md-3">
                      <input class="form-check-input" name="inventory_status" type="checkbox" role="switch" id="inventory_status"  v-model="values.inventory_status" :checked="form.inventory_status" @change="
                          (event) =>
                            setFieldValue('inventory_status', event.target.checked)
                        ">
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
        <span class="pt-0" v-else> {{ $t("Save") }} </span>
      </button>
    </div>
  </Form>
  <EditFormSkeleton v-else />

  <AsyncAddCategory @closeAddCategoryModal="closeAddCategoryModal" />

</template>

<script setup>
import { Form, Field } from "vee-validate";
import * as yup from "yup";
import { useAuthStore } from "@/stores/auth";
import ClipLoader from "vue-spinner/src/ClipLoader.vue";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import useGlobalFunctions from '@/composables/global_functions.js';

const AsyncAddCategory = defineAsyncComponent( () => import('@/components/category/AddCategory.vue') );

const { t } = useI18n();
const { isAuthorized } = useGlobalFunctions();
const language = localStorage.getItem('language');
const show_in_options = ref([
  {
    name: t('Everywhere'),
    value: '',
  },
  {
    name: 'POS',
    value: 'POS',
  },
  {
    name: 'INVOICE',
    value: 'INVOICE',
  }
]);

const labels = ref({
  name: t("Ingredient Name"),
  sale_price: t("Sale Price"),
  name_ar: t("Ingredient Name (Arabic)"),
  short_description: t("Short Description"),
  short_description_ar: t("Short Description (Arabic)"),
  description: t("Description"),
  description_ar: t("Description (Arabic)"),
  select_categories: t("Select Categories"),
  purchase_price: t("Purchase Price"),
  alert_quantity: t("Alert Quantity"),
  upc: t("UPC (Barcode)"),
  master_ingredient_tooltip: t('This master ingredient will be visible on all branches.'),
  branch_ingredient_tooltip: t('Stock only for this branch.'),
  sales_price_inc_tax: t('Sale Price (Incl. Tax)'),
  sales_price_exc_tax: t('Sale Price (Excl. Tax)'),
  quantity: t('Quantity'),
  sku: t('SKU'),
  show_in: t('Show In'),
  unit: t('Unit'),
});
const AsyncServerMessage = defineAsyncComponent(() =>
  import("@/components/common/ServerMessage.vue")
);

const auth = useAuthStore();
const currency_symbol = computed(() => {
  return auth.user.currency.symbol;
});

const route = useRoute();
const slack = route.params.slack;
const server_messages = reactive({
  type: "",
  messages: "",
});

function closeAddCategoryModal(){
    refreshData(); 
}

const form = ref({
  is_submitting: false,

  // form data
  slack: "",
  name: "",
  sale_price: "",
  stock_measurement_unit_id: "",
  sale_measurement_unit_id: "",
  categories: [],
  is_stockable: true,
  status: true,
  image: "",
  name_ar: "",
  short_description: "",
  short_description_ar: "",
  description: "",
  description_ar: "",
  upc: "",
  purchase_price: "",
  alert_quantity: "",
  inventory_slack: "",
  inventory_quantity: 0,
  inventory_sku: "",
  inventory_alert_quantity: "",
  inventory_show_in : "",
  inventory_is_favorite : false,
  inventory_status : true,
  is_quantity_readonly:false,
  stock_measurement_unit_name:"Units"
});

const schema = yup.object({
  name: yup
    .string()
    .required(t("name is required", { name: t("Ingredient Name") }))
    .min(
      3,
      t("name must be at least n characters", {
        name: t("Ingredient Name"),
        number: 3,
      })
    ).max(20,t("Must be less than 20 characters", {
            name: t("Ingredient Name"),
            number: 20,
          })
      ),
  sale_price: yup
    .number()
    .typeError(t("must be a number", { name: t("Sale Price") }))
    .required(t("name is required", { name: t("Sale Price") }))
    .positive(t("must be a positive number", { name: t("Sale Price") })),
  status: yup.bool().label("status"),
  categories: yup.array().min(1, t("select at least n options", { number: 1 })),
  inventory_quantity:yup.number().typeError(t('must be a number',{ name: t('Quantity') }))
      .when({
        is: () => form.value.is_stockable,
        then: (schema) => schema.required(t('name is required', { name: t('Quantity') })).moreThan(0, "Quantity cannot be negative"),
        otherwise:(schema) => schema.nullable()
      }),
  // purchase_price: yup.number().typeError(t('must be a number',{ name: t('Purchase Price') })).positive(t('must be a positive number', { name: t('Purchase Price') })),
  inventory_alert_quantity: yup.string().matches(/^([.0-9]{0,9999999999999})$/, t('Alert Quantity must be a positive number or 0')),
});

async function selectFile(e) {
  form.value.image = e.target.files[0];
}

async function selectStockExample(event){
  form.value.stock_measurement_unit_name = event.target.options[event.target.options.selectedIndex].text;
}
// const props = defineProps(["ingredient"]);

onMounted(() => {
  if (!_.isUndefined(slack)) {
    getIngredient();
  }
  // getMeasurements();
  refreshData();
  checkPermissions();
});

const category_permissions = ref({
    write : false,
    delete : false,
});

function checkPermissions(){
  category_permissions.value  = {
        write : isAuthorized('A_WRITE_CATEGORY'),
        delete : isAuthorized('A_DELETE_CATEGORY'),
    };
}

const measurements = ref([]);

async function getMeasurements() {
  await axios
    .get("/api/measurements")
    .then((response) => {
      measurements.value = response.data.data;
    })
    .catch((error) => {
      server_messages.type = "error";
      server_messages.messages = error;
      form.value.is_submitting = false;
      console.log(error);
    });
}

const categories = ref([]);
const taxes = ref([]);

async function refreshData() {
  await axios
    .get("/api/ingredient/add")
    .then((response) => {
      //console.log(response,'response');
      categories.value = response.data.data.categories;
      taxes.value = response.data.data.taxes;
      measurements.value = response.data.data.measurements;
    })
    .catch((error) => {
      server_messages.type = "error";
      server_messages.messages = error;
      form.value.is_submitting = false;
      console.log(error);
    });
}

async function saveIngredient(values) {
  form.is_submitting = true;

  var form_data = new FormData();
  form_data.append("name", values.name);
  form_data.append("sale_price", values.sale_price);
  form_data.append("categories", JSON.stringify(values.categories));
  form_data.append("is_stockable", values.is_stockable);
  form_data.append("status", values.status);
  form_data.append("image", form.value.image);
  // form_data.append('selected_taxes',JSON.stringify(values.selected_taxes));
  form_data.append("name_ar", values.name_ar);
  form_data.append("short_description", values.short_description);
  form_data.append("short_description_ar", values.short_description_ar);
  form_data.append("description", values.description);
  form_data.append("description_ar", values.description_ar);
  form_data.append("upc", values.upc);
  form_data.append("purchase_price", values.purchase_price);
  form_data.append("alert_quantity", values.alert_quantity);
  form_data.append("ingredient_slack", slack);
  form_data.append("inventory_slack", values.inventory_slack);
  form_data.append("inventory_sale_price", values.inventory_sale_price);
  form_data.append("inventory_quantity", values.inventory_quantity!= null?values.inventory_quantity:0);
  form_data.append("inventory_sku", values.inventory_sku!= null?values.inventory_sku:'');
  form_data.append("inventory_alert_quantity", values.inventory_alert_quantity);
  form_data.append("inventory_show_in", (values.inventory_show_in != null) ? values.inventory_show_in : '');
  form_data.append("inventory_is_favorite", (values.inventory_is_favorite == '1') ? true : false);
  form_data.append("inventory_status", (values.inventory_status == '1') ? true : false);

  if (values.is_stockable) {
    if (values.stock_measurement_unit_id != "") {
      form_data.append(
        "stock_measurement_unit_id",
        values.stock_measurement_unit_id ? values.stock_measurement_unit_id : ""
      );
    }
    if (values.sale_measurement_unit_id != "") {
      form_data.append(
        "sale_measurement_unit_id",
        values.sale_measurement_unit_id ? values.sale_measurement_unit_id : ""
      );
    }
  }

  var submit_url =
    slack != "" && slack != undefined
      ? "/api/ingredient/update"
      : "/api/ingredient/save";

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

        router.push("/ingredients");
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
      console.log(error);
    });
}

function resetData() {
  Object.assign(form, form);
}
const is_loaded = ref(false);
async function getIngredient() {
  let response = await axios.get("/api/ingredient", {
    params: {
      slack: slack,
    },
  });
  form.value = response.data.data.ingredient;
  is_loaded.value = true;
  form.value.image = "";
  form.value.categories = [];
  Object.keys(form.value.product_categories).forEach((key) => {
    form.value.categories.push(
      form.value.product_categories[key].category.slack
    );
  });

  if(form.value.this_branch_inventory!=null){
    form.value.inventory_slack = form.value.this_branch_inventory.slack;
    form.value.sale_price = form.value.this_branch_inventory.sale_price;
    form.value.inventory_quantity = form.value.this_branch_inventory.quantity;
    form.value.inventory_sku = form.value.this_branch_inventory.sku;
    form.value.inventory_alert_quantity = form.value.this_branch_inventory.alert_quantity;
    form.value.inventory_show_in = form.value.this_branch_inventory.show_in;
    form.value.inventory_is_favorite = form.value.this_branch_inventory.is_favorite==1?true:false;
    form.value.inventory_status = form.value.this_branch_inventory.status==1?true:false;
    form.value.is_quantity_readonly = true;
  }else{
    form.value.inventory_show_in = "";
    form.value.inventory_is_favorite = false;
    form.value.inventory_status = true;
    form.value.is_quantity_readonly = false;
  }

  if(form.value.is_stockable==true && form.value.stock_measurement_unit_id>0){
    form.value.stock_measurement_unit_name = form.value.stock_measurement_unit.unit_name+' '+form.value.stock_measurement_unit.unit_name_ar;
  }else{
    form.value.stock_measurement_unit_name = 'Units';
  }
}
</script>
