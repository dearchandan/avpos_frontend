<template>
    <div  class="header-nav-wrap">
        <div class="row align-items-center">
            <div class="col">
                <div class="navwrap" data-simplebar>
                    <nav>
                        <ul>
                            <li v-if="isAuthorized('SM_TABLE')" :class=" path == '/tables' ? 'active' : ''"><router-link to="/tables">{{ $t("Dining Tables") }}</router-link></li>
                            <li v-if="isAuthorized('SM_KITCHEN_DISPLAY')" :class=" path == '/kitchen_displays' ? 'active' : ''"><router-link to="/kitchen_displays">{{ $t("KDS") }}</router-link></li>
                            <li v-if="isAuthorized('SM_CUSTOMER_DISPLAY')" :class=" path == '/customer_displays' ? 'active' : ''"><router-link to="/customer_displays">{{ $t("CDS") }}</router-link></li>
                            <li v-if="isAuthorized('SM_KITCHEN_NOTIFIER')" :class=" path == '/kitchen_notifier' ? 'active' : ''"><router-link to="/kitchen_notifier">{{ $t("Kitchen Notifier") }}</router-link></li>
                            <li v-if="isAuthorized('SM_RESERVATIONS')" :class=" path == '/reservations' ? 'active' : ''"><router-link to="/reservations">{{ $t("Reservations") }}</router-link></li>
                        </ul>
                </nav>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>

import { computed } from 'vue';
import {useRoute} from "vue-router";
import useGlobalFunctions from '@/composables/global_functions.js';

const route = useRoute();
const path = computed(() =>route.path)

const { isAuthorized } = useGlobalFunctions();

</script>