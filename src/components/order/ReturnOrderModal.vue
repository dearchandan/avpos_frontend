<template>
    <div
      class="modal hide"
      id="returnOrderModal"
      tabindex="-1"
      aria-labelledby="Add Category"
      aria-modal="true"
      role="dialog"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
    >
      <div class="modal-dialog modal-xl modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <!-- <h5 class="modal-title text-primary">{{ $t('Returning Items') }} - Order #<span v-if="order != ''">{{ order.order_number }}</span> </h5> -->
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              @click="closeModal"
              id="close_btn"
            ></button>
          </div>
          <div class="modal-body">
            <div v-if="form.is_listing">
              <beat-loader
                color="gray"
                :size="'15px'"
                class="pt-2 pe-2"
              ></beat-loader>
            </div>
  
            <div v-else>
              <Form :validation-schema="schema" @submit="submitReturn" :initial-values="form" enctype="multipart/form-data">
                <div class="row">
                  <div class="col-6">
                    <div class="form-field">
                      <div class="form-check form-switch">
                        <label class="form-check-label">
                          <input
                            type="checkbox"
                            class="form-check-input me-2"
                            role="switch"
                            name="is_checked_returning_entire_order"
                            id="is_checked_returning_entire_order"
                            :unchecked-value="false"
                            v-model="form.is_checked_returning_entire_order"
                          />
                          {{ $t("Return Entire Order") }}</label
                        >
                      </div>
                    </div>
                  </div>
                  <div class="col-6">
                    <p class="text-end">
                      Order Amount: {{ getRoundedValue(order.total) }}
                      {{ currency_symbol }}
                    </p>
                  </div>
                </div>
    
                <div class="table-responsive mt-3">
                  <table
                    class="table table-hover table-bordered mb-3 table-responsive-data"
                  >
                    <thead class="bg-light">
                      <tr>
                        <th class="text-center" width="5%">{{ $t("Return") }}</th>
                        <th width="5%">{{ $t("Stock Status") }}</th>
                        <th width="30%">{{ $t("Product") }}</th>
                        <th width="10%">{{ $t("Qty Left") }}</th>
                        <th width="5%">{{ $t("Qty to Return") }}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(product, index) in form.items">
                        <td class="text-center">
                          <input type="checkbox" v-model="product.is_returning" />
                        </td>
                        <td class="text-center">
                          <select
                            v-if="form.items[index].is_stockable"
                            v-model="form.items[index].stock_status"
                          >
                            <option value="1">Return To Stock</option>
                            <option value="0">Wastage</option>
                          </select>
                          <span v-else>Unstockable</span>
                        </td>
                        <td>
                          {{ form.items[index].product_name }}
                          <span v-if="form.items[index].product_name_ar != ''">
                            {{ form.items[index].product_name_ar }}
                          </span>
                          <span
                            v-if="form.items[index].note != ''"
                            class="text-danger"
                          >
                            Note: {{ form.items[index].note }}
                          </span>
                        </td>
                        <td>{{ form.items[index].available_quantity }}</td>
                        <td>
                          <VTextInput
                              type="number"
                              :name="'items['+index+'].quantity'"
                              v-model="form.items[index].returning_quantity"
                              :max="form.items[index].available_quantity"
                              min="0"
                              :islabel=false
                              :class="'mt-0'"
                            />
                          <!-- <input
                            type="number"
                            class="text-primary w-100 p-2"
                            style="height: 35px;font-size: 20px;"
                            v-model="form.items[index].returning_quantity"
                          /> -->
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
    
                <div class="row pt-3">
                  <div class="col-md-4">
                    <div class="row">
                      <VMultiSelect
                        name="payment_method"
                        mode="single"
                        text="name"
                        value="id"
                        :label="'Payment Method'"
                        v-model="form.payment_method_id"
                        :options="payment_methods"
                        required
                      />
                    </div>
                  </div>
                  <div class="col-6">
                    <VMultiSelect
                      name="reason"
                      mode="single"
                      :label="'Returned Reason'"
                      v-model="form.reason"
                      :options="order_returned_reasons"
                      required
                    />
                  </div>
                  <div class="col-md-7" v-if="form.reason == 'Other'">
                    <VTextInput
                      type="text"
                      name="other_reason"
                      v-model="form.other_reason"
                      :label="labels.other_reason"
                      :placeholder="labels.other_reason_placeholder"
                    />
                  </div>
                  <div class="col-2 text-end pt-4">
                    <button
                      type="submit"
                      class="btn btn-primary w-100"
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
                        Submitting...
                      </span>
                      <span class="pt-0" v-else> Submit </span>
                    </button>
                  </div>
                </div>
              </Form>

            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, reactive, watch, computed, toRef } from "vue";
  import { Form, Field, ErrorMessage } from 'vee-validate'
  import * as yup from 'yup';
  import VTextInput from "@/components/common/VTextInput.vue";
  import BeatLoader from "vue-spinner/src/BeatLoader.vue";
  import useGlobal from "@/composables/global.js";
  const { t } = useI18n();
  import useGlobalFunctions from "@/composables/global_functions.js";
  
  import { useAuthStore } from "@/stores/auth";
  import ClipLoader from "vue-spinner/src/ClipLoader.vue";
  import { useI18n } from "vue-i18n";
  const { getRoundedValue } = useGlobalFunctions();
  const authStore = useAuthStore();
  
  const currency_symbol = computed(() => {
    return authStore.user.currency.symbol;
  });
  
  const server_messages = reactive({
    type: "",
    messages: "",
  });
  
  const labels = ref({
    other_reason: t("Other Reason"),
    other_reason_placeholder: t("Enter returned reason..."),
  });
  
  const { order_returned_reasons } = useGlobal();
  
  function closeModal() {
    $("#returnOrderModal").modal("hide");
  }
  
  const props = defineProps(["order"]);
  const order = toRef(props, "order");
  
  const form = ref({
    is_checked_returning_entire_order: false,
    is_listing: false,
    is_submitting: false,
    items: [],
    reason: "",
    other_reason: "",
    payment_method_id: "",
  });
  
  const schema = yup.object({
      items: yup.array(yup.object({
        quantity:yup.string().test({
            name: 'max',
            exclusive: false,
            params: { },
            test: function (value,context) {
                var max = $('[name="'+context.path+'"]').attr("max");
                if(isNaN(parseFloat(value)) || value == ''){
                  return context.createError({path:`${context.path}`, message:t('must be a positive number or 0',{ name:t('Quantity') }) });
                }else if(value <= parseFloat(max)){
                  return true;
                }else{
                  return context.createError({path:`${context.path}`, message:t('must be less than or equal to n',{ name:t('Quantity'), number:max }) });
                }
            },
          }),
        })),
        reason: yup.string().required(t('name is required', { name: t('Reason') })),
        payment_method: yup.string().required(t('name is required', { name: t('Payment Method') })),
    });

  watch(
    () => props.order,
    (value) => {
      if (value && value.products) {
          console.log(value.products)

        form.value.items = value.products.map((item) => {
          if (item.is_refundable) {
            return {
              is_stockable: item.is_stockable,
              stock_status: 1,
              is_refundable: item.is_refundable,
              product_name: item.product_name,
              product_name_ar: item.product_name_ar,
              note: item.note,
              product_amount: item.product_amount,
              /* additional parameters */
              order_product_slack: item.slack,
              is_returning: false,
              product_quantity: item.product_quantity,
              available_quantity: item.product_quantity - item.returned_quantity,
              returning_quantity: 0,
              returning_amount: 0,
            };
          }
        });
        form.value.items = form.value.items.filter(
          (item) => item && item.available_quantity > 0
        );
      }
    }
  );
  
  const payment_methods = ref([]);
  getPaymentMethods();
  async function getPaymentMethods() {
    let data = await axios.get("api/payment_methods/all");
    payment_methods.value = data.data.data;
  }
  
  function selectPaymentMethod(payment_method_id) {
    form.value.payment_method_id = payment_method_id;
  }
  
  watch(
    () => form.value.is_checked_returning_entire_order,
    (value) => {
      if (value) {
        form.value.items = _.forEach(form.value.items, (item) => {
          item.returning_quantity = item.available_quantity;
          item.is_returning = true;
        });
      } else {
        form.value.items = _.forEach(form.value.items, (item) => {
          item.returning_quantity = 0;
          item.is_returning = false;
        });
      }
    }
  );
  
  function resetData() {
    Object.assign(form, initialState);
  }
  
  async function submitReturn() {
    form.value.is_submitting = true;
    let items = _.filter(form.value.items, (item) => item.is_returning);
  
    let formData = new FormData();
    formData.append("order_slack", order.value.slack);
    formData.append("items", JSON.stringify(items));
    formData.append(
      "reason",
      form.value.reason == "Other" ? form.value.other_reason : form.value.reason
    );
    formData.append("payment_method_id", form.value.payment_method_id);
  
    await axios
      .post("/api/return_order/save", formData)
      .then((response) => {
        if (response.data.status_code == 200) {
          toast.success(response.data.msg);
          form.value.is_submitting = false;
          $("#returnOrderModal").modal("hide");
          location.reload();
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
        console.log(error);
      });
  }
  </script>
  
  <style scoped>
  .active-payment-method {
    border: 1px solid rgb(51, 52, 50, 0.2);
    font-weight: bold !important;
    color: #1e40af !important;
  }
  </style>
  