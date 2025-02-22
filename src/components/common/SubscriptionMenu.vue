<template>
    <div  class="header-nav-wrap">
        <div class="row align-items-center">
                <div class="col-auto">
                    <div class="header-back-link">
                        <router-link class="text-primary" to="/settings" ><Icon icon="fa6-solid:chevron-left"  /> {{ $t('Settings') }}</router-link>
                    </div>
                </div>
                <div class="col">
                    <div class="navwrap" data-simplebar>
                        <nav>
                        <ul>
                            <li v-if="isAuthorized('SM_SUBSCRIPTION') && authStore.user.merchant.user_subscription==null" :class=" path == '/subscriptions' ? 'active' : ''"><router-link to="/subscriptions">{{ $t("Subscription/Device") }}</router-link></li>
                            <li v-if="isAuthorized('SM_SUBSCRIPTION')" :class=" path == '/my_orders' ? 'active' : ''"><router-link to="/my_orders">{{ $t("My Subscriptions") }}</router-link></li>
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
import { useAuthStore } from '@/stores/auth';
import {useRoute} from "vue-router";

const route = useRoute();
const path = computed(() =>route.path)

const { isAuthorized } = useGlobalFunctions();
const authStore = useAuthStore();
</script>