<template>
  <div class="demarcate-page">
    <Maps :focusedArea="focusedAreaData" />
    <Sidebar @focusArea="focusedArea" />
    <FieldStats v-if="openFieldStats" />
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useStore } from "@/store";
import { Maps, Sidebar, FieldStats } from "@/components";
import { computed } from "vue";
import "./Demarcate.scss";

const { getOpenFieldStats } = useStore();
const openFieldStats = computed(() => getOpenFieldStats());
const focusedAreaData = ref(null);

const focusedArea = (area) => {
  focusedAreaData.value = area;
};
</script>
