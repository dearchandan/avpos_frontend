<template>
    <DefaultLayout>

        <template v-slot:subheader>
            <div class="header-nav-wrap">
                <div class="row align-items-center">
                    <div class="col-auto">
                        <div class="header-back-link">
                            <router-link class="text-primary" to="/kitchen_displays" ><Icon icon="fa6-solid:chevron-left"  /> {{ $t('KDSs') }}</router-link>
                        </div>
                    </div>
                    <div class="col-auto">
                        <h5 class="fw-bold">{{ kitchen_display.name  }} </h5>
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
                        <div v-if="kitchen_display == ''">
                            <beat-loader color="gray" :size="'15px'" class="pt-2 pe-2">  </beat-loader>
                        </div>
                        <div v-else>
                            <div class="row">
                              <h5>{{ $t('Basic Details') }}:</h5>
                              <div class="col-md-3">
                                  <div class="data-view-box mb-3">
                                      <div class="item">
                                          <b>{{ $t('KDS Name') }}:</b>
                                          {{ kitchen_display.name }}
                                      </div>
                                  </div>
                              </div>
                              <div class="col-md-3">
                                  <div class="data-view-box mb-3">
                                      <div class="item">
                                          <b>{{ $t('Activation Code') }}</b>
                                          {{ kitchen_display.activation_code }}
                                      </div>
                                  </div>
                              </div>
                              <div class="col-md-3">
                                <div class="data-view-box mb-3">
                                  <div class="item">
                                    <b>{{ $t('Created At') }}:</b>
                                    {{ kitchen_display.created_at_label }}
                                  </div>
                                </div>
                              </div>
                              <div class="col-md-3">
                                <div class="data-view-box mb-3">
                                  <div class="item">
                                    <b>{{ $t('Created At') }}:</b>
                                    {{ kitchen_display.updated_at_label }}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div class="row mt-3">
                              <h5>{{ $t('Categories') }}:</h5>
                              <div class="col-md-3" v-for="(category ,index) in categories">
                                <div class="data-view-box mb-3">
                                  <div class="item">
                                    <b>{{ category.name }}</b>
                                    <span v-if="category.parent_id>0">{{ $t('Sub Category') }}</span>
                                    <span v-else>{{ $t('Main Category') }}</span>
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
const kitchen_display = ref([]);
const categories = ref([]);

const initialState = {
      server_messages: {
        type: "",
        messages: "",
      },
};

const form = reactive({ ...initialState });

getKitchenDisplay();

async function getKitchenDisplay(){

    is_loading.value = true;

    await axios.get('/api/v2/kitchen_display', { params : {
            slack : slack,
        } }).then( (response) => {
    
        kitchen_display.value = response.data.data.kitchen_display;
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