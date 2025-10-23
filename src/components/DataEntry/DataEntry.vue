<template>
  <div class="cmp-data-entry">
    <div class="modal">
      <div v-if="selectedArea.areaType == 'field'">
        <p>Talhão</p>
        <h2>{{ selectedArea.areaName }}</h2>
        <p>Espaçamento rua: {{ selectedArea.roadSpace }}</p>
        <p>Espaçamento pé a pé: {{ selectedArea.plantSpace }}</p>
        <p>Tamanho da área: {{ selectedArea.areaSize.toFixed(0) }}m²</p>
        <p>
          Número de plantas aproximado:
          {{ selectedArea.plantsNumber.toFixed(0) }}
        </p>
      </div>
      <div v-else>
        <p>Propriedade</p>
        <h2>{{ selectedArea.areaName }}</h2>
        <p>Área total: {{ selectedArea.areaSize.toFixed(0) }}m²</p>
        <p>Área cultivada total: {{ cultivatedArea.toFixed(0) }}m²</p>
        <p>
          Número de plantas total aproximado: {{ propertyPlants.toFixed(0) }}
        </p>
      </div>
      <div class="buttons">
        <button @click="closeModal">Fechar</button>
        <button @click="deleteArea">Excluir área</button>
        <button @click="editInfo">Editar informações</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import "./DataEntry.scss";
import { useStore } from "@/store";
import axios from "axios";

const {
  setOpenDataEntry,
  getSelectedArea,
  setSelectedArea,
  setOpenFieldStats,
} = useStore();

const selectedArea = getSelectedArea();
const propertyPlants = ref(0);
const cultivatedArea = ref(0);

onMounted(async () => {
  const { data } = await axios.get(`http://localhost:3000/areas`);
  const propertyFields = data.filter(
    (area) => area.ownedProperty === selectedArea.id
  );
  propertyFields.forEach((field) => {
    propertyPlants.value += field.plantsNumber;
    cultivatedArea.value += field.areaSize;
  });
});

const closeModal = () => {
  setOpenDataEntry(false);
  setSelectedArea({});
};

const deleteArea = () => {
  try {
    axios.delete(`http://localhost:3000/areas/${selectedArea.id}`).then(() => {
      setOpenDataEntry(false);
      window.location.reload();
    });
  } catch (err) {
    console.error("Erro ao excluir área:", err);
  }
};

const editInfo = () => {
  setOpenDataEntry(false);
  setOpenFieldStats(true);
};
</script>
