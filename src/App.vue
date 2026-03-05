<template>
  <Header v-if="user" />
  <router-view />
</template>

<script setup>
import "./App.scss";
import { Header } from "@/components";
import { ref, onMounted } from "vue";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const user = ref(null);

onMounted(() => {
  const auth = getAuth();

  onAuthStateChanged(auth, (firebaseUser) => {
    user.value = firebaseUser;
  });
});
</script>
