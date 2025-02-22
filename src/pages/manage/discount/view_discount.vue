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
            <h5>{{ discount.name }} </h5>
          </div>
        </div>
      </div>
    </template>

    <div class="content">
      <div class="row">
        <div class="col-lg-3" >
          <div class="card p-3 p-xl-4" v-if="discount != ''">
            <div class="dv-data">
              <div class="item">
                <b>{{ $t('Discount') }}</b>
                {{ discount.name }}
              </div>
              <div class="item">
                <b>{{ $t('Value') }}</b>
                {{ discount.value }} {{ discount.type_text }}
              </div>
              <div class="item">
                <b>{{ $t('Applies To') }}</b>
                {{ discount.applies_to_text }}
              </div>
              <div class="item">
                <b>{{ $t('Inventory Type') }}</b>
                <span v-if="discount.inventory_type == 1">{{ $t('All Products') }}</span>
                <span v-if="discount.inventory_type == 2">{{ $t('Selected Products') }}</span>
                <span v-if="discount.inventory_type == 3">{{ $t('Selected Categories') }}</span>
              </div>
              <div class="item" v-if="discount.available_discount_quantity != null">
                <b>{{ $t('Total Quantity') }}</b>
                {{ discount.available_discount_quantity }}
              </div>
              <div class="item" v-if="discount.available_discount_quantity != null">
                <b>{{ $t('Remaining Quantity') }}</b>
                {{ discount.remaining_discount_quantity }}
              </div>
              <div class="item" v-if="discount.start_datetime_label != null">
                <b>{{ $t('Start Date') }}</b>
                {{ discount.start_datetime_label }}
              </div>
              <div class="item" v-if="discount.start_datetime_label != null">
                <b>{{ $t('End Date') }}</b>
                {{ discount.end_datetime_label }}
              </div>
              <div class="item" v-if="discount.minimum_order_amount != null || discount.maximum_discount_amount != null">
                <b>{{ $t('Min. Order Amount') }}</b>
                {{ discount.minimum_order_amount }}
              </div>
              <div class="item" v-if="discount.minimum_order_amount != null || discount.maximum_discount_amount != null">
                <b>{{ $t('Max Discount Amount') }}</b>
                {{ discount.maximum_discount_amount }}
              </div>
              <div class="item" v-if="discount.created_by">
                <b>{{ $t('Created By') }}</b>
                {{ discount.created_by.name }}
              </div>
              <div class="item" v-if="discount.updated_by">
                <b>{{ $t('Updated At') }}</b>
                {{ discount.updated_by.name }}
              </div>
              <div class="item">
                <b>{{ $t('Created At') }}</b>
                {{ discount.created_at_label }}
              </div>
              <div class="item">
                <b>{{ $t('Updated At') }}</b>
                {{ discount.updated_at_label }}
              </div>
            </div>
          </div>
          <ProductDetailSkeleton v-else />
        </div>
        <div class="col-lg-9">
          <ul class="nav nav-tabs nav-underline" id="myTab" role="tablist" v-if="discount!=''">
            <li class="nav-item" role="presentation" v-for="(tab,index) in tabs" :key="index">
              <button
                  class="nav-link"
                  @click="setActive(tab,index)"
                  :class="[ active_tab.index == index || (active_tab.index == '' && index == 0)  ? 'active' : '' ,  ]"
                  type="button" role="tab" aria-selected="false" tabindex="-1">
                {{ tab.value }}
                <span v-if="tab.count > 0" class="badge count-badge" :class="[ active_tab.index != index ? 'badge-secondary' : 'badge-dark' ]">{{  tab.count }}</span>
              </button>
            </li>
          </ul>
          <div class="tab-content" id="myTabContent" >

            <AsyncDiscountAppliedOn v-if="active_tab.index == '' || active_tab.tab.key == 'applied_on'" :discount_slack="slack" :form="form" @refreshDiscount="getDiscount" />

            <AsyncDiscountHistory v-if="active_tab.tab.key == 'history'" :discount_slack="slack"/>

          </div>
        </div>
      </div>
    </div>

  </DefaultLayout>
</template>

<script setup>

import {ref, reactive, onMounted, defineAsyncComponent } from 'vue';

import {useRoute} from "vue-router";
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth';

const language = localStorage.getItem('language');
const authStore = useAuthStore();
const { t } = useI18n();
const route = useRoute();
const slack = route.params.slack;

const AsyncDiscountAppliedOn = defineAsyncComponent( () => import('@/components/discount/DiscountAppliedOn.vue'));

const AsyncDiscountHistory = defineAsyncComponent( () => import('@/components/discount/DiscountHistory.vue') );

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


const discount = ref("");
const active_tab = ref({
  index : '',
  tab : ''
});

onMounted(() => {
  getDiscount();
});

const tabs = computed(() => {

  let values = [
    {
      key: 'applied_on',
      value: t('Applied On'),
      count: 0,
      required: false,
    },
    {
      key: 'history',
      value: t('Applied History'),
      count: 0,
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
  active_tab.value = template;
}

async function getDiscount(){

  await axios.get('/api/discount', { params : {
      slack : slack,
    } }).then( (response) => {
    form.discount = response.data.data.discount;
    discount.value = response.data.data.discount;
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


const layout = computed(() => {
  return authStore.user.merchant.layout;
})

</script>
