<template>
  <div class="cmp-data-entry">
    <div class="modal">
      <div class="field-info">
        <p>Espaçamento rua: {{ selectedArea.roadSpace }}</p>
        <p>Espaçamento pé a pé: {{ selectedArea.plantSpace }}</p>
        <p>Tamanho da área: {{ selectedArea.areaSize.toFixed(0) }}m²</p>
        <p>Número de plantas aproximado: {{ plantsNumer.toFixed(0) }}</p>
      </div>
      <div class="buttons">
        <button @click="closeModal">Fechar</button>
        <button @click="deleteArea">Excluir área</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import "./DataEntry.scss";
import { useStore } from "@/store";
import axios from "axios";

const { setOpenDataEntry, getSelectedArea, setSelectedArea } = useStore();

const selectedArea = getSelectedArea();
const plantsNumer = ref(0);

onMounted(async () => {
  if (selectedArea.areaType == "field") {
    plantsNumer.value =
      selectedArea.areaSize / selectedArea.plantSpace / selectedArea.roadSpace;
  }
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
</script>
