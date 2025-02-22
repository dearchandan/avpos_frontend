<template>
    <div  class="header-nav-wrap">
        <div class="row align-items-center">
            <div class="col">
                <div class="navwrap" data-simplebar>
                    <nav>
                        <ul>
                          <li :class="path == '/vouchers' ? 'active' : ''"><router-link to="/vouchers">{{ $t("Vouchers") }}</router-link></li>
                          <li v-if="authStore.isMerchant" :class=" path == '/voucher_settings' ? 'active' : ''"><router-link to="/voucher_settings">{{ $t("Voucher Settings") }}</router-link></li>
                          <li v-if="authStore.isUser" :class=" path == '/voucher_users' ? 'active' : ''"><router-link to="/voucher_users">{{ $t("Voucher Users") }}</router-link></li>
                        </ul>
                    </nav>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>

import { computed } from 'vue';
import useGlobalFunctions from '@/composables/global_functions.js';
import {useRoute} from "vue-router";
import {useAuthStore} from '@/stores/auth';

const route = useRoute();
const path = computed(() =>route.path)
const authStore = useAuthStore();
const { isAuthorized } = useGlobalFunctions();
</script>