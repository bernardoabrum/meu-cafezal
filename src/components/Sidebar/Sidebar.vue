<template>
  <div class="cmp-sidebar" :class="{ hidden: !showSidebar }">
    <div class="container">
      <h2>Propriedades</h2>
      <div class="button" v-for="property in properties" :key="property.id">
        <div class="property-button">
          <button @click="toggleExpand(property.id)">
            <font-awesome-icon
              :icon="
                expanded.includes(property.id) ? faChevronUp : faChevronDown
              "
            />
          </button>
          <button class="name" @click="handleEmit(property)">
            {{ property.areaName }}
          </button>
        </div>
        <div class="fields-button" v-if="expanded.includes(property.id)">
          <button
            v-for="field in getFieldsByProperty(property.id)"
            :key="field.id"
            @click="handleEmit(field)"
          >
            {{ field.areaName }}
          </button>
        </div>
      </div>
    </div>
    <div class="close">
      <button @click="toggleSidebar">
        <font-awesome-icon
          :icon="showSidebar ? faChevronLeft : faChevronRight"
        />
      </button>
    </div>
  </div>
</template>

<script setup>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faChevronDown,
  faChevronUp,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { ref, onMounted } from "vue";
import axios from "axios";
import "./Sidebar.scss";
import { useStore } from "@/store";

let properties = ref([]);
let fields = ref([]);
let expanded = ref([]);
const showSidebar = ref(true);
const emit = defineEmits(["focusArea", "toggleSidebar"]);
const { getLoggedUser } = useStore();

onMounted(async () => {
  const user = getLoggedUser();
  const resProps = await axios.get(
    `http://localhost:3000/areas?areaType=property&user=${user.id}`
  );
  properties.value = resProps.data;

  const resFields = await axios.get(
    `http://localhost:3000/areas?areaType=field&user=${user.id}`
  );
  fields.value = resFields.data;
});

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

const toggleSidebar = () => {
  emit("toggleSidebar", showSidebar.value);
  showSidebar.value ? (showSidebar.value = false) : (showSidebar.value = true);
};

const handleEmit = (area) => {
  emit("focusArea", area);
  toggleSidebar();
};
</script>
