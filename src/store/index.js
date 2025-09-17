import { createStore } from "vuex";
import axios from "axios";

const store = createStore({
  state: {
    openFieldStats: false,
    selectedArea: {},
  },
  mutations: {
    setOpenFieldStats(state, value) {
      state.openFieldStats = value;
    },
    setSelectedArea(state, area) {
      state.selectedArea = area;
    },
    updateSelectedAreaInfo(state, payload) {
      state.selectedArea = { ...state.selectedArea, ...payload };
    },
  },
  actions: {
    async saveSelectedArea({ commit, state }, { areaType, areaName }) {
      try {
        const updatedArea = {
          ...state.selectedArea,
          areaType,
          areaName,
        };

        await axios.put(
          `http://localhost:3000/areas/${updatedArea.id}`,
          updatedArea
        );
        commit("setSelectedArea", updatedArea);
      } catch (err) {
        console.error("Erro ao salvar informações da área:", err);
      }
    },
  },
  getters: {
    getOpenFieldStats(state) {
      return state.openFieldStats;
    },
    getSelectedArea(state) {
      return state.selectedArea;
    },
  },
});

export const useStore = () => {
  const setOpenFieldStats = (value) => store.commit("setOpenFieldStats", value);
  const getOpenFieldStats = () => store.state.openFieldStats;
  const setSelectedArea = (area) => store.commit("setSelectedArea", area);
  const getSelectedArea = () => store.state.selectedArea;
  const saveSelectedArea = (areaType, areaName) =>
    store.dispatch("saveSelectedArea", { areaType, areaName });

  return {
    setOpenFieldStats,
    getOpenFieldStats,
    setSelectedArea,
    getSelectedArea,
    saveSelectedArea,
  };
};

export default store;
