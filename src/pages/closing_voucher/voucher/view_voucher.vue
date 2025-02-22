<template>
  <DefaultLayout>

    <template v-slot:subheader>
      <div class="header-nav-wrap">
        <div class="row align-items-center">
          <div class="col-auto">
            <div class="header-back-link">
              <router-link class="text-primary" to="/vouchers" ><Icon icon="fa6-solid:chevron-left"  /> {{ $t('Vouchers') }}</router-link>
            </div>
          </div>
          <div class="col-auto">
            <h5 class="fw-bold">#{{ voucher.voucher_number  }} </h5>
          </div>
          <div class="col-auto ms-auto">
            <span v-if="voucher.status==0 && authStore.isMerchant" class="me-2">{{ $t('Balance') }}: <b>{{ voucher.balance_amount }}</b></span>
            <button class="btn btn-success btn-text-success ms-2 btn-sm" :disabled="is_loading" v-if="voucher.status==0 && authStore.isMerchant" @click="approve()">
              <clip-loader
                  v-if="form.is_submitting"
                  :color="'white'"
                  :size="'20px'"
                  class="pt-2 pe-2"
              ></clip-loader>
              <span v-if="is_loading">{{ $t('Approving...') }}</span>
              <span v-else>{{ $t('Approve') }}</span>
            </button>
            <a v-if="voucher.status==1" :href="voucher.receipt_link" target="_blank" class="btn btn-light btn-text-primary ms-2 btn-sm">{{ $t('Receipt') }}</a>
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

      <div class="row" v-if="voucher!=null">
        <div class="col-md-12">
          <div class="card">
            <div v-if="voucher == ''">
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
                      <b>{{ $t('Voucher No.') }}:</b>
                      {{ voucher.voucher_number }}
                    </div>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="data-view-box mb-3">
                    <div class="item">
                      <b>{{ $t('Amount') }}:</b>
                      {{ voucher.withdrawal_amount }}
                    </div>
                  </div>
                </div>
                <div class="col-md-3" v-if="authStore.isMerchant">
                  <div class="data-view-box mb-3">
                    <div class="item">
                      <b>{{ $t('Branch') }}:</b>
                      {{ voucher.branch.name }}
                    </div>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="data-view-box mb-3">
                    <div class="item">
                      <b>{{ $t('User') }}:</b>
                      {{ voucher.voucher_user.name }}
                    </div>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="data-view-box mb-3">
                    <div class="item">
                      <b>{{ $t('Date') }}:</b>
                      {{ voucher.voucher_date_label }}
                    </div>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="data-view-box mb-3">
                    <div class="item">
                      <b>{{ $t('Status') }}:</b>
                      <span v-if="voucher.status==0" class="badge badge-primary">{{ $t('Pending') }}</span>
                      <span v-if="voucher.status==1" class="badge badge-success">{{ $t('Approved') }}</span>
                      <span v-if="voucher.status==2" class="badge badge-danger">{{ $t('Rejected') }}</span>
                    </div>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="data-view-box mb-3">
                    <div class="item">
                      <b>{{ $t('Created By') }}:</b>
                      {{ voucher.created_by?.name }}
                    </div>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="data-view-box mb-3">
                    <div class="item">
                      <b>{{ $t('Created At') }}:</b>
                      {{ voucher.created_at_label }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row" v-if="voucher!=null && voucher.note!=null">
        <div class="col-md-12">
          <div class="card">
            <div v-if="voucher == ''">
              <beat-loader color="gray" :size="'15px'" class="pt-2 pe-2">  </beat-loader>
            </div>
            <div v-else>
              <div class="row">
                <div class="col-md-12 mb-3">
                  <h5>{{ $t('Note') }}</h5>
                </div>
                <div class="col-md-12">
                  <div class="data-view-box mb-3">
                    <div>
                      <p>{{ voucher.note!=null?voucher.note:'' }}</p>
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
const voucher = ref([]);
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

onMounted(() => {
  getVoucher();
});

async function getVoucher(){
  is_loading.value = true;
  await axios.get('/api/voucher', { params : {
      slack : slack,
      type : 1,
    } }).then( (response) => {
    voucher.value = response.data.data;
    is_loading.value = false;
    isDataLoaded.value = true;
  }).catch((error) => {
    form.server_messages.type = "error";
    form.server_messages.messages = error;
    is_loading.value = false;
    console.log(error);
  });

}

async function approve(){
  is_loading.value = true;
  var form_data = new FormData();
  form_data.append("slack", slack);
  form_data.append("type", 1);
  await axios.post('/api/voucher/approve', form_data).then( (response) => {
    voucher.value = response.data.data;
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