<template>
    <DefaultLayout>
      <template v-slot:subheader>
        <SubscriptionMenu />
      </template>
      <div class="content">

        <div class="row justify-content-center mt-2 mb-4 mt-md-4 mb-md-5">
            <div class="col-auto ">
                <ul class="nav nav-tabs rounded-tabs" id="myTab" role="tablist">
                    <li class="nav-item" role="presentation">
                    <button class="nav-link active" data-bs-toggle="tab" data-bs-target="#subscribe1" type="button" role="tab" aria-selected="true">{{ $t('Subscriptions') }}</button>
                    </li>
                    <li class="nav-item" role="presentation">
                    <button class="nav-link" data-bs-toggle="tab" data-bs-target="#subscribe2" type="button" role="tab" aria-selected="false">{{ $t('Devices') }}</button>
                    </li>
                </ul>
            </div>
          </div>

          <div class="container p-0">
              
              <div class="tab-content" id="myTabContent">
                  <div class="tab-pane fade show active" id="subscribe1" role="tabpanel" aria-labelledby="home-tab" tabindex="0">
                      <div class="row g-3 g-md-4">
                          <div class="col-md-6 col-lg-4 col-xl-3" v-for="(subscription, index) in subscriptions">
                              <div :class="[ authStore.user.merchant.user_subscription!=null && cart_subscription_id=='' && subscription.id == authStore.user.merchant.user_subscription.subscription_id ? 'subsctibecard active' : 'subsctibecard' ]" class="">
                                  <h3>{{ subscription.name.toUpperCase() }}</h3>
                                  <div class="pricewrap">
                                      <sup>{{ subscription.currency.symbol }}</sup>{{ Math.trunc(subscription.payable_amount) }}<sub>/ Yearly</sub>
                                  </div>
                                <ul class="subscribe-feature-points">
                                  <li v-for="(feature, index) in subscription.features">
                                    <div v-if="feature.feature_name=='Inventory'">{{ $t('Inventory Management') }}</div>
                                    <div v-if="feature.feature_name=='Sales'">{{ $t('Sales Management') }}</div>
                                    <div v-if="feature.feature_name=='Business'">{{ $t('Accounts Management') }}</div>
                                    <div v-if="feature.feature_name=='Manage'">{{ $t('Branches Management') }}</div>
                                    <div v-if="feature.feature_name=='Restaurant'">{{ $t('Restaurant Management') }}</div>
                                    <div v-if="feature.feature_name=='Reports'">{{ $t('All Reports') }}</div>
                                  </li>
                                  <li v-for="(addon, index) in subscription.addons">
                                    <div v-if="addon.addon.type==1 && addon.addon.name=='User Limit'">{{ $t('Up to') }} {{ Math.trunc(addon.limit_value) }} {{ $t('Users') }} </div>
                                    <div v-if="addon.addon.type==1 && addon.addon.name=='Branch Limit'">{{ $t('Up to') }} {{ Math.trunc(addon.limit_value) }}  {{ $t('Branches') }} </div>
                                    <div v-if="addon.addon.type==1 && addon.addon.name=='Product Limit'">{{ $t('Up to') }} {{ Math.trunc(addon.limit_value) }} {{ $t('Products') }} </div>
                                  </li>
                                  <li class="subscribe-feature-addon" v-for="(addon, index) in subscription.addons">
                                    <div class="withspan" v-if="index==0 && addon.addon.type==2"><span>{{ $t('WITH') }}</span></div>
                                    <div class="wosulpay-logo" v-if="addon.addon.type==2"><img src="../../../assets/images/subscriptions/wosupaylogo.png"/></div>
                                  </li>
                                </ul>
                                <button class="btn btn-primary w-100" @click="subscribe(subscription.id,1)" v-if="cart_subscription_id>0 || authStore.user.merchant.user_subscription==null"> {{ $t('Subscribe') }} </button>
                                <button class="btn btn btn-success w-100" @click="subscribe(subscription.id,2)" v-if="authStore.user.merchant.user_subscription!=null && cart_subscription_id=='' && subscription.id == authStore.user.merchant.user_subscription.subscription_id"> {{ $t('Renew') }} </button>

                                <button class="btn btn-outline-primary w-100" @click="subscribe(subscription.id,3)" v-if="authStore.user.merchant.user_subscription!=null && cart_subscription_id=='' && subscription.id!=authStore.user.merchant.user_subscription.subscription_id && Math.trunc(authStore.user.user_subscription.subscription.payable_amount) >= Math.trunc(subscription.payable_amount)"> {{ $t('Change the Plan') }} </button>
                                <button class="btn btn-outline-primary w-100" @click="subscribe(subscription.id,4)" v-if="authStore.user.merchant.user_subscription!=null && cart_subscription_id=='' && subscription.id!=authStore.user.merchant.user_subscription.subscription_id && Math.trunc(authStore.user.user_subscription.subscription.payable_amount) <= Math.trunc(subscription.payable_amount)"> {{ $t('Upgrade') }} </button>
                              </div>
                          </div>
                      </div>
                  </div>


                  <div class="tab-pane fade" id="subscribe2" role="tabpanel" aria-labelledby="profile-tab" tabindex="0">
                      <div class="row">
                          <div class="col-md-6 col-lg-4 col-xl-3">
                              <div class="devicescard">
                                  <div class="img">
                                      <img src="../../../assets/images/subscriptions/stand.png"/>
                                  </div>
                                  <h3>Ipad Holder</h3>
                                  <div class="pricewrap">
                                      <sup>SAR</sup>750.00
                                  </div>
                                  <button class="btn btn-primary w-100">Add To Cart</button>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>


      </div>
  </DefaultLayout>
</template>

<script setup>

import { ref , onMounted, reactive, watch, defineComponent, computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useSubscriptionStore } from '@/stores/subscriptionStore';
import useGlobalFunctions from '@/composables/global_functions.js';
import { useI18n } from 'vue-i18n'

const { t } = useI18n();
const { isAuthorized } = useGlobalFunctions();
const authStore = useAuthStore();
const subscriptionStore = useSubscriptionStore();

const cart_subscription_id = computed(()=>{
  return subscriptionStore.cart_subscription_id;
});

onMounted(() => {
  if(cart_subscription_id.value>0){
    subscribe(cart_subscription_id.value,1);
  }
  getSubscriptions();
});

const subscriptions = ref([]);
async function getSubscriptions(){
  await axios.get('/api/country_subscriptions').then( (response) => {
    subscriptions.value = response.data.data;
  }).catch((error) => {
    console.log(error);
  });
}

async function subscribe(id,type=1) {

  /* Redirecting to subscription page */
  window.open(
    'https://wosul.sa/en/plans',
    '_blank' // <- This is what makes it open in a new window.
  );
  // if(type==1){
  //   subscriptionStore.setSubscriptionId(id);
  // }

  // var form_data = new FormData();
  // form_data.append('subscription_id',id);
  // form_data.append('type',type);
  // await axios.post('/api/subscription/subscribe', form_data, {
  //   headers: {
  //     'Content-Type': 'multipart/form-data'
  //   },
  // }).then( (response) => {

  //   if(response.data.status_code == 200) {
  //     toast.success(response.data.msg);
  //     subscriptionStore.setSubscriptionId('');
  //     authStore.setMenu(response.data.data.menus);
  //     authStore.refresh();
  //   }else{
  //     try{
  //       server_messages.type = "error";
  //       server_messages.messages = JSON.parse(response.data.msg);
  //     }catch(err){
  //       server_messages.type = "error";
  //       server_messages.messages = response.data.msg;
  //     }
  //   }

  // }).catch((error) => {
  //   server_messages.type = "error";
  //   server_messages.messages = error;
  //   form.value.is_submitting = false;
  // });

}


</script>