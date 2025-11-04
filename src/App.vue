<template>
  <Header v-if="isAuthenticated" />
  <router-view />
</template>

<script setup>
import "./App.scss";
import { Header } from "@/components";
import { computed } from "vue";
import { useStore } from "@/store";

const { getIsAuthenticated } = useStore();
const isAuthenticated = computed(() => getIsAuthenticated());
</script>
