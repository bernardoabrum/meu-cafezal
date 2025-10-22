import { createStore } from "vuex";

const store = createStore({
  state: {
    openFieldStats: false,
    openDataEntry: false,
    pendingArea: {},
    selectedArea: {},
    loggedUser: null,
    isAuthenticated: false,
  },
  mutations: {
    setOpenDataEntry(state, value) {
      state.openDataEntry = value;
    },
    setOpenFieldStats(state, value) {
      state.openFieldStats = value;
    },
    setPendingArea(state, area) {
      state.pendingArea = area;
    },
    setSelectedArea(state, area) {
      state.selectedArea = area;
    },
    setLoggedUser(state, user) {
      state.loggedUser = user;
      state.isAuthenticated = !!user;
      if (user) {
        localStorage.setItem("authToken", Date.now());
        localStorage.setItem("loggedUser", JSON.stringify(user));
      } else {
        localStorage.removeItem("authToken");
        localStorage.removeItem("loggedUser");
      }
    },
  },
  actions: {
    checkAuth({ commit }) {
      const token = localStorage.getItem("authToken");
      if (token) {
        const savedUser = JSON.parse(localStorage.getItem("loggedUser"));
        commit("setLoggedUser", savedUser);
      }
    },
  },
  getters: {
    getOpenDataEntry(state) {
      return state.openDataEntry;
    },
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
    getPendingArea(state) {
      return state.pendingArea;
    },
  },
});

export const useStore = () => {
  const setOpenFieldStats = (value) => store.commit("setOpenFieldStats", value);
  const getOpenFieldStats = () => store.state.openFieldStats;
  const setSelectedArea = (area) => store.commit("setSelectedArea", area);
  const getSelectedArea = () => store.state.selectedArea;
  const setLoggedUser = (user) => store.commit("setLoggedUser", user);
  const getLoggedUser = () => store.state.loggedUser;
  const getIsAuthenticated = () => store.state.isAuthenticated;
  const setPendingArea = (area) => store.commit("setPendingArea", area);
  const getPendingArea = () => store.state.pendingArea;
  const setOpenDataEntry = (value) => store.commit("setOpenDataEntry", value);
  const getOpenDataEntry = () => store.state.openDataEntry;

  return {
    setOpenFieldStats,
    getOpenFieldStats,
    setSelectedArea,
    getSelectedArea,
    getLoggedUser,
    setLoggedUser,
    getIsAuthenticated,
    setPendingArea,
    getPendingArea,
    setOpenDataEntry,
    getOpenDataEntry,
  };
};

export default store;
