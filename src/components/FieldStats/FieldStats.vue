<template>
  <div class="cmp-field-stats">
    <div class="modal">
      <h2>FieldStats</h2>
      <div class="general-container">
        <div class="checkbox">
          <div>
            <input type="radio" value="property" v-model="form.areaType" />
            <span>Propriedade</span>
          </div>
          <div>
            <input type="radio" value="field" v-model="form.areaType" />
            <span>Talhão</span>
          </div>
        </div>
        <input
          type="text"
          v-model="form.areaName"
          placeholder="Digite o nome da área"
        />
      </div>
      <div class="field-container" v-if="form.areaType === 'field'">
        <p>A qual propriedade pertence este talhão?</p>
        <select v-model="selectedProperty">
          <option disabled value="">Selecione uma propriedade</option>
          <option
            :key="property.id"
            v-for="property in properties"
            :value="property"
          >
            {{ property.areaName }}
          </option>
        </select>
        <p>Qual espaçamento utilizado no talhão?</p>
        <div class="measures">
          <div>
            <p>Rua:</p>
            <input
              type="number"
              v-model="fieldForm.roadSpace"
              min="0"
              step="0.1"
            />
          </div>
          <div>
            <p>Pé a pé:</p>
            <input
              type="number"
              v-model="fieldForm.plantSpace"
              min="0"
              step="0.1"
            />
          </div>
        </div>
      </div>
      <div class="buttons">
        <button @click="saveStats">Salvar</button>
        <button @click="deleteArea">Cancelar</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import "./FieldStats.scss";
import { onMounted, reactive, ref, watch } from "vue";
import { useStore } from "@/store";
import axios from "axios";

const { setOpenFieldStats, getLoggedUser, getPendingArea, setPendingArea } =
  useStore();

let properties = ref([]);
let selectedProperty = ref("");
const user = getLoggedUser();

const form = reactive({
  areaName: "",
  areaType: "property",
});

const fieldForm = reactive({
  ownedProperty: null,
  plantSpace: 0,
  roadSpace: 0,
});

onMounted(async () => {
  try {
    const { data } = await axios.get(
      `http://localhost:3000/areas?areaType=property&user=${user.id}`
    );
    properties.value = data;
  } catch (err) {
    console.error("Erro ao carregar propriedades:", err);
  }
});

watch(selectedProperty, (newVal) => {
  fieldForm.ownedProperty = newVal ? newVal.id : null;
});

const saveStats = () => {
  const pending = getPendingArea();
  let payload = {};
  const plantsNumer =
    pending.areaSize / fieldForm.roadSpace / fieldForm.plantSpace;
  if (form.areaType === "field") {
    payload = {
      ...form,
      ...fieldForm,
      plantsNumer,
    };
  } else {
    payload = {
      ...form,
    };
  }

  try {
    axios.post("http://localhost:3000/areas", {
      ...payload,
      ...pending,
    });
  } catch (err) {
    console.error("Erro ao salvar área:", err);
  }
  setOpenFieldStats(false);
  setPendingArea({});
  window.location.reload();
};

const deleteArea = () => {
  window.location.reload();
};
</script>
