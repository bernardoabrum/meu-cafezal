<template>
  <h1>App</h1>
  <Demarcate />
  <FieldStats v-if="openModalInfo" />
</template>

<script setup>
import { computed } from "vue";
import store from "../store";
import { Demarcate } from "@/pages";
import { FieldStats } from "@/components";

const openModalInfo = computed(() => store.state.openFieldStats);
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
