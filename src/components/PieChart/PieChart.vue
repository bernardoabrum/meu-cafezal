<template>
  <div class="cmp-pie-chart">
    <h2 class="title">
      Produção total por propriedade ({{ props.selectedYear }})
    </h2>
    <Pie :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup>
import "./PieChart.scss";
import { computed } from "vue";
import { Pie } from "vue-chartjs";
import { Chart, registerables } from "chart.js";
import { GraphColors } from "@/utils/GraphColors";

Chart.register(...registerables);

const props = defineProps({
  property: { type: Object, required: true },
  selectedYear: { type: String, required: true },
});

const chartData = computed(() => {
  const year = props.selectedYear;
  const fields = props.property || [];

  const filtered = fields.filter(
    (f) => f.production && f.production[year] != null && f.production[year] > 0
  );

  const labels = filtered.map((f) => f.areaName);
  const data = filtered.map((f) => f.production[year]);

  return {
    labels,
    datasets: [
      {
        label: "Produção (volumes)",
        data,
        backgroundColor: GraphColors,
        borderColor: "#fff",
        borderWidth: 2,
        hoverOffset: 12,
      },
    ],
  };
});

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "bottom",
      onClick: null,
      labels: {
        color: "#fff",
        font: { size: 20, weight: 500 },
        usePointStyle: true,
        padding: 20,
      },
    },
    tooltip: {
      callbacks: {
        label: (context) => {
          const total = context.dataset.data.reduce((a, b) => a + b, 0);
          const percent = ((context.parsed / total) * 100).toFixed(1);
          return `${context.parsed} volumes (${percent}%)`;
        },
      },
      displayColors: false,
      padding: 12,
      titleFont: {
        size: 20,
        weight: "600",
      },
      bodyFont: {
        size: 20,
        weight: "600",
      },
    },
  },
}));
</script>
