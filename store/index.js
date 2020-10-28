import Vuex from "vuex";
import axios from "axios";
import Cookie from "js-cookie";

const createStore = () => {
  return new Vuex.Store({
    state: {
      user: {
        name: "Filiberto Reyes",
        uid: null,
        email: null,
        displayName: "FilRey"
      },
      snackbar: {
        message: "No Message",
        color: "",
        value: false
      },
      loadedTickets: [],
      loadedTest: [],
      loadedProjects: [],
      token: null
    },
    mutations: {
      setTickets(state, tickets) {
        state.loadedTickets = tickets;
      },
      setTest(state, test) {
        state.loadedTest = test;
      },
      setProjects(state, projects) {
        state.loadedProjects = projects;
      },
      setUser(state, userData) {
        state.user.email = userData.email;
        state.user.token = userData.idToken;
        state.user.uid = userData.localId;
      },
      setEmail(state, email) {
        state.user.email = email;
      },
      setUid(state, id) {
        state.user.uid = id;
      },
      setToken(state, token) {
        state.token = token;
      },
      setSnackbar(state, context) {
        state.snackbar.message = context.message;
        state.snackbar.color = context.color;
        state.snackbar.value = true;
        setTimeout(() => {
          state.snackbar.value = false;
        }, 5000);
      },
      clearToken(state) {
        state.token = null;
      },
      clearUser(state) {
        state.email = null;
        state.uid = null;
      },
      clearSnackbar(state) {
        state.snackbar.color = "";
        state.snackbar.value = false;
      }
    },
    actions: {
      toggleSnackbar(vuexContext, message, color) {
        vuexContext.commit("setSnackbar", message, color);
      },
      nuxtServerInit(vuexContext, context) {
        return axios
          .get("https://agile-sprint-board.firebaseio.com/test.json")
          .then(res => {
            const testArray = [];
            for (const key in res.data) {
              testArray.push({ ...res.data[key], id: key });
            }
            vuexContext.commit("setTest", testArray);
            return axios.get(
              "https://agile-sprint-board.firebaseio.com/projects.json"
            );
          })
          .then(res => {
            const projectsArray = [];
            for (const key in res.data) {
              projectsArray.push({ ...res.data[key], id: key });
            }
            vuexContext.commit("setProjects", projectsArray);
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
            let expDate = new Date().getTime() + +result.data.expiresIn * 1000;
            console.log(result);
            vuexContext.commit("setUser", result.data);
            localStorage.setItem("token", result.data.idToken);
            localStorage.setItem("tokenExpiration", expDate);
            localStorage.setItem("email", result.data.email);
            localStorage.setItem("uid", result.data.localId);
            Cookie.set("jwt", result.data.idToken);
            Cookie.set("expirationDate", expDate);
            Cookie.set("email", result.data.email);
            Cookie.set("uid", result.data.localId);
          })
          .catch(e => {
            this.$store.dispatch("toggleSnackbar", {
              message: "Invalid email or password",
              color: "error"
            });
          });
      },
      newTicket(vuexContext, contextData) {
        return axios
          .post(
            "https://agile-sprint-board.firebaseio.com/projects/"+ contextData.projectId + "/tickets.json?auth=" +
              vuexContext.state.token,
            contextData.ticketData
          )
          .then(result => {
            this.$store.dispatch("toggleSnackbar", {
            message: "Tickets",
            color: "success"
          });})
          .catch(e => console.log(e));
      },
      newProject(vuexContext, projectData) {
        return axios
          .post(
            "https://agile-sprint-board.firebaseio.com/projects.json?auth=" +
              vuexContext.state.token,
            projectData
          )
          .then(result => console.log("Res from newProject: " + result))
          .catch(e => console.log(e));
      },
      initAuth(vuexContext, req) {
        let token;
        let expirationDate;
        let email;
        let uid;
        if (req) {
          if (!req.headers.cookie) {
            return;
          }
          const jwtCookie = req.headers.cookie
            .split(";")
            .find(c => c.trim().startsWith("jwt="));

          if (!jwtCookie) {
            return;
          }
          token = jwtCookie.split("=")[1];
          expirationDate = req.headers.cookie
            .split(";")
            .find(c => c.trim().startsWith("expirationDate="))
            .split("=")[1];
          email = req.headers.cookie
            .split(";")
            .find(c => c.trim().startsWith("email="))
            .split("=")[1];
          uid = req.headers.cookie
            .split(";")
            .find(c => c.trim().startsWith("uid="))
            .split("=")[1];
        } else {
          token = localStorage.getItem("token");
          expirationDate = localStorage.getItem("tokenExpiration");
          email = localStorage.getItem("email");
          uid = localStorage.getItem("uid");
        }
        if (new Date().getTime() > +expirationDate || !token) {
          console.log("No token or invalid token");
          vuexContext.dispatch("logout");
          return;
        }

        vuexContext.commit("setToken", token);
        vuexContext.commit("setEmail", email);
        vuexContext.commit("setUid", uid);
      },
      logout(vuexContext) {
        vuexContext.commit("clearToken");
        vuexContext.commit("clearUser");
        Cookie.remove("jwt");
        Cookie.remove("expirationDate");
        Cookie.remove("email");
        Cookie.remove("uid");

        if (process.client) {
          localStorage.removeItem("token");
          localStorage.removeItem("tokenExpiration");
          localStorage.removeItem("email");
          localStorage.removeItem("uid");
        }
      }
    },
    getters: {
      loadedTickets(state) {
        return state.loadedTickets;
      },
      loadedProjects(state) {
        return state.loadedProjects;
      },
      loadedUser(state) {
        return state.user;
      },
      loadedToken(state) {
        return state.token;
      },
      isAuthenticated(state) {
        return state.token != null;
      },
      loadedSnackbarMessage(state) {
        return state.snackbar.message;
      },
      loadedSnackbarValue(state) {
        return state.snackbar.value;
      },
      loadedSnackbarColor(state) {
        return state.snackbar.color;
      }
    }
  });
};

export default createStore;
