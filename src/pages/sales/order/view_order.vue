<template>
  <DefaultLayout>
    <template v-slot:subheader>
      <div class="header-nav-wrap">
        <div class="row align-items-center">
          <div class="col-auto">
            <div class="header-back-link">
              <router-link class="text-primary" :to="{ name: 'Order', query: { order_filters: route.query.order_filters } }"
                ><Icon icon="fa6-solid:chevron-left" />
                {{ $t("Orders") }}</router-link>
            </div>
          </div>
          <div class="col-auto">
            <h5 class="fw-bold" v-if="order">#{{ order.order_number }}</h5>
          </div>
        </div>
      </div>
    </template>

    <div class="content">
      <div class="page-heading">
        <div class="py-3" v-if="server_messages.messages != ''">
          <ServerMessage :server_messages="server_messages" />
        </div>
      </div>

      <div class="row pb-4">
        <div class="col-8">
          <span class="badge badge-warning" v-if="order.order_status == 0"
            >{{ $t("Order Status") }} : {{ order.order_status_text }}</span
          >
          <span class="badge badge-success" v-if="order.order_status == 1"
            >{{ $t("Order Status") }} : {{ order.order_status_text }}</span
          >
          <span class="badge badge-danger" v-if="order.order_status == 2"
            >{{ $t("Order Status") }} : {{ order.order_status_text }} ({{
              order.kitchen_status_text
            }})
          </span>
          <span class="badge badge-primary" v-if="order.order_status == 3"
            >{{ $t("Order Status") }} : {{ order.order_status_text }}</span
          >
          <span class="badge badge-primary" v-if="order.order_status == 4"
            >{{ $t("Order Status") }} : {{ order.order_status_text }} ({{
              order.kitchen_status_text
            }})
          </span>
          <span class="badge badge-secondary" v-if="order.order_status == 5"
            >{{ $t("Order Status") }} : {{ order.order_status_text }}</span
          >
          <span class="badge badge-danger" v-if="order.order_status == 6"
            >{{ $t("Order Status") }} : {{ order.order_status_text }}</span
          >
        </div>
        <div class="col-4 text-end">
          <a :href="order.receipt_link" download class="btn btn-primary btn-sm">
            <Icon icon="material-symbols:download" class="fs-4"></Icon>
            {{ $t("Download Order Receipt") }}
          </a>
          <button
            v-if="
              (order.order_status == 1 ||
                order.order_status == 2 ||
                order.order_status == 6) &&
              order.is_refundable_now
            "
            href="#"
            type="button"
            class="btn btn-sm btn-danger ms-2"
            @click="returnOrder(order.slack)"
          >
            <span v-if="logged_in_terminal == null || logged_in_terminal == ''"
              >Open Register to Return</span
            >
            <span v-else>Return Order</span>
            <Icon icon="tabler:receipt-refund" class="fs-2" />
          </button>
        </div>
      </div>
      <div class="row mb-5" v-if="order.returned_orders != ''">
        <div class="accordion" id="accordionExample">
          <div
            class="accordion-item"
            v-for="(returned_order, index) in order.returned_orders"
          >
            <h2 class="accordion-header" id="headingOne">
              <button
                class="accordion-button fw-bold"
                type="button"
                data-bs-toggle="collapse"
                :data-bs-target="'#ac_' + returned_order.return_order_number"
                aria-expanded="true"
                :aria-controls="'ac_' + returned_order.return_order_number"
              >
                {{ $t("Returned Order") }} #{{
                  returned_order.return_order_number
                }}
              </button>
            </h2>
            <div
              :id="'ac_' + returned_order.return_order_number"
              class="accordion-collapse collapse show"
              aria-labelledby="headingOne"
              data-bs-parent="#accordionExample"
            >
              <div class="accordion-body pb-5">
                <div class="col-12 py-4">
                  <div class="row">
                    <div class="col-4">
                      {{ $t("Return Date") }}:
                      {{ returned_order.business_date_label }}
                    </div>
                    <div class="col-8 text-end">
                      <a
                        :href="returned_order.receipt_link"
                        download
                        class="btn btn-danger btn-xs"
                      >
                        <Icon
                          icon="material-symbols:download"
                          class="fs-4"
                        ></Icon>
                        {{ $t("Download Return Receipt") }}
                      </a>
                    </div>
                  </div>
                </div>
                <div class="col-md-12">
                  <div class="cards">
                    <h5 class="text-muted">{{ $t("Returned Items") }}</h5>
                    <div class="table-responsive mt-3">
                      <table class="table mb-3 table-responsive-data">
                        <thead class="bg-light">
                          <tr>
                            <th>#</th>
                            <th>{{ $t("Product") }}</th>
                            <th>{{ $t("Rate") }}</th>
                            <th>{{ $t("Qty.") }}</th>
                            <th>{{ $t("Subtotal") }}</th>
                            <th>{{ $t("Product Discount") }}</th>
                            <th>{{ $t("Order Discount") }}</th>
                            <th>{{ $t("Other Taxes and Fee") }}</th>
                            <th>{{ $t("Tax") }}</th>
                            <th class="text-end">{{ $t("Amount") }}</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="(item, index) in returned_order.items">
                            <td>{{ index + 1 }}</td>
                            <td>
                              {{ item.product_name }}
                              <span v-if="item.product_name_ar != ''">
                                {{ item.product_name_ar }}
                              </span>
                              <!-- Name: Modifier names -->
                              <small
                                class="text-secondary"
                                v-for="product_modifier in item.product_modifier_json"
                                ><br />{{ product_modifier.option_name }}
                                <span v-if="product_modifier.option_name_ar != ''">{{
                                  product_modifier.option_name_ar
                                }}</span>
                              </small>
                            </td>
                            <td>
                              {{ getRoundedValue(item.product_rate) }}
                              <small
                                v-for="product_modifier in item.product_modifier_json"
                                ><br />{{
                                  getRoundedValue(
                                    product_modifier.prices.product_price_without_tax
                                  )
                                }}</small
                              >
                            </td>
                            <td>
                              {{ getRoundedValue(item.product_quantity) }}
                            </td>
                            <td>{{ getRoundedValue(item.product_amount) }}</td>
                            <td>
                              {{
                                getRoundedValue(item.product_discount_amount)
                              }}
                            </td>
                            <td>
                              {{ getRoundedValue(item.order_discount_amount) }}
                            </td>
                            <td>
                              <span v-if="item.additional_fee_amount > 0">{{
                                getRoundedValue(item.additional_fee_amount)
                              }}</span>
                              <span v-if="item.tobacco_tax_amount > 0">{{
                                getRoundedValue(item.tobacco_tax_amount)
                              }}</span>
                            </td>
                            <td>{{ getRoundedValue(item.tax_amount) }}</td>
                            <td class="text-end">
                              <span v-if="item.tax_type == 1">{{
                                getRoundedValue(item.final_product_amount)
                              }}</span>
                              <span v-else>{{
                                getRoundedValue(item.product_amount)
                              }}</span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div class="row justify-content-end">
                      <div class="col-auto">
                        <table class="">
                          <tbody>
                            <tr>
                              <td class="p-2">{{ $t("Subtotal") }}</td>
                              <td class="p-2">
                                {{ getRoundedValue(returned_order.subtotal) }}
                              </td>
                            </tr>
                            <tr v-if="returned_order.product_discount > 0">
                              <td class="p-2 text-success">
                                {{ $t("Product Discount") }}
                              </td>
                              <td class="p-2">
                                {{
                                  getRoundedValue(
                                    returned_order.product_discount
                                  )
                                }}
                              </td>
                            </tr>
                            <tr v-if="returned_order.product_discount > 0">
                              <td class="p-2">
                                {{ $t("Subtotal After Product Discount") }}
                              </td>
                              <td class="p-2">
                                {{
                                  getRoundedValue(
                                    returned_order.subtotal_after_product_discount
                                  )
                                }}
                              </td>
                            </tr>
                            <tr v-if="returned_order.order_discount > 0">
                              <td class="p-2 text-success">
                                {{ $t("Order Discount") }}
                              </td>
                              <td class="p-2">
                                {{
                                  getRoundedValue(returned_order.order_discount)
                                }}
                              </td>
                            </tr>
                            <tr v-if="returned_order.order_discount > 0">
                              <td class="p-2">
                                {{ $t("Subtotal After Order Discount") }}
                              </td>
                              <td class="p-2">
                                {{
                                  getRoundedValue(
                                    returned_order.subtotal_after_order_discount
                                  )
                                }}
                              </td>
                            </tr>
                            <tr v-if="returned_order.additional_fee > 0">
                              <td class="p-2 text-danger">
                                {{ $t("Additional Fee") }}
                              </td>
                              <td class="p-2">
                                {{
                                  getRoundedValue(returned_order.additional_fee)
                                }}
                              </td>
                            </tr>
                            <tr v-if="returned_order.tobacco_tax > 0">
                              <td class="p-2 text-danger">
                                {{ $t("Tobacco Tax") }}
                              </td>
                              <td class="p-2">
                                {{
                                  getRoundedValue(returned_order.tobacco_tax)
                                }}
                              </td>
                            </tr>
                            <tr v-if="returned_order.tax > 0">
                              <td class="p-2 text-danger">{{ $t("Tax") }}</td>
                              <td class="p-2">
                                {{ getRoundedValue(returned_order.tax) }}
                              </td>
                            </tr>
                            <tr>
                              <td class="p-2">{{ $t("Grand Total") }}</td>
                              <td class="p-2 fs-5 fw-bold">
                                {{ getRoundedValue(returned_order.total) }}
                                {{ currency_symbol }}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-12">
                  {{ $t("Returned Reason") }}:
                  <span
                    class="text-danger"
                    v-if="returned_order.reason != null"
                    >{{ returned_order.reason }}</span
                  >
                  <span v-else>N/A</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-md-12 col-lg-12">
          <div class="card">
            <div class="row align-items-center">
              <div class="col-md-3">
                <div class="data-view-box mb-3">
                  <div class="item">
                    <span>{{ $t("Business Date") }}:</span>
                    {{ order.business_date_label }}
                  </div>
                </div>
              </div>

              <div class="col-md-3">
                <div class="data-view-box mb-3">
                  <div class="item">
                    <span>{{ $t("Reference") }} #:</span>
                    {{ order.reference_number }}
                  </div>
                </div>
              </div>
              <div class="col-md-3">
                <div class="data-view-box mb-3">
                  <div class="item">
                    <span>{{ $t("Terminal") }}:</span>
                    {{ order.terminal_name }}
                  </div>
                </div>
              </div>
              <div class="col-md-3">
                <div class="data-view-box mb-3">
                  <div class="item">
                    <span>{{ $t("Placed") }}:</span>
                    <strong v-if="order.is_offline_order" class="text-muted">
                      {{ $t("Offline") }}
                    </strong>
                    <strong v-else class="text-success">
                      {{ $t("Online") }}
                    </strong>
                  </div>
                </div>
              </div>
              <div class="col-md-3" v-if="order.customer_name != ''">
                <div class="data-view-box mb-3">
                  <div class="item">
                    <span>{{ $t("Customer") }}:</span>
                    <strong
                      >{{ order.customer_phone }},
                      {{ order.customer_name }}</strong
                    >
                  </div>
                </div>
              </div>
              <div class="col-md-3">
                <div class="data-view-box mb-3">
                  <div class="item">
                    <span>{{ $t("Order Type") }}:</span>
                    {{ order.order_type_text }}
                  </div>
                </div>
              </div>

              <div class="col-md-3">
                <div class="data-view-box mb-3">
                  <div class="item">
                    <span>{{ $t("Payment Method") }}:</span>
                    {{ order.payment_method_name }}
                  </div>
                </div>
              </div>
              <div class="col-md-3" v-if="order.table_name != null">
                <div class="data-view-box mb-3">
                  <div class="item">
                    <span>{{ $t("Dining Table") }}:</span>
                    {{ order.table_name }}
                  </div>
                </div>
              </div>
              <div class="col-md-3" v-if="order.note != ''">
                <div class="data-view-box mb-3">
                  <div class="item">
                    <span>{{ $t("Note") }}:</span>
                    {{ order.note }}
                  </div>
                </div>
              </div>
              <div class="col-md-3">
                <div class="data-view-box mb-3">
                  <div class="item">
                    <span>{{ $t("Cash Amount") }}:</span>
                    {{ getRoundedValue(order.cash_amount) }}
                  </div>
                </div>
              </div>
              <div class="col-md-3">
                <div class="data-view-box mb-3">
                  <div class="item">
                    <span>{{ $t("Card Amount") }}:</span>
                    {{ getRoundedValue(order.card_amount) }}
                  </div>
                </div>
              </div>
              <div class="col-md-3">
                <div class="data-view-box mb-3">
                  <div class="item">
                    <span>{{ $t("Change Amount") }}:</span>
                    {{ getRoundedValue(order.change_amount) }}
                  </div>
                </div>
              </div>
              <div class="col-md-3" v-if="order.created_by">
                <div class="data-view-box mb-3">
                  <div class="item">
                    <span>{{ $t("Cashier") }}:</span>
                    {{ order.created_by.name }}
                  </div>
                </div>
              </div>
              <div class="col-md-3" v-if="order.created_by">
                <div class="data-view-box mb-3">
                  <div class="item">
                    <span>{{ $t("Created At") }}:</span>
                    {{ order.created_at_label }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-12">
          <div class="card">
            <h5 class="text-muted">{{ $t("Ordered Items") }}</h5>
            <div class="table-responsive mt-3">
              <table
                class="table table-hover table-bordered mb-3 table-responsive-data"
              >
                <thead class="bg-light">
                  <tr>
                    <th>#</th>
                    <th>{{ $t("Product") }}</th>
                    <th>{{ $t("Rate") }}</th>
                    <th>{{ $t("Qty.") }}</th>
                    <th>{{ $t("Subtotal") }}</th>
                    <th>{{ $t("Product Discount") }}</th>
                    <th>{{ $t("Order Discount") }}</th>
                    <th>{{ $t("Other Taxes & Fee") }}</th>
                    <th>{{ $t("Tax") }}</th>
                    <th width="10%" class="text-end">{{ $t("Amount") }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(product, index) in order.products">
                    <td>{{ index + 1 }}</td>
                    <td class="fw-bold">
                      <!--Name: Product name -->
                      {{ product.product_name }}

                      <span v-if="product.product_name_ar != ''">
                        {{ product.product_name_ar }}
                      </span>

                      <!-- Name: Modifier names -->
                      <small
                        class="text-secondary"
                        v-for="product_modifier in product.product_modifier_json"
                        ><br />{{ product_modifier.option_name }}
                        <span v-if="product_modifier.option_name_ar != ''">{{
                          product_modifier.option_name_ar
                        }}</span>
                      </small>

                      <!-- Name: Product note -->
                      <small v-if="product.note != ''" class="text-warning">
                        <br />
                        {{ $t("Note") }}: {{ product.note }}
                      </small>

                      <span v-if="product.is_gift_item">
                        <svg
                          width="17"
                          height="17"
                          viewBox="0 0 17 17"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M14.6816 4.51562H12.8933C13.1698 4.14813 13.334 3.69153 13.334 3.19727C13.334 1.98569 12.3483 1 11.1367 1C10.4069 1 9.86875 1.26147 9.4431 1.82286C9.08699 2.29255 8.8266 2.94833 8.5 3.7769C8.1734 2.9483 7.91301 2.29255 7.5569 1.82286C7.13125 1.26147 6.5931 1 5.86328 1C4.65171 1 3.66602 1.98569 3.66602 3.19727C3.66602 3.69153 3.83017 4.14813 4.10667 4.51562H2.31836C1.59142 4.51562 1 5.10704 1 5.83398V6.71289C1 7.28579 1.36741 7.77426 1.87891 7.95566V14.6816C1.87891 15.4086 2.47032 16 3.19727 16H13.8027C14.5297 16 15.1211 15.4086 15.1211 14.6816V7.95566C15.6326 7.77426 16 7.28579 16 6.71289V5.83398C16 5.10704 15.4086 4.51562 14.6816 4.51562ZM9.30666 4.12715C9.97987 2.4192 10.2358 1.87891 11.1367 1.87891C11.8637 1.87891 12.4551 2.47032 12.4551 3.19727C12.4551 3.92421 11.8637 4.51562 11.1367 4.51562H9.15294C9.20679 4.38042 9.25814 4.25025 9.30666 4.12715ZM5.86328 1.87891C6.76419 1.87891 7.02013 2.4192 7.69334 4.12715C7.74186 4.25025 7.79321 4.38042 7.84706 4.51562H5.86328C5.13634 4.51562 4.54492 3.92421 4.54492 3.19727C4.54492 2.47032 5.13634 1.87891 5.86328 1.87891ZM6.74219 15.1211H3.19727C2.95495 15.1211 2.75781 14.924 2.75781 14.6816V8.03125H6.74219V15.1211ZM6.74219 7.15234H2.31836C2.07604 7.15234 1.87891 6.95521 1.87891 6.71289V5.83398C1.87891 5.59167 2.07604 5.39453 2.31836 5.39453H6.74219V7.15234ZM9.37891 15.1211H7.62109V5.39453C7.71317 5.39453 8.87383 5.39453 9.37891 5.39453V15.1211ZM14.2422 14.6816C14.2422 14.924 14.045 15.1211 13.8027 15.1211H10.2578V8.03125H14.2422V14.6816ZM15.1211 6.71289C15.1211 6.95521 14.924 7.15234 14.6816 7.15234H10.2578V5.39453H14.6816C14.924 5.39453 15.1211 5.59167 15.1211 5.83398V6.71289Z"
                            fill="#793693"
                            stroke="#793693"
                            stroke-width="0.3"
                          />
                        </svg>
                      </span>
                    </td>

                    <td>
                      {{ getProductPriceWithModifierPrice(product) }}

                      <small
                        v-for="product_modifier in product.product_modifier_json"
                        ><br />{{
                          getRoundedValue(
                            product_modifier.prices.product_price_without_tax
                          )
                        }}</small
                      >
                    </td>

                    <td>
                      {{ getRoundedValue(product.product_quantity) }}
                    </td>
                    <td>
                      {{ getRoundedValue(product.product_amount) }}
                    </td>
                    <td>
                      {{ getRoundedValue(product.product_discount_amount) }} 
                      <!-- ({{ getRoundedValue(product.product_discount_percentage) }}%) -->
                    </td>
                    <td>
                      {{ getRoundedValue(product.order_discount_amount) }} 
                      <!-- ({{ getRoundedValue(product.order_discount_percentage) }}%) -->
                    </td>
                    <td>
                      <span v-if="product.additional_fee_amount > 0">{{
                        getRoundedValue(product.additional_fee_amount)
                      }}</span>
                      <span v-if="product.tobacco_tax_amount > 0">{{
                        getRoundedValue(product.tobacco_tax_amount)
                      }}</span>
                    </td>
                    <td>
                      {{ getRoundedValue(product.tax_amount) }} ({{
                        product.tax_percentage
                      }}%)
                    </td>
                    <td class="text-end">
                      <span v-if="product.tax_type == 1">{{
                        getRoundedValue(product.final_product_amount)
                      }}</span>
                      <span v-else>{{
                        getRoundedValue(product.product_amount)
                      }}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="row justify-content-end">
              <div class="col-auto">
                <table class="table total-table">
                  <thead>
                    <tr>
                      <td>{{ $t("Subtotal") }}</td>
                      <td>{{ getRoundedValue(order.subtotal) }}</td>
                    </tr>
                    <tr v-if="order.product_discount > 0">
                      <td class="text-success">{{ $t("Product Discount") }}</td>
                      <td>{{ getRoundedValue(order.product_discount) }}</td>
                    </tr>
                    <tr v-if="order.product_discount > 0">
                      <td>{{ $t("Subtotal After Product Discount") }}</td>
                      <td>
                        {{
                          getRoundedValue(order.subtotal_after_product_discount)
                        }}
                      </td>
                    </tr>
                    <tr v-if="order.order_discount > 0">
                      <td class="text-success">{{ $t("Order Discount") }}</td>
                      <td>{{ getRoundedValue(order.order_discount) }}</td>
                    </tr>
                    <tr v-if="order.order_discount > 0">
                      <td>{{ $t("Subtotal After Order Discount") }}</td>
                      <td>
                        {{
                          getRoundedValue(order.subtotal_after_order_discount)
                        }}
                      </td>
                    </tr>
                    <tr v-if="order.additional_fee > 0">
                      <td class="text-danger">{{ $t("Additional Fee") }}</td>
                      <td>{{ getRoundedValue(order.additional_fee) }}</td>
                    </tr>
                    <tr v-if="order.tobacco_tax > 0">
                      <td class="text-danger">{{ $t("Tobacco Tax") }}</td>
                      <td>{{ getRoundedValue(order.tobacco_tax) }}</td>
                    </tr>
                    <tr v-if="order.tax > 0">
                      <td class="text-danger">{{ $t("Tax") }}</td>
                      <td>{{ getRoundedValue(order.tax) }}</td>
                    </tr>
                    <tr>
                      <td class="">{{ $t("Grand Total") }}</td>
                      <td class="fs-5 fw-bold">
                        {{ getRoundedValue(order.total) }} {{ currency_symbol }}
                      </td>
                    </tr>
                  </thead>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <asyncReturnOrderModal :order="order" />
  </DefaultLayout>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import useGlobalFunctions from "@/composables/global_functions.js";

const asyncReturnOrderModal = defineAsyncComponent(() =>
  import("@/components/order/ReturnOrderModal.vue")
);

const { getRoundedValue } = useGlobalFunctions();

const route = useRoute();

const slack = route.params.slack;

const auth = useAuthStore();

const currency_symbol = computed(() => {
  return auth.user.currency.symbol;
});

const logged_in_terminal = computed(() => {
  return auth.user.logged_in_terminal;
});

onMounted(() => {
  getOrder();
});

const server_messages = reactive({
  type: "",
  messages: "",
});

const order = ref("");

async function getOrder() {
  await axios
    .get("/api/order", {
      params: {
        slack: slack,
      },
    })
    .then((response) => {
      order.value = response.data.data;
    })
    .catch((error) => {
      server_messages.type = "error";
      server_messages.messages = error;
    });
}

// const returnOrderRef = ref(null);
function returnOrder(slack) {
  if (logged_in_terminal.value == null || logged_in_terminal.value == "") {
    location.href = "/cashier?order_slack=" + slack;
  } else {
    // returnOrderRef.value.updateOrderReturn(slack);
    $("#returnOrderModal").modal("show");
  }
}

function getProductPriceWithModifierPrice(product) {
  let product_price = product.product_price_without_tax;
  let modifier_price = _.reduce(
    product.product_modifier_json,
    (sum, item) => {
      return sum + item.prices.product_price_without_tax;
    },
    0
  );
  return getRoundedValue(parseFloat(product_price - modifier_price));
}

</script>
