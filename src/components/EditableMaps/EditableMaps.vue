<template>
  <div class="cmp-editable-maps">
    <div class="button">
      <button v-if="editingSelectedArea" @click="saveAreaEdition">
        Finalizar edição
      </button>
    </div>
    <GoogleMap
      ref="googleMap"
      :api-key="VITE_GOOGLE_MAPS_API_KEY"
      :center="center"
      :zoom="15"
      style="width: 100%; height: 100%"
      map-type-id="hybrid"
      :libraries="['drawing', 'geometry']"
    />
  </div>
</template>

<script setup>
import "./EditableMaps.scss";
import { ref, onMounted, watch, computed } from "vue";
import { GoogleMap } from "vue3-google-map";
import { useStore } from "@/store";
import { getAreasByUser } from "@/services/areas.service";
import { updateAreaGeometry } from "@/services/areas.service";

const { VITE_GOOGLE_MAPS_API_KEY } = import.meta.env;
const center = ref({ lat: -23.55052, lng: -46.633308 }); // Localização padrão (São Paulo)
const googleMap = ref(null);
let mapInstance = ref(null);
const {
  setSelectedArea,
  setOpenDataEntry,
  getSelectedArea,
  getEditingSelectedArea,
  setEditingSelectedArea,
} = useStore();
const polygons = ref([]);
const editingSelectedArea = computed(() => getEditingSelectedArea());

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
  { immediate: true },
);

watch(editingSelectedArea, (isEditing) => {
  const selectedArea = getSelectedArea();

  polygons.value.forEach(({ polygon, data }) => {
    const isSelected = data.id === selectedArea?.id;

    polygon.setEditable(isEditing && isSelected);
    polygon.setDraggable(isEditing && isSelected);

    if (isEditing && isSelected) {
      setPolygonStyle(polygon, true);
    } else {
      setPolygonStyle(polygon, false);
    }
  });
});

watch(
  () => props.focusedArea,
  (area) => {
    const bounds = new google.maps.LatLngBounds();
    area.areaCords.forEach((coord) => {
      bounds.extend(new google.maps.LatLng(coord.lat, coord.lng));
    });

    mapInstance.fitBounds(bounds);

    polygons.value.forEach(({ polygon, data }) => {
      if (data.id === area.id) {
        setPolygonStyle(polygon, true);
      } else {
        setPolygonStyle(polygon, false);
      }
    });
  },
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
    const data = await getAreasByUser();
    data.forEach((area) => {
      const isProperty = area.areaType === "property";

      const polygon = new google.maps.Polygon({
        paths: area.areaCords,
        fillColor: area.areaType === "property" ? "#3357FF" : "#33FF57",
        strokeColor: area.areaType === "property" ? "#3357FF" : "#33FF57",
        fillOpacity: 0.3,
        strokeWeight: 1,
        zIndex: isProperty ? 1 : 2,
      });

      polygon.setMap(mapInstance);
      polygons.value.push({ polygon, data: area });

      google.maps.event.addListener(polygon, "click", async () => {
        try {
          setSelectedArea({ ...area });
          setOpenDataEntry(true);
        } catch (err) {
          console.error(err);
        }
      });

      google.maps.event.addListener(polygon, "mouseover", () => {
        setPolygonStyle(polygon, true);
      });

      google.maps.event.addListener(polygon, "mouseout", () => {
        setPolygonStyle(polygon, false);
      });
    });
  } catch (err) {
    console.error("Erro ao carregar áreas:", err);
  }
};

const setPolygonStyle = (polygon, isActive = false) => {
  polygon.setOptions({
    fillOpacity: isActive ? 0.5 : 0.3,
    strokeWeight: isActive ? 2 : 1,
  });
};

const saveAreaEdition = async () => {
  try {
    const selectedArea = getSelectedArea();

    const selectedPolygon = polygons.value.find(
      ({ data }) => data.id === selectedArea?.id,
    );

    if (!selectedPolygon) return;

    const polygonPath = selectedPolygon.polygon.getPath().getArray();

    await updateAreaGeometry(selectedArea.id, polygonPath);

    selectedPolygon.polygon.setEditable(false);
    selectedPolygon.polygon.setDraggable(false);

    setEditingSelectedArea(false);
    window.location.reload();
  } catch (err) {
    console.error(err);
  }
};
</script>
