<template>
  <SimpleLayout>
    <div class="subscribebody">
      <div class="subscribeheader">
        <div class="container">
          <div class="row align-items-center justify-content-md-between justify-content-center">
            <div class="col-auto order-2 order-md-1">
              <h2>Subscriptions & Devices</h2>
              <ul class="nav nav-tabs rounded-tabs" id="myTab" role="tablist">
                <li class="nav-item" role="presentation">
                  <button class="nav-link active" data-bs-toggle="tab" data-bs-target="#subscribe1" type="button" role="tab" aria-selected="true">Subscriptions</button>
                </li>
                <li class="nav-item" role="presentation">
                  <button class="nav-link" data-bs-toggle="tab" data-bs-target="#subscribe2" type="button" role="tab" aria-selected="false">Devices</button>
                </li>
              </ul>
            </div>
            <div class="col-auto order-1 order-md-2 mb-3 mb-md-0">
              <router-link to="/"><img :src="logo" class="logo" alt=""></router-link>
            </div>
          </div>
        </div>
      </div>

      <div class="content">

        <div class="container p-0">

          <div class="tab-content" id="myTabContent">
            <div class="tab-pane fade show active" id="subscribe1" role="tabpanel" aria-labelledby="home-tab" tabindex="0">
              <div class="row g-3 g-md-4">
                <div class="col-md-6 col-lg-4 col-xl-3" v-for="(subscription, index) in subscriptions">
                  <div class="subsctibecard">
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
                        <div class="withspan" v-if="index==0 && addon.addon.type==2"><span>WITH</span></div>
                        <div class="wosulpay-logo" v-if="addon.addon.type==2"><img src="../../assets/images/subscriptions/wosupaylogo.png"/></div>
                      </li>
                    </ul>
                    <button class="btn btn-primary w-100" @click="subscribe(subscription.id)">Subscribe</button>
                  </div>
                </div>
              </div>
            </div>

            <div class="tab-pane fade" id="subscribe2" role="tabpanel" aria-labelledby="profile-tab" tabindex="0">
              <div class="row">
                <div class="col-md-6 col-lg-4 col-xl-3">
                  <div class="devicescard">
                    <div class="img">
                      <img src="../../assets/images/subscriptions/stand.png"/>
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
    </div>
  </SimpleLayout>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import {onMounted} from "vue";
import { useSubscriptionStore } from '@/stores/subscriptionStore';
const subscriptionStore = useSubscriptionStore();

const { t } = useI18n();

onMounted(() => {
  getSubscriptions();
});

const subscriptions = ref([]);
async function getSubscriptions(){
  await axios.get('/api/subscriptions/all').then( (response) => {
    subscriptions.value = response.data.data;
  }).catch((error) => {
    console.log(error);
  });
}

async function subscribe(id) {
  subscriptionStore.setSubscriptionId(id);
  router.push('/register');
}

</script>
<style scoped>
.logo{
  width: 120px;
}
</style>
  