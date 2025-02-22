<template>
  <DefaultLayout>

    <template v-slot:subheader>
      <div class="header-nav-wrap">
        <div class="row align-items-center">
          <div class="col-auto">
            <div class="header-back-link">
              <router-link class="text-primary" to="/invoices" ><Icon icon="fa6-solid:chevron-left"  /> {{ $t('Invoices') }}</router-link>
            </div>
          </div>
          <div class="col-auto">
            <h5 class="fw-bold">#{{ invoice.invoice_number  }} </h5>
          </div>
          <div class="col-auto ms-auto">
            <a href="javascript:;" class="btn btn-primary ms-2 btn-sm" v-if="invoice.status!=1 && invoice.status!=3" data-bs-toggle="modal" @click="openAddPaymentModal()" data-bs-target="#addPaymentModal">{{ $t('Make Payment') }}</a>
            <!--  <a href="javascript:;" class="btn btn-light-warning btn-text-warning ms-2 btn-sm" v-if="invoice.status==1">Return</a>-->
            <button href="javascript:;" @click="openPrintDialog()" class="btn btn-light btn-text-primary ms-2 btn-sm">{{ $t('Print Invoice') }}</button>
            <a :href="invoice.receipt_link" download class="btn btn-light btn-text-primary ms-2 btn-sm">{{ $t('Download Invoice') }}</a>
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
      <div class="row">
        <!-- Invoice Print Rendering Section -->
        <iframe ref="iframeRef" style="display: none;height:1000px;"></iframe>
      </div>

      <div class="row pb-4">
        <div class="col-8">
          <span class="badge badge-warning" v-if="invoice.status == 0"
            >{{ $t("Invoice Status") }} : {{ invoice.invoice_status_text }}</span
          >
          <span class="badge badge-success" v-if="invoice.status == 1"
            >{{ $t("Invoice Status") }} : {{ invoice.invoice_status_text }}</span
          >
          <span class="badge badge-primary" v-if="invoice.status == 2"
            >{{ $t("Invoice Status") }} : {{ invoice.invoice_status_text }} ({{
              invoice.kitchen_status_text
            }})
          </span>
          <span class="badge badge-danger" v-if="invoice.status == 3"
            >{{ $t("Invoice Status") }} : {{ invoice.invoice_status_text }}</span
          >
          <span class="badge badge-secondary " v-if="invoice.status == 4"
            >{{ $t("Invoice Status") }} : {{ invoice.invoice_status_text }} ({{
              invoice.kitchen_status_text
            }})
          </span>
          
        </div>
      </div>
      <div class="row mb-5" v-if="invoice.returned_invoices != ''">
        <div class="accordion" id="accordionExample">
          <div class="accordion-item" v-for="(returned_invoice, index) in invoice.returned_invoices" v-bind:key="index">
            <h2 class="accordion-header" id="headingOne">
              <button
                class="accordion-button fw-bold"
                type="button"
                data-bs-toggle="collapse"
                :data-bs-target="'#ac_' + returned_invoice.returned_invoice_number"
                aria-expanded="true"
                :aria-controls="'ac_' + returned_invoice.returned_invoice_number"
              >
                {{ $t("Returned Invoice") }} #{{
                  returned_invoice.returned_invoice_number
                }}
              </button>
            </h2>
            <div
              :id="'ac_' + returned_invoice.returned_invoice_number"
              class="accordion-collapse collapse show"
              aria-labelledby="headingOne"
              data-bs-parent="#accordionExample"
            >
              <div class="accordion-body pb-5">
                <div class="col-12 py-4">
                  <div class="row">
                    <div class="col-4">
                      {{ $t("Return Date") }}:
                      {{ returned_invoice.date_label }}
                    </div>
                    <div class="col-8 text-end">
                      <a
                        :href="returned_invoice.receipt_link"
                        download
                        class="btn btn-danger btn-xs"
                      >
                        <Icon
                          icon="material-symbols:download"
                          class="fs-4"
                        ></Icon>
                        {{ $t("Download Return Receipt") }}
                      </a>
                    </div>
                  </div>
                </div>
                <div class="col-md-12">
                  <div class="cards">
                    <h5 class="text-muted">{{ $t("Returned Items") }}</h5>
                    <div class="table-responsive mt-3">
                      <table class="table mb-3 table-responsive-data">
                        <thead class="bg-light">
                          <tr>
                            <th>#</th>
                            <th>{{ $t("Product") }}</th>
                            <th>{{ $t("Rate") }}</th>
                            <th>{{ $t("Qty.") }}</th>
                            <th>{{ $t("Subtotal") }}</th>
                            <th>{{ $t("Product Discount") }}</th>
                            <th>{{ $t("Invoice Discount") }}</th>
                            <th>{{ $t("Other Taxes and Fee") }}</th>
                            <th>{{ $t("Tax") }}</th>
                            <th class="text-end">{{ $t("Amount") }}</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="(item, index) in returned_invoice.items">
                            <td>{{ index + 1 }}</td>
                            <td>{{ item.product_name }} </td>
                            <td>{{ getRoundedValue(item.product_price_without_tax) }}</td>
                            <td>{{ getRoundedValue(item.product_quantity) }}</td>
                            <td>{{ getRoundedValue(item.subtotal_after_product_quantity) }}</td>
                            <td>{{ getRoundedValue(item.product_discount_amount) }} </td>
                            <td>{{ getRoundedValue(item.invoice_discount_amount) }} </td>
                            <td>
                              <span v-if="item.additional_fee_amount > 0">{{getRoundedValue(item.additional_fee_amount)}}</span>
                              <span v-if="item.tobacco_tax_amount > 0">{{getRoundedValue(item.tobacco_tax_amount)}}</span>
                            </td>
                            <td>{{ getRoundedValue(item.product_tax_amount) }}</td>
                            <td class="text-end">{{getRoundedValue(item.product_amount)}} </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div class="row justify-content-end">
                      <div class="col-auto">
                        <table class="">
                          <tbody>
                            <tr>
                              <td class="p-2">{{ $t("Subtotal") }}</td>
                              <td class="p-2">
                                {{ getRoundedValue(returned_invoice.subtotal_after_product_discount - product_discount) }}
                              </td>
                            </tr>
                            <tr v-if="returned_invoice.product_discount > 0">
                              <td class="p-2 text-success">
                                {{ $t("Product Discount") }}
                              </td>
                              <td class="p-2">
                                {{
                                  getRoundedValue(
                                    returned_invoice.product_discount
                                  )
                                }}
                              </td>
                            </tr>
                            <tr v-if="returned_invoice.product_discount > 0">
                              <td class="p-2">
                                {{ $t("Subtotal After Product Discount") }}
                              </td>
                              <td class="p-2">
                                {{
                                  getRoundedValue(
                                    returned_invoice.subtotal_after_product_discount
                                  )
                                }}
                              </td>
                            </tr>
                            <tr v-if="returned_invoice.invoice_discount_amount > 0">
                              <td class="p-2 text-success">
                                {{ $t("Invoice Discount") }}
                              </td>
                              <td class="p-2">
                                {{
                                  getRoundedValue(returned_invoice.invoice_discount_amount)
                                }}
                              </td>
                            </tr>
                            <tr v-if="returned_invoice.product_additional_fee > 0">
                              <td class="p-2 text-danger">
                                {{ $t("Additional Fee") }}
                              </td>
                              <td class="p-2">
                                {{
                                  getRoundedValue(returned_invoice.product_additional_fee)
                                }}
                              </td>
                            </tr>
                            <tr v-if="returned_invoice.tobacco_tax > 0">
                              <td class="p-2 text-danger">
                                {{ $t("Tobacco Tax") }}
                              </td>
                              <td class="p-2">
                                {{
                                  getRoundedValue(returned_invoice.tobacco_tax)
                                }}
                              </td>
                            </tr>
                            <tr v-if="returned_invoice.product_tax > 0">
                              <td class="p-2 text-danger">{{ $t("Tax") }}</td>
                              <td class="p-2">
                                {{ getRoundedValue(returned_invoice.product_tax) }}
                              </td>
                            </tr>
                            <tr>
                              <td class="p-2">{{ $t("Grand Total") }}</td>
                              <td class="p-2 fs-5 fw-bold">
                                {{ getRoundedValue(returned_invoice.grand_product_amount) }}
                                {{ currency_symbol }}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-12">
                  {{ $t("Returned Reason") }}:
                  <span
                    class="text-danger"
                    v-if="returned_invoice.reason != null"
                    >{{ returned_invoice.reason }}</span
                  >
                  <span v-else>N/A</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="row" v-if="invoice!=null">
        <div class="col-md-12">
          <div class="card">
            <div v-if="invoice == ''">
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
                      <b>{{ $t('Bill To') }}:</b>
                      {{ invoice.customer_type == 2 ? 'Company' : 'Customer' }}
                    </div>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="data-view-box mb-3">
                    <div class="item">
                      <b>{{ $t('Customer') }}:</b>
                      {{ invoice.customer_name }}
                    </div>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="data-view-box mb-3">
                    <div class="item">
                      <b>{{ $t('Invoice No.') }}:</b>
                      {{ invoice.invoice_number }}
                    </div>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="data-view-box mb-3">
                    <div class="item">
                      <b>{{ $t('Reference No.') }}:</b>
                      {{ invoice.reference_no }}
                    </div>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="data-view-box mb-3">
                    <div class="item">
                      <b>{{ $t('Invoice Date') }}:</b>
                      {{ invoice.invoice_date_label }}
                    </div>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="data-view-box mb-3">
                    <div class="item">
                      <b>{{ $t('Invoice Due Date') }}:</b>
                      {{ invoice.invoice_due_date_label }}
                    </div>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="data-view-box mb-3">
                    <div class="item">
                      <b>{{ $t('Representative') }}:</b>
                      {{ invoice.representative }}
                    </div>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="data-view-box mb-3">
                    <div class="item">
                      <b>{{ $t('Status') }}:</b>
                      <span v-if="invoice.status==0" class="badge badge-primary">{{ $t('Draft') }}</span>
                      <span v-if="invoice.status==1" class="badge badge-success">{{ $t('Paid') }}</span>
                      <span v-if="invoice.status==2" class="badge badge-warning">{{ $t('Partial Paid') }}</span>
                      <div v-if="invoice.status==3">
                        <span v-if="invoice.returned_status==0" class="badge badge-secondary">{{ $t('Partial Returned') }}</span>
                        <span v-if="invoice.returned_status==1" class="badge badge-secondary">{{ $t('Returned') }}</span>
                      </div>

                    </div>
                  </div>
                </div>
                <div class="col-md-3">
                  <!-- <div class="data-view-box mb-3">
                    <div class="item">
                      <b>{{ $t('Created By') }}:</b>
                      {{ invoice.created_by?.name }}
                    </div>
                  </div> -->
                </div>
                <div class="col-md-3">
                  <div class="data-view-box mb-3">
                    <div class="item">
                      <b>{{ $t('Created At') }}:</b>
                      {{ invoice.created_at_label }}
                    </div>
                  </div>
                </div>

                <div class="col-md-12">
                  <b>{{ $t('Invoice Additional Details') }}:</b>
                  <div class=" mb-3">
                    <div class="item">
                      <div class="row mb-3" v-if="invoice.invoice_additional_details != undefined" >
                        <div class="col-6 col-sm-8 col-md-10 mb-2">
                          <div class="row">
                            <div class="col-md-3">
                                <div class="align-items-left">{{ $t('Title') }}</div>
                            </div>
                            <div class="col-md-4">
                              <div class="d-flex align-items-left">{{ $t('Description') }}</div>
                            </div>
                            <div class="col-md-3">
                              <div class="d-flex align-items-right"> {{ $t('Title(Arabic)') }}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="row mb-3" v-for="(details, index) in invoice.invoice_additional_details" :key="index" >
                        <div class="col-6 col-sm-8 col-md-10 mb-2">
                          <div class="row">
                            <div class="col-md-3">
                                <div class="align-items-left" v-if="details.title">{{ details.title }} </div>
                            </div>
                            <div class="col-md-4">
                              <div class="d-flex align-items-left" v-if="details.description">{{ details.description }}</div>
                            </div>
                            <div class="col-md-3">
                              <div class="d-flex align-items-right" v-if="details.title_ar"> {{ details.title_ar }}</div>
                            </div>
                          </div>
                        </div>
                      </div> 
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <AsyncInvoiceProduct v-if="isDataLoaded" :invoice="invoice"/>
      </div>

      <div class="row" v-if="invoice.online_payment_link!=null && invoice.online_payment_link.length>0">
        <div class="col-md-12">
          <div class="card">
            <div v-if="invoice == ''">
              <beat-loader color="gray" :size="'15px'" class="pt-2 pe-2">  </beat-loader>
            </div>
            <div v-else>
              <div class="row">
                <div class="col-auto">
                  <h5>{{ $t('Online Payment Link') }}</h5>
                </div>
                <div class="col-md-12">
                  <table class="table table-condensed">
                    <thead>
                    <tr>
                      <th width="10%" class="text-center">{{ $t('Contact Number') }}</th>
                      <th width="10%" class="text-center">{{ $t('Created Date') }}</th>
                      <th width="10%" class="text-center">{{ $t('Amount') }}</th>
                      <th width="10%" class="text-center">{{ $t('Payment Link') }}</th>
                      <th width="10%" class="text-center">{{ $t('Action') }}</th>
                    </tr>
                    </thead>
                    <tbody>

                    <tr v-if="invoice.online_payment_link.length>0" v-for="(payment_link,index) in invoice.online_payment_link" :key="index">
                      <td class="text-center">{{ payment_link.contact_number }}</td>
                      <td class="text-center">{{ payment_link.created_at_label }}</td>
                      <td class="text-center">{{ payment_link.amount }}</td>
                      <td class="text-center"><a :href="payment_link.payment_link" target="_blank">Click Here</a></td>
                      <td class="text-center">
                        <button type="button" class="btn btn-primary btn-sm" :disabled="form.is_submitting" @click="sendSMS(payment_link.slack)">
                          <clip-loader v-if="form.is_submitting" :color="'white'" :size="'20px'" class="pt-2 pe-2"></clip-loader>
                          <span class="pt-0" v-if="form.is_submitting">{{ $t('Sanding...') }}</span>
                          <span class="pt-0" v-else>{{ $t('Send SMS Again') }}</span>
                        </button>
                      </td>
                    </tr>
                    <tr v-else>
                      <td colspan="8">{{ $t('No Online Link Available') }}</td>
                    </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row" v-if="invoice.invoice_transaction!=null && invoice.invoice_transaction.length>0">
        <div class="col-md-12">
          <div class="card">
            <div v-if="invoice == ''">
              <beat-loader color="gray" :size="'15px'" class="pt-2 pe-2">  </beat-loader>
            </div>
            <div v-else>
              <div class="row">
                <div class="col-auto">
                  <h5>{{ $t('Transactions') }}</h5>
                </div>
                <div class="col-auto ms-auto">
                  <span class="fw-bold ms-3 text-warning" v-if="total_pending_amount>0">{{ $t('Total Pending') }} : {{ total_pending_amount }} SAR</span>
                  <span class="fw-bold ms-3 text-success">Total Paid : {{ total_paid_amount }} SAR</span>
                </div>
                <div class="col-md-12">
                  <table class="table table-condensed">
                    <thead>
                    <tr>
                      <th width="5%">{{ $t('No.') }}</th>
                      <th width="10%" class="text-center">{{ $t('Date') }}</th>
                      <th width="10%" class="text-center">{{ $t('Type') }}</th>
                      <th width="10%" class="text-center">{{ $t('Payment Method') }}</th>
                      <th width="10%" class="text-center">{{ $t('Amount') }}</th>
                      <th width="10%" class="text-center">{{ $t('Created Date') }}</th>
                    </tr>
                    </thead>
                    <tbody>

                    <tr v-if="invoice.invoice_transaction.length>0" v-for="(transaction,index) in invoice.invoice_transaction" :key="index">
                      <td><strong>{{ transaction.branch_transaction_number }}</strong></td>
                      <td class="text-center">{{ transaction.transaction_date }}</td>
                      <td class="text-center">{{ transaction.type }}</td>
                      <td class="text-center">{{ transaction.payment_method_name }}</td>
                      <td class="text-center">{{ transaction.amount }}</td>
                      <td class="text-center">{{ transaction.created_at_label }}</td>
                    </tr>
                    <tr v-else>
                      <td colspan="8">{{ $t('No Transactions Available') }}</td>
                    </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row" v-if="invoice!=null && invoice.terms!=null">
        <div class="col-md-12">
          <div class="card">
            <div v-if="invoice == ''">
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
                      <p>{{ invoice.terms!=null?invoice.terms:'' }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>

    <AsyncAddPayment  :show_add_payment_modal="show_add_payment_modal" :invoice="invoice" :total_paid_amount="total_paid_amount" :total_pending_amount="total_pending_amount" @closeAddPaymentModal="closeAddPaymentModal" />

    <AsyncInvoicePrint />
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
  import { Icon } from '@iconify/vue/dist/iconify.js';
  import useGlobalFunctions from "@/composables/global_functions.js";

  const { getRoundedValue } = useGlobalFunctions();

  const route = useRoute();
  const slack = route.params.slack;
  const is_loading = ref(false);
  const invoice = ref([]);
  const total_paid_amount = ref(0);
  const total_pending_amount = ref(0);
  const isDataLoaded = ref(false);
  const initialState = {
    server_messages: {
      type: "",
      messages: "",
    },
    is_submitting: false,
  };
  const form = reactive({ ...initialState });
  const authStore = useAuthStore();

  const AsyncInvoiceProduct = defineAsyncComponent(() => import('@/components/invoice/InvoiceProduct.vue'));
  const AsyncAddPayment = defineAsyncComponent( () => import('@/components/invoice/AddPayment.vue') );

  onMounted(() => {
    getInvoice();
    loadPDFForPrint();
  });

  async function getInvoice(){
    is_loading.value = true;
    await axios.get('/api/v2/invoice', { params : {
        slack : slack,
      } }).then( (response) => {
      invoice.value = response.data.data;
      let total_paid=0;
      if(response.data.data.invoice_transaction!=null && response.data.data.invoice_transaction.length>0){
        _.forEach(response.data.data.invoice_transaction, (item) => {
          total_paid = parseFloat(total_paid) + parseFloat(item.amount);
        })
      }
      total_paid_amount.value = total_paid.toFixed(2);
      let total_pending = parseFloat(response.data.data.grand_product_amount) - parseFloat(total_paid_amount.value);
      total_pending_amount.value = total_pending.toFixed(2);
      is_loading.value = false;
      isDataLoaded.value = true;
    }).catch((error) => {
      form.server_messages.type = "error";
      form.server_messages.messages = error;
      is_loading.value = false;
      console.log(error);
    });

  }

  //FOR ADD PAYMENT
  const show_add_payment_modal = ref(false);
  function openAddPaymentModal(){
    show_add_payment_modal.value = true;
  }
  function closeAddPaymentModal(){
    show_add_payment_modal.value = false;
    getInvoice();
  }

  async function sendSMS(link_slack){
    form.is_submitting = true;
    await axios.post('/api/invoice/send_sms', {
        slack : link_slack,
      } ).then((response) => {
      if (response.data.status_code == 200) {
        toast.success(response.data.msg);
        form.is_submitting = false;
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

    }).catch((error) => {
      form.server_messages.type = "error";
      form.server_messages.messages = error;
      form.is_submitting = false;
    });
  }
  function downloadInvoice(url)
  {
    const link = document.createElement('a');
    link.href = url;
    link.download = '';
    document.body.appendChild(link);
    //link.click();
    window.open(link, '_blank');
  }
  
        /* Invoice Print Section */

const iframeRef = ref();
async function loadPDFForPrint() {
  await axios
    .get("/api/invoice/print", {
      responseType: "blob",
      params: { slack: slack },
    })
    .then((response) => {
      const blob = new Blob([response.data], { type: "application/pdf" });
      const dataUrl = URL.createObjectURL(blob);
      if (iframeRef.value) {
        iframeRef.value.src = dataUrl;
      }
    });
}

function openPrintDialog() {
  if (iframeRef.value) {
    iframeRef.value.contentWindow.print(); // Trigger print dialog
  }
}
</script>