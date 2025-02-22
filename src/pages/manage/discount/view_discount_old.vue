<template>
  <DefaultLayout>

    <template v-slot:subheader>
      <div class="header-nav-wrap">
        <div class="row align-items-center">
          <div class="col-auto">
            <div class="header-back-link">
              <router-link class="text-primary" to="/discounts" ><Icon icon="fa6-solid:chevron-left"  /> {{ $t('Discounts') }}</router-link>
            </div>
          </div>
          <div class="col-auto">
            <h5 class="fw-bold">{{ form.discount.name  }} </h5>
          </div>
        </div>
      </div>
    </template>

    <div class="content">
      <div class="page-heading">
        <div class="py-3" v-if="form.server_messages.messages != ''">
          <ServerMessage :server_messages="form.server_messages"  />
        </div>
      </div>

      <div class="row justify-content-center">
        <div class="col-auto">
          <ul class="nav nav-tabs align-items-center nav-tabs-product" id="myTab2" role="tablist">
            <li class="nav-item" role="presentation" v-for="(tab,index) in tabs" :key="index">
              <button class="nav-link nav-link-lg fw-bold" @click="setActive(tab,index)" :class="[ form.active_tab.index == index || (form.active_tab.index == '' && index == 0)  ? 'active' : '' , (tab.required && tab.count <= 0) ? 'text-danger' : ''  ]"  type="button" role="tab" aria-selected="false" tabindex="-1">{{ tab.value }} <span v-if="tab.count >= 0" class="badge count-badge" :class="[ form.active_tab.index != index ? 'badge-secondary' : 'badge-dark' ]" >{{  tab.count }}</span> </button>
            </li>
          </ul>
        </div>
      </div>

      <div v-if="form.discount != ''">

        <AsyncDiscountDetail v-if=" form.active_tab.index == '' || form.active_tab.tab.key == 'discount_detail'" :discount="form.discount"  />

        <AsyncDiscountAppliedOn v-if="form.active_tab.tab.key == 'applied_on'"  :form="form" @refreshDiscount="getDiscount" />

      </div>


    </div>

  </DefaultLayout>
</template>

<script setup>

import { Form } from 'vee-validate'
import BeatLoader from 'vue-spinner/src/BeatLoader.vue'
import {useRoute} from "vue-router";
import { useI18n } from 'vue-i18n'

/* async components */
const AsyncDiscountDetail = defineAsyncComponent( () => import('@/components/discount/DiscountDetail.vue') );
const AsyncDiscountAppliedOn = defineAsyncComponent( () => import('@/components/discount/DiscountAppliedOn.vue') );

/* Route parameter */
const route = useRoute();
const slack = route.params.slack;
const { t } = useI18n();

const tabs = computed(() => {

  let values = [
    {
      key: 'discount_detail',
      value: t('Discount Detail'),
      count: '',
      required: false,
    }
    ,{
      key: 'applied_on',
      value: t('Applied On'),
      count: '',
      required: false,
    }
  ]

  return values;

});

function setActive(tab,index){
  let template = {
    tab: tab,
    index: index,
  };
  form.active_tab = template;
}

onMounted(()=>{
  getDiscount();
})

/* form object */
const initialState = {
  server_messages: {
    type: "",
    messages: "",
  },
  active_tab : {
    index : '',
    tab : ''
  },
  selected_branch: "",
  discount: "",
  branches: "",
  categories: "",
  is_inventory_listing : false
};

const form = reactive({ ...initialState });

async function getDiscount(){

  await axios.get('/api/discount', { params : {
      slack : slack,
    } }).then( (response) => {

    form.discount = response.data.data.discount;
    form.branches = response.data.data.branches
    form.categories = response.data.data.categories;
    // form.applies_to_all_branch = response.data.data.discount.applies_to_all_branch;
    form.selected_branch = '';

  }).catch((error) => {
    form.server_messages.type = "error";
    form.server_messages.messages = error;
    console.log(error);
  });

}


</script>