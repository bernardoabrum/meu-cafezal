<template>
  <div class="cmp-back-button">
    <a @click="goBack">
      <font-awesome-icon :icon="faArrowLeft" />
      Voltar
    </a>
  </div>
</template>

<script setup>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import "./BackButton.scss";

const goBack = () => {
  window.history.back();
};
</script>
