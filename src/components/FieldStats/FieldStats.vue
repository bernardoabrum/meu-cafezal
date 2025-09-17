<template>
  <div class="cmp-field-stats">
    <div class="container">
      <h2>FieldStats</h2>
      <div class="checkbox-container">
        <div>
          <input type="radio" value="property" v-model="areaType" />
          <span>Propriedade</span>
        </div>
        <div>
          <input type="radio" value="field" v-model="areaType" />
          <span>Talhão</span>
        </div>
      </div>
      <div class="input-container">
        <input
          type="text"
          v-model="areaName"
          placeholder="Digite o nome da área"
        />
      </div>
      <div class="button-container">
        <button @click="closeStats">Fechar</button>
        <button @click="saveStats">Salvar</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import "./FieldStats.scss";
import { ref, onMounted } from "vue";
import { useStore } from "@/store";
const { setOpenFieldStats, saveSelectedArea, getSelectedArea } = useStore();

const areaType = ref("property");
const areaName = ref("");

onMounted(() => {
  const selected = getSelectedArea();

  if (selected?.areaType) {
    areaType.value = selected.areaType;
  }
  if (selected?.areaName) {
    areaName.value = selected.areaName;
  }
});

const closeStats = () => {
  setOpenFieldStats(false);
};

const saveStats = () => {
  saveSelectedArea(areaType.value, areaName.value);
  setOpenFieldStats(false);
};
</script>
