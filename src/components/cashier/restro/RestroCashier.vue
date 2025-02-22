<template>
  
  <RestroCashierLayout>
    
    <RestroCashierHeader @closeRegister="closeRegister()" />

    <RestroCashierSidebar />

    <div class="main-content-wrap">
      <div class="content pb-0">
        <div class="row align-items-center justify-content-between gx-3">
          <div
            class="col"
            v-if="
              cashier_settings.length == 0 ||
              (cashier_settings && cashier_settings.show_search)
            "
          >
            <div class="form-search-feild position-relative mb-0">
              <input
                class="form-control form-control-lg"
                type="search"
                :placeholder="search_placeholder"
                v-model="search_term"
                id="search"
              />
              <div class="icon">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g opacity="0.5">
                    <path
                      d="M6.77721 12.5582C9.96787 12.5582 12.5544 9.97031 12.5544 6.778C12.5544 3.58568 9.96787 0.997803 6.77721 0.997803C3.58654 0.997803 1 3.58568 1 6.778C1 9.97031 3.58654 12.5582 6.77721 12.5582Z"
                      stroke="#767F8F"
                      stroke-width="1.75071"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M15.0025 15.0021L11.0027 11.0005"
                      stroke="#767F8F"
                      stroke-width="1.75071"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </g>
                </svg>
              </div>
            </div>
          </div>
          <div class="col-auto">
            <ul class="popup-btns">
              <li
                :class="{ active: order_type != null && order_type == 1 }"
                @click="changeOrderType(1)"
              >
                <a href="#"
                  ><Icon
                    icon="material-symbols:box-outline-rounded"
                    class="pe-1 pb-1 align-middle top-0"
                    style="font-size: 1.75rem"
                  />
                  {{ $t("Take Away") }}</a
                >
              </li>
              <li :class="{ active: order_type != null && order_type == 2 }">
                <a
                  class="dropdown-item"
                  href="#"
                  data-bs-toggle="modal"
                  data-backdrop="static"
                  data-keyboard="false"
                  @click="openDineInModal()"
                  data-bs-target="#dineInModal"
                >
                  <Icon
                    icon="ic:twotone-table-bar"
                    class="pe-1 pb-1 align-middle top-0"
                    style="font-size: 1.75rem"
                  />
                  {{ $t("Dine In") }}
                  <span
                    v-if="selected_table && selected_seats"
                    class="bg-white text-primary"
                  >
                    {{ selected_table.name }}
                    <Icon icon="fa6-solid:users" class="ps-3" />
                    {{ selected_seats }}
                  </span>
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div class="page-heading">
          <div class="row align-items-center justify-content-between">
            <div class="col-auto">
              <nav aria-label="breadcrumb">
                <ol class="breadcrumb align-items-center mb-0">
                  <!-- <li class="breadcrumb-item text-muted" aria-current="page"> {{ filtered_products.length }} products found </li> -->
                </ol>
              </nav>
            </div>
            <div class="col-auto">
              <div class="row align-items-center">
                <div
                  class="col-auto"
                  v-if="
                    cashier_settings.length == 0 ||
                    (cashier_settings && cashier_settings.show_filter_by_veg)
                  "
                >
                  <!-- <div class="form-check switch_label_right form-switch">
                    <label
                      >{{ $t("Veg") }}
                      <input
                        class="form-check-input"
                        type="checkbox"
                        role="switch"
                        v-model="filters.dietary"
                      />
                    </label>
                  </div> -->
                </div>
                <div
                  class="col-auto"
                  v-if="
                    cashier_settings.length == 0 ||
                    (cashier_settings &&
                      cashier_settings.show_filter_by_in_stock)
                  "
                >
                  <!-- <div class="form-check switch_label_right form-switch">
                    <label
                      >{{ $t("In Stock") }}
                      <input
                        class="form-check-input"
                        checked
                        type="checkbox"
                        role="switch"
                        v-model="filters.in_stock"
                      />
                    </label>
                  </div> -->
                </div>
              </div>
            </div>
          </div>
        </div>
        <openTerminal
          @openTerminal="openTerminal()"
          @getProductsOnScroll="getProductsOnScroll"
          :page="page_no"
        />
        <!-- <h4 class="text text-muted text-center pt-5 mt-5">
          <img :src="logo" alt="" style="width: 200px" />
          <div class="p-3" v-if="is_loading_value == 0">{{ $t("Fetching products...") }}</div>
          <div class="p-3" v-if="is_loading_value == 1">{{ $t("Sorry, No Products Found!") }}</div>
        </h4> -->
      </div>
    </div>

    <div class="rightbar">
      <div
        class="select-customer-wrap"
        v-if="cashier_settings && cashier_settings.enable_customer_selection"
      >
        <div class="selectcustomer_data" v-if="customer.mobile_number != ''">
          <div class="row align-items-center justify-content-between">
            <div class="col-auto">
              <h6>{{ customer.name }}</h6>
              <h4>{{ customer.mobile_number }}</h4>
            </div>

            <div class="col-auto">
              <button @click="clearCustomer()">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M16.3486 6.60718L6.23691 16.2898C5.83802 16.6718 5.75717 17.2137 6.05635 17.5002C6.35552 17.7866 6.92141 17.7092 7.32031 17.3273L17.432 7.64461C17.8309 7.26264 17.9117 6.72075 17.6126 6.43427C17.3134 6.1478 16.7475 6.22521 16.3486 6.60718Z"
                    fill="#4B5B73"
                  />
                  <path
                    d="M17.7629 16.3557L7.65122 6.67306C7.25232 6.29109 6.68643 6.21368 6.38726 6.50016C6.08809 6.78664 6.16893 7.32852 6.56782 7.71049L16.6795 17.3931C17.0784 17.7751 17.6443 17.8525 17.9435 17.566C18.2426 17.2796 18.1618 16.7377 17.7629 16.3557Z"
                    fill="#4B5B73"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div class="collapse show" v-else>
          <a href="#" @click="selectCustomer()">{{ $t("Select Customer") }}</a>
        </div>
      </div>

      <RestroCashierCart @payNow="payNow()" />
      
    </div>


    <AsyncCloseRegister @openTerminal="openTerminal()" />

    <AsyncSelectTerminal />

    <AsyncSelectDineIn
      :show_dine_in_modal="show_dine_in_modal"
      @closeDineInModal="closeDineInModal"
    />

    <AsyncSelectPayment />

    <AsyncSelectCustomer @payNow="payNow()" @close="closeCustomerModal" />

    <AsyncHoldOrdersModal />

    <AsyncSearchOrdersModal />

    <AsyncBookTableModal @refreshDineInTables="refreshDineInTables" />

    <div class="modal fade" id="Apply_Coupon" tabindex="-1" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <div class="modal-title">
              <div class="text">
                <h2 class="mb-0">{{ $t("Apply Coupon") }}</h2>
              </div>
            </div>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <div class="form-search-feild position-relative mb-2">
              <input
                class="form-control form-control-lg"
                type="text"
                :placeholder="enter_promo_code"
              />
              <div class="icon">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g opacity="0.5">
                    <path
                      d="M6.77721 12.5582C9.96787 12.5582 12.5544 9.97031 12.5544 6.778C12.5544 3.58568 9.96787 0.997803 6.77721 0.997803C3.58654 0.997803 1 3.58568 1 6.778C1 9.97031 3.58654 12.5582 6.77721 12.5582Z"
                      stroke="#767F8F"
                      stroke-width="1.75071"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                    <path
                      d="M15.0025 15.0021L11.0027 11.0005"
                      stroke="#767F8F"
                      stroke-width="1.75071"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                  </g>
                </svg>
              </div>
            </div>
            <div class="modal-data-scorll" data-simplebar="">
              <ul class="discount-list">
                <li>
                  <div class="discount_item discount_item_large">
                    <label>
                      <input type="radio" name="Discounts" />
                      <span>
                        <div class="text">
                          <h2>
                            Get Free Paneer, Sweet Corn, Pasta & Cheese
                            Quesadillas
                          </h2>
                          <div
                            class="row align-items-center justify-content-between"
                          >
                            <div class="col-auto">
                              <div class="d_coupen-code">FREEQUESADILLAS</div>
                            </div>
                            <div class="col-auto">
                              <div class="d_valid-date">
                                Valid Till : 25-8-2023
                              </div>
                            </div>
                          </div>
                        </div>
                      </span>
                    </label>
                  </div>
                </li>
                <li>
                  <div class="discount_item discount_item_large">
                    <label>
                      <input type="radio" name="Discounts" />
                      <span>
                        <div class="text">
                          <h2>
                            Get Free Paneer, Sweet Corn, Pasta & Cheese
                            Quesadillas
                          </h2>
                          <div
                            class="row align-items-center justify-content-between"
                          >
                            <div class="col-auto">
                              <div class="d_coupen-code">FREEQUESADILLAS</div>
                            </div>
                            <div class="col-auto">
                              <div class="d_valid-date">
                                Valid Till : 25-8-2023
                              </div>
                            </div>
                          </div>
                        </div>
                      </span>
                    </label>
                  </div>
                </li>
                <li>
                  <div class="discount_item discount_item_large">
                    <label>
                      <input type="radio" name="Discounts" />
                      <span>
                        <div class="text">
                          <h2>
                            Get Free Paneer, Sweet Corn, Pasta & Cheese
                            Quesadillas
                          </h2>
                          <div
                            class="row align-items-center justify-content-between"
                          >
                            <div class="col-auto">
                              <div class="d_coupen-code">FREEQUESADILLAS</div>
                            </div>
                            <div class="col-auto">
                              <div class="d_valid-date">
                                Valid Till : 25-8-2023
                              </div>
                            </div>
                          </div>
                        </div>
                      </span>
                    </label>
                  </div>
                </li>
                <li>
                  <div class="discount_item discount_item_large">
                    <label>
                      <input type="radio" name="Discounts" />
                      <span>
                        <div class="text">
                          <h2>
                            Get Free Paneer, Sweet Corn, Pasta & Cheese
                            Quesadillas
                          </h2>
                          <div
                            class="row align-items-center justify-content-between"
                          >
                            <div class="col-auto">
                              <div class="d_coupen-code">FREEQUESADILLAS</div>
                            </div>
                            <div class="col-auto">
                              <div class="d_valid-date">
                                Valid Till : 25-8-2023
                              </div>
                            </div>
                          </div>
                        </div>
                      </span>
                    </label>
                  </div>
                </li>
                <li>
                  <div class="discount_item discount_item_large">
                    <label>
                      <input type="radio" name="Discounts" />
                      <span>
                        <div class="text">
                          <h2>
                            Get Free Paneer, Sweet Corn, Pasta & Cheese
                            Quesadillas
                          </h2>
                          <div
                            class="row align-items-center justify-content-between"
                          >
                            <div class="col-auto">
                              <div class="d_coupen-code">FREEQUESADILLAS</div>
                            </div>
                            <div class="col-auto">
                              <div class="d_valid-date">
                                Valid Till : 25-8-2023
                              </div>
                            </div>
                          </div>
                        </div>
                      </span>
                    </label>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    
  </RestroCashierLayout>
</template>

<script setup>
import { useCashierStore } from "@/stores/cashierStore";
import useGlobalFunctions from "@/composables/global_functions.js";
import { useI18n } from "vue-i18n";
import { computed, onMounted, watchEffect } from "vue";
import { useSettingStore } from "@/stores/settingStore";
import { useAuthStore } from "@/stores/auth";
import { useMagicKeys, whenever } from '@vueuse/core'

const settingStore = useSettingStore();
const authStore = useAuthStore();

const logo = computed(() => {
  return settingStore.logo;
});

const { t } = useI18n();

const cashierStore = useCashierStore();

const { placeOrder } = useGlobalFunctions();
const search_placeholder = t("Search by name, barcode, upc...");
const enter_promo_code = t("enter promo code");
const page_no = ref(1);
onMounted(() => {
  cashierStore.refreshTerminals();
  cashierStore.setPage(1);
});

/* Dine In */
const show_dine_in_modal = ref(false);
function openDineInModal() {
  cashierStore.setBookingType(1); // Dine In
  show_dine_in_modal.value = true;
}

function closeDineInModal() {
  show_dine_in_modal.value = false;
}

const cashier_settings = computed(() => {
  return cashierStore.settings;
});

const selected_table = computed(() => {
  return cashierStore.table;
});

const selected_seats = computed(() => {
  return cashierStore.seats;
});

const order_type = computed(() => {
  return cashierStore.order_type;
});

function changeOrderType(order_type) {
  cashierStore.setOrderType(order_type);
}

/* fetching products from database */


// const filtered_products = computed(() => {
//   return cashierStore.filtered_products;
// });

const last_page = computed(() => {
  return cashierStore.last_page;
});

/* ------------------------------ */
/* ---- Search & Filtering ------- */
/* ------------------------------ */

/* searching */
const search_term = ref("");

watch(
  () => search_term.value,
  _.debounce((newValue) => {
    cashierStore.setSearch(newValue);
  }, 600)
);

/* filter by is veg, in stock*/
// const filters = computed(() => {
//   return cashierStore.filters;
// });

const next_page = computed(() => {
  return cashierStore.next_page;
});
// watch(
//   filters,
//   (newValue) => {
//     all_products.value = [];
//     cashierStore.setFilters(newValue);
//   },
//   { deep: true }
// );

// watch(
//   filtered_products,
//   (newValue) => {
//     if (cashierStore.page == 1) {
//       all_products.value = [];
//       page_no.value = 1;
//     }
//     newValue.map(function (item) {
//       all_products.value.push(item);
//     });
//   },
//   { deep: true }
// );

/* customer */

const customer = computed(() => {
  return cashierStore.customer;
});

function selectCustomer(selection_type = 0) { // 0-direct,1-indirect
  clearCustomer();
  cashierStore.setCustomerSelectionType(selection_type); 
  $("#customerModal").modal("show");
}
function closeCustomerModal(){
  $("#customerModal").modal("hide");
}

const cashier_action = computed(() => {
  return cashierStore.action_type;
});

function clearCustomer() {
  cashierStore.clearCustomer();
}

async function payNow() {
  if (
    cashier_action.value == "CLOSE" ||
    cashier_action.value == "SEND_TO_KITCHEN"
  ) {
    if (
      cashier_settings.value &&
      cashier_settings.value.enable_customer_selection &&
      !customer.value.is_added
    ) {
      this.selectCustomer(1); // Indirect
    } else {
      $("#customerModal").modal("hide");
      $("#paymentModal").modal("show");
    }
  } else if (
    cashier_action.value == "HOLD" ||
    cashier_action.value == "HOLD_AND_SEND_TO_KITCHEN"
  ) {
    await holdOrder();
  }
}

const is_processing = ref(false);

async function holdOrder() {
  is_processing.value = true;

  let response = await placeOrder();

  if (response.data.status_code == 200) {
    toast.success(response.data.msg);

    cashierStore.clearCart();

    is_processing.value = false;
  } else {
    toast.error(response.data.msg);

    is_processing.value = false;
  }
}


function openTerminal() {

  $("#terminalModal").modal("show");
}

const register_id = computed(() => {
  return (authStore.loggedInTerminal) ? authStore.loggedInTerminal.active_business_register.id : '';
});



async function closeRegister() {
  let response = await axios.get("/api/order/system_closing_cash", {
    params: {
      register_id: register_id.value,
    },
  });
  cashierStore.setSystemClosingCash(response.data.system_closing_cash);
  $("#closeRegisterModal").modal("show");
}

const AsyncSelectTerminal = defineAsyncComponent(() =>
  import("@/components/cashier/SelectTerminal.vue")
);
const AsyncSelectDineIn = defineAsyncComponent(() =>
  import("@/components/cashier/restro/SelectDineIn.vue")
);
const AsyncSelectPayment = defineAsyncComponent(() =>
  import("@/components/cashier/SelectPayment.vue")
);
const AsyncSelectCustomer = defineAsyncComponent(() =>
  import("@/components/cashier/SelectCustomer.vue")
);
const AsyncCloseRegister = defineAsyncComponent(() =>
  import("@/components/cashier/CloseRegister.vue")
);
const AsyncHoldOrdersModal = defineAsyncComponent(() =>
  import("@/components/cashier/HoldOrdersModal.vue")
);
const AsyncSearchOrdersModal = defineAsyncComponent(() =>
  import("@/components/cashier/SearchOrdersModal.vue")
);
const AsyncBookTableModal = defineAsyncComponent(() =>
  import("@/components/cashier/restro/BookTableModal.vue")
);

function getProductsOnScroll(page) {
  //if (document.querySelector("#content")) {

    // document.querySelector("#content").addEventListener("scroll", (e) => {
    //   const clientHeight = e.target.clientHeight;
    //   const scrollHeight = e.target.scrollHeight;
    //   const scrollTop = e.target.scrollTop;
    //   // console.log('scrollTop'+scrollTop);
    //   // console.log('clientHeight'+clientHeight);
    //   // console.log('scrollHeight'+scrollHeight);
    //   //console.log((scrollTop + clientHeight)+" - "+scrollHeight)
    //   if (
    //     Math.ceil(scrollTop + clientHeight) >= scrollHeight ||
    //     scrollTop + clientHeight >= scrollHeight
    //   ) {
       // page_no.value++;
        if (page <= cashierStore.pagination.last_page) {
          page_no.value++;
          cashierStore.setPage(page);
        }
      // } else {
      // }
    // });
  //}
}

function refreshDineInTables(values) {
  cashierStore.setBookingDate(values.booking_datetime);
  cashierStore.setBookingTime(values.booking_datetime);
  cashierStore.setBookingData(values);

  $("#dineInModal").modal("show");
}

//KEYBOARD SORTCUTS
const { alt_s, alt_t, alt_d } = useMagicKeys({
  passive: false,
  onEventFired(e) {
    if (e.altKey && e.key === 'd' && e.type === 'keydown')
      e.preventDefault();

    if (e.altKey && e.key === 'b' && e.type === 'keydown')
      e.preventDefault();
  },
})
whenever(alt_s, () => document.getElementById('search').focus())
whenever(alt_t, () => changeOrderType(1))
whenever(alt_d, () => changeOrderType(2))

</script>
