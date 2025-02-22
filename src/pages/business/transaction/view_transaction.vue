<template>
    <DefaultLayout>

        <template v-slot:subheader>
            <div class="header-nav-wrap">
                <div class="row align-items-center">
                    <div class="col-auto">
                        <div class="header-back-link">
                            <router-link class="text-primary" to="/transactions" ><Icon icon="fa6-solid:chevron-left"  /> {{ $t('Transactions') }}</router-link>
                        </div>
                    </div>
                    <div class="col-auto">
                        <h5 class="fw-bold">{{ transaction.amount  }} <small class="text-muted">{{ currency_symbol  }}</small>  </h5>
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
                <div class="col-md-12">
                    <div class="card">
                        <div v-if="transaction == ''">
                            <beat-loader color="gray" :size="'15px'" class="pt-2 pe-2">  </beat-loader>
                        </div>
                        <div v-else>
                            <div class="row">
                              <div class="col-md-4">
                                  <div class="data-view-box mb-3">
                                      <div class="item">
                                          <b>{{ $t('Transaction Code') }}:</b>
                                          {{ transaction.code }}
                                      </div>
                                  </div>
                              </div>
                              <div class="col-md-4">
                                  <div class="data-view-box mb-3">
                                      <div class="item">
                                          <b>{{ $t('Branch Transaction No') }}:</b>
                                          {{ transaction.branch_transaction_number }}
                                      </div>
                                  </div>
                              </div>
                              <div class="col-md-4">
                                  <div class="data-view-box mb-3">
                                      <div class="item">
                                          <b>{{ $t('Transaction Type') }}:</b>
                                          {{ transaction.type }}
                                      </div>
                                  </div>
                              </div>
                              <div class="col-md-4">
                                  <div class="data-view-box mb-3">
                                      <div class="item">
                                          <b>{{ $t('Transaction Amount') }}:</b>
                                          {{ transaction.amount }}
                                      </div>
                                  </div>
                              </div>
                              <div class="col-md-4">
                                  <div class="data-view-box mb-3">
                                      <div class="item">
                                          <b>{{ $t('Account') }}:</b>
                                          {{ transaction.account.name }}
                                      </div>
                                  </div>
                              </div>
                              <div class="col-md-4">
                                  <div class="data-view-box mb-3">
                                      <div class="item">
                                          <b>{{ $t('Payment Method') }}:</b>
                                          {{ transaction.payment_method_name }}
                                      </div>
                                  </div>
                              </div>
                              <div class="col-md-4">
                                  <div class="data-view-box mb-3">
                                      <div class="item">
                                          <b>{{ $t('Bill To') }}:</b>
                                          {{ transaction.bill_to }}
                                      </div>
                                  </div>
                              </div>
                              <div class="col-md-4">
                                  <div class="data-view-box mb-3">
                                      <div class="item">
                                          <b>{{ $t('Bill To Name') }}:</b>
                                          {{ transaction.bill_to_name }}
                                      </div>
                                  </div>
                              </div>
                              <div class="col-md-4">
                                  <div class="data-view-box mb-3">
                                      <div class="item">
                                          <b>{{ $t('Bill To Contact') }}:</b>
                                          {{ transaction.bill_to_contact }}
                                      </div>
                                  </div>
                              </div>
                              <div class="col-md-4">
                                  <div class="data-view-box mb-3">
                                      <div class="item">
                                          <b>{{ $t('Bill To Address') }}:</b>
                                          {{ transaction.bill_to_address }}
                                      </div>
                                  </div>
                              </div>
                              <div class="col-md-4">
                                <div class="data-view-box mb-3">
                                  <div class="item">
                                    <b>{{ $t('Created By') }}:</b>
                                    {{ transaction.created_by.name }}
                                  </div>
                                </div>
                              </div>
                              <div class="col-md-4">
                                <div class="data-view-box mb-3">
                                  <div class="item">
                                    <b>{{ $t('Created At') }}:</b>
                                    {{ transaction.created_at_label }}
                                  </div>
                                </div>
                              </div>
                              <div class="col-md-4">
                                <div class="data-view-box mb-3">
                                  <div class="item">
                                    <b>{{ $t('Note') }}:</b>
                                    {{ transaction.notes }}
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
import {ref, reactive, onMounted } from 'vue';
import { Form } from 'vee-validate'
import * as yup from 'yup';
import BeatLoader from 'vue-spinner/src/BeatLoader.vue'
import ClipLoader from 'vue-spinner/src/ClipLoader.vue'
import { useAuthStore } from '@/stores/auth';


import {useRoute} from "vue-router";
const route = useRoute();
const slack = route.params.slack;

const auth = useAuthStore();
const currency_symbol = computed(() => {
  return auth.user.currency.symbol;
})

const is_loading = ref(false);
const transaction = ref([]);

const initialState = {
      server_messages: {
        type: "",
        messages: "",
      },
};

const form = reactive({ ...initialState });

getTransaction();

async function getTransaction(){

    is_loading.value = true;

    await axios.get('/api/transaction', { params : {
            slack : slack,
        } }).then( (response) => {
    
        transaction.value = response.data.data;
        is_loading.value = false;
        
    }).catch((error) => {
        form.server_messages.type = "error";
        form.server_messages.messages = error;
        is_loading.value = false;
        console.log(error);
    });

}
</script>