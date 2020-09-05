import Vuex from "vuex";

const createStore = () => {
  return new Vuex.Store({
    state: {
      user: "TestUser",
      loadedTickets: []
    },
    mutations: {
      setTickets(state, tickets) {
        state.loadedTickets = tickets;
      }
    },
    actions: {
      setTickets(vuexContext, tickets) {
        vuexContext.commit("setTickets", tickets);
      }
    },
    getters: {
      loadedTickets(state) {
        return state.loadedTickets;
      }
    }
  });
};

export default createStore;
