import { createStore } from "vuex";
import {
  updateAreaById,
  getAreasByUser,
  getAreaById,
} from "@/services/areas.service";

const store = createStore({
  state: {
    openFieldStats: false,
    openDataEntry: false,
    pendingArea: {},
    selectedArea: {},
    editingSelectedArea: false,
  },
  mutations: {
    setOpenFieldStats(state, value) {
      state.openFieldStats = value;
    },
    setOpenDataEntry(state, value) {
      state.openDataEntry = value;
    },
    setPendingArea(state, area) {
      state.pendingArea = area;
    },
    setSelectedArea(state, area) {
      state.selectedArea = area;
    },
    setEditingSelectedArea(state, value) {
      state.editingSelectedArea = value;
    },
  },
  actions: {
    async updatePropertyProduction(context, { propertyId, currentYear }) {
      try {
        const property = await getAreaById(propertyId);
        const allFields = await getAreasByUser({
          areaType: "field",
          ownedProperty: propertyId,
        });
        const totalProduction = allFields.reduce((acc, field) => {
          return acc + (field.production?.[currentYear] || 0);
        }, 0);

        const updatedProduction = {
          ...(property.production || {}),
          [currentYear]: totalProduction,
        };

        await updateAreaById(propertyId, {
          production: updatedProduction,
        });
      } catch (err) {
        console.error("Erro ao atualizar produção da propriedade:", err);
      }
    },
  },
  getters: {
    getOpenFieldStats(state) {
      return state.openFieldStats;
    },
    getOpenDataEntry(state) {
      return state.openDataEntry;
    },
    getPendingArea(state) {
      return state.pendingArea;
    },
    getSelectedArea(state) {
      return state.selectedArea;
    },
    getEditingSelectedArea(state) {
      return state.editingSelectedArea;
    },
  },
});

export const useStore = () => {
  const setOpenFieldStats = (value) => store.commit("setOpenFieldStats", value);
  const getOpenFieldStats = () => store.state.openFieldStats;
  const setOpenDataEntry = (value) => store.commit("setOpenDataEntry", value);
  const getOpenDataEntry = () => store.state.openDataEntry;
  const setPendingArea = (area) => store.commit("setPendingArea", area);
  const getPendingArea = () => store.state.pendingArea;
  const setSelectedArea = (area) => store.commit("setSelectedArea", area);
  const getSelectedArea = () => store.state.selectedArea;
  const setEditingSelectedArea = (value) =>
    store.commit("setEditingSelectedArea", value);
  const getEditingSelectedArea = () => store.state.editingSelectedArea;
  const updatePropertyProduction = (propertyId, currentYear) =>
    store.dispatch("updatePropertyProduction", { propertyId, currentYear });

  return {
    setOpenFieldStats,
    getOpenFieldStats,
    setOpenDataEntry,
    getOpenDataEntry,
    setPendingArea,
    getPendingArea,
    setSelectedArea,
    getSelectedArea,
    updatePropertyProduction,
    setEditingSelectedArea,
    getEditingSelectedArea,
  };
};

export default store;
