<template>
    <DefaultLayout>

        <template v-slot:subheader>
            <InventoryMenu/>
          </template>

        <div class="content">
            <AsyncGenerateBarcode  />
        </div>
     </DefaultLayout>
</template>

<script setup>
import {useRoute} from "vue-router";
const AsyncGenerateBarcode = defineAsyncComponent(
    () => import('@/components/barcode/GenerateBarcode.vue')
)

const route = useRoute();
const slack = route.params.slack;
</script>