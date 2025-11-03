<template>
  <div class="page statistics-page">
    <BackButton />
    <div v-if="registeredYears.length">
      <div class="select">
        <select v-model="selectedYear" name="selectedYear">
          <option disabled value="">Selecione um ano</option>
          <option v-for="year in registeredYears" :key="year" :value="year">
            {{ year }}
          </option>
        </select>
      </div>
      <div class="infos">
        <div class="totals">
          <h2 class="title">Estatísticas gerais ({{ selectedYear }})</h2>
          <p>
            Numéro total de plantas:
            <span>{{ totalPlantsByYear.toFixed() }}</span>
          </p>
          <p>
            Área cultivada total:
            <span>{{ cultivatedAreaByYear.toFixed() }}m²</span>
          </p>
          <p>
            Produção total em volumes:
            <span>{{ totalProduction[selectedYear] || 0 }}</span>
          </p>
          <p>
            Produção total em sacas (estimado):
            <span>{{
              ((totalProduction[selectedYear] ?? 0) / 8.33).toFixed(1)
            }}</span>
          </p>
        </div>
        <div>
          <PieChart
            :selectedYear="selectedYear"
            :property="properties"
            type="properties"
          />
        </div>
        <div class="line-chart" v-if="registeredYears.length > 1">
          <h2 class="title">Evolução da produção ao longo dos anos</h2>
          <LineChart :chartData="totalProduction" />
        </div>
      </div>
      <div class="table">
        <h2 class="title">
          Estatísticas de cada propriedade na proporção por hectare ({{
            selectedYear
          }})
        </h2>
        <table v-if="properties.length">
          <thead>
            <tr>
              <th>Propriedade</th>
              <th>Volumes por hectare</th>
              <th>Sacas por hectare (estimado)</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="property in productionPerHectare" :key="property.name">
              <td>{{ property.name }}</td>
              <td>{{ property.volumesPerHectare.toFixed(1) }}</td>
              <td>{{ property.bagsPerHectare.toFixed(1) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="graphs">
        <h2 class="title">
          Distribuição da produção por talhão ({{ selectedYear }})
        </h2>
        <div class="pie-chart">
          <PieChart
            v-for="property in properties.filter(
              (p) => p.production && p.production[selectedYear] > 0
            )"
            :key="property.id"
            :selectedYear="selectedYear"
            :property="property"
            type="fields"
          />
        </div>
      </div>
    </div>
    <div v-else class="no-properties">
      <h2>
        Você precisa marcar propriedades ou registrar volumes para ter acesso as
        estatísticas!
      </h2>
    </div>
  </div>
</template>

<script setup>
import "./Statistics.scss";
import { onMounted, ref, computed } from "vue";
import { BackButton, LineChart, PieChart } from "@/components";
import axios from "axios";
import { useStore } from "@/store";

const selectedYear = ref("");
const totalProduction = ref({});
const registeredYears = ref([]);
const properties = ref([]);
const { getLoggedUser } = useStore();

onMounted(async () => {
  await getData();

  const currentYear = new Date().getFullYear().toString();

  if (registeredYears.value.includes(currentYear)) {
    selectedYear.value = currentYear;
  }
});

const cultivatedAreaByYear = computed(() => {
  const year = Number(selectedYear.value);
  return properties.value.reduce((acc, property) => {
    const fieldsUpToYear = property.fields.filter(
      (field) => Number(field.year) <= year
    );
    const propertyTotal = fieldsUpToYear.reduce(
      (sum, field) => sum + (field.areaSize || 0),
      0
    );
    return acc + propertyTotal;
  }, 0);
});

const totalPlantsByYear = computed(() => {
  const year = Number(selectedYear.value);
  return properties.value.reduce((acc, property) => {
    const fieldsUpToYear = property.fields.filter(
      (field) => Number(field.year) <= year
    );
    const propertyTotal = fieldsUpToYear.reduce(
      (sum, field) => sum + Number(field.plantsNumber || 0),
      0
    );
    return acc + propertyTotal;
  }, 0);
});

const getData = async () => {
  try {
    const { data: propertiesData } = await axios.get(
      `http://localhost:3000/areas?areaType=property&user=${getLoggedUser().id}`
    );

    const { data: fieldsData } = await axios.get(
      `http://localhost:3000/areas?areaType=field&user=${getLoggedUser().id}`
    );

    const combinedData = propertiesData.map((property) => {
      const relatedFields = fieldsData.filter(
        (field) => field.ownedProperty === property.id
      );
      return {
        ...property,
        fields: relatedFields,
      };
    });

    properties.value = combinedData;

    const totals = combinedData.reduce((acc, property) => {
      const production = property.production || {};
      for (const [year, value] of Object.entries(production)) {
        acc[year] = (acc[year] || 0) + value;
      }
      return acc;
    }, {});

    totalProduction.value = totals;
    registeredYears.value = Object.keys(totals).sort((a, b) => b - a);
  } catch (err) {
    console.error("Erro ao buscar produções:", err);
  }
};

const productionPerHectare = computed(() => {
  return properties.value.map((property) => {
    const production = property.production[selectedYear.value] ?? 0;
    const cultivatedArea = cultivatedAreaByYear.value;
    const name = property.areaName;
    const bags = production / 8.33;
    const volumesPerHectare = production / (cultivatedArea / 10000);
    const bagsPerHectare = bags / (cultivatedArea / 10000);

    return {
      name,
      bags,
      volumesPerHectare,
      bagsPerHectare,
    };
  });
});
</script>
