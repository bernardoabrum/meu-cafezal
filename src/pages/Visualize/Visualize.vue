<template>
  <div class="visualize-page">
    <BackButton />
    <EditableMaps :focusedArea="focusedArea" />
    <Sidebar @focusArea="putFocus" />
    <DataEntry v-if="getOpenDataEntry()" />
  </div>
</template>

<script setup>
import "./Visualize.scss";
import { ref } from "vue";
import { BackButton, EditableMaps, Sidebar, DataEntry } from "@/components";
import { useStore } from "@/store";

const { getOpenDataEntry } = useStore();

const focusedArea = ref(null);

const putFocus = (area) => {
  focusedArea.value = area;
};
</script>
