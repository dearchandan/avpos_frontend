<template>
  <teleport to="body">
    <div
      class="modal hide modal-lg cashier-layout-modal"
      id="SwitchMultiplePriceModal"
      tabindex="5"
      aria-hidden="true"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <div class="modal-title">
              <h2 class="mb-0">{{ $t("Switch Price") }}</h2>
            </div>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <div class="row g-3">
              <div class="col-lg-3 col-md-4 col-6" @click="switchPrice()">
                <div class="sw_price_box">
                  <a
                    href="#"
                    :class="{ 'active': multiple_price_id === '' }"
                  >
                    <h4>Default</h4>
                    <h6>Default (Ar)</h6>
                  </a>
                </div>
              </div>
              <div
                class="col-lg-3 col-md-4 col-6"
                v-for="multiple_price in multiple_prices"
                @click="switchPrice(multiple_price)"
              >
                <div class="sw_price_box">
                  <a
                    href="#"
                    :class="{
                      'active': multiple_price_id == multiple_price.id,
                    }"
                  >
                    <h4>{{ multiple_price.name }}</h4>
                    <h6 v-if="multiple_price.name_ar != ''">
                      {{ multiple_price.name_ar }}
                    </h6>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { useCashierStore } from "@/stores/cashierStore";
import { useCashierStorePersist } from "@/stores/cashierStorePersist";
import { useAuthStore } from "@/stores/auth";

const cashierStore = useCashierStore();
const cashierStorePersist = useCashierStorePersist();
const authStore = useAuthStore();

const multiple_prices = computed(() => {
  return cashierStore.multiple_prices;
});

const multiple_price_id = computed(() => {
  return cashierStorePersist.multiple_price_id;
});

function switchPrice(multiple_price='') {
    cashierStorePersist.setMultiplePrice(multiple_price);
    cashierStore.getProducts();
    $('#SwitchMultiplePriceModal').modal('hide');
}
</script>
