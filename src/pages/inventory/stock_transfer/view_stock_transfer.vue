<template>
  <DefaultLayout>

    <template v-slot:subheader>
      <div class="header-nav-wrap">
        <div class="row align-items-center">
          <div class="col-auto">
            <div class="header-back-link">
              <router-link class="text-primary" to="/stock_transfers" ><Icon icon="fa6-solid:chevron-left"  /> {{ $t('Stock Transfers') }}</router-link>
            </div>
          </div>
          <div class="col-auto">
            <h5 class="fw-bold">#{{ stock_transfer.reference_no  }} </h5>
          </div>
        </div>
      </div>
    </template>

    <div class="content" >
      <div class="page-heading">
        <div class="py-3" v-if="form.server_messages.messages != ''">
          <ServerMessage :server_messages="form.server_messages"  />
        </div>
      </div>

      <div class="row" v-if="stock_transfer!=null">
        <div class="col-md-12">
          <div class="card">
            <StockTransferDetailSkeleton v-if="stock_transfer == ''" />
            <div v-else>
              <div class="row">
                <h5 class="section-title pb-3 text-muted">{{ $t('Basic Details') }}:</h5>
                <div class="col-md-3">
                  <div class="data-view-box mb-3">
                    <div class="item">
                      <b>{{ $t('Reference No.') }}:</b>
                      #{{ stock_transfer.reference_no }}
                    </div>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="data-view-box mb-3">
                    <div class="item">
                      <b>{{ $t('From Branch') }}:</b>
                      {{ stock_transfer.from_branch.name }}
                    </div>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="data-view-box mb-3">
                    <div class="item">
                      <b>{{ $t('To Branch') }}:</b>
                      {{ stock_transfer.to_branch.name }}
                    </div>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="data-view-box mb-3">
                    <div class="item">
                      <b>{{ $t('Transfer On') }}:</b>
                      {{ stock_transfer.transfer_at_label }}
                    </div>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="data-view-box mb-3">
                    <div class="item">
                      <b>{{ $t('Status') }}:</b>
                      <span v-if="stock_transfer.status==0" class="badge badge-primary">{{ $t('Pending') }}</span>
                      <span v-if="stock_transfer.status==1" class="badge badge-info">{{ $t('Approval Pending') }}</span>
                      <span v-if="stock_transfer.status==2" class="badge badge-success">{{ $t('Accepted') }}</span>
                      <span v-if="stock_transfer.status==3" class="badge badge-warning">{{ $t('Partial Accepted') }}</span>
                      <span v-if="stock_transfer.status==4" class="badge badge-danger">{{ $t('Rejected') }}</span>
                    </div>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="data-view-box mb-3">
                    <div class="item">
                      <b>{{ $t('Created By') }}:</b>
                      {{ stock_transfer.created_by.name }}
                    </div>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="data-view-box mb-3">
                    <div class="item">
                      <b>{{ $t('Created At') }}:</b>
                      {{ stock_transfer.created_at_label }}
                    </div>
                  </div>
                </div>
                <div class="col-md-12">
                  <div class="data-view-box mb-3">
                    <div class="item">
                      <b>{{ $t('Note') }}:</b>
                      {{ stock_transfer.note!=null?stock_transfer.note:'' }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <AsyncFromStockTransfer v-if="isDataLoaded && authStore.user.branch_id==stock_transfer.from_branch_id" :stock_transfer="stock_transfer"/>
        <AsyncToStockTransfer v-if="isDataLoaded && authStore.user.branch_id==stock_transfer.to_branch_id" :stock_transfer="stock_transfer"/>
      </div>

    

    </div>

    <!-- <StockTransferDetailSkeleton v-else /> -->

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
  
  const stock_transfer = ref([]);
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

  const AsyncFromStockTransfer = defineAsyncComponent(() => import('@/components/stock_transfer/FromStockTransfer.vue'));
  const AsyncToStockTransfer = defineAsyncComponent(() => import('@/components/stock_transfer/ToStockTransfer.vue'));

  onMounted(() => {
    getStockTransfer();
  });

  async function getStockTransfer(){
    await axios.get('/api/stock_transfer', { params : {
        slack : slack,
      } }).then( (response) => {
      stock_transfer.value = response.data.data;
      isDataLoaded.value = true;
    }).catch((error) => {
      form.server_messages.type = "error";
      form.server_messages.messages = error;
      console.log(error);
    });

  }
</script>