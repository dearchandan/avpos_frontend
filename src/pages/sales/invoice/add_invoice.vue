<template>
    <DefaultLayout>

        <template v-slot:subheader>
            <div class="header-nav-wrap">
                <div class="row align-items-center">
                    <div class="col-auto">
                        <div class="header-back-link">
                            <router-link class="text-primary" to="/invoices" ><Icon icon="fa6-solid:chevron-left"  /> {{ $t('Invoices') }}</router-link>
                        </div>
                    </div>
                    <div class="col-auto">
                        <h5 class="fw-bold" v-if="slack!='' && slack!= undefined">{{ $t('Update Invoice') }}</h5>
                        <h5 class="fw-bold" v-else>{{ $t('Add Invoice') }}</h5>
                    </div>
                </div>
            </div>
        </template>

        <div class="content">
            <AsyncAddInvoice  />
        </div>
     </DefaultLayout>
</template>

<script setup>
import {useRoute} from "vue-router";
const AsyncAddInvoice = defineAsyncComponent(() => import('@/components/invoice/AddInvoice.vue'))
const route = useRoute();
const slack = route.params.slack;


</script>