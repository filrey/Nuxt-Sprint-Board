import Vuex from "vuex";
import axios from "axios";
import Cookie from "js-cookie";
import firebase from "firebase";

const createStore = () => {
  return new Vuex.Store({
    state: {
      user: {
        name: "Filiberto Reyes",
        uid: null,
        email: null,
        displayName: "FilRey",
        photoUrl: '',
        role: ''
      },
      snackbar: {
        message: "No Message",
        color: "",
        value: false
      },
      loadedSiteUsers:[],
      loadedProjects: [],
      token: null
    },

    mutations: {
      setloadedSiteUsers(state, siteUsers){
        state.loadedSiteUsers = siteUsers;
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
      setPhotoUrl(state, photoUrl){
        state.user.photoUrl = photoUrl
      },
      setRole(state, role){
        state.user.role = role
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
        state.user.email = null;
        state.user.uid = null;
        state.user.name = null;
        state.user.photoUrl = null;
        state.user.role = null;
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

      userInit(vuexContext,userData){
        return axios
          .get("https://agile-sprint-board.firebaseio.com/users/" + userData.localId + ".json")
          .then(res => {
            //Initializes user data in vuex store, localstorage, and sets  cookies
            vuexContext.commit("setUser", res.data);
            vuexContext.commit("setPhotoUrl", res.data.photoUrl)
            vuexContext.commit("setRole", res.data.role)
            localStorage.setItem("email", res.data.email);
            localStorage.setItem("uid", res.data.uid);
            localStorage.setItem("photoUrl", res.data.photoUrl);
            localStorage.setItem("role", res.data.role);
            Cookie.set("email", res.data.email);
            Cookie.set("uid", res.data.uid);
            Cookie.set("photoUrl", res.data.photoUrl);
            Cookie.set("role", res.data.role);
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
      
      setTickets(vuexContext, tickets) {
        vuexContext.commit("setTickets", tickets);
      },

      setUser(vuexContext, user) {
        vuexContext.commit("setUser", user);
      },

      authenticateGoogleUser(vuexContext, authData){
        let expDate = new Date().getTime() + +(1*60*60*1000);
        // If new google user then save into firebase database under /users
        if(!authData.doesUserExist){
          let writeData = {
            collection: {
              email: authData.email, 
              uid: authData.localId,
              photoUrl: authData.photoUrl
            },
            path: 'users/' + authData.localId, 
            msgSucces: 'User saved in Database', 
            msgError: "Error new user database"
          }
  
          vuexContext.dispatch("newDataSet", writeData)
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
              path: 'users/' + result.data.localId, 
              msgSucces: 'User saved in Database', 
              msgError: "Error new user database"
            }
            

            vuexContext.dispatch("newDataSet", writeData)

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
            "https://agile-sprint-board.firebaseio.com/projects/"+ contextData.projectId + "/tickets.json?auth=" +
              vuexContext.state.token,
            contextData.ticketData
          )
          .then(result => {
            vuexContext.commit("setSnackbar", {message: 'Ticket submitted', color: 'success'}); 

          })
          .catch(e => {
            vuexContext.commit("setSnackbar", {message: 'Error submitting ticket', color: 'error'}); 
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

      newImage(vuexContext, imageData){
        let fbStoreRef = firebase.storage().ref();
        let imageRef = fbStoreRef.child('images/starter.png')
        imageRef.put(imageData).then(
          result => console.log(result)
        ).catch(e => console.log(e))
      },

      // Creates new data entry with a newly generated key
      newDataPush(vuexContext, writeData){
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

      newDataUpdate(vuexContext, updateData){
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
      newDataSet(vuexContext, writeData){
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

      initAuth(vuexContext, req) {
        let token;
        let expirationDate;
        let email;
        let uid;
        let photoUrl
        let role

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
          photoUrl = req.headers.cookie
            .split(";")
            .find(c => c.trim().startsWith("photoUrl="))
            .split("=")[1];
          role = req.headers.cookie
            .split(";")
            .find(c => c.trim().startsWith("role="))
            .split("=")[1];


        } else {
          token = localStorage.getItem("token");
          expirationDate = localStorage.getItem("tokenExpiration");
          email = localStorage.getItem("email");
          uid = localStorage.getItem("uid");
          photoUrl = localStorage.getItem("photoUrl");
          role = localStorage.getItem("role");


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
        vuexContext.commit("setEmail", email);
        vuexContext.commit("setUid", uid);
        vuexContext.commit("setPhotoUrl", photoUrl)
        vuexContext.commit("setRole", role)

      },

      logout(vuexContext) {
        vuexContext.commit("clearToken");
        vuexContext.commit("clearUser");
        Cookie.remove("jwt");
        Cookie.remove("expirationDate");
        Cookie.remove("email");
        Cookie.remove("uid");
        Cookie.remove("photoUrl");
        Cookie.remove("role");


        if (process.client) {
          localStorage.removeItem("token");
          localStorage.removeItem("tokenExpiration");
          localStorage.removeItem("email");
          localStorage.removeItem("uid");
          localStorage.removeItem("photoUrl");
          localStorage.removeItem("role");

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
