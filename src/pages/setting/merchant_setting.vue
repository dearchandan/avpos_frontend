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
            <h5 class="fw-bold">{{ $t("Merchant Setting") }}</h5>
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
                  <div class="icon">
                    <svg
                      width="42"
                      height="42"
                      viewBox="0 0 42 42"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M29.7098 13.7278C30.0547 13.7278 30.2847 13.4979 30.2847 13.1529V8.61132C30.2847 8.26635 30.0547 8.0364 29.7098 8.0364H22.8111C22.2361 7.00156 21.3738 6.19676 20.1666 5.62184C20.0515 3.49474 18.2119 2 16.1423 2C14.0727 2 12.233 3.55217 12.1181 5.62184C11.1407 6.08175 10.1634 6.77161 9.47356 8.0364H2.57492C2.22995 8.0364 2 8.26635 2 8.61132V39.368C2 39.713 2.22995 39.9429 2.57492 39.9429H29.6523C29.9973 39.9429 30.2273 39.713 30.2273 39.368V38.1607C30.2273 37.8733 29.9398 37.5858 29.6523 37.5858C29.3074 37.5858 29.0774 37.8158 29.0774 38.1607V38.7931H3.14977V9.18624H9.01365C8.8412 9.8186 8.72619 10.5085 8.72619 11.3708C8.72619 11.7158 8.95614 11.9458 9.30111 11.9458H22.9835C23.3284 11.9458 23.5584 11.7158 23.5584 11.3708C23.5584 10.566 23.4434 9.87611 23.271 9.18624H29.1349V13.153C29.1349 13.4979 29.3649 13.7278 29.7098 13.7278ZM9.87603 10.7959C10.0485 8.72633 11.0258 7.2891 12.8654 6.54173C13.0954 6.42672 13.2678 6.19676 13.2104 5.96681C13.0954 4.35713 14.4752 3.09234 16.0849 3.09234C17.6946 3.09234 19.0169 4.29962 18.9593 5.96681C18.9593 6.19676 19.0744 6.42672 19.3043 6.54173C21.144 7.2891 22.1788 8.66883 22.2937 10.7959H9.87603Z"
                        fill="black"
                      ></path>
                      <path
                        d="M16.0839 4.24194C14.8766 4.24194 13.8418 5.21927 13.8418 6.48405C13.8993 7.69133 14.8766 8.72617 16.0839 8.72617C17.2912 8.72617 18.326 7.74884 18.326 6.48405C18.3259 5.27678 17.3486 4.24194 16.0839 4.24194ZM16.0839 7.57632C15.509 7.57632 14.9916 7.11641 14.9916 6.48405C14.9916 5.8517 15.5091 5.39179 16.0839 5.39179C16.6588 5.39179 17.1762 5.8517 17.1762 6.48405C17.1762 7.11641 16.7163 7.57632 16.0839 7.57632Z"
                        fill="black"
                      ></path>
                      <path
                        d="M9.87387 14.8198H5.96457C5.6196 14.8198 5.38965 15.0498 5.38965 15.3947V19.5914C5.38965 19.9364 5.6196 20.1664 5.96457 20.1664H9.87387C10.2188 20.1664 10.4488 19.9364 10.4488 19.5914V15.3947C10.4487 15.0498 10.2188 14.8198 9.87387 14.8198ZM9.29895 18.959H6.53949V15.9121H9.29895V18.959Z"
                        fill="black"
                      ></path>
                      <path
                        d="M9.87387 22.5237H5.96457C5.6196 22.5237 5.38965 22.7536 5.38965 23.0986V27.2953C5.38965 27.6403 5.6196 27.8702 5.96457 27.8702H9.87387C10.2188 27.8702 10.4488 27.6403 10.4488 27.2953V23.0986C10.4487 22.7536 10.2188 22.5237 9.87387 22.5237ZM9.29895 26.7204H6.53949V23.6735H9.29895V26.7204Z"
                        fill="black"
                      ></path>
                      <path
                        d="M9.87387 30.2268H5.96457C5.6196 30.2268 5.38965 30.4568 5.38965 30.8017V34.9984C5.38965 35.3434 5.6196 35.5733 5.96457 35.5733H9.87387C10.2188 35.5733 10.4488 35.3434 10.4488 34.9984V30.8017C10.4487 30.4568 10.1613 30.2268 9.87387 30.2268ZM9.29895 34.4235H6.53949V31.3766H9.29895V34.4235Z"
                        fill="black"
                      ></path>
                      <path
                        d="M39.5979 20.3966L29.1924 14.7052C29.0199 14.5901 28.79 14.5901 28.675 14.7052C26.7203 15.74 20.2241 19.1893 18.2694 20.2816C18.097 20.3966 17.982 20.569 17.982 20.799V26.7204C14.9351 26.7779 12.5205 29.2499 12.5205 32.2969C12.5205 35.3438 14.9926 37.8733 18.097 37.8733C20.684 37.8733 22.8686 36.0911 23.4435 33.734L28.675 37.0684C28.8474 37.1834 29.0199 37.1834 29.2499 37.0684L39.7129 31.4919C39.8854 31.3769 40.0004 31.2044 40.0004 30.9745V20.914C39.9429 20.684 39.7704 20.4541 39.5979 20.3966ZM28.905 15.8549L38.2183 20.914L35.8037 22.2362L26.4904 17.1197L28.905 15.8549ZM25.2257 17.8096L35.1713 23.2711V26.088L33.7916 26.8354V24.3059C33.7916 24.0759 33.6765 23.846 33.5041 23.7885L23.8459 18.5569L25.2257 17.8096ZM17.9821 36.6661C15.5675 36.6661 13.5554 34.7114 13.5554 32.2394C13.5554 29.7674 15.5101 27.8128 17.9821 27.8128C20.4541 27.8128 22.4087 29.7674 22.4087 32.2394C22.4087 34.7114 20.3965 36.6661 17.9821 36.6661ZM28.2726 35.4013L23.501 32.4119C23.5585 29.5949 21.6038 27.2954 19.0168 26.8354V21.7189L28.2726 26.9504V35.4013ZM28.905 26.0306L19.6492 20.7991L22.6387 19.1894L32.0094 24.3059L28.905 26.0306ZM38.7931 30.6297L29.4799 35.5162V27.0078L32.6418 25.2831V27.8126C32.6418 28.0426 32.7568 28.215 32.9292 28.33C33.0443 28.3876 33.1017 28.3876 33.2167 28.3876C33.3317 28.3876 33.3892 28.3876 33.5042 28.33L36.0337 26.9503C36.2061 26.8353 36.3211 26.6629 36.3211 26.4329V23.271L38.7932 21.9488V30.6297H38.7931Z"
                        fill="black"
                      ></path>
                      <path
                        d="M20.2822 16.8894H12.0613C11.7163 16.8894 11.4863 17.1194 11.4863 17.4643C11.4863 17.8093 11.7163 18.0393 12.0613 18.0393H20.2822C20.5696 18.0393 20.8571 17.8093 20.8571 17.4643C20.8571 17.1194 20.6271 16.8894 20.2822 16.8894Z"
                        fill="black"
                      ></path>
                      <path
                        d="M16.7743 24.6506H12.0027C11.6577 24.6506 11.4277 24.8806 11.4277 25.2256C11.4277 25.5705 11.6577 25.8005 12.0027 25.8005H16.7743C17.1192 25.8005 17.3492 25.5705 17.3492 25.2256C17.3492 24.8806 17.1192 24.6506 16.7743 24.6506Z"
                        fill="black"
                      ></path>
                      <path
                        d="M21.1442 30.2273C20.9143 29.9973 20.5693 29.9973 20.3394 30.1698L16.775 33.4467L15.6253 31.837C15.4528 31.5495 15.1078 31.492 14.8204 31.722C14.5329 31.8944 14.4754 32.2394 14.7054 32.5268L16.2001 34.7115C16.3151 34.8265 16.4301 34.9414 16.6025 34.9414H16.66C16.775 34.9414 16.9475 34.8839 17.0624 34.769L21.0867 31.0322C21.3742 30.8597 21.3742 30.4573 21.1442 30.2273Z"
                        fill="black"
                      ></path>
                    </svg>
                  </div>
                  <div class="txt">
                    <h5>{{ $t("System Layout") }}</h5>
                    <div class="col-auto p-1">
                      <div class="form-feild">
                        <div class="form-check">
                          <label for="restro" class="fw-bold">
                            <input
                              class="form-check-input"
                              type="radio"
                              name="layout"
                              id="restro"
                              value="1"
                              v-model="form.layout"
                              @change="update()"
                              :checked="form.layout == 1"
                            />
                            {{ $t("Restro") }}
                          </label>
                          <br /><small class="text-muted"
                            >Preffered for Restaurant, Cafe & Food
                            Outlets</small
                          >
                        </div>
                      </div>
                    </div>
                    <div class="col-auto p-1">
                      <div class="form-feild">
                        <div class="form-check">
                          <label for="retail" class="fw-bold">
                            <input
                              class="form-check-input"
                              type="radio"
                              name="layout"
                              id="retail"
                              value="2"
                              v-model="form.layout"
                              @change="update()"
                              :checked="form.layout == 2"
                            />
                            {{ $t("Retail") }}
                          </label>
                          <br /><small class="text-muted"
                            >Preffered for Supermarket, Retail Stores, Laundry
                            etc.</small
                          >
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
  get();
});

const initialState = {
  server_messages: {
    type: "",
    messages: "",
  },
  layout: 1, // 1-Retail,2-Retail
};

const form = reactive({ ...initialState });

const is_loaded = ref(false);
async function get() {
  await axios
    .get("/api/merchant_settings")
    .then((response) => {
      if (response.data != "") {
        form.layout = response.data.data.layout;
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
  
  is_loaded.value = false;

  var form_data = new FormData();
  form_data.append("layout", form.layout);

  await axios
    .post("/api/merchant_settings/update_layout", form_data)
    .then((response) => {
      authStore.refresh();

      toast.success(response.data.msg);
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
</script>
