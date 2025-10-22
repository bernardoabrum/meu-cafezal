<template>
  <div class="cmp-maps">
    <div class="buttons">
      <button v-if="!isDrawing" @click="startDrawing">
        Começar a desenhar
      </button>
      <button v-else @click="stopDrawing">Parar</button>
    </div>
    <GoogleMap
      ref="googleMap"
      :api-key="VITE_GOOGLE_MAPS_API_KEY"
      :center="center"
      :zoom="15"
      style="width: 1000px; height: 500px"
      map-type-id="hybrid"
      :libraries="['drawing', 'geometry']"
    />
    <div class="modal">
      <ModalConfirm
        v-if="showModal"
        @confirm="confirmArea"
        @delete="deleteArea"
      />
    </div>
  </div>
</template>

<script setup>
import "./Maps.scss";
import axios from "axios";
import { ref, onMounted, watch } from "vue";
import { GoogleMap } from "vue3-google-map";
import { ModalConfirm } from "@/components";
import { useStore } from "@/store";

const { VITE_GOOGLE_MAPS_API_KEY } = import.meta.env;
const center = ref({ lat: -23.55052, lng: -46.633308 }); // Localização padrão (São Paulo)
const googleMap = ref(null);
const showModal = ref(false);
const currentArea = ref(null);
const isDrawing = ref(false);
let mapInstance = ref(null);
let drawingManager = null;
const { setOpenFieldStats, getLoggedUser, setPendingArea } = useStore();
const user = getLoggedUser();

watch(
  () => googleMap.value?.map,
  (map) => {
    if (!map) return;
    mapInstance = map;

    configMaps();
    loadAreas();
  },
  { immediate: true }
);

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

const configMaps = () => {
  mapInstance.setOptions({
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false,
    zoomControl: false,
    styles: [
      {
        featureType: "poi",
        elementType: "labels",
        stylers: [{ visibility: "off" }],
      },
    ],
  });

  drawingManager = new google.maps.drawing.DrawingManager({
    drawingMode: null,
    drawingControl: false,
  });

  drawingManager.setMap(mapInstance);

  google.maps.event.addListener(drawingManager, "overlaycomplete", (event) => {
    drawingManager.setDrawingMode(null);
    currentArea.value = event.overlay;
    showModal.value = true;
    isDrawing.value = false;
  });
};

const loadAreas = async () => {
  try {
    const { data } = await axios.get(
      `http://localhost:3000/areas?user=${user.id}`
    );
    data.forEach((area) => {
      const polygon = new google.maps.Polygon({
        paths: area.areaCords,
        fillOpacity: 0.3,
        strokeWeight: 1,
      });

      polygon.setMap(mapInstance);
    });
  } catch (err) {
    console.error("Erro ao carregar áreas:", err);
  }
};

const startDrawing = () => {
  isDrawing.value = true;
  drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYGON);
};

const stopDrawing = () => {
  isDrawing.value = false;
  drawingManager.setDrawingMode(null);
};

const computeArea = (path) => {
  return google.maps.geometry.spherical.computeArea(path);
};

const confirmArea = () => {
  const path = currentArea.value.getPath().getArray();
  const areaSize = computeArea(path);
  const payload = {
    user: user.id,
    areaSize,
    areaCords: path.map((point) => ({
      lat: point.lat(),
      lng: point.lng(),
    })),
  };

  setOpenFieldStats(true);
  setPendingArea(payload);
  showModal.value = false;
  currentArea.value = null;
};

const deleteArea = () => {
  showModal.value = false;
  currentArea.value = null;
  window.location.reload();
};
</script>
