<template>
  <DefaultLayout>

    <template v-slot:subheader>
      <div class="header-nav-wrap">
        <div class="row align-items-center">
          <div class="col-auto">
            <div class="header-back-link">
              <router-link class="text-primary" to="/purchase_orders" ><Icon icon="fa6-solid:chevron-left"  /> {{ $t('Purchase Orders') }}</router-link>
            </div>
          </div>
          <div class="col-auto">
            <h5 class="fw-bold">#{{ purchase_order.po_number  }} </h5>
          </div>
          <div class="col-auto ms-auto">
            <a :href="purchase_order.receipt_link" target="_blank" class="btn btn-light btn-text-primary ms-2 btn-sm">{{ $t('Print Now') }}</a>
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

      <div class="row" v-if="purchase_order!=null">
        <div class="col-md-12">
          <div class="card">
            <div v-if="purchase_order == ''">
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
                      {{ purchase_order.supplier?.name }}
                    </div>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="data-view-box mb-3">
                    <div class="item">
                      <b>{{ $t('Account') }}:</b>
                      {{ purchase_order.account?.name }}
                    </div>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="data-view-box mb-3">
                    <div class="item">
                      <b>{{ $t('Payment Method') }}:</b>
                      {{ purchase_order.payment_method_name }}
                    </div>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="data-view-box mb-3">
                    <div class="item">
                      <b>{{ $t('PO No.') }}:</b>
                      {{ purchase_order.po_number }}
                    </div>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="data-view-box mb-3">
                    <div class="item">
                      <b>{{ $t('Reference No.') }}:</b>
                      {{ purchase_order.reference_no }}
                    </div>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="data-view-box mb-3">
                    <div class="item">
                      <b>{{ $t('PO Date') }}:</b>
                      {{ purchase_order.po_date_label }}
                    </div>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="data-view-box mb-3">
                    <div class="item">
                      <b>{{ $t('PO Due Date') }}:</b>
                      {{ purchase_order.po_due_date_label }}
                    </div>
                  </div>
                </div>
                <div class="col-md-3" v-if="purchase_order.reporting_user_id>0">
                  <div class="data-view-box mb-3">
                    <div class="item">
                      <b>{{ $t('Reporting Person') }}:</b>
                      {{ purchase_order.reporting_user?.name }}
                    </div>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="data-view-box mb-3">
                    <div class="item">
                      <b>{{ $t('Approval Status') }}:</b>
                      <span v-if="purchase_order.approval_status==0" class="badge badge-primary">{{ $t('Draft') }}</span>
                      <span v-if="purchase_order.approval_status==1" class="badge badge-success">{{ $t('Approved') }}</span>
                      <span v-if="purchase_order.approval_status==2" class="badge badge-danger">{{ $t('Rejected') }}</span>
                      <span v-if="purchase_order.approval_status==3" class="badge badge-warning">{{ $t('Cancel') }}</span>
                    </div>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="data-view-box mb-3">
                    <div class="item">
                      <b>{{ $t('Delivery Status') }}:</b>
                      <span v-if="purchase_order.delivery_status==0" class="badge badge-primary">{{ $t('Undelivered') }}</span>
                      <span v-if="purchase_order.delivery_status==1" class="badge badge-info">{{ $t('Partial Delivered') }}</span>
                      <span v-if="purchase_order.delivery_status==2" class="badge badge-success">{{ $t('Delivered/Closed') }}</span>
                    </div>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="data-view-box mb-3">
                    <div class="item">
                      <b>{{ $t('Created By') }}:</b>
                      {{ purchase_order.created_by?.name }}
                    </div>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="data-view-box mb-3">
                    <div class="item">
                      <b>{{ $t('Created At') }}:</b>
                      {{ purchase_order.created_at_label }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <AsyncPurchaseOrderProduct v-if="isDataLoaded" :purchase_order="purchase_order"/>
      </div>

      <div class="row" v-if="purchase_order!=null && purchase_order.terms!=null">
        <div class="col-md-12">
          <div class="card">
            <div v-if="purchase_order == ''">
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
                      <p>{{ purchase_order.terms!=null?purchase_order.terms:'' }}</p>
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
  const purchase_order = ref([]);
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

  const AsyncPurchaseOrderProduct = defineAsyncComponent(() => import('@/components/purchase_order/PurchaseOrderProduct.vue'));

  onMounted(() => {
    getPurchaseOrder();
  });

  async function getPurchaseOrder(){
    is_loading.value = true;
    await axios.get('/api/v2/purchase_order', { params : {
        slack : slack,
      } }).then( (response) => {
      purchase_order.value = response.data.data;
      is_loading.value = false;
      isDataLoaded.value = true;
    }).catch((error) => {
      form.server_messages.type = "error";
      form.server_messages.messages = error;
      is_loading.value = false;
      console.log(error);
    });

  }
</script>