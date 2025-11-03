<template>
  <div class="cmp-bar-chart">
    <div class="container">
      <h2>{{ property.areaName }}</h2>
      <Bar :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>

<script setup>
import "./BarChart.scss";
import { computed } from "vue";
import { Bar } from "vue-chartjs";
import { Chart, registerables } from "chart.js";
import { GraphColors } from "@/utils/GraphColors";

Chart.register(...registerables);

const props = defineProps({
  property: { type: Object, required: true },
  selectedYear: { type: String, required: true },
});

const chartData = computed(() => {
  const fields = props.property.fields || [];
  const labels = fields.map((f) => f.areaName);
  const data = fields.map((f) => f.production?.[props.selectedYear] ?? 0);

  return {
    labels,
    datasets: [
      {
        label: "Produção (volumes)",
        data,
        backgroundColor: GraphColors,
        borderRadius: 6,
      },
    ],
  };
});

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      callbacks: {
        label: (context) => {
          const total = context.dataset.data.reduce((a, b) => a + b, 0);
          const percent = ((context.parsed.y / total) * 100).toFixed(1);
          return `${context.parsed.y} volumes (${percent}%)`;
        },
      },
      displayColors: false,
      padding: 12,
      titleFont: {
        size: 18,
        weight: "600",
      },
      bodyFont: {
        size: 18,
        weight: "600",
      },
    },
  },
  scales: {
    x: {
      ticks: {
        color: "#333",
        font: {
          size: 16,
          weight: 500,
        },
      },
      title: {
        display: true,
        text: "Talhões",
        color: "#333",
        font: { size: 18, weight: "500" },
      },
      grid: { display: true },
    },
    y: {
      beginAtZero: true,
      ticks: {
        color: "#333",
        font: {
          size: 16,
          weight: 500,
        },
      },
      title: {
        display: true,
        text: "Volumes",
        color: "#333",
        font: { size: 18, weight: "500" },
      },
    },
  },
}));
</script>
