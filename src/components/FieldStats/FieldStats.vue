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
      <div class="field-container" v-if="form.areaType === 'field'">
        <p>A qual propriedade pertence este talhão?</p>
        <select v-model="selectedProperty">
          <option
            :key="property.id"
            v-for="property in properties"
            :value="property"
          >
            {{ property.areaName }}
          </option>
        </select>
      </div>
      <div class="button-container">
        <button @click="closeStats">Fechar</button>
        <button @click="saveStats">Salvar</button>
        <button @click="deleteArea">Excluir área</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import "./FieldStats.scss";
import { onMounted, reactive, ref, watch } from "vue";
import { useStore } from "@/store";
import axios from "axios";

const { setOpenFieldStats, saveSelectedArea, getSelectedArea } = useStore();

let ownedProperty = ref(null);
let properties = ref([]);
let selectedProperty = ref(null);

const form = reactive({
  areaType: "property",
  areaName: "",
  ownedProperty,
});

onMounted(async () => {
  const selected = getSelectedArea();
  if (selected) {
    Object.assign(form, selected);
  }

  const result = await axios.get(
    "http://localhost:3000/areas?areaType=property"
  );

  const currentId = selected.id;
  properties.value = result.data.filter((p) => p.id !== currentId);

  if (form.ownedProperty) {
    const match = properties.value.find((p) => p.id === form.ownedProperty);
    if (match) {
      selectedProperty.value = match;
    }
  }
});

watch(selectedProperty, (newVal) => {
  ownedProperty.value = newVal.id;
});

const closeStats = () => {
  setOpenFieldStats(false);
};

const saveStats = () => {
  let payload = { ...form };

  if (form.areaType === "property") {
    payload.ownedProperty = null;
  }
  saveSelectedArea(payload);
  setOpenFieldStats(false);
};

const deleteArea = async () => {
  const id = getSelectedArea().id;
  try {
    await axios.delete(`http://localhost:3000/areas/${id}`);
  } catch (err) {
    console.error("Não foi possível deletar a área:", err);
  }

  window.location.reload();
};
</script>
