<template>
  <div class="cmp-data-entry">
    <div class="modal">
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
        <div class="register">
          <p>Lançar quantidade de volumes produzidos:</p>
          <div class="container">
            <div class="send">
              <input type="number" placeholder="0" />
              <button>Enviar</button>
            </div>
            <p>Total lançado: 0</p>
          </div>
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
import "./DataEntry.scss";
import { useStore } from "@/store";

const {
  setOpenDataEntry,
  getSelectedArea,
  setSelectedArea,
  setOpenFieldStats,
} = useStore();

const selectedArea = getSelectedArea();

const closeModal = () => {
  setOpenDataEntry(false);
  setSelectedArea({});
};

const editInfo = () => {
  setOpenDataEntry(false);
  setOpenFieldStats(true);
};
</script>
