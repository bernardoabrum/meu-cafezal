<template>
  <div class="demarcate-page">
    <Maps :focusedArea="focusedAreaData" />
    <Sidebar @focusArea="focusedArea" />
  </div>
</template>

<script setup>
import { Maps, Sidebar } from "@/components";
import { ref } from "vue";

const focusedAreaData = ref(null);

const focusedArea = (area) => {
  focusedAreaData.value = area;
};
</script>
