<template>
    <div  class="header-nav-wrap">
        <div class="row align-items-center">
            <div class="col">
                <div class="navwrap" data-simplebar>
                    <nav>
                        <ul>
                          <li :class="path == '/rent_receipts' ? 'active' : ''"><router-link to="/rent_receipts">{{ $t("Rent Receipts") }}</router-link></li>
                          <li v-if="authStore.isMerchant" :class=" path == '/rent_receipt_settings' ? 'active' : ''"><router-link to="/rent_receipt_settings">{{ $t("Rent Receipt Settings") }}</router-link></li>
                          <li v-if="authStore.isUser" :class=" path == '/rent_receipt_users' ? 'active' : ''"><router-link to="/rent_receipt_users">{{ $t("Rent Receipt Users") }}</router-link></li>
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