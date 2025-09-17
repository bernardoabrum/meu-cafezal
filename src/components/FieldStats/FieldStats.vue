<template>
  <div class="cmp-field-stats">
    <div class="container">
      <h2>FieldStats</h2>
      <div class="checkbox-container">
        <div>
          <input type="radio" value="property" v-model="form.areaType" />
          <span>Propriedade</span>
        </div>
        <div>
          <input type="radio" value="field" v-model="form.areaType" />
          <span>Talhão</span>
        </div>
      </div>
      <div class="input-container">
        <input
          type="text"
          v-model="form.areaName"
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
import { onMounted, reactive } from "vue";
import { useStore } from "@/store";
const { setOpenFieldStats, saveSelectedArea, getSelectedArea } = useStore();

const form = reactive({
  areaType: "property",
  areaName: "",
});

onMounted(() => {
  const selected = getSelectedArea();
  if (selected) {
    Object.assign(form, selected);
  }
});

const closeStats = () => {
  setOpenFieldStats(false);
};

const saveStats = () => {
  saveSelectedArea(form);
  setOpenFieldStats(false);
};
</script>
