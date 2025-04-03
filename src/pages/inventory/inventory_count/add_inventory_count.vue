<template>
    <DefaultLayout>

        <template v-slot:subheader>
            <div class="header-nav-wrap">
                <div class="row align-items-center">
                    <div class="col-auto">
                        <div class="header-back-link">
                            <router-link class="text-primary" to="/inventory_counts" ><Icon icon="fa6-solid:chevron-left"  /> {{ $t('Inventory Counts') }}</router-link>
                        </div>
                    </div>
                    <div class="col-auto">
                        <h5 class="fw-bold" v-if="slack!='' && slack!= undefined">{{ $t('Update Inventory Count') }}</h5>
                        <h5 class="fw-bold" v-else>{{ $t('Add Inventory Count') }}</h5>
                    </div>
                </div>
            </div>
        </template>

        <div class="content">
            <AsyncAddInventoryCount  />
        </div>
     </DefaultLayout>
</template>

<script setup>
import {useRoute} from "vue-router";
const AsyncAddInventoryCount = defineAsyncComponent(
    () => import('@/components/inventory_count/AddInventoryCount.vue')
)

const route = useRoute();
const slack = route.params.slack;
</script>