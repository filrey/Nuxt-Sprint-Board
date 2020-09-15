import Vuex from "vuex";
import axios from "axios";

const createStore = () => {
  return new Vuex.Store({
    state: {
      user: "Filiberto Reyes",
      loadedTickets: [],
      loadedTest: [],
      token: null
    },
    mutations: {
      setTickets(state, tickets) {
        state.loadedTickets = tickets;
      },
      setTest(state, test) {
        state.loadedTest = test;
      },
      setUser(state, user) {
        state.loadedUser = user;
      },
      setToken(state, token) {
        state.token = token;
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
          .catch(e => context.error(e));
      },
      setTickets(vuexContext, tickets) {
        vuexContext.commit("setTickets", tickets);
      },
      setUser(vuexContext, user) {
        vuexContext.commit("setUser", user);
      },
      authenticateUser(vuexContext, authData) {
        return axios
          .post(
            "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=" +
              process.env.fbAPIKey,
            {
              email: authData.email,
              password: authData.password,
              returnSecureToken: true
            }
          )
          .then(result => {
            vuexContext.commit("setToken", result.data.idToken);
          })
          .catch(e => console.log(e));
      }
    },
    getters: {
      loadedTickets(state) {
        return state.loadedTickets;
      },
      loadedUser(state) {
        return state.user;
      }
    }
  });
};

export default createStore;
