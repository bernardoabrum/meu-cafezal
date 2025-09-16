import { createStore } from "vuex";

const store = createStore({
  state: {
    openFieldStats: false,
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

export const useStore = () => {
  const setOpenFieldStats = (value) => store.commit("setOpenFieldStats", value);
  const getOpenFieldStats = () => store.state.openFieldStats;

  return { setOpenFieldStats, getOpenFieldStats };
};

export default store;
