<template>
  <div class="visualize-page">
    <BackButton />
    <EditableMaps :focusedArea="focusedAreaData" />
    <Sidebar @focusArea="focusedArea" />
  </div>
</template>

<script setup>
import "./Visualize.scss";
import { ref } from "vue";
import { BackButton, EditableMaps, Sidebar } from "@/components";

const focusedAreaData = ref(null);

const focusedArea = (area) => {
  focusedAreaData.value = area;
};
</script>
