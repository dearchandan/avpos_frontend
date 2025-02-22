<template>
  <DefaultLayout>

    <template v-slot:subheader>
      <div class="header-nav-wrap">
        <div class="row align-items-center">
          <div class="col-auto">
            <div class="header-back-link">
              <router-link class="" to="/Ingredients" ><Icon icon="fa6-solid:chevron-left"  /> {{ $t('Ingredients') }}</router-link>
            </div>
          </div>
          <div class="col-auto">
            <h5>{{ ingredient.name  }} </h5>
          </div>
        </div>
      </div>
    </template>

    <div class="content">
      <div class="row">
        <div class="col-lg-3" >
          <div class="card p-3 p-xl-4" v-if="is_ingredient_detail_listed">
            <div class="row flex-xl-nowrap align-items-center mb-3">
              <div class="col col-lg-12 col-xl">
                <div class="p-view-head">
                  <h2>{{ ingredient.name }} <br v-if="ingredient.name_ar != ''"> {{  ingredient.name_ar  }} </h2>
                  <h5 v-if="ingredient.short_description">{{ ingredient.short_description }}</h5>
                  <h5 v-if="ingredient.short_description_ar">{{ ingredient.short_description_ar }}</h5>
                </div>
              </div>
            </div>
            <div class="row g-1 flex-nowrap flex-lg-wrap flex-xl-nowrap mb-1 mb-md-3">
              <div class="col col-lg-12 col-xl" >
                <div class="pview-head-data">
                  {{ $t('Default Sale Price') }} <b class="d-block" v-if="ingredient.sale_price">{{ ingredient.sale_price }} <span v-if="ingredient.stock_measurement_unit">{{ $t('Per') }} {{ (language == 'ar' && ingredient.stock_measurement_unit.abbreviation_ar != '' && ingredient.stock_measurement_unit.abbreviation_ar != null)?ingredient.stock_measurement_unit.abbreviation_ar:ingredient.stock_measurement_unit.abbreviation  }}</span> <span v-else>{{ $t('Per Unit') }}</span></b>
                  <b v-else> - </b>
                </div>
              </div>
              <div class="col col-lg-12 col-xl">
                <div class="pview-head-data">
                  {{ $t('Default Alert Quantity') }} <br/><b class="d-block"  v-if="ingredient.alert_quantity">{{ ingredient.alert_quantity }} <span v-if="ingredient.stock_measurement_unit"> {{ (language == 'ar' && ingredient.stock_measurement_unit.abbreviation_ar != '' && ingredient.stock_measurement_unit.abbreviation_ar != null)?ingredient.stock_measurement_unit.abbreviation_ar:ingredient.stock_measurement_unit.abbreviation  }}</span> <span v-else> {{ $t('Unit') }}</span></b>
                  <b v-else> - </b>
                </div>
              </div>
            </div>
            <div class="dv-data">
              <div class="item">
                <span>{{ $t('Stock Measurement') }}</span>
                <span v-if="ingredient.stock_measurement_unit"> {{ (language == 'ar' && ingredient.stock_measurement_unit.unit_name_ar != '' && ingredient.stock_measurement_unit.unit_name_ar != null)?ingredient.stock_measurement_unit.unit_name_ar:ingredient.stock_measurement_unit.unit_name  }}</span>
                <span v-else> {{ $t('Units') }} </span>
              </div>
              <div class="item">
                <span>{{ $t('Sale Measurement') }}</span>
                <span v-if="ingredient.sale_measurement_unit"> {{ (language == 'ar' && ingredient.sale_measurement_unit.unit_name_ar != '' && ingredient.sale_measurement_unit.unit_name_ar != null)?ingredient.sale_measurement_unit.unit_name_ar:ingredient.sale_measurement_unit.unit_name  }}</span>
                <span v-else> {{ $t('Units') }} </span>
              </div>
              <div class="item">
                <span>{{ $t('UPC (Barcode)') }}</span>
                {{ ingredient.upc }}
              </div>
              <div class="item" v-if="layout == 2">
                <span>{{ $t('MPN') }}</span>
                {{ ingredient.mpn }}
              </div>
              <div class="item" v-if="layout == 2">
                <span>{{ $t('EAN') }}</span>
                {{ ingredient.ean }}
              </div>
              <div class="item" v-if="layout == 2">
                <span>{{ $t('Manufacturer') }}</span>
                {{ ingredient.manufacturer }}
              </div>
              <div class="item" v-if="layout == 2">
                <span>{{ $t('Brand') }}</span>
                {{ ingredient.brand }}
              </div>
              <div class="item">
                <span>{{ $t('Calories') }}</span>
                {{ ingredient.calories }}
              </div>
              <div class="item" v-if="ingredient.preparation_time != ''">
                <span>{{ $t('Preparation Time') }}</span>
                {{ ingredient.preparation_time  }} {{ $t('Mins') }}
              </div>
              <div class="item">
                <span>{{ $t('Created At') }}</span>
                {{ ingredient.created_at_label }}
              </div>
              <div class="item">
                <span>{{ $t('Updated At') }}</span>
                {{ ingredient.updated_at_label }}
              </div>
              <div class="item" v-if="ingredient.description">
                <b class="d-block w-100" >{{ $t('Description') }} :</b>
                <span class="d-block w-100">{{ ingredient.description }}</span>
              </div>
              <div class="item" v-if="ingredient.description_ar">
                <b class="d-block w-100">{{ $t('Description (Arabic)') }} :</b>
                <span class="d-block w-100">{{ ingredient.description_ar }}</span>
              </div>
            </div>
          </div>
          <ProductDetailSkeleton v-else />
        </div>
        <div class="col-lg-9">
          <ul class="nav nav-tabs nav-underline" id="myTab" role="tablist" v-if="ingredient!=''">
            <li class="nav-item" role="presentation" v-for="(tab,index) in tabs" :key="index">
              <button
                  v-tippy="(tab.required && tab.count <= 0) ? low_inventory_message : ''"
                  class="nav-link"
                  @click="setActive(tab,index)"
                  :class="[ active_tab.index == index || (active_tab.index == '' && index == 0)  ? 'active' : '' , (tab.required && tab.count <= 0) ? 'text-danger' : ''  ]"
                  type="button" role="tab" aria-selected="false" tabindex="-1">
                  {{ tab.value }}
                <span v-if="tab.count >= 0 && tab.key != 'inventory'" class="badge count-badge" :class="[ active_tab.index != index ? 'badge-secondary' : 'badge-dark' ]" >
                    {{  tab.count }}
                </span>
              </button>
            </li>

          </ul>
          <div class="tab-content" id="myTabContent" >
            <AsyncAddIngredientSupplier v-if="active_tab.tab.key == '' || active_tab.tab.key == 'suppliers'" :ingredient="ingredient" :all_suppliers="all_suppliers"/>
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

const initialState = {
  server_messages: {
    type: "",
    messages: "",
  },
};

const form = reactive({ ...initialState });

const AsyncAddIngredientBranch = defineAsyncComponent( () => import('@/components/ingredient/AddIngredientBranch.vue') );
const AsyncAddIngredientSupplier = defineAsyncComponent( () => import('@/components/ingredient/AddIngredientSupplier.vue') );

const ingredient = ref("");
// const all_branches = ref([]);
const all_suppliers = ref([]);
const active_tab = ref({
  index : '',
  tab : ''
});

onMounted(() => {
  getIngredient();
});
const tabs = computed(() => {

  let values = [
    /*{
      key: 'inventory',
      value: t('Inventory'),
      count: _.size(ingredient.value.all_branch_inventory) ,
      required: true,
    },*/
    {
      key: 'suppliers',
      value: t('Suppliers'),
      count: _.size(ingredient.value.product_suppliers),
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

const low_inventory_message = t("Inventory can not be left blank, at least 1 branch should have some stock!");

const is_ingredient_detail_listed = ref(false);
async function getIngredient(){

  await axios.get('/api/v2/ingredient', { params : {
      slack : slack,
    } }).then( (response) => {

    ingredient.value = response.data.data.ingredient;
    // all_branches.value = response.data.data.all_branches;
    all_suppliers.value = response.data.data.all_suppliers;
    
    if(ingredient.value!=null){
      setActive(tabs.value[0],0)
    }
    is_ingredient_detail_listed.value = true;
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
