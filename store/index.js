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
      },
      clearToken(state) {
        state.token = null;
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
            vuexContext.dispatch("setLogoutTImer", result.expiresIn * 1000);
          })
          .catch(e => console.log(e));
      },
      newTicket(vuexContext, ticketData) {
        return axios
          .post(
            "https://agile-sprint-board.firebaseio.com/test.json?auth=" +
              vuexContext.state.token,
            ticketData
          )
          .then(result => console.log(result))
          .catch(e => console.log(e));
      },
      setLogoutTimer(vuexContext, duration) {
        setTimeout(() => {
          vuexContext.commit("clearToken");
        }, duration);
      }
    },
    getters: {
      loadedTickets(state) {
        return state.loadedTickets;
      },
      loadedUser(state) {
        return state.user;
      },
      loadedToken(state) {
        return state.token;
      },
      isAuthenticated(state) {
        return state.token != null;
      }
    }
  });
};

export default createStore;
