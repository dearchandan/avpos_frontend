<template>
  <teleport to="body">
    <div
      class="modal fade"
      id="forceSignInModal"
      tabindex="-1"
      aria-hidden="true"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
    >
      <div class="modal-dialog modal-dialog-centered modal-w-1260 modal-md">
        <div class="modal-content">
          <div class="modal-header modal-title border-0">
            <h3 class="mb-0">{{ $t("Force Sign In") }}</h3>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              @click="closeModal"
              id="close_btn"
            ></button>
          </div>
          <div class="modal-body pt-0">
            <div class="row">
              <div class="col-12">
                <p class="fw-bold">
                  {{ msg }}
                </p>
              </div>
            </div>
            <div class="row mt-4">
              <div class="col-12">
                <button
                  type="submit"
                  class="btn btn-danger w-100"
                  @click="signIn()"
                  :disabled="is_processing"
                >
                  <span> {{ $t("Yes, Sign in here") }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import ClipLoader from "vue-spinner/src/ClipLoader.vue";
import { useAuthStore } from "@/stores/auth";
import { useI18n } from "vue-i18n";
import { useSubscriptionStore } from "@/stores/subscriptionStore";

const { t } = useI18n();

const authStore = useAuthStore();
const subscriptionStore = useSubscriptionStore();

const props = defineProps(["msg", "email", "password"]);
const msg = toRef(props, "msg");
const email = toRef(props, "email");
const password = toRef(props, "password");

function closeModal() {
  $("#forceSignInModal").modal("hide");
}

const is_processing = ref(false);

const server_messages = reactive({
  type: "",
  messages: "",
});
const cart_subscription_id = computed(() => {
  return subscriptionStore.cart_subscription_id;
});
async function signIn() {
  try {
    is_processing.value = true;

    var form_data = new FormData();
    form_data.append("email", email.value);
    form_data.append("password", password.value);
    form_data.append("language", localStorage.getItem("language"));
    form_data.append("force_sign_in", true);

    authStore.resetState();
    let response = await authStore.login(form_data);
    is_processing.value = false;
    if (response.status_code == 200) {
      server_messages.type = "success";
      server_messages.messages = response.msg;

      if (authStore.user.user_type != 1 && authStore.user.user_type != 4) {
        if (
          cart_subscription_id.value > 0 ||
          (authStore.user.merchant.user_subscription != null &&
            authStore.user.user_type == 2 &&
            authStore.user.merchant.user_subscription.status == 3)
        ) {
          location.href = "/subscriptions";
        } else if (
          authStore.user.merchant.user_subscription == null &&
          authStore.user.user_type == 2
        ) {
       
          location.href = "/subscriptions";
        } else {
          location.href = "/dashboard";
        }
      } else if (
        authStore.user.user_type == 1 ||
        authStore.user.user_type == 4
      ) {
        location.href = "/admin/dashboard";
      }
    } else {
      try {
        server_messages.type = "error";
        server_messages.messages = JSON.parse(response.msg);
      } catch (err) {
        server_messages.type = "error";
        server_messages.messages = response.msg;
      }
    }
  } catch (error) {
    server_messages.type = "error";
    server_messages.messages = error;
    is_processing.value = false;
  }
}
</script>
