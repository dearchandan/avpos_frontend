<template>
    <DefaultLayout>

        <template v-slot:subheader>
            <div class="header-nav-wrap">
                <div class="row align-items-center">
                    <div class="col-auto">
                        <div class="header-back-link">
                            <router-link class="text-primary" to="/customer_displays" ><Icon icon="fa6-solid:chevron-left"  /> {{ $t('CDSs') }}</router-link>
                        </div>
                    </div>
                    <div class="col-auto">
                        <h5 class="fw-bold">{{ customer_display.name  }} </h5>
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
                        <div v-if="customer_display == ''">
                            <beat-loader color="gray" :size="'15px'" class="pt-2 pe-2">  </beat-loader>
                        </div>
                        <div v-else>
                            <div class="row">
                              <div class="col-md-3">
                                  <div class="data-view-box mb-3">
                                      <div class="item">
                                          <b>{{ $t('CDS Name') }}:</b>
                                          {{ customer_display.name }}
                                      </div>
                                  </div>
                              </div>
                              <div class="col-md-3">
                                  <div class="data-view-box mb-3">
                                      <div class="item">
                                          <b>{{ $t('Activation Code') }}</b>
                                          {{ customer_display.activation_code }}
                                      </div>
                                  </div>
                              </div>
                              <div class="col-md-3">
                                  <div class="data-view-box mb-3">
                                      <div class="item">
                                          <b>{{ $t('Terminals') }}</b>
                                          {{ customer_display.terminal.terminal_name }}
                                      </div>
                                  </div>
                              </div>
                              <div class="col-md-3">
                                <div class="data-view-box mb-3">
                                  <div class="item">
                                    <b>{{ $t('Created At') }}:</b>
                                    {{ customer_display.created_at_label }}
                                  </div>
                                </div>
                              </div>
                              <div class="col-md-3">
                                <div class="data-view-box mb-3">
                                  <div class="item">
                                    <b>{{ $t('Created At') }}:</b>
                                    {{ customer_display.updated_at_label }}
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
import VTextInput from '@/components/common/VTextInput.vue' 



import {useRoute} from "vue-router";
const route = useRoute();
const slack = route.params.slack;


const is_loading = ref(false);
const customer_display = ref([]);
const categories = ref([]);

const initialState = {
      server_messages: {
        type: "",
        messages: "",
      },
};

const form = reactive({ ...initialState });

getCustomerDisplay();

async function getCustomerDisplay(){

    is_loading.value = true;

    await axios.get('/api/customer_display', { params : {
            slack : slack,
        } }).then( (response) => {
    
        customer_display.value = response.data.data.customer_display;
        categories.value = response.data.data.categories;
        is_loading.value = false;
    }).catch((error) => {
        form.server_messages.type = "error";
        form.server_messages.messages = error;
        is_loading.value = false;
        console.log(error);
    });

}
</script>