<template>
  <div class="map-container">
    <GoogleMap
      ref="googleMap"
      :api-key="VITE_GOOGLE_MAPS_API_KEY"
      :center="center"
      :zoom="15"
      style="width: 1000px; height: 500px"
      map-type-id="hybrid"
      :libraries="['drawing']"
    />
  </div>
</template>

<script setup>
import "./Maps.scss";
import { ref, onMounted } from "vue";
import { GoogleMap } from "vue3-google-map";
import axios from "axios";
import { polygonColors } from "@/utils/areaColor";

const { VITE_GOOGLE_MAPS_API_KEY } = import.meta.env;
const center = ref({ lat: -23.55052, lng: -46.633308 }); // localização padrão (São Paulo)
const googleMap = ref(null);

onMounted(() => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((pos) => {
      center.value = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      };
    });
  }

  setTimeout(() => {
    const mapInstance = googleMap.value?.map;
    if (!mapInstance) return;

    mapInstance.setOptions({
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      zoomControl: false,
    });

    const drawingManager = new google.maps.drawing.DrawingManager({
      drawingMode: null,
      drawingControl: true,
      drawingControlOptions: {
        drawingModes: ["polygon"],
      },
    });

    drawingManager.setMap(mapInstance);

    google.maps.event.addListener(
      drawingManager,
      "overlaycomplete",
      (event) => {
        setAreaColors(event);
        const area = event.overlay.getPath().getArray();
        axios.post("http://localhost:3000/areas", {
          area: area.map((point) => ({
            lat: point.lat(),
            lng: point.lng(),
          })),
        });
        drawingManager.setDrawingMode(null);
        // event.overlay.setMap(null);
        alert("Área adicionada com sucesso!");
      }
    );
  }, 200);
});

const setAreaColors = (event) => {
  const randomColor =
    polygonColors[Math.floor(Math.random() * polygonColors.length)];

  event.overlay.setOptions({
    fillColor: randomColor,
    fillOpacity: 0.4,
    strokeColor: randomColor,
    strokeWeight: 2,
  });
};
</script>
