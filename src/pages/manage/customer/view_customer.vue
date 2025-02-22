<template>
  <DefaultLayout>

    <template v-slot:subheader>
      <div class="header-nav-wrap">
        <div class="row align-items-center">
          <div class="col-auto">
            <div class="header-back-link">
              <router-link class="" to="/customers" ><Icon icon="fa6-solid:chevron-left"  /> {{ $t('Customers') }}</router-link>
            </div>
          </div>
          <div class="col-auto">
            <h5>{{ customer.name  }} </h5>
          </div>
        </div>
      </div>
    </template>

    <div class="content">
      <div class="row">
        <div class="col-lg-3" >
          <div class="card p-3 p-xl-4" v-if="customer != ''">
            <div class="dv-data">
              <div class="item">
                <b>{{ $t('Name') }}</b>
                {{ customer.name }}
              </div>
              <div class="item">
                <b>{{ $t('Phone') }}</b>
                {{ customer.phone!=null?customer.phone:'-' }}
              </div>
              <div class="item">
                <b>{{ $t('Customer Type') }}</b>
                <span v-if="customer.type==2">{{ $t('Walk In') }}</span>
                <span v-else>{{ $t('Regular') }}</span>
              </div>
              <div class="item" v-if="customer.customer.country">
                <b>{{ $t('Country') }}</b>
                <span>{{ customer.customer.country.name }}</span>
              </div>
              <div class="item">
                <b>{{ $t('Email') }}</b>
                {{ customer.email!=null?customer.email:'-' }}
              </div>
              <div class="item">
                <b>{{ $t('Date of Birth') }}</b>
                {{ customer.date_of_birth!=null?customer.date_of_birth:'-' }}
              </div>
              <div class="item">
                <b>{{ $t('Date of Anniversary') }}</b>
                {{ customer.date_of_anniversary!=null?customer.date_of_anniversary:'-' }}
              </div>
              <div class="item">
                <b>{{ $t('Date of Joining') }}</b>
                {{ customer.joining_date!=null?customer.joining_date:'-' }}
              </div>
              <div class="item">
                <b>{{ $t('VAT Number') }}</b>
                {{ customer.vat_number!=null?customer.vat_number:'-' }}
              </div>
              <div class="item">
                <b>{{ $t('GST Number') }}</b>
                {{ customer.gst_number!=null?customer.gst_number:'-' }}
              </div>
              <div class="item">
                <b>{{ $t('Address') }}</b>
                <span v-if="customer.first_address_line!= null">{{ customer.first_address_line }}</span><span v-if="customer.second_address_line!=null">, {{ customer.second_address_line }}</span><span v-if="customer.city!=null">, {{ customer.city }}</span><span v-if="customer.postal_code!=null">, {{ customer.postal_code }}</span><span v-if="customer.state!=null">, {{ customer.state }}</span><span v-if="customer.country!=null">, {{ customer.country.name }}</span>
              </div>
              <div class="item" v-if="customer.created_by">
                <b>{{ $t('Created By') }}</b>
                {{ customer.created_by.name }}
              </div>
              <div class="item" v-if="customer.updated_by">
                <b>{{ $t('Updated At') }}</b>
                {{ customer.updated_by.name }}
              </div>
              <div class="item">
                <b>{{ $t('Created At') }}</b>
                {{ customer.created_at_label }}
              </div>
              <div class="item">
                <b>{{ $t('Updated At') }}</b>
                {{ customer.updated_at_label }}
              </div>
            </div>
          </div>
          <ProductDetailSkeleton v-else />
        </div>
        <div class="col-lg-9">
          <ul class="nav nav-tabs nav-underline" id="myTab" role="tablist" v-if="customer!=''">
            <li class="nav-item" role="presentation" v-for="(tab,index) in tabs" :key="index">
              <button class="nav-link" @click="setActive(tab,index)"
                  :class="[ active_tab.index == index || (active_tab.index == '' && index == 0)  ? 'active' : '' ,  ]"
                  type="button" role="tab" aria-selected="false" tabindex="-1">
                {{ tab.value }}
                <span v-if="tab.count > 0" class="badge count-badge" :class="[ active_tab.index != index ? 'badge-secondary' : 'badge-dark' ]">
                  {{  tab.count }}</span>
              </button>
            </li>
          </ul>
          <div class="tab-content" id="myTabContent" >

            <AsyncCustomerDashboard v-if="active_tab.index == '' || active_tab.tab.key == 'dashboard'" :customer_slack="slack"/>

            <AsyncCustomerOrderList v-if="active_tab.tab.key == 'orders'" :customer_slack="slack"/>

            <AsyncCustomerInvoiceList v-if="active_tab.tab.key == 'invoices'" :customer_slack="slack"/>

            <AsyncCustomerCustomField v-if="active_tab.tab.key == 'custom_fields'" :customer_slack="slack"/>

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

const AsyncCustomerDashboard = defineAsyncComponent( () => import('@/components/customer/CustomerDashboard.vue') );
const AsyncCustomerOrderList = defineAsyncComponent( () => import('@/components/customer/CustomerOrderList.vue') );
const AsyncCustomerInvoiceList = defineAsyncComponent( () => import('@/components/customer/CustomerInvoiceList.vue') );
const AsyncCustomerCustomField = defineAsyncComponent( () => import('@/components/customer/CustomerCustomField.vue') );

const customer = ref("");
const active_tab = ref({
  index : '',
  tab : ''
});

onMounted(() => {
  getCustomer();
});
const tabs = computed(() => {

  let values = [
    {
      key: 'dashboard',
      value: t('Dashboard'),
      count: '',
      required: true,
    },
    {
      key: 'orders',
      value: t('Orders'),
      count: customer.value.total_orders ,
      required: true,
    }
    ,{
      key: 'invoices',
      value: t('Invoices'),
      count: customer.value.total_invoices,
      required: false,
    }
    ,{
      key: 'custom_fields',
      value: t('Custom Fields'),
      count: customer.value.total_custom_fields,
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

async function getCustomer(){

  await axios.get('/api/customer', { params : {
      slack : slack,
    } }).then( (response) => {
    customer.value = response.data.data;

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
