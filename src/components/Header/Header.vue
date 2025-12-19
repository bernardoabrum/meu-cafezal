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
import { ref } from "vue";
import "./Header.scss";
import router from "@/router";
import { auth } from "@/firebase";
import { signOut } from "firebase/auth";

const name = ref("");

const logout = async () => {
  await signOut(auth);
  router.push("/login");
};

const goHome = () => {
  router.push("/home");
};
</script>
