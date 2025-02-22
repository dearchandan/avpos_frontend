<template>
    <apexchart type="pie" height="260" :options="options" :series="series"></apexchart>
</template>

<script setup>

    import VueApexCharts from "vue3-apexcharts";
    import { useAuthStore } from '@/stores/auth';
    const authStore = useAuthStore();
    
    const currency_symbol = computed(() => {
        return authStore.user.currency.symbol;
    })

    const options = ref({
        chart: {
            width: 380,
            type: 'pie',
        },
        labels: [],
        responsive: [{
            breakpoint: 480,
            options: {
            chart: {
                width: 200
            },
            legend: {
                position: 'bottom'
            }
            }
        }]
    });

    const series = ref([]);

    const apexchart = defineComponent(
        VueApexCharts
    );

    const props = defineProps(['data']);  
    options.value.labels = props.data.products;
    series.value = _.map(props.data.sales, (value) => Number(value) );

     watch(() => 
        props.data, (value) => {
            if(value.products && value.sales){
               // console.log('aaa')
              options.value.labels  = value.products;
              series.value = _.map(value.sales, (value) => Number(value) );
            }
        },
    );
</script>