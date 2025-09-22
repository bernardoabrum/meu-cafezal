<template>
  <h1>App</h1>
  <Demarcate />
  <FieldStats v-if="showModal" />
  <Sidebar />
</template>

<script setup>
import { Demarcate } from "@/pages";
import { FieldStats, Sidebar } from "@/components";
import { useStore } from "@/store";
import { computed } from "vue";

const { getOpenFieldStats } = useStore();

const showModal = computed(() => getOpenFieldStats());
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
