<template>
    <table class="table" >
        <thead>
            <tr>
                <th>{{ $t('Amount') }}</th>
                <th>{{ $t('Bill Type') }}</th>
                <th>{{ $t('Payment') }}</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="transaction in recent_transactions">
                <td :class="[ transaction.type == 'INCOME' ? 'text-success' : 'text-danger'  ]">
                    {{ transaction.amount }} {{  currency_symbol  }}
                </td>
                <td>{{ transaction.bill_type_text }}</td>
                <td>{{ transaction.payment_method_name }}</td>
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
    
    const recent_transactions = ref([]);

    const props = defineProps(['data']);  
    recent_transactions.value = props.data;
    
    watch(() => 
        props.data, (value) => {
            if(value){
               // console.log('aaa')
                  recent_transactions.value = value;

            }
        },
    );
</script>