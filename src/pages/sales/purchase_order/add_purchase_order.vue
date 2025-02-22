<template>
    <DefaultLayout>

        <template v-slot:subheader>
            <div class="header-nav-wrap">
                <div class="row align-items-center">
                    <div class="col-auto">
                        <div class="header-back-link">
                            <router-link class="text-primary" to="/purchase_orders" ><Icon icon="fa6-solid:chevron-left"  /> {{ $t('Purchase Orders') }}</router-link>
                        </div>
                    </div>
                    <div class="col-auto">
                        <h5 class="fw-bold" v-if="slack!='' && slack!= undefined">{{ $t('Update Purchase Order') }}</h5>
                        <h5 class="fw-bold" v-else>{{ $t('Add Purchase Order') }}</h5>
                    </div>
                </div>
            </div>
        </template>

        <div class="content">
            <AsyncAddPurchaseOrder  />
        </div>
     </DefaultLayout>
</template>

<script setup>
import {useRoute} from "vue-router";
const AsyncAddPurchaseOrder = defineAsyncComponent(
    () => import('@/components/purchase_order/AddPurchaseOrder.vue')
)

const route = useRoute();
const slack = route.params.slack;
</script>