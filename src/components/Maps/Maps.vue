<template>
  <div class="cmp-maps">
    <div class="button">
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
      style="width: 100%; height: 100%"
      map-type-id="hybrid"
      :libraries="['geometry']"
    />
  </div>
</template>

<script setup>
import "./Maps.scss";
import { ref, onMounted, watch } from "vue";
import { GoogleMap } from "vue3-google-map";
import { useStore } from "@/store";
import { getAreasByUser } from "@/services/areas.service";
import { auth } from "@/firebase";

const { VITE_GOOGLE_MAPS_API_KEY } = import.meta.env;
const center = ref({ lat: -23.55052, lng: -46.633308 }); // Localização padrão (São Paulo)
const googleMap = ref(null);
const isDrawing = ref(false);
const userId = auth.currentUser.uid;
let mapInstance = null;
let polygon = null;
let path = [];
let mapClickListener = null;

const { setOpenFieldStats, setPendingArea } = useStore();

watch(
  () => googleMap.value?.map,
  (map) => {
    if (!map) return;
    mapInstance = map;

    configMaps();
    loadAreas();
  },
  { immediate: true },
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
};

const loadAreas = async () => {
  try {
    const data = await getAreasByUser();
    data.forEach((area) => {
      const polygon = new google.maps.Polygon({
        paths: area.areaCords,
        fillOpacity: 0.3,
        strokeWeight: 1,
        clickable: false,
      });

      polygon.setMap(mapInstance);
    });
  } catch (err) {
    console.error("Erro ao carregar áreas:", err);
  }
};

const computeArea = (path) => {
  return google.maps.geometry.spherical.computeArea(path);
};

const startDrawing = () => {
  isDrawing.value = true;

  mapInstance.setOptions({
    draggableCursor: "crosshair",
  });

  polygon = new google.maps.Polygon({
    paths: path,
    editable: true,
    strokeWeight: 2,
    fillOpacity: 0.3,
    map: mapInstance,
  });

  mapClickListener = mapInstance.addListener("click", (event) => {
    const point = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    };

    path.push(point);
    polygon.setPath(path);
  });
};

const stopDrawing = () => {
  isDrawing.value = false;

  mapInstance.setOptions({
    draggableCursor: "default",
  });

  if (mapClickListener) {
    google.maps.event.removeListener(mapClickListener);
  }

  const polygonPath = polygon.getPath().getArray();
  const areaSize = computeArea(polygonPath);

  const payload = {
    user: userId,
    areaSize,
    areaCords: polygonPath.map((point) => ({
      lat: point.lat(),
      lng: point.lng(),
    })),
  };

  setPendingArea(payload);
  setOpenFieldStats(true);
};
</script>
