<template>
    <div  class="header-nav-wrap">
        <div class="row align-items-center">
            <div class="col">
                <div class="navwrap" data-simplebar>
                    <nav>
                        <ul>
                            <li :class=" path == '/branches' ? 'active' : ''"><router-link to="/branches">{{ $t("Branches") }}</router-link></li>
                            <li :class=" path == '/users' ? 'active' : ''"><router-link to="/users">{{ $t("Users") }}</router-link></li>
                            <!-- <li :class=" path == '/roles' ? 'active' : ''"><router-link to="/roles">{{ $t("Roles") }}</router-link></li> -->
                            <li :class=" path == '/terminals' ? 'active' : ''"><router-link to="/terminals">{{ $t("Terminals") }}</router-link></li>
                            <li :class=" path == '/customers' ? 'active' : ''"><router-link to="/customers">{{ $t("Customers") }}</router-link></li>
                            <li :class=" path == '/suppliers' ? 'active' : ''"><router-link to="/suppliers">{{ $t("Suppliers") }}</router-link></li>
                            
<!--                            <li :class=" path == '/coupons' ? 'active' : ''"><router-link to="/coupons">{{ $t("Coupons") }}</router-link></li>-->

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