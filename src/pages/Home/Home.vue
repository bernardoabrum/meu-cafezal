<template>
  <div class="page home-page">
    <h1>Home Page</h1>
    <div class="buttons">
      <button @click="redirectUser('demarcate')">Marcar nova área</button>
      <button @click="redirectUser('visualize')">
        Ver minhas propriedades
      </button>
      <button @click="redirectUser('statistics')">
        Estatísticas de produção
      </button>
    </div>
  </div>
</template>

<script setup>
import "./Home.scss";
import router from "@/router";

const redirectUser = (route) => {
  router.push(`/${route}`);
};
</script>
