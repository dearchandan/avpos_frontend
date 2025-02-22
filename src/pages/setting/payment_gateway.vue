<template>
    <DefaultLayout>

        <template v-slot:subheader>
            <div class="header-nav-wrap">
                <div class="row align-items-center">
                    <div class="col-auto">
                        <div class="header-back-link">
                            <router-link class="text-primary" to="/settings" ><Icon icon="fa6-solid:chevron-left"  /> {{ $t('Settings') }}</router-link>
                        </div>
                    </div>
                    <div class="col-auto">
                        <h5>{{ $t('Payment Gateways') }}</h5>
                    </div>
                </div>
            </div>
        </template>

        <div class="content">
          <div class="row">
            <div class="col-lg-3" >
              <div class="card p-3 p-xl-4">
                <div class="row flex-xl-nowrap align-items-center mb-3">
                  <div class="col col-lg-12 col-xl">
                    <div class="p-view-head">
                      <h2 class="mb-3">SMS Template Variables</h2>
                      <p class="mb-2">[INVOICE_NUMBER] : For Invoice Number</p>
                      <p class="mb-2">[AMOUNT] : For Invoice Amount</p>
                      <p class="mb-2">[INVOICE_LINK] : For Invoice PDF Link</p>
                      <p class="mb-2">[PAYMENT_LINK] : For Invoice Payment Link</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-lg-9">
              <ul class="nav nav-tabs nav-underline" id="myTab" role="tablist">
                <li class="nav-item" role="presentation" v-for="(tab,index) in tabs" :key="index">
                  <button
                      class="nav-link"
                      @click="setActive(tab.key,index)"
                      :class="[ active_tab.index == index ? 'active' : '']"
                      type="button" role="tab" aria-selected="false" tabindex="-1">
                    {{ tab.value }}
                  </button>
                </li>

              </ul>
              <div class="tab-content" id="myTabContent" v-if="form.is_loaded">
                <AsyncAddEdfaSetting v-if="active_tab.tab.index == '' ||  active_tab.tab == 'EDFAPAY'" :active_payment_gateway="active_payment_gateway"/>
                <AsyncAddMoyasarSetting v-if="active_tab.tab == 'MOYASAR'" :active_payment_gateway="active_payment_gateway"/>
                <AsyncAddHyperpaySetting v-if="active_tab.tab == 'HYPERPAY'" :active_payment_gateway="active_payment_gateway"/>
              </div>
              <PaymentGatewayFormSkeleton v-else/>
            </div>
          </div>
    </div>

  </DefaultLayout>
</template>

<script setup>
import { Form } from 'vee-validate'
import * as yup from 'yup';
import { useAuthStore } from '@/stores/auth';
import ClipLoader from 'vue-spinner/src/ClipLoader.vue'
import {defineAsyncComponent, onBeforeMount, ref} from "vue";
import { useI18n } from 'vue-i18n'
import VTextArea from '@/components/common/VTextArea.vue'

const { t } = useI18n();

const AsyncServerMessage = defineAsyncComponent( () => import('@/components/common/ServerMessage.vue') );
const AsyncAddMoyasarSetting = defineAsyncComponent( () => import('@/components/payment_gateway/AddMoyasarSetting.vue') );
const AsyncAddEdfaSetting = defineAsyncComponent( () => import('@/components/payment_gateway/AddEdfaSetting.vue') );
const AsyncAddHyperpaySetting = defineAsyncComponent( () => import('@/components/payment_gateway/AddHyperpaySetting.vue') );

const auth = useAuthStore();

const initialState = {
  server_messages: {
    type: "",
    messages: "",
  },
  is_submitting: false,
  is_loaded: false
};

const form = reactive({ ...initialState });

onBeforeMount(() =>{
  getPaymentGatewaySettings();
});

const tabs = ref([]);
const active_payment_gateway = ref('');
async function getPaymentGatewaySettings(){

  let add_data = await axios.post('api/payment_gateway_setting/add');
  let master_payment_gateways = add_data.data.data.master_payment_gateways;

  _.forEach(master_payment_gateways, (item) => {
    let template = {
      'key': item.constant,
      'value': item.name,
      'count': 0,
      'required': false,
    };
    tabs.value.push(template);
  });

  if(!jQuery.isEmptyObject(add_data.data.data.payment_gateway)){
    active_payment_gateway.value = add_data.data.data.payment_gateway;
    if(active_payment_gateway.value!=null && active_payment_gateway.value.status>0){
      var index;
      tabs.value.findIndex(function (item, i) {
        if (item.key == active_payment_gateway.value.name) {
          index = i;
          return true;
        }
      });
      setActive(active_payment_gateway.value.name,index);
    }
    form.is_loaded = true;
  }else{
    active_payment_gateway.value= [];
    setActive('EDFAPAY',0);
    form.is_loaded = true;
  }

}

const active_tab = ref({
  index : '',
  tab : ''
});

function setActive(tab,index){
  let template = {
    tab: tab,
    index: index,
  };
  active_tab.value = template;
  form.adds_type = index;
}

function resetData(){
    Object.assign(form, initialState);
}
</script>
