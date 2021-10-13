import Vuex from "vuex";
import axios from "axios";
import Cookie from "js-cookie";
import firebase from "firebase";

const createStore = () => {
  return new Vuex.Store({
    state: {
      user: {
        bio: "",
        name: "",
        uid: null,
        email: null,
        displayName: "",
        photoUrl: "",
        role: ""
      },
      snackbar: {
        message: "No Message",
        color: "",
        value: false
      },
      loadedSiteUsers: [],
      loadedProjects: [],
      token: null
    },

    mutations: {
      setloadedSiteUsers(state, siteUsers) {
        state.loadedSiteUsers = siteUsers;
      },
      setProjects(state, projects) {
        state.loadedProjects = projects;
      },
      setUser(state, userData) {
        state.user = userData;
      },
      setBio(state, bio) {
        state.user.bio = bio;
      },
      setName(state, name) {
        state.user.name = name;
      },
      setUid(state, uid) {
        state.user.uid = uid;
      },
      setEmail(state, email) {
        state.user.email = email;
      },
      setDisplayName(state, displayName) {
        state.user.displayName = displayName;
      },
      setPhotoUrl(state, photoUrl) {
        state.user.photoUrl = photoUrl;
      },
      setRole(state, role) {
        state.user.role = role;
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
        state.user.bio = null;
        state.user.name = null;
        state.user.uid = null;
        state.user.email = null;
        state.user.displayName = null;
        state.user.photoUrl = null;
        state.user.role = null;
      },
      clearSnackbar(state) {
        state.snackbar.color = "";
        state.snackbar.value = false;
      }
    },

    actions: {
      setTickets(vuexContext, tickets) {
        vuexContext.commit("setTickets", tickets);
      },

      setUser(vuexContext, user) {
        vuexContext.commit("setUser", user);
      },

      toggleSnackbar(vuexContext, message, color) {
        vuexContext.commit("setSnackbar", message, color);
      },

      userInit(vuexContext, userData) {
        return axios
          .get(
            "https://agile-sprint-board.firebaseio.com/users/" +
              userData.localId +
              ".json"
          )
          .then(res => {
            let userObj = {
              bio: res.data.bio,
              name: res.data.name,
              uid: res.data.uid,
              email: res.data.email,
              displayName: res.data.displayName,
              photoUrl: res.data.photoUrl,
              role: res.data.role
            };
            let lsNames = [
              "bio",
              "name",
              "uid",
              "email",
              "displayName",
              "photoUrl",
              "role"
            ];
            let lsValues = [
              userObj.bio,
              userObj.name,
              userObj.uid,
              userObj.email,
              userObj.displayName,
              userObj.photoUrl,
              userObj.role
            ];
            //Initializes user data in vuex store, localstorage, and sets  cookies
            vuexContext.commit("setUser", res.data);

            for (let index = 0; index < lsNames.length; index++) {
              localStorage.setItem(lsNames[index], lsValues[index]);
              Cookie.set(lsNames[index], lsValues[index]);
            }
          })
          .catch(e => context.error(e));
      },

      nuxtServerInit(vuexContext, context) {
        return axios
          .get("https://agile-sprint-board.firebaseio.com/users.json")
          .then(res => {
            const usersArray = [];
            for (const key in res.data) {
              usersArray.push({ ...res.data[key] });
            }
            vuexContext.commit("setloadedSiteUsers", usersArray);
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

      authenticateGoogleUser(vuexContext, authData) {
        let expDate = new Date().getTime() + +(1 * 60 * 60 * 1000);
        // If new google user then save into firebase database under /users
        if (!authData.doesUserExist) {
          let writeData = {
            collection: {
              email: authData.email,
              uid: authData.localId,
              photoUrl: authData.photoUrl
            },
            path: "users/" + authData.localId,
            msgSucces: "User saved in Database",
            msgError: "Error new user database"
          };

          vuexContext.dispatch("newDataSet", writeData);
        }

        localStorage.setItem("token", authData.idToken);
        localStorage.setItem("tokenExpiration", expDate);
        Cookie.set("jwt", authData.idToken);
        Cookie.set("expirationDate", expDate);
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
            let writeData = {
              collection: {
                email: result.data.email,
                uid: result.data.localId,
                photoUrl: `https://demos.creative-tim.com/vuetify-material-dashboard/favicon.ico`
              },
              path: "users/" + result.data.localId,
              msgSucces: "User saved in Database",
              msgError: "Error new user database"
            };

            vuexContext.dispatch("newDataSet", writeData);

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
            vuexContext.dispatch("toggleSnackbar", {
              message: "Invalid email or password",
              color: "error"
            });
          });
      },

      newTicket(vuexContext, contextData) {
        return axios
          .post(
            "https://agile-sprint-board.firebaseio.com/projects/" +
              contextData.projectId +
              "/tickets.json?auth=" +
              vuexContext.state.token,
            contextData.ticketData
          )
          .then(result => {
            vuexContext.commit("setSnackbar", {
              message: "Ticket submitted",
              color: "success"
            });
          })
          .catch(e => {
            vuexContext.commit("setSnackbar", {
              message: "Error submitting ticket",
              color: "error"
            });
          });
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

      newImage(vuexContext, imageData) {
        let fbStoreRef = firebase.storage().ref();
        let imageRef = fbStoreRef.child("images/starter.png");
        imageRef
          .put(imageData)
          .then(result => console.log(result))
          .catch(e => console.log(e));
      },

      // Creates new data entry with a newly generated key
      newDataPush(vuexContext, writeData) {
        firebase
          .database()
          .ref()
          .child(writeData.path)
          .push(writeData.collection)
          .then(response => {
            vuexContext.dispatch("toggleSnackbar", {
              message: writeData.msgSucces,
              color: "success"
            });
          })
          .catch(err => {
            vuexContext.dispatch("toggleSnackbar", {
              message: writeData.msgError,
              color: "error"
            });
          });
      },

      newDataUpdate(vuexContext, updateData) {
        firebase
          .database()
          .ref()
          .child(updateData.path)
          .update(updateData.collection)
          .then(response => {
            vuexContext.dispatch("toggleSnackbar", {
              message: updateData.msgSucces,
              color: "success"
            });
          })
          .catch(err => {
            vuexContext.dispatch("toggleSnackbar", {
              message: updateData.msgError,
              color: "error"
            });
          });
      },

      // Creates new data entry with attribute name as the key
      newDataSet(vuexContext, writeData) {
        firebase
          .database()
          .ref()
          .child(writeData.path)
          .set(writeData.collection)
          .then(response => {
            vuexContext.dispatch("toggleSnackbar", {
              message: writeData.msgSucces,
              color: "success"
            });
          })
          .catch(err => {
            vuexContext.dispatch("toggleSnackbar", {
              message: writeData.msgError,
              color: "error"
            });
          });
      },

      // Deletes entry at specified path writeData.path
      dataRemove(vuexContext, writeData) {
        firebase
          .database()
          .ref()
          .child(writeData.path)
          .remove()
          .then(response => {
            vuexContext.dispatch("toggleSnackbar", {
              message: writeData.msgSucces,
              color: "success"
            });
          })
          .catch(err => {
            vuexContext.dispatch("toggleSnackbar", {
              message: writeData.msgError,
              color: "error"
            });
          });
      },

      initAuth(vuexContext, req) {
        let token;
        let expirationDate;

        // let expirationDate,bio,name,uid,email,displayName,photoUrl,role
        let lsNames = [
          "bio",
          "name",
          "uid",
          "email",
          "displayName",
          "photoUrl",
          "role"
        ];
        let commands = [
          "setBio",
          "setName",
          "setUid",
          "setEmail",
          "setDisplayName",
          "setPhotoUrl",
          "setRole"
        ];
        let lsValues = ["", "", "", "", "", "", ""];

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

          for (let index = 0; index < lsNames.length; index++) {
            lsValues[index] = req.headers.cookie
              .split(";")
              .find(c => c.trim().startsWith(lsNames[index] + "="))
              .split("=")[1]
              .replace(/%20/gi, " ");
          }
        } else {
          token = localStorage.getItem("token");
          expirationDate = localStorage.getItem("tokenExpiration");

          for (let index = 0; index < lsNames.length; index++) {
            lsValues[index] = localStorage.getItem(lsNames[index]);
          }
        }
        if (new Date().getTime() > +expirationDate || !token) {
          vuexContext.dispatch("toggleSnackbar", {
            message: "Session has expired",
            color: "error"
          });
          vuexContext.dispatch("logout");
          return;
        }

        vuexContext.commit("setToken", token);

        for (let index = 0; index < lsNames.length; index++) {
          vuexContext.commit(commands[index], lsValues[index]);
        }
      },

      logout(vuexContext) {
        let lsNames = [
          "bio",
          "name",
          "uid",
          "email",
          "displayName",
          "photoUrl",
          "role"
        ];

        vuexContext.commit("clearToken");
        vuexContext.commit("clearUser");
        Cookie.remove("jwt");
        Cookie.remove("expirationDate");

        lsNames.forEach(property => {
          Cookie.remove(property);
        });

        if (process.client) {
          localStorage.removeItem("token");
          localStorage.removeItem("tokenExpiration");

          lsNames.forEach(property => {
            localStorage.removeItem(property);
          });
        }
      }
    },

    getters: {
      loadedSiteUsers(state) {
        return state.loadedSiteUsers;
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
