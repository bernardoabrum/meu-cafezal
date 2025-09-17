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
import { ref, onMounted } from "vue";
import { GoogleMap } from "vue3-google-map";
import { AreaColors } from "@/utils/AreaColors";
import { ModalConfirm } from "@/components";
import { useStore } from "@/store";

const { VITE_GOOGLE_MAPS_API_KEY } = import.meta.env;
const center = ref({ lat: -23.55052, lng: -46.633308 }); // Localização padrão (São Paulo)
const googleMap = ref(null);
const showModal = ref(false);
const currentArea = ref(null);
const { setOpenFieldStats, setSelectedArea, getSelectedArea } = useStore();

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
  }, 100);
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
    currentArea.value = event.overlay;
    showModal.value = true;
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
    data.forEach((area) => {
      const polygon = new google.maps.Polygon({
        paths: area.areaCords,
      });

      setAreaColors(polygon);
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
    });
  } catch (err) {
    console.error("Erro ao carregar áreas:", err);
  }
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
    });
  } catch (err) {
    console.error("Erro ao salvar área:", err);
  }
  showModal.value = false;
  currentArea.value = null;
};

const deleteArea = () => {
  currentArea.value.setMap(null);
  showModal.value = false;
  currentArea.value = null;
  window.location.reload();
};
</script>
