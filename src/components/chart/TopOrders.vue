<template>
    <table class="table">
        <thead>
            <tr>
                <th>{{ $t('Amount') }}</th>
                <!-- <th>{{ $t('Terminal') }}</th> -->
                <th>{{ $t('Order Number') }}</th>
                <th>{{ $t('Date') }}</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="order in top_orders">
                <td>{{ order.amount }} {{ currency_symbol  }} </td>
                <!-- <td>{{ order.terminal_name }}</td> -->
                <td><a :href="order.receipt_link" target="_blank">#{{ order.order_number }}</a> </td>
                <td>{{ order.business_date }}</td>
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
    
    const top_orders = ref([]);

    const props = defineProps(['data']);  
    top_orders.value = props.data;
    
    watch(() => 
        props.data, (value) => {
            if(value){
               // console.log('aaa')
                top_orders.value = value;
            }
        },
    );

</script>