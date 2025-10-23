<template>
  <div class="visualize-page">
    <BackButton />
    <EditableMaps :focusedArea="focusedArea" />
    <Sidebar @focusArea="putFocus" />
    <DataEntry v-if="getOpenDataEntry()" />
    <FieldStats v-if="getOpenFieldStats()" />
  </div>
</template>

<script setup>
import "./Visualize.scss";
import { ref } from "vue";
import {
  BackButton,
  EditableMaps,
  Sidebar,
  DataEntry,
  FieldStats,
} from "@/components";
import { useStore } from "@/store";

const { getOpenDataEntry, getOpenFieldStats } = useStore();

const focusedArea = ref(null);

const putFocus = (area) => {
  focusedArea.value = area;
};
</script>
