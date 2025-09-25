<template>
  <div class="cmp-sidebar">
    <h2>Sidebar</h2>
    <div v-for="property in properties" :key="property.id">
      <div class="properties-container">
        <button>
          >
        </button>
        <button @click="handlePropertyClick(property)">
          {{ property.areaName }}
        </button>
      </div>
      <div v-if="expanded.includes(property.id)">
        <button
          v-for="field in getFieldsByProperty(property.id)"
          :key="field.id"
          @click="$emit('focusArea', field)"
        >
          {{ field.areaName }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import "./Sidebar.scss";

let properties = ref([]);
let fields = ref([]);
let expanded = ref([]);
const emit = defineEmits(["focusArea"]);

onMounted(async () => {
  const resProps = await axios.get(
    "http://localhost:3000/areas?areaType=property"
  );
  properties.value = resProps.data;

  const resFields = await axios.get(
    "http://localhost:3000/areas?areaType=field"
  );
  fields.value = resFields.data;
});

const handlePropertyClick = (property) => {
  toggleExpand(property.id);
  emit("focusArea", property);
};

const toggleExpand = (id) => {
  if (expanded.value.includes(id)) {
    expanded.value = expanded.value.filter((x) => x !== id);
  } else {
    expanded.value.push(id);
  }
};

const getFieldsByProperty = (propertyId) => {
  return fields.value.filter((f) => f.ownedProperty === propertyId);
};
</script>
