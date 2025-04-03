<template>
  <Form
    :validation-schema="schema"
    v-slot="{ setFieldValue, values }"
    @submit="saveProduct"
    enctype="multipart/form-data"
    :initial-values="form"
    v-if="(slack == '' || slack == undefined) || (slack != '' && is_loaded)"
  >
    <div class="row">
      <AsyncServerMessage
        class="py-3"
        v-if="server_messages.messages != ''"
        :server_messages="server_messages"
      />

      <div class="col-md-12">
        <div class="row">
          <div class="col-md-12">

            <div class="card">

              <div class="row mb-3 mb-lg-5">
                <h4 class="section-title pb-2">{{ $t("Master Product Details") }}:<VTooltip :message="labels.master_product_tooltip" /></h4>
                <h5 class="section-title pb-2 text-muted">{{ $t("Basic Details") }}:</h5>

                <div class="col-6 col-md-4 col-lg-3">
                  <VSelectInput
                    name="type"
                    :label="labels.type"
                    required
                    :options="product_types"
                    v-model="form.type"
                    size="normal"
                    @change="selectType"
                  />
                </div>
              

                <div class="col-6 col-md-4 col-lg-3">
                  <VTextInput
                    type="text"
                    name="name"
                    :label="labels.name"
                    :required="true"
                    v-model="form.name"
                  />
                </div>

                <div class="col-12 col-md-4 col-lg-3">
                  <div class="form-field">
                    <label>{{ $t("Product Image") }}</label>
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

                <div class="col-8 col-md-4 col-lg-3">
                  <VSelectInput v-if="category_permissions.write"
                    name="categories"
                    :label="labels.select_categories"
                    :text="'name'"
                    :value="'slack'"
                    :options="categories"
                    required
                    :selected="form.categories"
                    v-model="form.categories"
                    :addModalShow="true"
                    :addModalId="'#addCategoryModal'"
                    mode="single"
                    />
                    <!-- @change="checkCategory" -->
                  <VSelectInput v-else
                    name="categories"
                    :label="labels.select_categories"
                    :text="'name'"
                    :value="'slack'"
                    :options="categories"
                    required
                    :selected="form.categories"
                    v-model="form.categories"
                    mode="single"
                    />
                    <!-- @change="checkCategory" -->
                </div>

                <div class="col-auto col-md-2 col-lg-3 pt-4">
                  <div class="form-field">
                    <div class="form-check form-switch">
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
                      <label class="form-check-label" for="status"
                        >{{ $t("Active") }} <em>*</em>
                      </label>
                    </div>
                  </div>
                </div>

                <div class="col-6 col-md-3 col-lg-3">
                  <VSelectInput
                    name="price_type"
                    :label="labels.price_type"
                    required
                    size="normal"
                    :options="price_types"
                    :tooltip="labels.price_type_tooltip"
                    v-model="form.price_type"
                  />
                </div>

                <div class="col-6 col-md-3 col-lg-3">
                  <VSelectInput
                    name="tax_id"
                    :label="labels.select_tax"
                    :text="'name'"
                    :value="'id'"
                    mode="single"
                    :selected="form.tax_id"
                    :options="taxes"
                    v-model="form.tax_id"
                  />
                </div>

                <div class="col-6 col-md-3 col-lg-3">
                  <div class="">
                    <div class="pt-4" v-if="values.type != 4">
                      <div class="form-field">
                        <div class="form-check form-switch">
                          <Field
                            class="form-check-input me-2"
                            type="checkbox"
                            role="switch"
                            name="is_stockable"
                            id="is_stockable"
                            :unchecked-value="false"
                            :value="true"
                            v-model="form.is_stockable"
                            @change="
                              (event) =>
                                setFieldValue(
                                  'is_stockable',
                                  event.target.checked
                                )
                            "
                          />
                          <label class="form-check-label" for="is_stockable"
                            >{{ $t("Stockable") }} <em>*</em>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="col-6 col-md-4 col-lg-3"
                  v-if="values.type == 1 && values.is_stockable"
                >
                  <div class="form-field">
                    <label for=""
                      >{{ $t("Stock Unit") }} <em class="text-danger">*</em>
                      <VTooltip :message="labels.stock_unit_tooltip" />
                    </label>
                    <Field
                      as="select"
                      name="stock_measurement_unit_id"
                      id=""
                      class="form-control form-control-solid"
                      v-model="form.stock_measurement_unit_id"
                    >
                      <option value="">{{ $t("Units") }}</option>
                      <optgroup
                        v-for="(measurement, index) in measurements" v-show="measurement.status == 1"
                        :key="index"
                        :label="measurement.name+' '+(measurement.name_ar!='' && measurement.name_ar!=null && measurement.name_ar!='null'?measurement.name_ar:'')"
                      >
                        <option
                          v-for="(unit, unit_index) in measurement.units"
                          :key="unit_index"
                          :value="unit.id"
                        >
                          {{ unit.unit_name }} {{ unit.unit_name_ar!='' && unit.unit_name_ar!=null && unit.unit_name_ar!='null'?unit.unit_name_ar:'' }}
                        </option>
                      </optgroup>
                    </Field>
                  </div>
                </div>

                <div class="col-6 col-md-4 col-lg-3"
                  v-if="values.type == 1 && values.is_stockable"
                >
                  <div class="form-field">
                    <label for=""
                      >{{ $t("Sales Unit") }} <em class="text-danger">*</em>
                      <VTooltip :message="labels.sale_unit_tooltip" />
                    </label>
                    <Field
                      as="select"
                      name="sale_measurement_unit_id"
                      class="form-control form-control-solid"
                      v-model="form.sale_measurement_unit_id"
                    >
                      <option value="">{{ $t("Units") }}</option>
                      <optgroup
                        v-for="(measurement, index) in measurements" v-show="measurement.status == 1"
                        :key="index"
                        :label="measurement.name+' '+(measurement.name_ar!='' && measurement.name_ar!=null && measurement.name_ar!='null'?measurement.name_ar:'')"
                      >
                        <option
                          v-for="(unit, unit_index) in measurement.units"
                          :key="unit_index"
                          :value="unit.id"
                        >
                          {{ unit.unit_name }} {{ unit.unit_name_ar!='' && unit.unit_name_ar!=null && unit.unit_name_ar!='null'?unit.unit_name_ar:'' }}
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

                <!-- <div class="col-6 col-md-4 col-lg-3">
                  <VSelectInput
                      name="other_tax_type"
                      :label="labels.other_tax_type"
                      :options="other_tax_types"
                      v-model="form.other_tax_type"
                      :selected="form.other_tax_type"
                      size="normal"
                  />
                </div> -->

                <div class="col-6 col-md-4 col-lg-3" v-if="form.other_tax_type==2">
                  <VMultiSelect
                      name="additional_fee_id"
                      :label="labels.additional_fee"
                      :text="'name'"
                      :value="'id'"
                      mode="single"
                      :selected="form.additional_fee_id"
                      :options="additional_fees"
                      required
                  />
                </div>

                <!-- <div class="col-6 col-md-4 col-lg-3">
                  <VTextInput
                      type="number"
                      name="sale_price"
                      :label="
                      authStore.user.login_branch.tax_inclusive_pricing
                        ? labels.default_sales_price_inc_tax
                        : labels.default_sales_price_exc_tax
                    "
                      :input_group_text="
                      values.is_stockable && values.sale_measurement_unit_id
                        ? currency_symbol +
                          '/ '+ labels.per +' '+
                          data.sale_measurement_unit
                        : currency_symbol + '/ ' + labels.per_unit
                    "
                      v-model="form.sale_price"
                  />
                </div> -->

                <!-- <div class="col-6 col-md-4 col-lg-3">
                  <VTextInput
                      type="text"
                      name="name_ar"
                      :label="labels.name_ar"
                      v-model="form.name_ar"
                  />
                </div> -->

                <div class="col-6 col-md-4 col-lg-3">
                  <VTextInput
                      type="text"
                      name="short_description"
                      :label="labels.short_description"
                      v-model="form.short_description"
                  />
                </div>

                <!-- <div class="col-6 col-md-4 col-lg-3">
                  <VTextInput
                      type="text"
                      name="short_description_ar"
                      :label="labels.short_description_ar"
                      v-model="form.short_description_ar"
                  />
                </div> -->

                <!-- <div class="col-12 col-md-4 col-lg-3">
                  <div class="form-field">
                    <label>{{ $t("Description") }}</label>
                    <Field
                        as="textarea"
                        class="form-control form-control-solid p-3"
                        name="description"
                        :label="labels.description"
                        cols="3"
                        v-model="form.description"
                    ></Field>
                  </div>
                </div> -->

                <!-- <div class="col-12 col-md-4 col-lg-3">
                  <div class="form-field">
                    <label>{{ $t("Description (Arabic)") }}</label>
                    <Field
                        as="textarea"
                        class="form-control form-control-solid p-3"
                        name="description_ar"
                        :label="labels.description_ar"
                        cols="3"
                        v-model="form.description_ar"
                    ></Field>
                  </div>
                </div> -->

                <div class="col-6 col-md-4 col-lg-3"
                    v-show="values.type == 1 || values.type == 2"
                >
                  <VTextInput type="text" name="upc" :label="labels.upc" v-model="form.upc" />
                </div>

                <div class="col-6 col-md-4 col-lg-3" v-show="values.type == 1 && layout == 2">
                  <VTextInput type="text" name="mpn" :label="labels.mpn" v-model="form.mpn" />
                </div>

                <div class="col-6 col-md-4 col-lg-3" v-show="values.type == 1 && layout == 2">
                  <VTextInput type="text" name="ean" :label="labels.ean"  v-model="form.ean" />
                </div>

                <div class="col-6 col-md-4 col-lg-3" v-show="values.type == 1 && layout == 2">
                  <VTextInput
                      type="text"
                      name="manufacturer"
                      :label="labels.manufacturer"
                      v-model="form.manufacturer"
                  />
                </div>

                <div class="col-6 col-md-4 col-lg-3" v-show="values.type == 1 && layout == 2">
                  <VTextInput type="text" name="brand" :label="labels.brand" v-model="form.brand" />
                </div>

                <div class="col-6 col-md-4 col-lg-3" v-show="values.type == 1">
                  <VTextInput
                      type="number"
                      name="purchase_price"
                      :label="labels.purchase_price"
                      :input_group_text="
                      values.stock_measurement_unit_id
                        ? currency_symbol +
                          '/ ' +labels.per +' '+
                          data.stock_measurement_unit
                        : currency_symbol + '/ ' + labels.per_unit
                    "
                      v-model="form.purchase_price"
                      :min="0"
                  />
                </div>

                <!-- <div class="col-6 col-md-4 col-lg-3"
                    v-show="values.type == 1 || values.type == 2"
                >
                  <VTextInput
                      type="number"
                      name="alert_quantity"
                      :label="labels.alert_quantity"
                      v-model="form.alert_quantity"
                      :min="0"
                  />
                </div> -->

                <div class="col-6 col-md-4 col-lg-3"
                    v-show="values.type == 1 || values.type == 2"
                >
                  <VSelectInput
                      name="dietary"
                      :label="labels.dietary"
                      :options="dietary_types"
                      v-model="form.dietary"
                      :selected="form.dietary"
                    size="normal"
                  />
                </div>

              

                <div class="col-6 col-md-4 col-lg-3"
                    v-show="values.type == 1 || values.type == 2"
                >
                  <VTextInput
                      type="number"
                      name="calories"
                      :label="labels.calories"
                      v-model="form.calories"
                      :min="0"
                  />
                </div>

                <div class="col-6 col-md-4 col-lg-3" v-show="values.type == 2">
                  <VTextInput
                      type="number"
                      name="preparation_time"
                      :label="labels.preparation_time"
                      v-model="form.preparation_time"
                      :min="0"
                  />
                </div>

                <div class="col-6 col-md-4 col-lg-3 pt-md-3"
                v-show="values.type == 1 || values.type == 2"
            >
              <div class="form-field">
                <div class="form-check form-switch">
                  <Field
                      class="form-check-input me-2"
                      role="switch"
                      name="is_refundable"
                      id="is_refundable"
                      label="Refundable"
                      type="checkbox"
                      :unchecked-value="false"
                      :value="true"
                      v-model="form.is_refundable"
                      @change="
                      (event) =>
                        setFieldValue('is_refundable', event.target.checked)
                    "
                  />
                  <label class="form-check-label" for="is_refundable">{{
                      $t("Refundable (Can be returned)")
                    }}</label>
                </div>
              </div>
            </div>

                <input type="hidden" name="slack" />

              </div>

            </div>

          </div>

          <div class="col-md-12">
            <div class="card">
              <div class="row">
                <h5 class="section-title pb-2 text-muted">{{ authStore.user.login_branch.name }}'s {{ $t("In Hand Inventory Details") }}:<VTooltip :message="labels.branch_product_tooltip" /></h5>

                <div class="col-6 col-md-4 col-lg-3">
                  <VTextInput
                      type="number"
                      :name="'inventory_sale_price'"
                      :input_group_text="
                      form.is_stockable && form.sale_measurement_unit_id
                        ? currency_symbol +
                          '/ '+ labels.per +' '+
                          data.sale_measurement_unit
                        : currency_symbol + '/ ' + labels.per_unit"
                      v-model="form.inventory_sale_price"
                      step="1"
                      :label="authStore.user.login_branch.tax_inclusive_pricing
                        ? labels.sales_price_inc_tax
                        : labels.sales_price_exc_tax"
                      :readonly="form.is_ingredients_total_price"
                      required
                      class="mb-0"
                  />
                  <span v-if="form.is_ingredients_total_price"><i class="text-primary">Total is based on ingredient's product total.</i></span>
                </div>

                <div class="col-6 col-md-4 col-lg-3 " v-if="form.is_stockable==true">
                  <VTextInput
                      type="number"
                      name="inventory_quantity"
                      :label="labels.quantity"
                      v-model="form.inventory_quantity"
                      :input_group_text="
                      form.is_stockable && form.stock_measurement_unit_id
                        ? data.stock_measurement_unit
                        : labels.unit"
                      required
                      :readonly="form.is_quantity_readonly"
                      :class="form.is_quantity_readonly==true?'pe-none':''"
                  />
                </div>

                <div class="col-6 col-md-4 col-lg-3">
                  <VTextInput
                      type="text"
                      name="inventory_sku"
                      :label="labels.sku"
                      v-model="values.inventory_sku"
                  />
                </div>

                <div class="col-6 col-md-4 col-lg-3" v-if="form.is_stockable==true">
                  <VTextInput
                      type="number"
                      name="inventory_alert_quantity"
                      :label="labels.alert_quantity"
                      v-model="values.inventory_alert_quantity"
                      :min="0"
                  />
                </div>

                <div class="col-6 col-md-5 col-lg-3">
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

                <!-- <div class="col-3">
                  <div class="form-field" type="radio">
                    <label class="label"> {{ $t('Only for this Branch?') }}</label>
                    <div class="form-check mt-md-3">
                      <input class="form-check-input me-1" type="checkbox" name="only_for_this_branch" v-model="values.only_for_this_branch" :checked="form.only_for_this_branch" @change="
                          (event) =>
                            setFieldValue('only_for_this_branch', event.target.checked)
                        ">Yes
                    </div>
                  </div>
                </div> -->

                <!-- <div class="col-3">
                  <div class="form-field" type="radio">
                    <label class="label"> {{ $t('Is Favorite') }}</label>
                    <div class="form-check form-switch mt-md-3">
                      <input class="form-check-input" name="inventory_is_favorite" type="checkbox" role="switch" id="inventory_is_favorite"  v-model="values.inventory_is_favorite" :checked="form.inventory_is_favorite" @change="
                          (event) =>
                            setFieldValue('inventory_is_favorite', event.target.checked)
                        ">
                    </div>
                  </div>
                </div> -->

                <div class="col-auto mt-4" >
                  <div class="form-field" type="radio">
                    <label class="label"> {{ $t('Inventory Status') }}</label>
                    <div class="form-check form-switch mt-md-3">
                      <input class="form-check-input" name="inventory_status" type="checkbox" role="switch" id="inventory_status"  v-model="values.inventory_status" :checked="form.inventory_status" @change="
                          (event) =>
                            setFieldValue('inventory_status', event.target.checked)
                        "> <span class="ps-2">Active</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          <!-- <div class="col-md-12">
            <div class="card">
              <div class="row">
                <h5 class="section-title pb-2 text-muted">{{ $t("Add Multiple Pricing") }}</h5>
                <div class="col-md-3">
                    <div class="form-field">
                        <select
                          class="form-control form-control-solid w-100"
                          v-model="select_multiple_price"
                          @change="selectMultiplePrice"
                        >
                          <option value="">
                            --{{ $t("Select Multiple Price") }}--
                          </option>
                          <option
                            v-for="(price, index) in filtered_multiple_prices"
                            :value="price.slack"
                          >
                            {{ price.name }}
                          </option>
                        </select>
                    </div>
                  </div>
                  <div class="col-md-6" v-if="selected_multiple_prices.length">
                  <div class="table-responsive">
                      <table class="table table-condensed">
                        <thead>
                          <th>{{ $t("Name") }}</th>
                          <th>{{ $t("Price") }}</th>
                          <th class="text-end">{{ $t("Action") }}</th>
                        </thead>
                        <tbody>
                          <tr
                            v-if="selected_multiple_prices.length"
                            v-for="(price, index) in selected_multiple_prices"
                            :key="index"
                          >
                            <td>{{ price.name }}</td>
                            <td>
                              <VTextInput
                              type="number"
                              :name="'purchase_price_'+index"
                              :label="''"
                              v-model="price.product_price"
                              :min="'0'"
                          />
                            </td>
                            <td class="text-end">
                              <a
                                class="dropdown-item text-danger"
                                href="#"
                                @click="removePrice(price.id)"
                                >{{ $t("Remove") }}</a
                              >
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
              </div>
            </div>
          </div> -->
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
  <EditFormSkeleton v-else />

  <AsyncAddCategory @closeAddCategoryModal="closeAddCategoryModal" />
</template>

<script setup>
import { Form, Field,useForm } from "vee-validate";
const { values,setFieldValue,setValues  } = useForm();

import * as yup from "yup";
import { useAuthStore } from "@/stores/auth";
import ClipLoader from "vue-spinner/src/ClipLoader.vue";
import { useRoute } from "vue-router";
import { computed, reactive } from "vue";
import { useI18n } from "vue-i18n";
import useGlobalFunctions from '@/composables/global_functions.js';

const AsyncAddCategory = defineAsyncComponent( () => import('@/components/category/AddCategory.vue') );
const { t } = useI18n();
const { isAuthorized } = useGlobalFunctions();
const language = localStorage.getItem('language');

const labels = ref({
  type: t("Product Type"),
  name: t("Product Name"),
  // name_ar: t("Product Name (Arabic)"),
  select_categories: t("Select Categories"),
  price_type: t("Price Type"),
  select_tax: t("Select Tax"),
  // default_sales_price_inc_tax: t("Default Sale Price (Inclusive Tax)"),
  // default_sales_price_exc_tax: t("Default Sale Price (Exclusive Tax)"),
  short_description: t("Short Description"),
  // short_description_ar: t("Short Description (Arabic)"),
  // description: t("Description"),
  // description_ar: t("Description (Arabic)"),
  upc: t("UPC (Barcode)"),
  mpn: t("MPN (Manufacturing Part Number)"),
  ean: t("EAN (13 Digit International Article Number)"),
  manufacturer: t("Manufacturer"),
  brand: t("Brand"),
  alert_quantity: t("Alert Quantity"),
  calories: t("Calories"),
  preparation_time: t("Preparation Time (In Mins)"),
  purchase_price: t("Purchase Price (Exclusive Tax)"),
  price_type_tooltip: t("Open price can be added from cashier screen"),
  stock_unit_tooltip: t("Stock unit is your storage unit, i.e sugar can be stored in kilograms"),
  sale_unit_tooltip: t("Sales unit is your selling unit i.e sugar can be sold in grams"),
  dietary: t("Dietary"),
  per: t('Per'),
  per_unit: t('Per Unit'),
  master_product_tooltip: t('This master product will be visible on all branches.'),
  branch_product_tooltip: t('Stock only for this branch.'),
  sales_price_inc_tax: t('Sale Price (Incl. Tax)'),
  sales_price_exc_tax: t('Sale Price (Excl. Tax)'),
  quantity: t('Quantity In Hand'),
  sku: t('SKU'),
  show_in: t('Show In'),
  unit: t('Unit'),
  // other_tax_type: t('Other Tax Type'),
  // additional_fee: t('Additional Fee'),
});
const select_multiple_price = ref("");
const AsyncServerMessage = defineAsyncComponent(() =>
  import("@/components/common/ServerMessage.vue")
);

const route = useRoute();
const slack = route.params.slack;

const authStore = useAuthStore();
const currency_symbol = computed(() => {
  return authStore.user.currency.symbol;
});

function closeAddCategoryModal(){
    refreshData(); 
}

const server_messages = reactive({
  type: "",
  messages: "",
});

const data = reactive({
  sale_measurement_unit: "Unit",
  stock_measurement_unit: "Unit",
});
const form = ref({
  is_submitting: false,

  // form data (field names must match with database table)
  type: 1,
  name: "",
  sale_price: "",
  stock_measurement_unit_id: "",
  sale_measurement_unit_id: "",
  categories: "",
  is_stockable: true,
  status: true,
  image: "",
  name_ar: "",
  short_description: "",
  // short_description_ar: "",
  // description: "",
  // description_ar: "",
  upc: "",
  mpn: "",
  ean: "",
  manufacturer: "",
  brand: "",
  purchase_price: "",
  price_type: 1,
  alert_quantity: "",
  dietary: "",
  is_refundable: true,
  calories: "",
  preparation_time: "",
  tax_id: "",
  slack: "",
  other_tax_type: "",
  additional_fee_id:"",
  inventory_slack: "",
  inventory_sale_price: 0,
  inventory_quantity: 0,
  inventory_sku: "",
  inventory_alert_quantity: "",
  inventory_show_in : "",
  inventory_is_favorite : false,
  only_for_this_branch : false,
  inventory_status : true,
  is_quantity_readonly:false,
  is_ingredients_total_price:false
});

const product_types = ref([
  {
    id: 1,
    name: t("Product"),
  },
  {
    id: 2,
    name: t("Recipe"),
  },
  {
    id: 4,
    name: t("Service"),
  },
]);

const price_types = ref([
  {
    id: 1,
    name: t("Fixed"),
  },
  {
    id: 2,
    name: t("Open"),
  },
]);
const dietary_types = ref([
  {
    id: "",
    name: t("None"),
  },
  {
    id: 1,
    name: t("Veg"),
  },
  {
    id: 2,
    name: t("Non Veg"),
  },
]);

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

const other_tax_types = ref([
  {
    id: "",
    name: t("None"),
  },
  {
    id: 1,
    name: t("Tobacco Tax"),
  },
  {
    id: 2,
    name: t("Additional Fee"),
  },
]);

const layout = computed(() => {
  return authStore.user.merchant.layout;
});

const multiselect = defineComponent(Multiselect);

const schema = yup.object({
  type: yup.string().required(t("name is required", { name: t("Product Type") })),
  name: yup.string().required(t("name is required", { name: t("Product Name") }))
    .min(3,t("name must be at least n characters", {
        name: t("Product Name"),
        number: 3,
      })
    )
    .max(20,t("Must be less than 20 characters", {
          name: t("Product Name"),
          number: 20,
        })
    ),
  status: yup.bool().label("Status"),
  ean: yup.string().when({
                is: () => layout.value == 2,
                then: (schema) => schema.min(13).max(13).nullable(true).notRequired(true).transform((_, val) => val > 0 ? val : null) ,
                otherwise:(schema) => schema.nullable(true).notRequired(true)
            }).label("EAN"),
  categories: yup.string().required(t("name is required", { name: t("Category") })),
  inventory_sale_price: yup.number().typeError(t('must be a number',{ name: t('Sale Price') }))
    .required(t('name is required', { name: t('Sale Price') }))
    .positive(t("must be grater than 0", { name: t("Sale Price") })),
  inventory_quantity:yup.number().typeError(t('must be a number',{ name: t('Quantity') }))
      .when({
        is: () => form.value.is_stockable,
        then: (schema) => schema.required(t('name is required', { name: t('Quantity') })).moreThan(-1, "Quantity cannot be negative"),
        otherwise:(schema) => schema.nullable()
      }),
  // purchase_price: yup.string().matches(/^([.0-9]{0,9999999999999})$/, t('Purchase Price must be a positive number or 0')),
  // alert_quantity: yup.string().matches(/^([.0-9]{0,9999999999999})$/, t('Alert Quantity must be a positive number or 0')),
  inventory_alert_quantity: yup.string().matches(/^([.0-9]{0,9999999999999})$/, t('Alert Quantity must be a positive number or 0')),
  // additional_fee_id:yup.string()
  //     .when({
  //       is: () => form.value.other_tax_type==2,
  //       then: (schema) => schema.required(t('name is required', { name: t('Additional Fee') })),
  //       otherwise:(schema) => schema.nullable()
  //     }),
});

async function selectFile(e) {
  form.value.image = e.target.files[0];
}

onMounted(() => {
  refreshData();
  if(!_.isUndefined(localStorage.getItem('product_form_data')) && localStorage.getItem('product_form_data')!=null){
    form.value = JSON.parse(localStorage.getItem('product_form_data'));
    localStorage.removeItem('product_form_data')
  }
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
const multiple_prices = ref([]);
const selected_multiple_prices = ref([]);
const is_loaded = ref(false);
async function getProduct() {
  
  let response = await axios.get("/api/v2/product/edit/" + slack);
  form.value = response.data.data.product;
  form.value.image = "";
  form.value.categories = [];
  Object.keys(form.value.product_categories).forEach((key) => {
    form.value.categories = form.value.product_categories[key].category?.id;
  });
  if (
    response.data.data.product.sale_measurement_unit_id != null &&
    response.data.data.product.sale_measurement_unit_id != ""
  ) {
    data.sale_measurement_unit =
      response.data.data.product.sale_measurement_unit.abbreviation;
  }
  if (
    response.data.data.product.stock_measurement_unit_id != null &&
    response.data.data.product.stock_measurement_unit_id != ""
  ) {
    data.stock_measurement_unit =
      response.data.data.product.stock_measurement_unit.abbreviation;
  }

  // if(response.data.data.product.tobacco_tax == 1 || response.data.data.product.tobacco_tax == true){
  //   form.value.other_tax_type = 1;
  // }

  // if(response.data.data.product.additional_fee_id > 0){
  //   form.value.other_tax_type = 2;
  // }

  is_loaded.value = true;
  if(form.value.this_branch_inventory!=null){
    form.value.inventory_slack = form.value.this_branch_inventory.slack;
    form.value.inventory_sale_price = form.value.this_branch_inventory.sale_price;
    form.value.inventory_quantity = form.value.this_branch_inventory.quantity;
    form.value.inventory_sku = form.value.this_branch_inventory.sku;
    form.value.is_ingredients_total_price = form.value.this_branch_inventory.is_ingredients_total_price==1?true:false;
    form.value.inventory_alert_quantity = form.value.this_branch_inventory.alert_quantity;
    form.value.inventory_show_in = form.value.this_branch_inventory.show_in;
    // form.value.inventory_is_favorite = form.value.this_branch_inventory.is_favorite==1?true:false;
    // form.value.only_for_this_branch = form.value.branch_id>0?true:false;
    form.value.inventory_status = form.value.this_branch_inventory.status==1?true:false;
    form.value.is_quantity_readonly =  (clone_mode.value) ? false : true;
    // if (form.value.this_branch_inventory.product_prices) {

    //   Object.keys(form.value.this_branch_inventory.product_prices).forEach((key) => {
    //     let price = _.find(
    //       multiple_prices.value,
    //       (item) => item.id == form.value.this_branch_inventory.product_prices[key].multiple_price_id
    //     );
    //     price.product_price = form.value.this_branch_inventory.product_prices[key].product_price;
    //     selected_multiple_prices.value.push(price);
    //   });
    // }
  }else{
    form.value.inventory_show_in = "";
    // form.value.inventory_is_favorite = false;
    // form.value.only_for_this_branch = false;
    form.value.inventory_status = true;
    form.value.is_quantity_readonly = false;
  }

  // console.log(form.value.categories);
 //setValues(form.value);
//setFieldValue("dietary",1)
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
    });
}



// const filtered_multiple_prices = computed(() => {
//   return multiple_prices.value.filter((obj1) => {
//     return !selected_multiple_prices.value.some((obj2) => obj2.id === obj1.id);
//   });
// });

// function selectMultiplePrice() {
//   if (select_multiple_price.value != "") {
//     let price = _.find(
//       multiple_prices.value,
//       (item) => item.slack == select_multiple_price.value
//     );
//     price.product_price = 0;
//     selected_multiple_prices.value.push(price);
//   }
// }

const categories = ref([]);
const taxes = ref([]);
// const additional_fees = ref([]);

const props = defineProps(["action"]);
const clone_mode = computed(() => {
  return !_.isUndefined(props.action);
});


async function refreshData() {
  await axios
    .get("/api/product/add")
    .then((response) => {
      categories.value = response.data.data.categories;
      taxes.value = response.data.data.taxes;
      // additional_fees.value = response.data.data.additional_fees;
      // multiple_prices.value = response.data.data.multiple_prices;
      measurements.value = response.data.data.measurements;
      if (!_.isUndefined(slack)) {
        getProduct();
      }
      if (_.isUndefined(slack)) {
        var default_tax = taxes.value.find(function (elem) {
          if (elem.is_country_default_tax == 1) return elem.id;
        });
        if(default_tax && default_tax!=undefined)
        {
          form.value.tax_id = default_tax.id;
        }
      }
    })
    .catch((error) => {
      server_messages.type = "error";
      server_messages.messages = error;
      form.value.is_submitting = false;
    });
}

async function saveProduct(values) {
  form.value.is_submitting = true;
  var form_data = new FormData();
  form_data.append("type", values.type);
  form_data.append("name", values.name);
  form_data.append("sale_price", values.sale_price);
  form_data.append("categories", JSON.stringify([values.categories]));
  form_data.append("is_stockable", values.is_stockable);
  form_data.append("status", values.status);
  form_data.append("image", form.value.image);
  form_data.append("tax_id", values.tax_id);
  // form_data.append("name_ar", values.name_ar);
  form_data.append("short_description", values.short_description);
  // form_data.append("short_description_ar", values.short_description_ar);
  // form_data.append("description", values.description);
  // form_data.append("description_ar", values.description_ar);
  form_data.append("upc", values.upc);
  form_data.append("mpn", values.mpn);
  form_data.append("ean", values.ean);
  form_data.append("manufacturer", values.manufacturer);
  form_data.append("brand", values.brand);
  form_data.append("purchase_price", values.purchase_price);
  form_data.append("price_type", values.price_type);
  // form_data.append("alert_quantity", values.alert_quantity);
  form_data.append("dietary", values.dietary);
  form_data.append("is_refundable", values.is_refundable);
  form_data.append("calories", values.calories);
  form_data.append("preparation_time", values.preparation_time);
  form_data.append("slack", slack);
  // form_data.append("other_tax_type", values.other_tax_type);
  // form_data.append("additional_fee_id", values.additional_fee_id!= null?values.additional_fee_id:'');
  form_data.append("inventory_slack", values.inventory_slack);
  form_data.append("inventory_sale_price", values.inventory_sale_price);
  form_data.append("inventory_quantity", values.inventory_quantity!= null?values.inventory_quantity:0);
  form_data.append("inventory_sku", values.inventory_sku!= null?values.inventory_sku:'');
  form_data.append("inventory_alert_quantity", values.inventory_alert_quantity);
  form_data.append("inventory_show_in", (values.inventory_show_in != null) ? values.inventory_show_in : '');
  // form_data.append("inventory_is_favorite", (values.inventory_is_favorite == '1') ? true : false);
  // form_data.append("only_for_this_branch", (values.only_for_this_branch == '1') ? 1 : 0);
  form_data.append("inventory_status", (values.inventory_status == '1') ? true : false);
  // form_data.append("multiple_prices",JSON.stringify(selected_multiple_prices.value));
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

  var submit_url = clone_mode.value
    ? "/api/product/clone"
    : slack != "" && slack != undefined
    ? "/api/product/update"
    : "/api/product/save";

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

        router.push("/products");
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

if (layout.value == 2) {
  product_types.value = _.filter(product_types.value, (value) => {
    return value.id != 2;
  });
}

// const is_tobacco_or_fee = computed(() => {
//   return authStore.isTobaccoOrFee;
// });

async function selectType(){
  if(event.target.value==4){
    form.value.is_stockable = 0;
  }
}

// function removePrice(id) {
//   selected_multiple_prices.value = _.filter(
//     selected_multiple_prices.value,
//     (item) => item.id != id
//   );
// }

// async function checkCategory(){

//   var sel_cate_tobacco_status = categories.value.find(function (elem) {
//     if (elem.id == form.value.categories && elem.is_tobacco_tax == 1) return true;
//   });
//   if(sel_cate_tobacco_status != undefined && sel_cate_tobacco_status.is_tobacco_tax == 1)
//   {
//     form.value.other_tax_type = 1;
//   }
//   else{
//     form.value.other_tax_type = "";
//   }
// }

</script>
