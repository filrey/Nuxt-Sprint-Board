import Vuex from "vuex";
import axios from "axios";

const createStore = () => {
  return new Vuex.Store({
    state: {
      user: "TestUser",
      loadedTickets: [],
      loadedTest: []
    },
    mutations: {
      setTickets(state, tickets) {
        state.loadedTickets = tickets;
      },
      setTest(state, test) {
        state.loadedTest = test;
      }
    },
    actions: {
      nuxtServerInit(vuexContext, context) {
        return axios
          .get("https://agile-sprint-board.firebaseio.com/test.json")
          .then(res => {
            const testArray = [];
            for (const key in res.data) {
              testArray.push({ ...res.data[key], id: key });
            }
            vuexContext.commit("setTest", testArray);
          })
          .catch(e => AudioContext.error(e));
      },
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
