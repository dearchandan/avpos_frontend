<template>
    <DefaultLayout>

        <template v-slot:subheader>
            <div class="header-nav-wrap">
                <div class="row align-items-center">
                    <div class="col-auto">
                        <div class="header-back-link">
                            <router-link class="text-primary" to="/products" ><Icon icon="fa6-solid:chevron-left"  /> {{ $t('Products') }}</router-link>
                        </div>
                    </div>
                    <div class="col-auto">
                        <h5 class="fw-bold" v-if="slack == undefined || slack == ''">{{ $t('Add Product') }}</h5>
                        <h5 class="fw-bold" v-else>{{ $t('Edit Product') }}</h5>
                    </div>
                </div>
            </div>
        </template>

        <div class="content">

            <AsyncAddProduct />

        </div>
     </DefaultLayout>
</template>

<script setup>
import {ref, reactive, onMounted, defineAsyncComponent } from 'vue';

import {useRoute} from "vue-router";
const route = useRoute();
const slack = route.params.slack;

const AsyncAddProduct = defineAsyncComponent(
    () => import('@/components/product/AddProduct.vue')
)
</script>