<template>
  <div class="statistics-page">
    <BackButton />
    <div>
      <select v-model="selectedYear" name="selectedYear">
        <option disabled value="">Selecione um ano</option>
        <option v-for="year in years" :key="year" :value="year">
          {{ year }}
        </option>
      </select>
      <p>Produção total em volumes: {{ productionTotals[selectedYear] }}</p>
    </div>
    <div v-if="years.length > 1">
      <LineChart :chartData="productionTotals" />
    </div>
  </div>
</template>

<script setup>
import "./Statistics.scss";
import { onMounted, ref } from "vue";
import { BackButton, LineChart } from "@/components";
import axios from "axios";

const selectedYear = ref("");
const productionTotals = ref({});
const years = ref([]);

onMounted(async () => {
  await getAllProductions();

  const currentYear = new Date().getFullYear().toString();

  if (years.value.includes(currentYear)) {
    selectedYear.value = currentYear;
  }
});

const getAllProductions = async () => {
  try {
    const { data } = await axios.get(
      `http://localhost:3000/areas?areaType=property`
    );

    const totals = {};

    data.forEach((property) => {
      const production = property.production || {};
      for (const [year, value] of Object.entries(production)) {
        totals[year] = (totals[year] || 0) + value;
      }
    });

    productionTotals.value = totals;
    years.value = [...new Set(Object.keys(totals))].sort((a, b) => b - a);
  } catch (err) {
    console.error("Erro ao buscar produções:", err);
  }
};
</script>
