<template>
  <div class="map-container">
    <GMapMap
      :center="center"
      :zoom="15"
      style="width: 100%; height: 100%"
      map-type-id="hybrid"
      :options="{
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      }"
    />
  </div>
</template>

<script setup>
import "./Maps.scss";
import { ref, onMounted } from "vue";

const center = ref({ lat: -23.55052, lng: -46.633308 });

onMounted(() => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        center.value = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
      },
      (err) => {
        console.error("Erro ao obter localização:", err);
      }
    );
  }
});
</script>
