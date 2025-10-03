import { createStore } from "vuex";
import axios from "axios";

const store = createStore({
  state: {
    openFieldStats: false,
    selectedArea: {},
    loggedUser: null,
    isAuthenticated: false,
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
    setLoggedUser(state, user) {
      state.loggedUser = user;
      state.isAuthenticated = !!user;
    },
    logout(state) {
      state.loggedUser = null;
      state.isAuthenticated = false;
    },
  },
  actions: {
    async saveSelectedArea({ state, commit }, payload) {
      try {
        const id = state.selectedArea.id;
        await axios.patch(`http://localhost:3000/areas/${id}`, payload);

        commit("updateSelectedAreaInfo", payload);
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
    getLoggedUser(state) {
      return state.loggedUser;
    },
    getIsAuthenticated(state) {
      return state.isAuthenticated;
    },
  },
});

export const useStore = () => {
  const setOpenFieldStats = (value) => store.commit("setOpenFieldStats", value);
  const getOpenFieldStats = () => store.state.openFieldStats;
  const setSelectedArea = (area) => store.commit("setSelectedArea", area);
  const getSelectedArea = () => store.state.selectedArea;
  const saveSelectedArea = (payload) =>
    store.dispatch("saveSelectedArea", payload);
  const setLoggedUser = (user) => store.commit("setLoggedUser", user);
  const getLoggedUser = () => store.state.loggedUser;
  const getIsAuthenticated = () => store.state.isAuthenticated;

  return {
    setOpenFieldStats,
    getOpenFieldStats,
    setSelectedArea,
    getSelectedArea,
    saveSelectedArea,
    getLoggedUser,
    setLoggedUser,
    getIsAuthenticated,
  };
};

export default store;
