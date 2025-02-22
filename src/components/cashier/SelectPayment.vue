<template>
  <teleport to="body">
    <div
      class="modal hide cashier-layout-modal"
      id="paymentModal"
      tabindex="5"
      aria-hidden="true"
      aria-modal="true"
      role="dialog"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
    >
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header modal-title">
            <h2 class="mb-0">{{ $t("Payment Options") }}</h2>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body bg-light">
            <div class="row">
              <div class="col-md-4 paymentmathed-tab-wrap">
                <ul
                  class="nav nav-tabs paymentmathed-tabs"
                  id="myTab3"
                  role="tablist"
                >
                  <li v-for="(item,index) in payment_methods" class="nav-item" role="" @click="setPaymentMethod(item.id)">
                    <button
                      class="nav-link"
                      :class="{ active: item.id == payment_method }"
                      type="button"
                      role="tab"
                      aria-selected="true"
                      tabindex="-1"
                    >
                      <span class="icon">
                        <img v-if="item.constant == 'CASH'" src="/src/assets/images/cash.svg" alt="" />
                        <img v-else src="/src/assets/images/credit.svg" alt="" />
                      </span>
                      {{ item.name }}
                    </button>
                  </li>
                </ul>
              </div>
              <div class="col-md-8">
                <div class="tab-content paymentmathed-tab-content">
                  <div class="tab-pane fade show active" role="tabpanel">
                    <div class="row mb-4" v-if="payment_method == 1">
                      <div class="col-12">
                        <div class="form-field mb-md-0">
                          <label class="label">{{ $t("Cash Amount") }}</label>
                          <input
                            type="text"
                            placeholder=""
                            class="form-control form-control-lg"
                            required=""
                            v-model="cash_amount"
                          />
                        </div>
                      </div>
                    </div>

                    <div class="row mb-4" v-else>
                      <div class="col-8">
                        <div class="form-field mb-md-0">
                          <label class="label">{{ $t("Card Amount") }}</label>
                          <input
                            type="text"
                            placeholder=""
                            class="form-control form-control-lg"
                            required=""
                            v-model="card_amount"
                          />
                        </div>
                      </div>

                      <div class="col-4">
                        <div class="form-field mb-md-0">
                          <label class="label">{{ $t("Cash Amount") }}</label>
                          <input
                            type="text"
                            placeholder=""
                            class="form-control form-control-lg"
                            required=""
                            v-model="cash_amount"
                          />
                        </div>
                      </div>
                    </div>

                    

                    <div class="row mb-4">
                      <div class="col-12">
                        <div class="form-field mb-md-0">
                          <label class="label">{{ $t("Order Note") }}</label>
                          <textarea
                              type="text"
                              placeholder=""
                              class="form-control form-control-lg"
                              required=""
                              v-model="order_note"
                          ></textarea>
                        </div>
                      </div>
                    </div>

                    <!-- <div class="row mb-4" v-if="payment_method == 3">
                                            <div class="col-12">
                                                <div class="form-field mb-0">
                                                    <label class="label">Gift Code</label>
                                                    <div class="row">
                                                        <div class="col">
                                                            <input type="text" placeholder="enter gift code" class="form-control form-control-lg" required="">
                                                        </div>
                                                        <div class="col-auto">
                                                            <button type="button" class="btn btn-primary">Apply</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div> -->

                    <div
                      class="apply-discount mt-0 mb-2"
                    >
                      <div class="checkbox-wrap">
                        <label
                          data-bs-toggle="collapse"
                          data-bs-target="#discountfeilds"
                        >
                          <input
                            type="checkbox"
                            name="Apply_Discount"
                            v-model="apply_discount"
                            :checked="apply_discount"
                            class="me-1"
                          />

                        </label>
                        <span>{{ $t("Apply Discount") }}</span>
                      </div>
                      <div
                        class="expand"
                        id="discountfeilds"
                        v-if="apply_discount"
                      >
                        <div class="discount-feilds">
                          <div class="row gx-3">
                            <div class="col-5 col-md-5 m-0">
                              <div class="form-field mb-0">
                                <label class="label">{{
                                  $t("Discount")
                                }}</label>
                                <select
                                  class="form-control"
                                  tabindex="-1"
                                  v-model="discount_code"
                                  @change="applyDiscount()"
                                >
                                  <option value="">
                                    {{ $t("Custom Discount") }}
                                  </option>
                                  <option
                                    :value="discount"
                                    v-for="discount in discounts"
                                  >
                                    {{ discount.name }}
                                  </option>
                                </select>
                              </div>
                            </div>
                            <div class="col-7 col-md-7 m-0">
                              <div
                                class="form-field position-relative mb-0 input-select"
                              >
                                <label class="label">{{
                                  $t("Amount/Percentage")
                                }}</label>
                                <div class="position-relative">
                                  <input
                                    type="text"
                                    placeholder="00"
                                    class="form-control"
                                    :disabled="discount_code != ''"
                                    v-model="discount_value"
                                    @input="applyDiscount()"
                                  />

                                  <div class="input-select-wrap p-0 m-0">
                                    <select
                                      class="form-control w-100"
                                      tabindex="-1"
                                      :disabled="discount_code != ''"
                                      v-model="discount_type"
                                      @change="applyDiscount()"
                                    >
                                      <option value="1">%</option>
                                      <option value="2">
                                        {{ currency_symbol }}
                                      </option>
                                    </select>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="checkout-data-table">
                      <table class="w-100">
                        <tbody>
                          <tr>
                            <td>
                              {{ $t("Subtotal") }}
                            </td>
                            <td align="right">
                              {{ cashierStore.grandTotal.subtotal }}
                            </td>
                          </tr>
                          <tr v-if="cashierStore.grandTotal.product_discount > 0">
                            <td class="text-success">
                              {{ $t("Product Discount") }}
                            </td>
                            <td align="right" class="text-success">
                              {{ cashierStore.grandTotal.product_discount }}
                            </td>
                          </tr>
                          <tr v-if="cashierStore.grandTotal.product_discount > 0">
                            <td>
                              {{ $t("Subtotal After Product Discount") }}
                            </td>
                            <td align="right">
                              {{ cashierStore.grandTotal.subtotal_after_product_discount }}
                            </td>
                          </tr>
                          <tr v-if="cashierStore.grandTotal.order_discount > 0">
                            <td class="text-success">
                              {{ $t("Order Discount") }}
                            </td>
                            <td align="right" class="text-success">
                              {{ cashierStore.grandTotal.order_discount }}
                            </td>
                          </tr>
                          <tr v-if="cashierStore.grandTotal.order_discount > 0">
                            <td>
                              {{ $t("Subtotal After Order Discount") }}
                            </td>
                            <td align="right">
                              {{ cashierStore.grandTotal.subtotal_after_order_discount }}
                            </td>
                          </tr>
                          <tr v-if="cashierStore.grandTotal.additional_fee > 0">
                            <td>
                              {{ $t("Additional Fee") }}
                            </td>
                            <td align="right">
                              {{ cashierStore.grandTotal.additional_fee }}
                            </td>
                          </tr>
                          <tr v-if="cashierStore.grandTotal.tobacco_tax > 0">
                            <td>
                              {{ $t("Tobacco Tax") }}
                            </td>
                            <td align="right">
                              {{ cashierStore.grandTotal.tobacco_tax }}
                            </td>
                          </tr>
                          <tr v-if="cashierStore.grandTotal.tax > 0">
                            <td>
                              {{ $t("Tax") }}
                            </td>
                            <td align="right">
                              {{ cashierStore.grandTotal.tax }}
                            </td>
                          </tr>
                         
                        </tbody>
                        <tfoot>
                          <tr class="total-tr">
                            <td>
                              <h5>{{ $t("Total") }}</h5>
                            </td>
                            <td align="right">
                              <h5
                                >{{
                                  cashierStore.grandTotal.total
                                }}
                                {{ currency_symbol }}</h5
                              >
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                    <div class="mt-4">
                      <div
                      v-if="cashierStore.grandTotal.total < 0 || cashierStore.cash_amount < 0 || cashierStore.card_amount < 0" 
                        class="alert alert-warning fw-bold text-center mb-0"
                      >
                        {{ $t("Order must not contain negative values") }}
                      </div>
                      <button
                        v-if="cashierStore.grandTotal.total > 0 && cashierStore.cash_amount >= 0 || cashierStore.card_amount >= 0 && isAuthorized('A_CLOSE_ORDER')"
                        type="button"
                        class="btn btn-primary btn-rounded btn-lg w-100"
                        :disabled="is_processing"
                        :class="{
                          disabled:
                            change_amount < 0 ||
                            checkNum(change_amount) ||
                            cashierStore.grandTotal.total < 0 ||
                            (payment_method == 2 &&
                              cash_card_amount <
                                cashierStore.grandTotal.total),
                        }"
                        @click="close()"
                      >
                        <clip-loader
                          v-if="is_processing"
                          :color="'white'"
                          :size="'20px'"
                          class="pt-2 pe-2"
                        >
                        </clip-loader>
                        <span class="pt-0" v-if="is_processing">
                          {{ $t("Placing Order...") }}
                        </span>
                        <span v-else>
                          <span v-if="action_type == 'CLOSE'">
                            <span>{{ $t("CLOSE ORDER") }}</span>
                          </span>
                          <span v-if="action_type == 'SEND_TO_KITCHEN'">
                            {{ $t("SEND TO KITCHEN") }}
                          </span>
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <AsyncChangeAmountModal :change="change" />
  </teleport>
</template>

<script setup>
import { useAuthStore } from "@/stores/auth";
import { useCashierStore } from "@/stores/cashierStore";
import useGlobalFunctions from "@/composables/global_functions.js";
import ClipLoader from "vue-spinner/src/ClipLoader.vue";

const { isAuthorized } = useGlobalFunctions();

const authStore = useAuthStore();
const cashierStore = useCashierStore();

const server_messages = reactive({
  type: "",
  messages: "",
});

const currency_symbol = computed(() => {
  return authStore.user.currency.symbol;
});

const cash_amount = computed({
  get: () => cashierStore.cash_amount,
  set: (value) => cashierStore.setCashAmount(value),
});

const card_amount = computed({
  get: () => cashierStore.card_amount,
  set: (value) => cashierStore.setCardAmount(value),
});

const cash_card_amount = computed(() => {
  return parseFloat(cash_amount.value) + parseFloat(card_amount.value);
});

const change_amount = computed(() => {
  return _.round(cashierStore.change_amount,2);
});

const order_note = computed({
  get: () => cashierStore.order_note,
  set: (value) => cashierStore.setOrderNote(value),
});

const action_type = computed(() => {
  return cashierStore.action_type;
});

function setPaymentMethod(value) {
  cashierStore.setPaymentMethod(value);

  if (value == 3) {
    apply_discount.value = false;
  }
}

const payment_method = computed(() => {
  return cashierStore.payment_method;
});

function checkNum(value) {
  return isNaN(value);
}

// const apply_discount = ref(false);
const discount_code = ref("");
const discount_value = ref("");
const discount_type = ref(1);

const apply_discount = computed({
  get: () => cashierStore.is_discount_applied,
  set: (value) => cashierStore.setIsDiscountApplied(value),
});

watch(
  () => apply_discount.value,
  (value) => {
    if (value) {
      fetchDiscounts();
    }
    applyDiscount();
  }
);

watch(
  () => discount_code.value,
  (value) => {
    if (value) {
      discount_value.value = discount_code.value.value;
      discount_type.value = discount_code.value.type;
      discount_type.slack = discount_code.value.slack;
    } else {
      discount_value.value = "";
      discount_type.value = 1;
      discount_type.slack = "";
    }
  }
);

function applyDiscount() {
  if (discount_value.value != "") {
    cashierStore.setDiscount(
      discount_value.value,
      parseInt(discount_type.value),
      discount_type.slack
    );
  } else {
    cashierStore.clearDiscount();
  }
}

const discounts = ref([]);
async function fetchDiscounts() {
  let form_data = new FormData();
  form_data.append(
    "order_amount",
    cashierStore.grandTotal.grand_product_amount
  );
  var response = await axios.post("api/cashier/discounts", form_data);
  discounts.value = response.data.data.order_discounts;
}

const is_processing = ref(false);

const { placeOrder } = useGlobalFunctions();

const change = ref(0);

async function close() {
  is_processing.value = true;

  let response = await placeOrder();

  if (response.data.status_code == 200) {
    toast.success(response.data.msg);

    $("#paymentModal").modal("hide");

    if (change_amount.value > 0) {
      change.value = change_amount.value;
      $("#ChangeAmountModal").modal("show");
    }

    cashierStore.clearCart();

    is_processing.value = false;

    window.open(
      response.data.data.receipt_link,
      "_blank" // <- This is what makes it open in a new window.
    );
  } else {
    toast.error(response.data.msg);

    is_processing.value = false;
  }
}

const is_discount_applicable = computed(() => {
  if (parseFloat(cashierStore.grandTotal.grand_product_amount) >= 0) {
    return true;
  } else {
    return false;
  }
});

const AsyncChangeAmountModal = defineAsyncComponent(() =>
  import("@/components/cashier/ChangeAmountModal.vue")
);

const payment_methods = computed(() => {
  return cashierStore.payment_methods;
})
</script>
