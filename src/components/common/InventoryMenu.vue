<template>
    <div  class="header-nav-wrap">
        <div class="row align-items-center">
            <!-- <div class="col-auto">
                <div class="header-back-link">
                    <a href="#">
                        <svg width="5" height="8" viewBox="0 0 5 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 7.37109L1 3.99995L4 0.62881" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        {{ $t("Back") }}
                    </a>
                </div>
            </div> -->
            <div class="col">
                <div class="navwrap" data-simplebar>
                    <nav>
                        <ul>
                            <li v-if="isAuthorized('SM_PRODUCT')" :class=" path == '/products' ? 'active' : ''"><router-link to="/products">{{ $t("Products") }}</router-link></li>
                            <li v-if="isAuthorized('SM_CATEGORY')" :class=" path == '/categories' ? 'active' : ''"><router-link to="/categories">{{ $t("Categories") }}</router-link></li>
                            <li v-if="isAuthorized('SM_INGREDIENT') && authStore.user.merchant.layout==1" :class=" path == '/ingredients' ? 'active' : ''"><router-link to="/ingredients">{{ $t("Ingredients") }}</router-link></li>
                            <li v-if="isAuthorized('SM_MODIFIER')" :class=" path == '/modifiers' ? 'active' : ''"><router-link to="/modifiers">{{ $t("Modifiers") }}</router-link></li>
                            <!-- <li v-if="isAuthorized('SM_COMBO')" :class=" path == '/combos' ? 'active' : ''"><router-link to="/combos">{{ $t("Combos") }}</router-link></li> -->
                            <!-- <li v-if="isAuthorized('SM_VARIANT')" :class=" path == '/variants' ? 'active' : ''"><router-link to="/variants">{{ $t("Variants") }}</router-link></li> -->
                            <li v-if="isAuthorized('SM_DISCOUNT')" :class=" path == '/discounts' ? 'active' : ''"><router-link to="/discounts">{{ $t("Discounts") }}</router-link></li>
                            <li v-if="isAuthorized('SM_STOCK_TRANSFER') && branch_count > 1" :class=" path == '/stock_transfers' ? 'active' : ''"><router-link to="/stock_transfers">{{ $t("Stock Transfer") }}</router-link></li>
                            <li v-if="isAuthorized('SM_STOCK_ADJUSTMENT')" :class=" path == '/stock_adjustments' ? 'active' : ''"><router-link to="/stock_adjustments">{{ $t("Stock Adjustment") }}</router-link></li>
                          <li :class=" path == '/multiple_prices' ? 'active' : ''"><router-link to="/multiple_prices">{{ $t("Multiple Prices") }}</router-link></li>
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

const branch_count = computed(() => {
    return authStore.user.branches.length;
})
</script>