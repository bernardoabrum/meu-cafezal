<template>
  <div :class="['page visualize-page', { moveButton: toggleSidebar }]">
    <BackButton />
    <EditableMaps :focusedArea="focusedArea" />
    <Sidebar @focusArea="putFocus" @toggleSidebar="openSidebar" />
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

const {
  getOpenDataEntry,
  getOpenFieldStats,
  setOpenDataEntry,
  setSelectedArea,
} = useStore();

const focusedArea = ref(null);
const toggleSidebar = ref(false);

const putFocus = (area) => {
  focusedArea.value = area;
  setSelectedArea(area);
  if (area.areaType === "property") {
    setOpenDataEntry(true);
  }
};

const openSidebar = (value) => {
  toggleSidebar.value = value;
};
</script>
