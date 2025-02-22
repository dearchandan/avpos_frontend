<template>
  <DefaultLayout>

    <template v-slot:subheader>
      <div class="header-nav-wrap">
        <div class="row align-items-center">
          <div class="col-auto">
            <div class="header-back-link">
              <router-link class="text-primary" to="/stock_adjustments" ><Icon icon="fa6-solid:chevron-left"  /> {{ $t('Stock Adjustment') }}</router-link>
            </div>
          </div>
          <div class="col-auto">
            <h5 class="fw-bold">#{{ stock_adjustment.reference_no  }} </h5>
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

      <div class="row" v-if="stock_adjustment!=null">
        <div class="col-md-12">
          <div class="card">
            <StockTransferDetailSkeleton v-if="stock_adjustment == ''" />
            <div v-else>
              <div class="row">
                <h5 class="section-title pb-3 text-muted">{{ $t('Basic Details') }}:</h5>
                <div class="col-md-3">
                  <div class="data-view-box mb-3">
                    <div class="item">
                      <b>{{ $t('Reference No.') }}:</b>
                      #{{ stock_adjustment.reference_no }}
                    </div>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="data-view-box mb-3">
                    <div class="item">
                      <b>{{ $t('Branch') }}:</b>
                      {{ stock_adjustment.branch.name }}
                    </div>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="data-view-box mb-3">
                    <div class="item">
                      <b>{{ $t('Approved On') }}:</b>
                      {{ stock_adjustment.approved_at_label }}
                    </div>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="data-view-box mb-3">
                    <div class="item">
                      <b>{{ $t('Status') }}:</b>
                      <span v-if="stock_adjustment.status==1" class="badge badge-primary">{{ $t('Pending') }}</span>
                      <span v-if="stock_adjustment.status==2" class="badge badge-success">{{ $t('Approved') }}</span>
                      <span v-if="stock_adjustment.status==3" class="badge badge-danger">{{ $t('Rejected') }}</span>
                    </div>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="data-view-box mb-3">
                    <div class="item">
                      <b>{{ $t('Created By') }}:</b>
                      {{ stock_adjustment.created_by.name }}
                    </div>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="data-view-box mb-3">
                    <div class="item">
                      <b>{{ $t('Created At') }}:</b>
                      {{ stock_adjustment.created_at_label }}
                    </div>
                  </div>
                </div>
                <div class="col-md-12">
                  <div class="data-view-box mb-3">
                    <div class="item">
                      <b>{{ $t('Note') }}:</b>
                      {{ stock_adjustment.note!=null?stock_adjustment.note:'' }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <AsyncStockAdjustmentProducts v-if="is_data_loaded" :stock_adjustment="stock_adjustment" :sel_branch_id="stock_adjustment.branch_id"/>
        <!-- <AsyncToStockTransfer v-if="is_data_loaded && authStore.user.branch_id==stock_adjustment.to_branch_id" :stock_adjustment="stock_adjustment"/> -->
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
  const stock_adjustment = ref([]);
  const is_data_loaded = ref(false);
  const initialState = {
    server_messages: {
      type: "",
      messages: "",
    },
    is_submitting: false,
  };

  const form = reactive({ ...initialState });
  const authStore = useAuthStore();

  const AsyncStockAdjustmentProducts = defineAsyncComponent(() => import('@/components/stock_adjustment/StockAdjustmentProducts.vue'));
  // const AsyncToStockTransfer = defineAsyncComponent(() => import('@/components/stock_adjustment/ToStockTransfer.vue'));

  onMounted(() => {
    getStockTransfer();
  });

  async function getStockTransfer(){
    await axios.get('/api/stock_adjustment', { params : {
        slack : slack,
      } }).then( (response) => {
      stock_adjustment.value = response.data.data;
      is_data_loaded.value = true;
    }).catch((error) => {
      form.server_messages.type = "error";
      form.server_messages.messages = error;
      console.log(error);
    });

  }
</script>