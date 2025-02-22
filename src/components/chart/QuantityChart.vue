<template>
    <apexchart  height="260" width="450" type="pie" :options="options" :series="series"></apexchart>
</template>

<script setup>

    import VueApexCharts from "vue3-apexcharts";
    import { useAuthStore } from '@/stores/auth';
    import { useI18n } from 'vue-i18n'

    const { t } = useI18n();

    const authStore = useAuthStore();

    const options = ref({});

    const series = ref([]);


    const apexchart = defineComponent(
        VueApexCharts
    );
    options.value = {
        series: [],
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
    };
    options.value.labels = [t('Quantity In Hand'), t('Quantity to be received')];
    const props = defineProps(['data']);
    
    series.value = _.map(props.data, (value) => Number(value) );

    watch(() => 
        props.data, (value) => {
            if(value){
               // console.log('aaa')
              series.value = _.map(value, (value) => Number(value) );
            }
        },
    );
</script>