<template>
  <div class="cmp-line-chart">
    <Line :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup>
import "./LineChart.scss";
import { defineProps, ref, computed } from "vue";
import { Line } from "vue-chartjs";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const props = defineProps({
  chartData: { type: Object, required: true },
});

const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: { mode: "index", intersect: false },
  },
  scales: {
    x: { title: { display: true, text: "Ano" } },
    y: {
      beginAtZero: true,
      title: { display: true, text: "Volumes" },
    },
  },
});

const chartData = computed(() => ({
  labels: Object.keys(props.chartData),
  datasets: [
    {
      label: "Produção total",
      data: Object.values(props.chartData),
      borderColor: "#2f7ed8",
      backgroundColor: "rgba(47,126,216,0.15)",
      fill: true,
      tension: 0.3,
      borderWidth: 2,
      pointRadius: 4,
    },
  ],
}));
</script>
