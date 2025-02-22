<template>
    <div  class="header-nav-wrap">
        <div class="row align-items-center">
            <div class="col">
                <div class="navwrap" data-simplebar>
                    <nav>
                        <ul>
                            <li :class=" path == '/orders' ? 'active' : ''" v-if="isAuthorized('SM_ORDER')"><router-link to="/orders">{{ $t("Orders") }}</router-link></li>
                            <li :class=" path == '/invoices' ? 'active' : ''" v-if="isAuthorized('SM_INVOICE')"><router-link to="/invoices">{{ $t("Invoices") }}</router-link></li>
                            <li :class=" path == '/purchase_orders' ? 'active' : ''" v-if="isAuthorized('SM_PURCHASE_ORDER')"><router-link to="/purchase_orders">{{ $t("Purchases") }}</router-link></li>
                            <li :class=" path == '/quotations' ? 'active' : ''" v-if="isAuthorized('SM_QUOTATION')"><router-link to="/quotations">{{ $t("Quotations") }}</router-link></li>
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
const route = useRoute();
const path = computed(() =>route.path)
const { isAuthorized } = useGlobalFunctions();

</script>