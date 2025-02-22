<template>
    <DefaultLayout>

        <template v-slot:subheader>
            <div class="header-nav-wrap">
                <div class="row align-items-center">
                    <div class="col-auto">
                        <div class="header-back-link">
                            <router-link class="text-primary" to="/combos" ><Icon icon="fa6-solid:chevron-left"  /> {{ $t('Combos') }}</router-link>
                        </div>
                    </div>
                    <div class="col-auto">
                        <h5 class="fw-bold" v-if="slack == undefined || slack == ''">{{ $t('Add Combo') }}</h5>
                        <h5 class="fw-bold" v-else>{{ $t('Edit Combo') }}</h5>
                    </div>
                </div>
            </div>
        </template>
        <div class="content">
            <AsyncAddCombo :combo="combo" :combo_products="combo_products" />
        </div>
    </DefaultLayout>

</template>

<script setup>
import {ref, reactive, onMounted, defineAsyncComponent } from 'vue';

import {useRoute} from "vue-router";
const route = useRoute();
const slack = route.params.slack;
const combo = ref([]);
const combo_products = ref([]);
onMounted(() => {
   getCombo();
});

const AsyncAddCombo = defineAsyncComponent(
    () => import('@/components/combo/AddCombo.vue')
)

async function getCombo(){
    await axios.get('/api/combo', { params : {
        slack : slack,
        } }).then( (response) => {
        combo.value = response.data.data.combo;
        combo_products.value = response.data.data.combo_products
    }).catch((error) => {
        console.log(error);
    });

}
</script>