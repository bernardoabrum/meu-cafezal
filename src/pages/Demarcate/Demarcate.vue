<template>
  <div class="demarcate-page">
    <BackButton />
    <Maps />
    <FieldStats v-if="openFieldStats" />
  </div>
</template>

<script setup>
import "./Demarcate.scss";
import { computed } from "vue";
import { useStore } from "@/store";
import { Maps, FieldStats, BackButton } from "@/components";

const { getOpenFieldStats } = useStore();
const openFieldStats = computed(() => getOpenFieldStats());
</script>
