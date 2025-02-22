<template>
    <div  class="header-nav-wrap">
        <div class="row align-items-center">
            <div class="col">
                <div class="navwrap" data-simplebar>
                    <nav>
                        <ul>
                            <li :class=" path == '/accounts' ? 'active' : ''"><router-link to="/accounts">{{ $t("Accounts") }}</router-link></li>
                            <li :class=" path == '/transactions' ? 'active' : ''"><router-link to="/transactions" >{{ $t("Transactions") }}</router-link></li>
                            <li :class=" path == '/business_registers' ? 'active' : ''"><router-link to="/business_registers">{{ $t("Business Registers") }}</router-link></li>
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

</script>