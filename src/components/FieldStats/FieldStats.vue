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
        <div class="variety">
          <p>Qual variedade de café cultivada nesse talhão?</p>
          <input
            type="text"
            v-model="fieldForm.variety"
            placeholder="Digite a variedade de café"
            autocomplete="off"
            @input="showSuggestions = true"
            @blur="hideSuggestions"
            @focusout="hideSuggestions"
          />
          <ul v-if="showSuggestions">
            <li
              v-for="item in Array.from(suggestions)"
              :key="item"
              @click="selectVariety(item)"
            >
              {{ item }}
            </li>
          </ul>
        </div>
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
  updatePropertyProduction,
} = useStore();

const user = getLoggedUser();
const selectedArea = getSelectedArea();
const properties = ref([]);
const selectedProperty = ref("");
const currentYear = new Date().getFullYear();
const suggestions = ref([]);
const showSuggestions = ref(false);

const form = reactive({
  areaName: "",
  areaType: "property",
});

const fieldForm = reactive({
  ownedProperty: null,
  plantSpace: 0,
  roadSpace: 0,
  variety: "",
});

onMounted(async () => {
  try {
    const { data } = await axios.get(
      `http://localhost:3000/areas?areaType=property&user=${user.id}`
    );
    properties.value = data;

    if (Object.keys(selectedArea).length) {
      Object.assign(form, {
        areaName: selectedArea.areaName,
        areaType: selectedArea.areaType,
      });

      if (selectedArea.areaType === "field") {
        Object.assign(fieldForm, {
          roadSpace: selectedArea.roadSpace,
          plantSpace: selectedArea.plantSpace,
          ownedProperty: selectedArea.ownedProperty,
          variety: selectedArea.variety || "",
        });
        selectedProperty.value = data.find(
          (p) => p.id === selectedArea.ownedProperty
        );
      }
    }
  } catch (err) {
    console.error("Erro ao carregar propriedades:", err);
  }
  getVarieties();
});

const getVarieties = async () => {
  const { data } = await axios.get(
    `http://localhost:3000/areas?areaType=field&user=${user.id}`
  );
  data.forEach((field) => {
    if (!suggestions.value.includes(field.variety)) {
      suggestions.value.push(field.variety);
    }
  });
};

const selectVariety = (variety) => {
  fieldForm.variety = variety;
  showSuggestions.value = false;
};

const hideSuggestions = () => {
  setTimeout(() => {
    showSuggestions.value = false;
  }, 200);
};

watch(selectedProperty, (newVal) => {
  fieldForm.ownedProperty = newVal?.id || null;
});

const saveStats = async () => {
  const pending = getPendingArea();
  const base = Object.keys(pending).length ? pending : selectedArea;
  const isField = form.areaType === "field";

  if (!isField && !form.areaName) {
    alert("Preencha todos os campos!");
    return;
  }

  if (
    (isField && !form.areaName) ||
    !fieldForm.variety ||
    !fieldForm.ownedProperty ||
    !fieldForm.roadSpace ||
    !fieldForm.plantSpace
  ) {
    alert("Preencha todos os campos!");
    return;
  }

  const plantsNumber = isField
    ? base.areaSize / fieldForm.roadSpace / fieldForm.plantSpace
    : 0;

  const payload = {
    ...form,
    ...fieldForm,
    plantsNumber,
    cultivatedArea: isField ? undefined : base.cultivatedArea || 0,
    year: currentYear.toString(),
  };

  if (!isField) {
    delete payload.ownedProperty;
    delete payload.roadSpace;
    delete payload.plantSpace;
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

    if (isField && fieldForm.ownedProperty) {
      await updatePropertyStats(fieldForm.ownedProperty);
    }
  } catch (err) {
    console.error("Erro ao salvar área:", err);
  }
  setOpenFieldStats(false);
  setPendingArea({});
  window.location.reload();
};

const updatePropertyStats = async (propertyId) => {
  try {
    const { data: fields } = await axios.get(
      `http://localhost:3000/areas?ownedProperty=${propertyId}&areaType=field`
    );

    const totals = fields.reduce(
      (acc, f) => ({
        plants: acc.plants + (f.plantsNumber || 0),
        area: acc.area + (f.areaSize || 0),
      }),
      { plants: 0, area: 0 }
    );

    await axios.patch(`http://localhost:3000/areas/${propertyId}`, {
      plantsNumber: totals.plants,
      cultivatedArea: totals.area,
    });
  } catch (err) {
    console.error("Erro ao recalcular estatísticas:", err);
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
      await updatePropertyStats(ownedPropertyId);
      await updatePropertyProduction(ownedPropertyId, currentYear);
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
