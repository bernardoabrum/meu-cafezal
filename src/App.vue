<template>
  <Header v-if="isAuthenticated" />
  <router-view />
</template>

<script setup>
import { Header } from "@/components";
import { ref, computed } from "vue";
import { useStore } from "@/store";

const user = ref(null);
const { getIsAuthenticated } = useStore();
const isAuthenticated = computed(() => getIsAuthenticated());
</script>

<style>
html,
body,
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 24px;
}
</style>
