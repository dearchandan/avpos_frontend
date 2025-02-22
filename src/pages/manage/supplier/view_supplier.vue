<template>
  <DefaultLayout>

    <template v-slot:subheader>
      <div class="header-nav-wrap">
        <div class="row align-items-center">
          <div class="col-auto">
            <div class="header-back-link">
              <router-link class="" to="/suppliers" ><Icon icon="fa6-solid:chevron-left"  /> {{ $t('Suppliers') }}</router-link>
            </div>
          </div>
          <div class="col-auto">
            <h5>{{ supplier.name  }} </h5>
          </div>
        </div>
      </div>
    </template>

    <div class="content">
      <div class="row">
        <div class="col-lg-3" >
          <div class="card p-3 p-xl-4" v-if="supplier != ''">
            <div class="dv-data">
              <div class="item">
                <b>{{ $t('Name') }}</b>
                {{ supplier.name }}
              </div>
              <div class="item">
                <b>{{ $t('Phone') }}</b>
                {{ supplier.phone!=null?supplier.phone:'-' }}
              </div>
              <div class="item">
                <b>{{ $t('Email') }}</b>
                {{ supplier.email!=null?supplier.email:'-' }}
              </div>
              <div class="item">
                <b>{{ $t('VAT Number') }}</b>
                {{ supplier.vat_number!=null?supplier.vat_number:'-' }}
              </div>
              <div class="item">
                <b>{{ $t('GST Number') }}</b>
                {{ supplier.gst_number!=null?supplier.gst_number:'-' }}
              </div>
              <div class="item">
                <b>{{ $t('Address') }}</b>
                <span v-if="supplier.first_address_line!= null">{{ supplier.first_address_line }}</span><span v-if="supplier.second_address_line!=null">, {{ supplier.second_address_line }}</span><span v-if="supplier.city!=null">, {{ supplier.city }}</span><span v-if="supplier.postal_code!=null">, {{ supplier.postal_code }}</span><span v-if="supplier.state!=null">, {{ supplier.state }}</span><span v-if="supplier.country!=null">, {{ supplier.country.name }}</span>
              </div>
              <div class="item" v-if="supplier.created_by">
                <b>{{ $t('Created By') }}</b>
                {{ supplier.created_by.name }}
              </div>
              <div class="item" v-if="supplier.updated_by">
                <b>{{ $t('Updated At') }}</b>
                {{ supplier.updated_by.name }}
              </div>
              <div class="item">
                <b>{{ $t('Created At') }}</b>
                {{ supplier.created_at_label }}
              </div>
              <div class="item">
                <b>{{ $t('Updated At') }}</b>
                {{ supplier.updated_at_label }}
              </div>
            </div>
          </div>
          <ProductDetailSkeleton v-else />
        </div>
        <div class="col-lg-9">
          <ul class="nav nav-tabs nav-underline" id="myTab" role="tablist" v-if="supplier!=''">
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

            <AsyncSupplierPOList v-if="active_tab.index == '' || active_tab.tab.key == 'purchase_orders'" :supplier_slack="slack"/>

            <AsyncSupplierCustomField v-if="active_tab.tab.key == 'custom_fields'" :supplier_slack="slack"/>

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


const AsyncSupplierPOList = defineAsyncComponent( () => import('@/components/supplier/SupplierPOList.vue') );
const AsyncSupplierCustomField = defineAsyncComponent( () => import('@/components/supplier/SupplierCustomField.vue') );

const supplier = ref("");
const active_tab = ref({
  index : '',
  tab : ''
});

onMounted(() => {
  getSupplier();
});
const tabs = computed(() => {

  let values = [
    {
      key: 'purchase_orders',
      value: t('Purchase Orders'),
      count: supplier.value.total_purchase_orders,
      required: true,
    }
    ,{
      key: 'custom_fields',
      value: t('Custom Fields'),
      count: supplier.value.total_custom_fields,
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

async function getSupplier(){

  await axios.get('/api/supplier', { params : {
      slack : slack,
    } }).then( (response) => {
    supplier.value = response.data.data;
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
