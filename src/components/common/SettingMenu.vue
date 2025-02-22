<template>
    <div  class="header-nav-wrap">
        <div class="row align-items-center">
            <div class="col">
                <div class="navwrap" data-simplebar>
                    <nav>
                        <ul>

                            <li v-if="auth_store.isAdmin" :class=" path == '/app_setting' ? 'active' : ''"><router-link to="/app_setting">{{ $t("App Setting") }}</router-link></li>
                            <li :class=" path == '/cashier_setting' ? 'active' : ''"><router-link to="/cashier_setting">{{ $t("Cashier Setting") }}</router-link></li>
                            <li :class=" path == '/branch_setting' ? 'active' : ''"><router-link to="/branch_setting">{{ $t("Branch Setting") }}</router-link></li>
                            <li :class=" path == '/printer_setting' ? 'active' : ''"><router-link to="/printer_setting" class="text-muted">{{ $t("Printer Setting") }}</router-link></li>
                            <li :class=" path == '/cds_setting' ? 'active' : ''"><router-link to="/cds_setting" >{{ $t("CDS Setting") }}</router-link></li>
                            <li :class=" path == '/bulk_import' ? 'active' : ''"><router-link to="/bulk_import">{{ $t("Bulk Import") }}</router-link></li>
                            <li :class=" path == '/measurements' ? 'active' : ''"><router-link to="/measurements">{{ $t("Measurements") }}</router-link></li>
                            <li :class=" path == '/taxes' ? 'active' : ''"><router-link to="/taxes">{{ $t("Taxes") }}</router-link></li>
                            <!-- <li :class=" path == '/greetings' ? 'active' : ''"><router-link to="/greetings" class="text-muted">{{ $t("Greetings") }}</router-link></li> -->
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
const route = useRoute();
const path = computed(() =>route.path)

import { useAuthStore } from '@/stores/auth';
const auth_store = useAuthStore();


</script>