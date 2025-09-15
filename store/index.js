import { createStore } from "vuex";

const store = createStore({
  state: {
    openFieldStats: true,
  },
  mutations: {
    setOpenFieldStats(state, value) {
      state.openFieldStats = value;
    },
  },
  actions: {},
  getters: {
    getOpenFieldStats(state) {
      return state.openFieldStats;
    },
  },
});

export default store;
