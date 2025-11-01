<template>
  <div class="page demarcate-page">
    <BackButton />
    <Maps />
    <FieldStats v-if="getOpenFieldStats()" />
  </div>
</template>

<script setup>
import "./Demarcate.scss";
import { useStore } from "@/store";
import { Maps, FieldStats, BackButton } from "@/components";

const { getOpenFieldStats } = useStore();
</script>
