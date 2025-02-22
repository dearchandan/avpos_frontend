<template>
    <DefaultLayout>

        <template v-slot:subheader>
            <div class="header-nav-wrap">
                <div class="row align-items-center">
                    <div class="col-auto">
                        <div class="header-back-link">
                            <router-link class="text-primary" to="/quotations" ><Icon icon="fa6-solid:chevron-left"  /> {{ $t('Quotations') }}</router-link>
                        </div>
                    </div>
                    <div class="col-auto">
                        <h5 class="fw-bold" v-if="slack!='' && slack!= undefined">{{ $t('Update Quotation') }}</h5>
                        <h5 class="fw-bold" v-else>{{ $t('Add Quotation') }}</h5>
                    </div>
                </div>
            </div>
        </template>

        <div class="content">
            <AsyncAddQuotation  />
        </div>
     </DefaultLayout>
</template>

<script setup>
import {useRoute} from "vue-router";
const AsyncAddQuotation = defineAsyncComponent(
    () => import('@/components/quotation/AddQuotation.vue')
)
const route = useRoute();
const slack = route.params.slack;
</script>