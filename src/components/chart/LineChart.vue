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
  series: [],
  chart: {
    type: "line",
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
    categories: ["January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December"],
  },
  yaxis: {
    labels: {
      formatter: function (value) {
        return value;
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
if(props.data.categories!=undefined)
options.value.xaxis.categories = props.data.categories;
console.log(props.data.series)
if(props.data.series!=undefined)
series.value = props.data.series;
watchEffect(() =>{
        // props.data, (value) => {
      if(props.data.categories!=undefined && !_.isUndefined(props.data.series)){
       // console.log(value.series)
        options.value.xaxis.categories = props.data.categories;
        series.value = props.data.series;
      }
    // },
}
);
</script>