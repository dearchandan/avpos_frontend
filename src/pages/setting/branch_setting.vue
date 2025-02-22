<template>
  <DefaultLayout>
    <template v-slot:subheader>
      <div class="header-nav-wrap">
        <div class="row align-items-center">
          <div class="col-auto">
            <div class="header-back-link">
              <router-link class="text-primary" to="/settings"
                ><Icon icon="fa6-solid:chevron-left" />
                {{ $t("Settings") }}</router-link
              >
            </div>
          </div>
          <div class="col-auto">
            <h5 class="fw-bold">{{ $t("Branch Setting") }}</h5>
          </div>
        </div>
      </div>
    </template>

    <div class="content py-5">
      <div class="py-3" v-if="form.server_messages.messages != ''">
        <ServerMessage :server_messages="form.server_messages" />
      </div>

      <div class="row">
        <div class="col-4 offset-4">
          <div class="card">
            <div class="form-field">
              <div class="col-12">
                <label class="label" for="">{{
                  $t("Tax Registration Name")
                }}</label>
                <input
                  type="text"
                  class="form-control form-control-solid"
                  v-model="form.tax_registration_name"
                />
              </div>
            </div>

            <div class="form-field">
              <div class="col-12">
                <label class="label" for="">{{ $t("Tax Number") }}</label>
                <input
                  type="text"
                  class="form-control form-control-solid"
                  v-model="form.tax_registration_number"
                />
              </div>
            </div>

            <div class="form-feild">
              <div class="col-12 py-3">
                <div class="form-check">
                  <label for="tax_inclusive_pricing">
                    <input
                      class="form-check-input mt-1"
                      type="checkbox"
                      role="switch"
                      id="tax_inclusive_pricing"
                      v-model="form.tax_inclusive_pricing"
                      :checked="form.tax_inclusive_pricing"
                    />
                    <span class="fs-5">{{ $t("Tax Inclusive Pricing") }}</span>
                  </label>
                </div>
              </div>
            </div>

            <div class="form-feild">
              <div class="col-12 py-3">
                <div class="form-check">
                  <label for="enable_order_return">
                    <input
                      class="form-check-input mt-1"
                      type="checkbox"
                      id="enable_order_return"
                      v-model="form.enable_order_return"
                      :checked="form.enable_order_return"
                    />
                    <span class="fs-5">{{ $t("Enable Order Return") }} </span>
                  </label>
                </div>
                <small
                  ><i
                    >You can enter number of hours under which the order will be
                    allowed to return, keep it blank to make all orders
                    refundable</i
                  ></small
                >
              </div>
            </div>

            <div class="form-field" v-if="form.enable_order_return">
              <div class="col-12">
                <input
                  type="number"
                  min="0"
                  class="form-control form-control-solid"
                  placeholder="Enter Return Period (In Hours)"
                  v-model="form.order_return_period"
                />
              </div>
            </div>

            <div class="form-field pt-4">
              <div class="col-12 text-end">
                <button
                  type="button"
                  class="btn btn-primary btn-md"
                  @click="update()"
                >
                  {{ $t("Save") }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup>
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();

onMounted(() => {
  get();
});

const initialState = {
  server_messages: {
    type: "",
    messages: "",
  },
  tax_registration_number: "",
  tax_registration_name: "",
  tax_inclusive_pricing: true,
  enable_order_return: true,
  order_return_period: 0,
};

const form = reactive({ ...initialState });

const is_processing = ref(true);

async function get() {
  await axios
    .get("/api/branch_settings")
    .then((response) => {
      if (response.data != "") {
        form.tax_registration_number = response.data.tax_registration_number;
        form.tax_registration_name = response.data.tax_registration_name;
        form.tax_inclusive_pricing = response.data.tax_inclusive_pricing;
        form.enable_order_return = response.data.enable_order_return;
        form.order_return_period =
          response.data.order_return_period > 0
            ? response.data.order_return_period
            : "";
      }
      is_processing.value = false;
    })
    .catch((error) => {
      form.server_messages.type = "error";
      form.server_messages.messages = error;
      console.log(error);
    });
}

async function update() {
  var form_data = new FormData();
  form_data.append("tax_registration_number", form.tax_registration_number);
  form_data.append("tax_registration_name", form.tax_registration_name);
  form_data.append("tax_inclusive_pricing", form.tax_inclusive_pricing);
  form_data.append("enable_order_return", form.enable_order_return);
  form_data.append("order_return_period", form.order_return_period);

  await axios
    .post("/api/branch_settings/update", form_data)
    .then((response) => {
      toast.success(response.data.msg);
      authStore.refresh();
      is_processing.value = false;
    })
    .catch((error) => {
      form.server_messages.type = "error";
      form.server_messages.messages = error;
      console.log(error);
    });
}
</script>
