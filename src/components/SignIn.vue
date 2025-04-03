<template>

    <div class="login-page">
        <div class="login-shape-1">
            <img :src="loginshape1" alt=""/>
        </div>
        <div class="login-shape-2">
            <img :src="loginshape2" alt=""/>
        </div>
        <div class="row g-0">
            <div class="col-lg-4 offset-4">
                <div class="login-page-wrap">
                
                    <div class="card login-card">
                        <div class="row align-items-center justify-content-between mb-3 mb-md-5">
                            <div class="col-auto">
                                <div class="login-logo">
                                    <a href="#"><img :src="logo" alt=""/></a>
                                </div>
                            </div>
                            <!-- <div class="col-auto">
                                <div class="login-lang-switcher">
                                    <a href="#" class="dropdown dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="true" data-bs-auto-close="outside">
                                    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M22.1924 3.80758C19.737 1.35225 16.4724 0 13 0C9.52758 0 6.263 1.35225 3.80758 3.80758C1.35225 6.263 0 9.52758 0 13C0 16.4724 1.35225 19.737 3.80758 22.1924C6.263 24.6477 9.52758 26 13 26C16.4724 26 19.737 24.6477 22.1924 22.1924C24.6477 19.737 26 16.4724 26 13C26 9.52758 24.6477 6.263 22.1924 3.80758ZM8.14491 2.60259C7.72246 3.30591 7.34373 4.13436 7.0168 5.07691C6.84186 5.58121 6.68632 6.10898 6.54829 6.65468C5.63393 6.46176 4.76222 6.22746 3.94728 5.9541C5.0571 4.53136 6.49446 3.37639 8.14491 2.60259ZM3.06455 7.26091C4.04488 7.6114 5.10702 7.90644 6.2267 8.14282C5.99193 9.43805 5.85376 10.815 5.81735 12.2383H1.54934C1.66811 10.4345 2.20497 8.74316 3.06455 7.26091ZM3.0616 18.7342C2.20375 17.2531 1.66801 15.5635 1.54934 13.7617H5.81735C5.85371 15.1838 5.99168 16.5596 6.22604 17.8539C5.1057 18.0898 4.04275 18.3842 3.0616 18.7342ZM3.94388 20.0415C4.75968 19.7685 5.63225 19.5345 6.54743 19.3421C6.68561 19.889 6.8415 20.4179 7.0168 20.9232C7.34373 21.8657 7.72246 22.6941 8.14491 23.3974C6.49279 22.6228 5.05421 21.4662 3.94388 20.0415ZM12.2383 24.4507C11.8097 24.4224 11.3872 24.3714 10.9727 24.2973C9.85618 23.6087 8.74118 21.7663 8.04446 19.0699C9.38732 18.8626 10.7986 18.7398 12.2383 18.7079V24.4507ZM12.2383 17.184C10.6892 17.217 9.16784 17.3513 7.71971 17.5794C7.51121 16.4216 7.37664 15.1433 7.34018 13.7617H12.2383V17.184ZM12.2383 12.2383H7.34018C7.37664 10.8558 7.51136 9.57653 7.72012 8.41806C9.16784 8.64688 10.689 8.78186 12.2383 8.81557V12.2383ZM12.2383 7.29168C10.7985 7.25913 9.38747 7.13568 8.04507 6.92773C8.74184 4.23262 9.85654 2.39109 10.9727 1.70275C11.3873 1.62855 11.8097 1.57757 12.2383 1.54934V7.29168ZM22.9383 7.26578C23.7962 8.74692 24.332 10.4365 24.4507 12.2383H20.1827C20.1463 10.8162 20.0083 9.44039 19.7739 8.14613C20.8943 7.91025 21.9572 7.61577 22.9383 7.26578ZM22.0561 5.95852C21.2403 6.23152 20.3677 6.46547 19.4525 6.65793C19.3143 6.11107 19.1584 5.58223 18.9832 5.07691C18.6563 4.13436 18.2775 3.30591 17.8551 2.60259C19.5072 3.37716 20.9458 4.53375 22.0561 5.95852ZM13.7617 1.54934C14.1903 1.57757 14.6127 1.62855 15.0273 1.70275C16.1438 2.39129 17.2588 4.23368 17.9555 6.93012C16.6127 7.13736 15.2014 7.2602 13.7617 7.29209V1.54934ZM13.7617 8.81598C15.3108 8.78297 16.8322 8.64871 18.2803 8.4206C18.4888 9.57841 18.6234 10.8568 18.6598 12.2383H13.7617V8.81598ZM13.7617 13.7617H18.6598C18.6234 15.1442 18.4886 16.4235 18.2799 17.5819C16.8322 17.3531 15.3111 17.2181 13.7617 17.1844V13.7617ZM15.0273 24.2973C14.6128 24.3714 14.1903 24.4224 13.7617 24.4507V18.7083C15.2015 18.7409 16.6126 18.8643 17.9549 19.0723C17.2582 21.7674 16.1435 23.6089 15.0273 24.2973ZM17.8551 23.3974C18.2775 22.6941 18.6563 21.8657 18.9832 20.9232C19.1581 20.4188 19.3137 19.8911 19.4518 19.3453C20.3661 19.5382 21.2378 19.7725 22.0528 20.0459C20.9429 21.4686 19.5055 22.6236 17.8551 23.3974ZM22.9355 18.7391C21.9551 18.3886 20.893 18.0936 19.7733 17.8572C20.0081 16.5619 20.1462 15.185 20.1826 13.7617H24.4506C24.3319 15.5655 23.795 17.2568 22.9355 18.7391Z" fill="currentColor"/>
                                        </svg>
                                        {{ lang == 'en'?"English":"عربي" }}
                                    </a>
                                    <div class="dropdown-menu">
                                        <div class="dropdown-item" role="button" @click="switchLanguage('en')">English</div>
                                        <div class="dropdown-item" role="button" @click="switchLanguage('ar')">عربي</div>
                                    </div>
                                </div>
                            </div> -->
                        </div>

                        <h3 class="text-primary">{{ $t("Sign In to your account") }}</h3>
                        <div v-if="server_messages.messages != ''">
                            <ServerMessage  :server_messages="server_messages"  />
                        </div>
                        <Form
                        :validation-schema="schema"
                        @submit="signIn"
                        >   

                            <VTextInput
                            type="email" 
                            name="email"
                            v-model="email"
                            :label="t('Email')" 
                            :placeholder="t('Email')" 
                            required
                            size="large"
                            />

                            <VTextInput 
                            type="password" 
                            name="password" 
                            v-model="password"
                            :label="t('Password')" 
                            :placeholder="t('Password')"
                            required 
                            size="large"
                            />
                           
                            <div class="text-end">
                            <router-link to="/forgot_password" >{{ $t("Forgot Password?") }}</router-link>
                            </div>
                            <button 
                            type="submit"
                            class="btn btn-primary w-100 btn-lg mt-3" 
                            :disabled="is_processing"
                            >
                                <clip-loader v-if="is_processing" :color="'white'" :size="'20px'" class="pt-2 pe-2">  </clip-loader>
                                <span class="pt-0" v-if="is_processing">
                                    {{ $t("Signing In...") }}
                                </span>
                                <span class="pt-0" v-else>
                                    {{ $t("Sign In") }}
                                </span> 

                            </button>
                            
                        </Form>
                        
                        <p class=" pt-4 text-center login-link-text">{{ $t("Don’t have an account?") }} <router-link to="/register"><b> {{ $t("Sign up for free") }}</b></router-link></p>

                    </div>

                </div>
            </div>
        </div>
        <div class="copyright-text text-center">
            <p>© {{ $t("Copyright") }} 2025. {{ app_name }} {{ $t("All Rights Reserved.") }}</p>
        </div>
    </div>

    <AsyncForceSignInModal :msg="force_sign_in_msg" :email="email" :password="password" />

</template>

<script setup>

import { Form, Field } from 'vee-validate'
import * as yup from 'yup';
import ClipLoader from 'vue-spinner/src/ClipLoader.vue'

import { useAuthStore } from '@/stores/auth';
import { useSettingStore } from '@/stores/settingStore';
import { useSubscriptionStore } from '@/stores/subscriptionStore';
// import logo from '@/assets/images/logo.png'
import women_img from '@/assets/images/loginpage/login-man.png';
import logo1 from '@/assets/images/loginpage/logos/1.png';
import logo2 from '@/assets/images/loginpage/logos/2.png';
import logo3 from '@/assets/images/loginpage/logos/3.png';
import logo4 from '@/assets/images/loginpage/logos/4.png';
import logo5 from '@/assets/images/loginpage/logos/5.png';
import logo6 from '@/assets/images/loginpage/logos/6.png';
import logo7 from '@/assets/images/loginpage/logos/7.png';
import logo8 from '@/assets/images/loginpage/logos/8.png';
import logo9 from '@/assets/images/loginpage/logos/9.png';
import logo10 from '@/assets/images/loginpage/logos/10.png';
import loginshape1 from '@/assets/images/loginpage/login-shape-1.svg';
import loginshape2 from '@/assets/images/loginpage/login-shape-2.svg';
import { useI18n } from 'vue-i18n'
import { useRoute } from "vue-router";

const { t } = useI18n();
const route = useRoute();

const authStore = useAuthStore();
const settingStore = useSettingStore();
const subscriptionStore = useSubscriptionStore();

const logo = computed(() => {
  return settingStore.logo;
});
const app_name = computed(() => {
  return settingStore.display_name; 
});
const lang = ref("en");
const cart_subscription_id = computed(() => {
  return subscriptionStore.cart_subscription_id;
});
onMounted(() => {
  authStore.reset();
  lang.value = localStorage.getItem("language");
  if (route.query.message != undefined && route.params != "") {
    server_messages.type = "success";
    server_messages.messages = route.query.message;
    // toast.success(route.query.message);
  }
});

const server_messages = reactive({
  type: "",
  messages: "",
});

const is_processing = ref(false);

const schema = yup.object({
  email: yup
    .string()
    .required(t("name is required", { name: t("merchant email") }))
    .email(t("must be a valid email", { name: t("merchant email") })),
  password: yup
    .string()
    .required(t("name is required", { name: t("password") }))
    .min(
      8,
      t("name must be at least n characters", {
        name: t("password"),
        number: 8,
      })
    ),
});

const email = ref("");
const password = ref("");

const is_already_logged_in = ref(false);
const force_sign_in_msg = ref("");


async function signIn(force_sign_in = false) {

  try {
    is_processing.value = true;

    var form_data = new FormData();
    form_data.append("email", email.value);
    form_data.append("password", password.value);
    form_data.append("language", localStorage.getItem("language"));

    authStore.resetState();
    let response = await authStore.login(form_data);

    is_processing.value = false;

    if (response.status_code == 201) {
      is_already_logged_in.value = true;
      force_sign_in_msg.value = response.msg;
      $("#forceSignInModal").modal("show");
    } else if (response.status_code == 200) {
      server_messages.type = "success";
      server_messages.messages = response.msg;
      if (authStore.user.user_type != 1 && authStore.user.user_type != 4) {
        if(authStore.open_branch_change_modal){
          location.href = "/dashboard";
        }else{
          if (cart_subscription_id.value > 0 || (authStore.user.merchant.user_subscription != null && authStore.user.user_type == 2 && authStore.user.merchant.user_subscription.status == 3)) {
            location.href = "/subscriptions";
          } else if (authStore.user.merchant.user_subscription == null && authStore.user.user_type == 2) {
            location.href = "/subscriptions";
          } else {
            if(authStore.user.login_branch.default_view=='INVENTORY'){
              location.href = "/products";
            }else if(authStore.user.login_branch.default_view=='POS'){
              location.href = "/cashier";
            }else if(authStore.user.login_branch.default_view=='INVOICING'){
              location.href = "/invoices";
            }else{
              location.href = "/dashboard";
            }
          }
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
    console.log(error);
  }
}
async function switchLanguage(language) {
  localStorage.setItem("language", language);
  window.location.reload();
}

const AsyncForceSignInModal = defineAsyncComponent(() =>
  import("@/components/common/ForceSignInModal.vue")
);
</script>
