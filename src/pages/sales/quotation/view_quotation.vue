<template>
  <DefaultLayout>

    <template v-slot:subheader>
      <div class="header-nav-wrap">
        <div class="row align-items-center">
          <div class="col-auto">
            <div class="header-back-link">
              <router-link class="text-primary" to="/quotations" ><Icon icon="fa6-solid:chevron-left"  /> {{ $t('Quotations') }}</router-link>
            </div>
          </div>
          <div class="col-auto">
            <h5 class="fw-bold">#{{ quotation.quotation_number  }} </h5>
          </div>
          <div class="col-auto ms-auto">
            <button  class="btn btn-warning btn-radius ms-2 btn-sm" :disabled="form.is_submitting"
              v-if="quotation.status==1 && form.invoice_slack == null &&  (quotation.converted_invoice_slack == undefined || quotation.converted_invoice_slack == null )" 
              @click="quotationToInvoice" >{{ $t('Convert to Invoice') }} {{ form.invoice_slack }} </button>
            <button class="btn btn-success btn-radius ms-2 btn-sm" v-else-if="form.invoice_slack != null && quotation.status==1" 
              @click="viewInvoice" >{{ $t('View Converted Invoice') }}</button>
              <a v-else></a>
            <a :href="quotation.receipt_link" target="_blank" v-if="quotation.receipt_link != null" class="btn btn-light btn-text-primary ms-2 btn-sm">{{ $t('Print Now') }}</a>
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

      <div class="row" v-if="quotation!=null">
        <div class="col-md-12">
          <div class="card">
            <div v-if="quotation == ''">
              <beat-loader color="gray" :size="'15px'" class="pt-2 pe-2">  </beat-loader>
            </div>
            <div v-else>
              <div class="row">
                <div class="col-md-12 mb-3">
                  <h5>{{ $t('Basic Detail') }}</h5>
                </div>
                <div class="col-md-3">
                  <div class="data-view-box mb-3">
                    <div class="item">
                      <b>{{ $t('Supplier') }}:</b>
                      {{ quotation.customer?.name }}
                    </div>
                  </div>
                </div><div class="col-md-3">
                  <div class="data-view-box mb-3">
                    <div class="item">
                      <b>{{ $t('Quotation No.') }}:</b>
                      {{ quotation.quotation_number }}
                    </div>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="data-view-box mb-3">
                    <div class="item">
                      <b>{{ $t('Reference No.') }}:</b>
                      {{ quotation.reference_no }}
                    </div>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="data-view-box mb-3">
                    <div class="item">
                      <b>{{ $t('Quotation Date') }}:</b>
                      {{ quotation.quotation_date_label }}
                    </div>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="data-view-box mb-3">
                    <div class="item">
                      <b>{{ $t('Quotation Due Date') }}:</b>
                      {{ quotation.quotation_due_date_label }}
                    </div>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="data-view-box mb-3">
                    <div class="item">
                      <b>{{ $t('Status') }}:</b>
                      <span v-if="quotation.status==0" class="badge badge-primary">{{ $t('Draft') }}</span>
                      <span v-if="quotation.status==1" class="badge badge-success">{{ $t('Approved') }}</span>
                    </div>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="data-view-box mb-3">
                    <div class="item">
                      <b>{{ $t('Created By') }}:</b>
                      {{ quotation.created_by?.name }}
                    </div>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="data-view-box mb-3">
                    <div class="item">
                      <b>{{ $t('Created At') }}:</b>
                      {{ quotation.created_at_label }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <AsyncQuotationProduct v-if="isDataLoaded" :quotation="quotation"/>
      </div>

      <div class="row" v-if="quotation!=null && quotation.terms!=null">
        <div class="col-md-12">
          <div class="card">
            <div v-if="quotation == ''">
              <beat-loader color="gray" :size="'15px'" class="pt-2 pe-2">  </beat-loader>
            </div>
            <div v-else>
              <div class="row">
                <div class="col-md-12 mb-3">
                  <h5>{{ $t('Note/Terms and Conditions') }}</h5>
                </div>
                <div class="col-md-12">
                  <div class="data-view-box mb-3">
                    <div>
                      <p>{{ quotation.terms!=null?quotation.terms:'' }}</p>
                    </div>
                  </div>
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

  import DefaultLayout from '@/layouts/DefaultLayout.vue'
  import {ref, reactive, onMounted, watch} from 'vue';
  import { Form } from 'vee-validate'
  import * as yup from 'yup';
  import BeatLoader from 'vue-spinner/src/BeatLoader.vue'
  import ClipLoader from 'vue-spinner/src/ClipLoader.vue'
  import { useAuthStore } from '@/stores/auth';

  import {useRoute} from "vue-router";

  const route = useRoute();
  const slack = route.params.slack;
  const is_loading = ref(false);
  const quotation = ref([]);
  const isDataLoaded = ref(false);
  const initialState = {
    server_messages: {
      type: "",
      messages: "",
    },
    is_submitting: false,
    invoice_slack: '',
  };

  const form = reactive({ ...initialState });
  const authStore = useAuthStore();

  const AsyncQuotationProduct = defineAsyncComponent(() => import('@/components/quotation/QuotationProduct.vue'));

  onMounted(() => {
    getQuotation();
    
  });

  async function getQuotation(){
    is_loading.value = true;
    await axios.get('/api/v2/quotation', { params : {
        slack : slack,
      } })
      .then( (response) => {
      quotation.value = response.data.data;
      // console.log('quotation.value.converted_invoice_slack =', quotation.value.converted_invoice_slack);  
      form.invoice_slack = quotation.value.converted_invoice_slack;
      // console.log(form.invoice_slack);
      is_loading.value = false;
      isDataLoaded.value = true;
    })
    .catch((error) => {
      form.server_messages.type = "error";
      form.server_messages.messages = error;
      is_loading.value = false;
      console.log(error);
    });

  }

  async function quotationToInvoice(){
    is_loading.value = true;
    form.is_submitting = true;
    await axios.get('/api/quotation_to_invoice', { params : {
        slack : slack,
      } })
      .then( (response) => {

        if (response.data.status_code == 200) {
          toast.success(response.data.msg);
          console.log(' response.data.data.invoice =', response.data.data.invoice);
          form.invoice_slack = response.data.data.invoice.slack;
          form.server_messages.messages = '';
        } else {
          try {
            form.server_messages.type = "error";
            form.server_messages.messages = JSON.parse(response.data.msg);
          } catch (err) {
            form.server_messages.type = "error";
            form.server_messages.messages = response.data.msg;
          }
          form.is_submitting = false;
        }
      is_loading.value = false;
      isDataLoaded.value = true;
      form.is_submitting = false;
    })
    .catch((error) => {
      form.is_submitting = false;
      form.server_messages.type = "error";
      form.server_messages.messages = error;
      is_loading.value = false;
      console.log(error);
    });

  }

  function viewInvoice() {
    const routeData = router.resolve('/invoice/' + form.invoice_slack);
    window.open(routeData.href, '_blank');
  }

</script>