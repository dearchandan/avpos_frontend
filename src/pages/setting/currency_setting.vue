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
            <h5 class="fw-bold">{{ $t("Currency Setting") }}</h5>
          </div>
        </div>
      </div>
    </template>

    <div class="content py-5">
      <div class="py-3" v-if="form.server_messages.messages != ''">
        <ServerMessage :server_messages="form.server_messages" />
      </div>

      <div class="row">
        <div class="col-md-12">
          <div v-if="is_loaded">
            <div class="row gx-3">
            <div class="col-md-6 col-lg-4">
                <div class="cs-setting-card">
                  <div class="txt">
                    <h5>{{ $t("Select Currency") }}</h5>
                    <div class="col-auto p-1">
                      <div class="form-feild">
                        <div class="form-check">
                          <VSelectInput
                              name="currency_id"
                              mode="single"
                              :selected="form.currency_id"
                              v-model="form.currency_id"
                              :options="form.currencies"
                              :text="'name'"
                              :value="'id'"
                              :height_sm="true"
                              />
                          <br/><small class="text-muted">Please re login after update</small>
                        </div>
                      </div>
                    </div>
                    <div class="col-auto p-1">
                      <div class="form-feild">
                        <div class="form-check">
                          <button type="submit" class="btn btn-primary" :disabled="form.is_submitting" @click="update">
                            <clip-loader v-if="form.is_submitting" :color="'white'" :size="'20px'" class="pt-2 pe-2">  </clip-loader>
                            <span class="pt-0" v-if="form.is_submitting"> {{ $t('Updating...') }}</span>
                            <span class="pt-0" v-else> {{ $t('Update') }} </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <MerchantSettingSkeleton v-else />
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup>
import BeatLoader from "vue-spinner/src/BeatLoader.vue";
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();

onMounted(() => {
  getCurrencies();
});

const initialState = {
  server_messages: {
    type: "",
    messages: "",
  },
  currencies: [], 
  currency_id: 1, 
  is_submitting: false,
};

const form = reactive({ ...initialState });

const is_loaded = ref(false);

async function getCurrencies() {
  await axios
    .get("/api/currency_settings")
    .then((response) => {
      if (response.data != "") {
        form.currencies = response.data.data.currencies;
        form.currency_id = response.data.data.selected_currency;
        console.log('form.currencies =', form.currencies);
      }
      is_loaded.value = true;
    })
    .catch((error) => {
      form.server_messages.type = "error";
      form.server_messages.messages = error;
      console.log(error);
      if (401 === error.response.status) {
        router.push("/");
      }
    });
}

async function update() {
  
  form.is_submitting = true;

  var form_data = new FormData();
  form_data.append("currency_id", form.currency_id);

  await axios
    .post("/api/currency_settings/update_currency", form_data)
    .then((response) => {

      authStore.refresh();

      toast.success(response.data.msg);
      form.is_submitting = false;
    })
    .catch((error) => {
      form.server_messages.type = "error";
      form.server_messages.messages = error;
      form.is_submitting = false;
      console.log(error);
      if (401 === error.response.status) {
        router.push("/");
      }
    });
}
</script>
