<template>
  <DefaultLayout>

    <template v-slot:subheader>
      <div class="header-nav-wrap">
        <div class="row align-items-center">
          <div class="col-auto">
            <div class="header-back-link">
              <router-link class="text-primary" to="/inventory_counts" ><Icon icon="fa6-solid:chevron-left"  /> {{ $t('Inventory Counts') }}</router-link>
            </div>
          </div>
          <div class="col-auto">
            <h5 class="fw-bold">#{{ inventory_count.reference_no  }} </h5>
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

      <div class="row" v-if="inventory_count!=null">
        <div class="col-md-12">
          <div class="card">
            <div v-if="inventory_count == ''">
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
                      <b>{{ $t('Reference No.') }}:</b>
                      {{ inventory_count.reference_no }}
                    </div>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="data-view-box mb-3">
                    <div class="item">
                      <b>{{ $t('Created At') }}:</b>
                      {{ inventory_count.created_at_label }}
                    </div>
                  </div>
                </div>
                <div class="col-md-3">
                    <div class="data-view-box mb-3">
                      <div class="item">
                        <b>{{ $t('Completed At') }}:</b>
                        {{ inventory_count.completed_at_label }}
                      </div>
                    </div>
                  </div>
               
                <div class="col-md-3">
                  <div class="data-view-box mb-3">
                    <div class="item">
                      <b>{{ $t('Status') }}:</b>
                      <span v-if="inventory_count.status==0" class="badge badge-primary">{{ $t('Draft') }}</span>
                      <span v-if="inventory_count.status==1" class="badge badge-success">{{ $t('Completed') }}</span>
                    </div>
                  </div>
                </div>
              
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <AsyncInventoryCountProduct v-if="isDataLoaded" :inventory_count="inventory_count"/>
      </div>

      <div class="row" v-if="inventory_count!=null && inventory_count.terms!=null">
        <div class="col-md-12">
          <div class="card">
            <div v-if="inventory_count == ''">
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
                      <p>{{ inventory_count.terms!=null?inventory_count.terms:'' }}</p>
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
  const inventory_count = ref([]);
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

  const AsyncInventoryCountProduct = defineAsyncComponent(() => import('@/components/inventory_count/InventoryCountProduct.vue'));

  onMounted(() => {
    getInventoryCount();
  });

  async function getInventoryCount(){
    is_loading.value = true;
    await axios.get('/api/v2/inventory_count', { params : {
        slack : slack,
      } }).then( (response) => {
      inventory_count.value = response.data.data;
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