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
                        <h5 class="fw-bold">{{ combo.name }}</h5>
                    </div>
                </div>
            </div>
        </template>
        <div class="content">
            <AsyncComboDetails v-if="isDataLoaded" :combo="combo" :combo_products="combo_products"/>
        </div>
    </DefaultLayout>
</template>

<script setup>

import {ref, reactive, onMounted, defineAsyncComponent } from 'vue';

import {useRoute} from "vue-router";
import BeatLoader from 'vue-spinner/src/BeatLoader.vue'
import ClipLoader from 'vue-spinner/src/ClipLoader.vue'
import { useAuthStore } from '@/stores/auth';

const route = useRoute();
const slack = route.params.slack;
const is_loading = ref(false);
const combo = ref([]);
const combo_products = ref([]);
const isDataLoaded = ref(false);
const initialState = {
    server_messages: {
        type: "",
        messages: "",
    },
};

const form = reactive({ ...initialState });
const authStore = useAuthStore();
const AsyncComboDetails = defineAsyncComponent(() => import('@/components/combo/ComboDetail.vue'));

onMounted(() => {
    getCombo();
});

async function getCombo(){
    is_loading.value = true;
    await axios.get('/api/combo', { params : {
        slack : slack,
        } }).then( (response) => {
        combo.value = response.data.data.combo;
        combo_products.value = response.data.data.combo_products
        is_loading.value = false;
        isDataLoaded.value = true;
    }).catch((error) => {
        form.server_messages.type = "error";
        form.server_messages.messages = error;
        is_loading.value = false;
        console.log(error);
    });

}
</script>