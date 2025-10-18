<template>
  <div class="cmp-editable-maps">
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
import "./EditableMaps.scss";
import axios from "axios";
import { ref, onMounted, watch } from "vue";
import { GoogleMap } from "vue3-google-map";
import { useStore } from "@/store";

const { VITE_GOOGLE_MAPS_API_KEY } = import.meta.env;
const center = ref({ lat: -23.55052, lng: -46.633308 }); // Localização padrão (São Paulo)
const googleMap = ref(null);
let mapInstance = ref(null);
const { setSelectedArea, getSelectedArea, getLoggedUser } = useStore();
const user = getLoggedUser();

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
    drawingControl: false,
  });

  drawingManager.setMap(mapInstance);
};

const loadAreas = async () => {
  try {
    const { data } = await axios.get(
      `http://localhost:3000/areas?user=${user.id}`
    );
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
</script>
