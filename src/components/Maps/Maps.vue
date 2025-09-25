<template>
  <div class="cmp-maps">
    <GoogleMap
      ref="googleMap"
      :api-key="VITE_GOOGLE_MAPS_API_KEY"
      :center="center"
      :zoom="15"
      style="width: 1000px; height: 500px"
      map-type-id="hybrid"
      :libraries="['drawing', 'geometry']"
    />
    <ModalConfirm
      v-if="showModal"
      @confirm="confirmArea"
      @delete="deleteArea"
    />
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
let mapInstance = ref(null);
const { setOpenFieldStats, setSelectedArea, getSelectedArea } = useStore();

const props = defineProps({
  focusedArea: Object,
});

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

watch(
  () => props.focusedArea,
  (area) => {
    const bounds = new google.maps.LatLngBounds();
    area.areaCords.forEach((coord) => {
      bounds.extend(new google.maps.LatLng(coord.lat, coord.lng));
    });
    mapInstance.fitBounds(bounds);
  }
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

  const drawingManager = new google.maps.drawing.DrawingManager({
    drawingMode: null,
    drawingControlOptions: {
      drawingModes: ["polygon"],
    },
  });

  drawingManager.setMap(mapInstance);

  google.maps.event.addListener(drawingManager, "overlaycomplete", (event) => {
    drawingManager.setDrawingMode(null);
    currentArea.value = event.overlay;
    showModal.value = true;
  });
};

const loadAreas = async () => {
  try {
    const { data } = await axios.get("http://localhost:3000/areas");
    data.forEach((area) => {
      const polygon = new google.maps.Polygon({
        paths: area.areaCords,
        fillColor: getAreaColor(area.areaType),
        strokeColor: getAreaColor(area.areaType),
        fillOpacity: 0.3,
        strokeWeight: 1,
      });

      polygon.setMap(mapInstance);

      google.maps.event.addListener(polygon, "click", () => {
        const currentSelected = getSelectedArea();

        if (currentSelected && currentSelected.id === area.id) {
          setSelectedArea({ ...area, ...currentSelected });
        } else {
          setSelectedArea(area);
        }
        setOpenFieldStats(true);
      });

      const originalOptions = {
        strokeWeight: polygon.strokeWeight,
        fillOpacity: polygon.fillOpacity,
      };

      google.maps.event.addListener(polygon, "mouseover", () => {
        polygon.setOptions({
          fillOpacity: 0.5,
          strokeWeight: 2,
        });
      });

      google.maps.event.addListener(polygon, "mouseout", () => {
        polygon.setOptions(originalOptions);
      });
    });
  } catch (err) {
    console.error("Erro ao carregar áreas:", err);
  }
};

const getAreaColor = (areaType) => {
  if (!areaType) return null;
  return areaType === "property" ? "#3357FF" : "#33FF57";
};

const computeArea = (path) => {
  return google.maps.geometry.spherical.computeArea(path);
};

const confirmArea = () => {
  const path = currentArea.value.getPath().getArray();
  const areaSize = computeArea(path);

  try {
    axios.post("http://localhost:3000/areas", {
      areaCords: path.map((point) => ({
        lat: point.lat(),
        lng: point.lng(),
      })),
      areaSize,
      areaName: "Nova propriedade",
    });
  } catch (err) {
    console.error("Erro ao salvar área:", err);
  }

  showModal.value = false;
  currentArea.value = null;
  window.location.reload();
};

const deleteArea = () => {
  showModal.value = false;
  currentArea.value = null;
  window.location.reload();
};
</script>
