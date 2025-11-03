<template>
  <div class="cmp-data-entry">
    <div class="container">
      <div class="infos" v-if="selectedArea.areaType == 'field'">
        <div class="name">
          <p>Talhão</p>
          <h2>{{ selectedArea.areaName }}</h2>
        </div>
        <div>
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
        <div>
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
          <p>
            Total lançado ({{ currentYear }}):
            <span v-if="showVolumes">
              {{ selectedArea.production?.[currentYear] || 0 }}
            </span>
            <span v-else>
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
            </span>
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
        <button @click="editInfo">Editar informações</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import "./DataEntry.scss";
import { useStore } from "@/store";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faPenToSquare, faCheck } from "@fortawesome/free-solid-svg-icons";

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

const sendValue = async () => {
  const newValue = Math.max(0, Number(currentProduction.value));
  const propertyId = selectedArea.ownedProperty;

  try {
    const existingVolumes = selectedArea.production || {};
    const updatedVolumes = { ...existingVolumes };
    updatedVolumes[currentYear] = (updatedVolumes[currentYear] || 0) + newValue;

    await axios.patch(`http://localhost:3000/areas/${selectedArea.id}`, {
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

      await axios.patch(`http://localhost:3000/areas/${selectedArea.id}`, {
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
