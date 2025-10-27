<template>
  <div class="cmp-field-stats">
    <div class="modal">
      <h2>FieldStats</h2>
      <div class="general-container">
        <div class="checkbox" v-if="!Object.keys(selectedArea).length">
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
        <button v-if="Object.keys(selectedArea).length" @click="closeModal">
          Fechar
        </button>
        <button @click="deleteArea">Excluir área</button>
        <button @click="saveStats">Salvar</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import "./FieldStats.scss";
import { onMounted, reactive, ref, watch } from "vue";
import { useStore } from "@/store";
import axios from "axios";

const {
  setOpenFieldStats,
  getLoggedUser,
  getPendingArea,
  setPendingArea,
  getSelectedArea,
  setSelectedArea,
} = useStore();

let properties = ref([]);
let selectedProperty = ref("");
const user = getLoggedUser();
const selectedArea = getSelectedArea();

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

    if (selectedArea && Object.keys(selectedArea).length > 0) {
      form.areaName = selectedArea.areaName;
      form.areaType = selectedArea.areaType;

      if (selectedArea.areaType === "field") {
        fieldForm.roadSpace = selectedArea.roadSpace;
        fieldForm.plantSpace = selectedArea.plantSpace;
        fieldForm.ownedProperty = selectedArea.ownedProperty;

        const prop = data.find((p) => p.id === selectedArea.ownedProperty);
        if (prop) selectedProperty.value = prop;
      }
    }
  } catch (err) {
    console.error("Erro ao carregar propriedades:", err);
  }
});

watch(selectedProperty, (newVal) => {
  fieldForm.ownedProperty = newVal ? newVal.id : null;
});

const saveStats = async () => {
  const pending = getPendingArea();
  let payload = {};
  const baseArea = Object.keys(pending).length > 0 ? pending : selectedArea;
  const plantsNumber =
    form.areaType === "field"
      ? baseArea.areaSize / fieldForm.roadSpace / fieldForm.plantSpace
      : 0;

  if (form.areaType === "field") {
    payload = {
      ...form,
      ...fieldForm,
      plantsNumber,
    };
  } else {
    payload = {
      ...form,
      plantsNumber,
      cultivatedArea: baseArea.cultivatedArea || 0,
    };
  }

  try {
    if (!Object.keys(selectedArea).length) {
      await axios.post("http://localhost:3000/areas", {
        ...payload,
        ...pending,
      });
    } else {
      await axios.patch(`http://localhost:3000/areas/${selectedArea.id}`, {
        ...payload,
      });
    }

    if (form.areaType === "field") {
      await recalculatePropertyStats(fieldForm.ownedProperty);
    }
  } catch (err) {
    console.error("Erro ao salvar área:", err);
  }
  setOpenFieldStats(false);
  setPendingArea({});
  window.location.reload();
};

const recalculatePropertyStats = async (propertyId) => {
  try {
    const { data: fields } = await axios.get(
      `http://localhost:3000/areas?ownedProperty=${propertyId}&areaType=field`
    );

    const totalPlants = fields.reduce(
      (acc, field) => acc + (field.plantsNumber || 0),
      0
    );

    const totalAreaSize = fields.reduce(
      (acc, field) => acc + (field.areaSize || 0),
      0
    );

    await axios.patch(`http://localhost:3000/areas/${propertyId}`, {
      plantsNumber: totalPlants,
      cultivatedArea: totalAreaSize,
    });
  } catch (err) {
    console.error("Erro ao recalcular plantas da propriedade:", err);
  }
};

const deleteArea = async () => {
  if (!Object.keys(selectedArea).length) {
    window.location.reload();
    return;
  }

  try {
    const ownedPropertyId = selectedArea?.ownedProperty;

    await axios.delete(`http://localhost:3000/areas/${selectedArea.id}`);

    if (selectedArea.areaType === "field" && ownedPropertyId) {
      await recalculatePropertyStats(ownedPropertyId);
    }
    setOpenFieldStats(false);
    setPendingArea({});
    setSelectedArea({});
    window.location.reload();
  } catch (err) {
    console.error("Erro ao excluir área:", err);
  }
};

const closeModal = () => {
  setOpenFieldStats(false);
  setSelectedArea({});
};
</script>
