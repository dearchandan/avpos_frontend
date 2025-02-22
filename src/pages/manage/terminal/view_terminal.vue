<template>
    <DefaultLayout>

        <template v-slot:subheader>
            <div class="header-nav-wrap">
                <div class="row align-items-center">
                    <div class="col-auto">
                        <div class="header-back-link">
                            <router-link class="text-primary" to="/terminals" ><Icon icon="fa6-solid:chevron-left"  /> {{ $t('Terminals') }}</router-link>
                        </div>
                    </div>
                    <div class="col-auto">
                        <h5 class="fw-bold">{{ terminal.terminal_name  }} </h5>
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
            
            <ListingSkeleton v-if="is_loading" />            
              
            <div v-else class="row">
                <div class="col-12">
                    <div class="card">
                        <!--  order  -->
                        
                        <div class="row">
                            <div class="col-md-4 col-lg-3">
                                <div class=" ">
                                    <div class="card">
                                        <div class="d-flex align-items-start flex-column box-content">
                                            <div class="p-2 theme-color-blue">
                                                {{ $t("Total No. of Orders") }}
                                            </div>
                                            <div class="mt-auto p-2">
                                                <span class="text-headline">
                                                    <h4 class="theme-color-blue">{{ dashboard_data.total_order_count }}</h4>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-4 col-lg-3">
                                <div class=" ">
                                    <div class="card">
                                        <div class="d-flex align-items-start flex-column box-content">
                                            <div class="p-2 theme-color-blue">
                                                {{ $t("Total Order Amount") }}
                                            </div>
                                            <div class="mt-auto p-2">
                                                <span class="text-headline">
                                                    <h4 class="theme-color-blue">{{ parseFloat(dashboard_data.total_order_amount).toFixed(2) }} {{ currency_symbol }}</h4>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-4 col-lg-3">
                                <div class=" ">
                                    <div class="card">
                                        <div class="d-flex align-items-start flex-column box-content">
                                            <div class="p-2 theme-color-blue">
                                                {{ $t("Today's No. of Orders") }}
                                            </div>
                                            <div class="mt-auto p-2">
                                                <span class="text-headline">
                                                    <h4 class="theme-color-blue">{{ dashboard_data.todays_total_order_count }}</h4>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-4 col-lg-3">
                                <div class=" ">
                                    <div class="card">
                                        <div class="d-flex align-items-start flex-column box-content">
                                            <div class="p-2 theme-color-blue">
                                                {{ $t("Today's Order Amount") }}
                                            </div>
                                            <div class="mt-auto p-2">
                                                <span class="text-headline">
                                                    <h4 class="theme-color-blue">{{ parseFloat(dashboard_data.todays_total_order_amount).toFixed(2) }} {{ currency_symbol }}</h4>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <!--  invoice  -->
                            <div class="col-md-4 col-lg-3">
                                <div class=" ">
                                    <div class="card">
                                        <div class="d-flex align-items-start flex-column box-content">
                                            <div class="p-2 theme-color-blue">
                                                {{ $t("Order on Hold") }}
                                            </div>
                                            <div class="mt-auto p-2">
                                                <span class="text-headline">
                                                    <h4 class="theme-color-blue">{{ dashboard_data.hold_total_order_count }}</h4>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-4 col-lg-3">
                                <div class=" ">
                                    <div class="card">
                                        <div class="d-flex align-items-start flex-column box-content">
                                            <div class="p-2 theme-color-blue">
                                                {{ $t("Orders In Kitchen") }}
                                            </div>
                                            <div class="mt-auto p-2">
                                                <span class="text-headline">
                                                    <h4 class="theme-color-blue">{{ dashboard_data.kitchen_total_order_count }}</h4>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-4 col-lg-3">
                                <div class=" ">
                                    <div class="card">
                                        <div class="d-flex align-items-start flex-column box-content">
                                            <div class="p-2 theme-color-blue">
                                                {{ $t("Total No. of Return Orders") }}
                                            </div>
                                            <div class="mt-auto p-2">
                                                <span class="text-headline">
                                                    <h4 class="theme-color-blue">{{ dashboard_data.total_order_return_count }}</h4>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-4 col-lg-3">
                                <div class=" ">
                                    <div class="card">
                                        <div class="d-flex align-items-start flex-column box-content">
                                            <div class="p-2 theme-color-blue">
                                                {{ $t("Total Return Order Amount") }}
                                            </div>
                                            <div class="mt-auto p-2">
                                                <span class="text-headline">
                                                    <h4 class="theme-color-blue">{{ parseFloat(dashboard_data.total_order_return_amount).toFixed(2) }} {{ currency_symbol }}</h4>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-4 col-lg-3">
                                <div class=" ">
                                    <div class="card">
                                        <div class="d-flex align-items-start flex-column box-content">
                                            <div class="p-2 theme-color-blue">
                                                {{ $t("Today's No. of Return Orders") }}
                                            </div>
                                            <div class="mt-auto p-2">
                                                <span class="text-headline">
                                                    <h4 class="theme-color-blue">{{ dashboard_data.todays_total_order_return_count }}</h4>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-4 col-lg-3">
                                <div class=" ">
                                    <div class="card">
                                        <div class="d-flex align-items-start flex-column box-content">
                                            <div class="p-2 theme-color-blue">
                                                {{ $t("Today's Return Order Amount") }}
                                            </div>
                                            <div class="mt-auto p-2">
                                                <span class="text-headline">
                                                    <h4 class="theme-color-blue">
                                                        {{ parseFloat(dashboard_data.todays_total_order_return_amount).toFixed(2) }} {{ currency_symbol }}
                                                    </h4>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                        </div>
                    </div>
                </div>
            </div>

            <div class="row" v-if="terminal">
                <div :class="[ terminal && terminal.users && terminal.users.length > 0 ?'col-md-8':'col-md-12' ] ">
                    <div class="card">
                        <div v-if="terminal == ''">
                            <beat-loader color="gray" :size="'15px'" class="pt-2 pe-2">  </beat-loader>
                        </div>
                        <div v-else>
                            <div class="row">
                              <div class="col-md-4">
                                  <div class="data-view-box mb-3">
                                      <div class="item">
                                          <b>{{ $t('Terminal Login Code') }}:</b>
                                          {{ terminal.terminal_login_code }}
                                      </div>
                                  </div>
                              </div>
                              <div class="col-md-4">
                                  <div class="data-view-box mb-3">
                                      <div class="item">
                                          <b>{{ $t('Name') }}:</b>
                                          {{ terminal.terminal_name }}
                                      </div>
                                  </div>
                              </div>
                              <div class="col-md-4">
                                  <div class="data-view-box mb-3">
                                      <div class="item">
                                        <b>{{ $t('Terminal Mode') }}:</b>
                                        <span v-if="terminal.type==1">{{ $t('Online') }}</span>
                                        <span v-else>{{ $t('Offline') }}</span>
                                      </div>
                                  </div>
                              </div>
                              <div class="col-md-4">
                                  <div class="data-view-box mb-3">
                                      <div class="item">
                                          <b>{{ $t('Branch') }}:</b>
                                          {{ terminal.branch.name }}
                                      </div>
                                  </div>
                              </div>
                              <div class="col-md-4">
                                  <div class="data-view-box mb-3">
                                      <div class="item">
                                        <b>{{ $t('Terminal Type') }}:</b>
                                        <span v-if="terminal.terminal_type==1">Open</span>
                                        <span v-else>Restricted</span>
                                      </div>
                                  </div>
                              </div>
                              <div class="col-md-4">
                                <div class="data-view-box mb-3">
                                  <div class="item">
                                    <b>{{ $t('Created By') }}:</b>
                                    {{ terminal.created_by.name }}
                                  </div>
                                </div>
                              </div>
                              <div class="col-md-4">
                                <div class="data-view-box mb-3">
                                  <div class="item">
                                    <b>{{ $t('Created At') }}:</b>
                                    {{ terminal.created_at_label }}
                                  </div>
                                </div>
                              </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-md-4" v-if="terminal.users && terminal.users.length">
                  <div class="card">
                    <h2>{{ $t('Assigned Users') }}</h2>
                    <div class="data-view-box mb-3" v-for="(user,branch_index) in terminal.users">
                      <div class="item">
                        <b>{{ user.user.name }}</b>
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

const auth = useAuthStore();
const route = useRoute();
const slack = route.params.slack;
const currency_symbol = computed(() => {
  return auth.user.currency.symbol;
});

const is_loading = ref(false);
const terminal = ref([]);
const dashboard_data = ref([]);

const initialState = {
      server_messages: {
        type: "",
        messages: "",
      },
};

const form = reactive({ ...initialState });

onMounted(() => {
    getTerminal();
    getTerminalDashboardData();
});

async function getTerminal(){

    is_loading.value = true;

    await axios.get('/api/terminal', { params : {
            slack : slack,
        } }).then( (response) => {
    
        terminal.value = response.data.data;
        is_loading.value = false;
        
    }).catch((error) => {
        form.server_messages.type = "error";
        form.server_messages.messages = error;
        is_loading.value = false;
        console.log(error);
    });
}

async function getTerminalDashboardData(){
    is_loading.value = true;
    await axios.get('/api/terminal/dashboard_data', { params : {
            slack : slack,
        } }).then( (response) => {
        dashboard_data.value = response.data.data;
        is_loading.value = false;
    }).catch((error) => {
        form.server_messages.type = "error";
        form.server_messages.messages = error;
        is_loading.value = false;
        console.log(error);
    });
}


</script>