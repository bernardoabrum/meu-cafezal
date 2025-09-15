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
        <input type="text" placeholder="Digite o nome da área" />
      </div>
    </div>
  </div>
</template>

<script setup>
import "./FieldStats.scss";
import { ref } from "vue";

const areaType = ref("property");
</script>
