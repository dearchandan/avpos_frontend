<template>
    <table class="table">
        <thead>
            <tr>
                <th>{{ $t('Product') }}</th>
                <th>{{ $t('Quantity') }}</th>
                <th>{{ $t('Action') }}</th>
            
            </tr>
        </thead>
        <tbody>
            <template v-if="low_stock_products.length" v-for="branch_product in low_stock_products">
                <tr v-if="branch_product.product">
                    <td>{{ branch_product.product.name }} </td>
                    <td>{{ branch_product.quantity }}</td>
                    <td ><a class="btn btn-sm btn-primary" :href="'/product/'+branch_product.product.slack" target="_blank">{{ $t("Refill") }}</a> </td>
                </tr>
            </template>
            <tr v-else>
                <td colspan="3" class="text-center">{{ $t("No Data Found") }}</td>
            </tr>
        </tbody>
    </table>
</template>

<script setup>

    import { useAuthStore } from '@/stores/auth';
    const authStore = useAuthStore();
    
    const currency_symbol = computed(() => {
        return authStore.user.currency.symbol;
    })
    
    const low_stock_products = ref([]);

    const props = defineProps(['data']);  
    low_stock_products.value = props.data;
</script>