<template>
  <div class="cmp-header">
    <h1>Header</h1>
    <div>
      <p>{{ name }}</p>
      <button @click="logout">Sair</button>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import "./Header.scss";
import router from "@/router";
import { useStore } from "@/store";

const name = ref("");
const { setLoggedUser, getLoggedUser } = useStore();

onMounted(() => {
  name.value = getLoggedUser().name;
});

const logout = () => {
  router.push("/login");
  setLoggedUser(null);
};
</script>
