<template>
  <div
    :class="['page statistics-page', { 'no-data': !registeredYears.length }]"
  >
    <BackButton />
    <div v-if="registeredYears.length">
      <div class="select">
        <p>Selecione um ano:</p>
        <div class="input">
          <input
            type="number"
            v-model="selectedYear"
            placeholder="Selecione o ano"
            readonly
            @focusin="showYears = true"
            @blur="hideYears"
            @focusout="hideYears"
          />
          <ul v-if="showYears">
            <li
              v-for="year in registeredYears"
              :key="year"
              @click="selectYear(year)"
            >
              {{ year }}
            </li>
          </ul>
        </div>
      </div>
      <div class="infos">
        <div class="totals">
          <h2 class="title">Estatísticas gerais ({{ selectedYear }})</h2>
          <p>
            Número total de plantas:
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
          <div class="averages">
            <h2 class="title">Médias gerais (todos os anos)</h2>
            <p>
              Produção total média em volumes:
              <span>{{ averageProduction.toFixed(1) }}</span>
            </p>
            <p>
              Produção total média em sacas (estimado):
              <span>{{ (averageProduction / 8.33).toFixed(1) }}</span>
            </p>
          </div>
        </div>
        <div>
          <PieChart :selectedYear="selectedYear" :property="properties" />
        </div>
        <div v-if="registeredYears.length > 1">
          <LineChart :chartData="totalProduction" />
        </div>
      </div>
      <h2 class="title">
        Produtividade de cada propriedade por hectare ({{ selectedYear }})
      </h2>
      <div class="table">
        <table v-if="properties.length">
          <thead>
            <tr>
              <th>Propriedade</th>
              <th>Sacas (estimado)</th>
              <th>Volumes por hectare</th>
              <th>Sacas por hectare (estimado)</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="productionPerHectare.length > 1 && averagePerHectare">
              <td>{{ averagePerHectare.name }}</td>
              <td>{{ averagePerHectare.bags.toFixed(1) }}</td>
              <td>{{ averagePerHectare.volumesPerHectare.toFixed(1) }}</td>
              <td>{{ averagePerHectare.bagsPerHectare.toFixed(1) }}</td>
            </tr>
            <tr v-for="property in productionPerHectare" :key="property.name">
              <td>{{ property.name }}</td>
              <td>{{ property.bags.toFixed(1) }}</td>
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
        <div class="bar-chart">
          <BarChart
            v-for="property in properties.filter(
              (p) => p.production && p.production[selectedYear] > 0,
            )"
            :key="property.id"
            :selectedYear="selectedYear"
            :property="property"
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
import { BackButton, LineChart, PieChart, BarChart } from "@/components";
import { getAreasByUser } from "@/services/areas.service";

const selectedYear = ref("");
const totalProduction = ref({});
const registeredYears = ref([]);
const properties = ref([]);
const showYears = ref(false);

onMounted(async () => {
  await getData();

  const currentYear = new Date().getFullYear().toString();

  if (registeredYears.value.includes(currentYear)) {
    selectedYear.value = currentYear;
  } else {
    selectedYear.value = registeredYears.value[0];
  }
});

const averageProduction = computed(() => {
  const values = Object.values(totalProduction.value);

  const total = values.reduce((acc, val) => acc + val, 0);
  return total / values.length;
});

const cultivatedAreaByYear = computed(() => {
  const year = Number(selectedYear.value);
  return properties.value.reduce((acc, property) => {
    const fieldsUpToYear = property.fields.filter(
      (field) => Number(field.year) <= year,
    );
    const propertyTotal = fieldsUpToYear.reduce(
      (sum, field) => sum + (field.areaSize || 0),
      0,
    );
    return acc + propertyTotal;
  }, 0);
});

const totalPlantsByYear = computed(() => {
  const year = Number(selectedYear.value);
  return properties.value.reduce((acc, property) => {
    const fieldsUpToYear = property.fields.filter(
      (field) => Number(field.year) <= year,
    );
    const propertyTotal = fieldsUpToYear.reduce(
      (sum, field) => sum + Number(field.plantsNumber || 0),
      0,
    );
    return acc + propertyTotal;
  }, 0);
});

const getData = async () => {
  try {
    const propertiesData = await getAreasByUser({ areaType: "property" });
    const fieldsData = await getAreasByUser({ areaType: "field" });

    const combinedData = propertiesData.map((property) => {
      const relatedFields = fieldsData.filter(
        (field) => field.ownedProperty === property.id,
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
  const selected = Number(selectedYear.value);
  const filteredProperties = properties.value.filter(
    (property) => Number(property.year) <= selected,
  );

  return filteredProperties.map((property) => {
    const production = property.production?.[selected] ?? 0;
    const productiveFields = property.fields.filter(
      (field) => (field.production?.[selected] ?? 0) > 0,
    );

    const productiveArea = productiveFields.reduce(
      (sum, field) => sum + (field.areaSize || 0),
      0,
    );

    const areaHectares = productiveArea / 10000 || 1;
    const name = property.areaName;
    const bags = production / 8.33;
    const volumesPerHectare = production / areaHectares;
    const bagsPerHectare = bags / areaHectares;

    return {
      name,
      bags,
      volumesPerHectare,
      bagsPerHectare,
    };
  });
});

const averagePerHectare = computed(() => {
  const list = productionPerHectare.value;
  if (!list.length) return null;

  const totalBags = list.reduce((sum, p) => sum + p.bags, 0);
  const totalVolumes = list.reduce((sum, p) => sum + p.volumesPerHectare, 0);
  const totalBagsPerHa = list.reduce((sum, p) => sum + p.bagsPerHectare, 0);

  return {
    name: "Média geral",
    bags: totalBags / list.length,
    volumesPerHectare: totalVolumes / list.length,
    bagsPerHectare: totalBagsPerHa / list.length,
  };
});

const hideYears = () => {
  setTimeout(() => {
    showYears.value = false;
  }, 200);
};

const selectYear = (year) => {
  selectedYear.value = year;
  showYears.value = false;
};
</script>
