<template>
  <div class="maps-container">
    <GoogleMap
      ref="googleMap"
      :api-key="VITE_GOOGLE_MAPS_API_KEY"
      :center="center"
      :zoom="15"
      style="width: 1000px; height: 500px"
      map-type-id="hybrid"
      :libraries="['drawing', 'geometry']"
    />
  </div>
</template>

<script setup>
import "./Maps.scss";
import axios from "axios";
import { ref, onMounted } from "vue";
import { GoogleMap } from "vue3-google-map";
import { AreaColors } from "@/utils/AreaColors";

const { VITE_GOOGLE_MAPS_API_KEY } = import.meta.env;
const center = ref({ lat: -23.55052, lng: -46.633308 }); // Localização padrão (São Paulo)
const googleMap = ref(null);
const showModal = ref(false);

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

    loadAreas(mapInstance);
    configMaps(mapInstance);
  }, 500);
});

const configMaps = (mapInstance) => {
  mapInstance.setOptions({
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false,
    zoomControl: false,
  });

  const drawingManager = new google.maps.drawing.DrawingManager({
    drawingMode: null,
    drawingControlOptions: {
      drawingModes: ["polygon"],
    },
  });

  drawingManager.setMap(mapInstance);

  google.maps.event.addListener(drawingManager, "overlaycomplete", (event) => {
    setAreaColors(event.overlay);
    drawingManager.setDrawingMode(null);
    showModal.value = true;
    const path = event.overlay.getPath().getArray();
    const areaSize = computeArea(path);
    const area = event.overlay.getPath().getArray();
    axios.post("http://localhost:3000/areas", {
      area: area.map((point) => ({
        lat: point.lat(),
        lng: point.lng(),
      })),
      areaSize,
    });
  });
};

const setAreaColors = (overlay) => {
  const randomColor = AreaColors[Math.floor(Math.random() * AreaColors.length)];

  overlay.setOptions({
    fillColor: randomColor,
    fillOpacity: 0.4,
    strokeColor: randomColor,
    strokeWeight: 2,
  });
};
const computeArea = (path) => {
  return google.maps.geometry.spherical.computeArea(path);
};

const loadAreas = async (mapInstance) => {
  try {
    const { data } = await axios.get("http://localhost:3000/areas");
    data.forEach((savedArea) => {
      const polygon = new google.maps.Polygon({
        paths: savedArea.area,
      });

      setAreaColors(polygon);
      polygon.setMap(mapInstance);

      google.maps.event.addListener(polygon, "click", () => {
        console.log("ID da área clicada:", savedArea.id);
        console.log("Tamanho da área clicada:", savedArea.areaSize);
      });
    });
  } catch (err) {
    console.error("Erro ao carregar áreas:", err);
  }
};
</script>
