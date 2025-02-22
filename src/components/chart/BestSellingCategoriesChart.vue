<template>
    <apexchart type="bar" height="250" :options="options" :series="series"></apexchart>
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
               toolbar: {
                show: false,
              },
              height: 350,
              type: 'bar',
            },
            plotOptions: {
              bar: {
                borderRadius: 0,
                columnWidth: '50%',
              }
            },
            dataLabels: {
              enabled: true
            },
            stroke: {
              width: 0
            },
            grid: {
              row: {
                colors: ['#fff', '#f2f2f2']
              }
            },
            xaxis: {
              labels: {
                rotate: -45
              },
              categories: ['Apples', 'Oranges', 'Strawberries', 'Pineapples', 'Mangoes'],
              tickPlacement: 'on'
            },
            yaxis: {
                labels: {
                    formatter: function (value) {
                      return value +" "+currency_symbol.value;
                    }
                },
            },
            
            colors: ['#571DAF'],
    });

    const series = ref([
        {
            name: 'Sales',
            data: [44, 55, 41, 67, 22]
        },
    ]);

    const apexchart = defineComponent(
        VueApexCharts
    );

    const props = defineProps(['data']);
    
    options.value.xaxis.categories = props.data.categories;
    series.value[0].data = props.data.sales;

    watch(() => 
        props.data, (value) => {
            if(value.categories && value.sales){
               // console.log('aaa')
              options.value.xaxis.categories = value.categories;
              series.value[0].data = value.sales;
            }
        },
    );

</script>