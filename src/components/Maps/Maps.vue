<template>
  <div class="map-container">
    <GoogleMap
      :api-key="VITE_GOOGLE_MAPS_API_KEY"
      :center="center"
      :zoom="15"
      style="width: 1000px; height: 500px"
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
import { GoogleMap } from "vue3-google-map";

const { VITE_GOOGLE_MAPS_API_KEY } = import.meta.env;

const center = ref({ lat: -23.55052, lng: -46.633308 }); // localização padrão (São Paulo)

onMounted(() => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((pos) => {
      center.value = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      };
    });
  }
});
</script>
