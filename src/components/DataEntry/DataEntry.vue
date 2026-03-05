<template>
  <div class="cmp-data-entry">
    <div class="modal">
      <div class="infos" v-if="selectedArea.areaType == 'field'">
        <div class="name">
          <p>Talhão</p>
          <h2>{{ selectedArea.areaName }}</h2>
          <p class="variety">{{ selectedArea.variety }}</p>
        </div>
        <div class="numbers">
          <p>Espaçamento rua: {{ selectedArea.roadSpace }}</p>
          <p>Espaçamento pé a pé: {{ selectedArea.plantSpace }}</p>
          <p>Tamanho da área: {{ selectedArea.areaSize.toFixed(0) }}m²</p>
          <p>
            Número de plantas aproximado:
            {{ selectedArea.plantsNumber.toFixed(0) }}
          </p>
        </div>
      </div>
      <div class="infos" v-else>
        <div class="name">
          <p>Propriedade</p>
          <h2>{{ selectedArea.areaName }}</h2>
        </div>
        <div class="numbers">
          <p>Área total: {{ selectedArea.areaSize.toFixed(0) }}m²</p>
          <p>
            Área cultivada total: {{ selectedArea.cultivatedArea.toFixed(0) }}m²
          </p>
          <p>
            Número de plantas total aproximado:
            {{ selectedArea.plantsNumber.toFixed(0) }}
          </p>
          <p>
            Total de volumes colhidos registrados ({{ currentYear }}):
            {{ selectedArea.production?.[currentYear] || 0 }}
          </p>
        </div>
      </div>
      <div class="production" v-if="selectedArea.areaType == 'field'">
        <div class="by-year">
          <p>
            Produção ano:
            {{ productionPerHa.toFixed(2) }} volumes/ha
          </p>
          <div class="container">
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
        <div class="average">
          <p>Pordução média: {{ averageProductionHa.toFixed(2) }} volumes/ha</p>
        </div>
      </div>
      <div class="register" v-if="selectedArea.areaType == 'field'">
        <p>Lançar quantidade de volumes produzidos</p>
        <div class="send">
          <input
            v-model="currentProduction"
            type="number"
            min="0"
            placeholder="0"
            @wheel.prevent
            @input="
              (e) => {
                if (e.target.value < 0) e.target.value = currentProduction = 0;
              }
            "
          />
          <button @click="sendValue">Enviar</button>
        </div>
        <div class="revise">
          <p>Total lançado ({{ currentYear }}):</p>
          <p v-if="showVolumes">
            <span>
              {{ selectedArea.production?.[currentYear] || 0 }}
            </span>
          </p>
          <p v-else>
            <input
              v-model="revisedValue"
              type="number"
              min="0"
              placeholder="0"
              @wheel.prevent
              @input="
                (e) => {
                  if (e.target.value < 0)
                    e.target.value = currentProduction = 0;
                }
              "
            />
          </p>
          <button>
            <FontAwesomeIcon
              @click="reviseVolumes"
              :icon="showVolumes ? faPenToSquare : faCheck"
            />
          </button>
        </div>
      </div>
      <div class="buttons">
        <button @click="closeModal">Fechar</button>
        <button @click="editInfo">Editar</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import "./DataEntry.scss";
import { useStore } from "@/store";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faPenToSquare, faCheck } from "@fortawesome/free-solid-svg-icons";
import { updateAreaById } from "@/services/areas.service";

const {
  setOpenDataEntry,
  getSelectedArea,
  setSelectedArea,
  setOpenFieldStats,
  updatePropertyProduction,
} = useStore();

const selectedArea = getSelectedArea();
const currentProduction = ref(0);
const showVolumes = ref(true);
const revisedValue = ref(0);
const currentYear = new Date().getFullYear();
const fieldProduction = selectedArea.production;
const fieldAreaHa = selectedArea.areaSize / 10000;
const registeredYears = selectedArea.production
  ? Object.keys(selectedArea.production).sort((a, b) => b - a)
  : [];
const showYears = ref(false);
const selectedYear = ref("");
const productionPerHa = ref(0);
const averageProductionHa = ref(0);

onMounted(() => {
  if (registeredYears.includes(currentYear.toString())) {
    selectedYear.value = currentYear;
  } else {
    selectedYear.value = registeredYears[0];
  }
  productionPerHa.value =
    fieldProduction[selectedYear.value] / fieldAreaHa || 0;
  averageProductionHa.value =
    Object.values(fieldProduction).reduce((sum, val) => sum + val, 0) /
      registeredYears.length /
      fieldAreaHa || 0;
});

const hideYears = () => {
  setTimeout(() => {
    showYears.value = false;
  }, 200);
};

const selectYear = (year) => {
  selectedYear.value = year;
  showYears.value = false;
  productionPerHa.value =
    fieldProduction[selectedYear.value] / fieldAreaHa || 0;
};

const sendValue = async () => {
  const newValue = Math.max(0, Number(currentProduction.value));
  const propertyId = selectedArea.ownedProperty;

  try {
    const existingVolumes = selectedArea.production || {};
    const updatedVolumes = { ...existingVolumes };
    updatedVolumes[currentYear] = (updatedVolumes[currentYear] || 0) + newValue;

    await updateAreaById(selectedArea.id, {
      production: updatedVolumes,
    });

    selectedArea.production = updatedVolumes;
    updatePropertyProduction(propertyId, currentYear);
  } catch (err) {
    console.error("Erro ao lançar quantidade de volumes:", err);
  } finally {
    currentProduction.value = 0;
  }
};

const reviseVolumes = async () => {
  const propertyId = selectedArea.ownedProperty;

  if (showVolumes.value) {
    revisedValue.value = selectedArea.production?.[currentYear] || 0;
    showVolumes.value = false;
  } else {
    const updatedValue = Math.max(0, Number(revisedValue.value));

    try {
      const updatedVolumes = {
        ...(selectedArea.production || {}),
        [currentYear]: updatedValue,
      };

      await updateAreaById(selectedArea.id, {
        production: updatedVolumes,
      });

      selectedArea.production = updatedVolumes;
      updatePropertyProduction(propertyId, currentYear);
    } catch (err) {
      console.error("Erro ao corrigir quantidade de volumes:", err);
    } finally {
      showVolumes.value = true;
    }
  }
};

const closeModal = () => {
  setOpenDataEntry(false);
  setSelectedArea({});
};

const editInfo = () => {
  setOpenDataEntry(false);
  setOpenFieldStats(true);
};
</script>
