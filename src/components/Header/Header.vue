<template>
  <div class="cmp-header">
    <div class="logo" @click="goHome">
      <img src="@/assets/coffee.png" alt="##" />
      <p>MEU CAFEZAL</p>
    </div>
    <div class="account">
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

const goHome = () => {
  router.push("/home");
};
</script>
