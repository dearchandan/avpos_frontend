<template>
    <apexchart type="line" height="300" :options="options" :series="series" />
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
                type: "area",
                zoom: {
                    enabled: false,
                },
                toolbar: {
                    show: false,
                },
            },
            stroke: {
              curve: 'smooth'
            },
            xaxis: {
                categories: [],
            },
            yaxis: {
                labels: {
                    formatter: function (value) {
                      return value +" "+currency_symbol.value;
                    }
                },
            },
            toolbar: {
                show: true,
                tools: {
                    download: false,
                },
            },
            tooltip: {
                enabled: true,
                marker: {
                    show: false,
                },
            },
            // colors: ['#571DAF','#ADD8E6'],
            fill: {
               colors: ['#571DAF', '#571DAF', '#571DAF']
            },
    });

    const series = ref([]);

    const apexchart = defineComponent(
        VueApexCharts
    );

    const props = defineProps(['data']);

    options.value.xaxis.categories = props.data.categories;
    series.value = props.data.series;
    watch(() => 
        props.data, (value) => {
            if(value.categories && value.series){
              //  console.log('aaa')
            options.value.xaxis.categories = value.categories;
            series.value = value.series;
            }
        },
    );
</script>