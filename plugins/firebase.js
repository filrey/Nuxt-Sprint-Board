import firebase from 'firebase'

// copy the config from the console https://console.firebase.google.com/u/0/project/sign-11111/settings/general/
var firebaseConfig = {
    apiKey: "AIzaSyAuOs2rQBFVMhWzqLwlASCo6oaFREApLzo",
    authDomain: "agile-sprint-board.firebaseapp.com",
    databaseURL: "https://agile-sprint-board.firebaseio.com",
    projectId: "agile-sprint-board",
    storageBucket: "agile-sprint-board.appspot.com",
    messagingSenderId: "1007002237386",
    appId: "1:1007002237386:web:d9b1ad6acfde81b7b7b733",
    measurementId: "G-CB7WJSWFYX"
};
let app = null
// prevent initializing firebase more than once
if (!firebase.apps.length) { 
  app = firebase.initializeApp(firebaseConfig)
}
// inject it so it can be accessed as this.$firebase inside the project
export default (ctx, inject) => {
  inject('firebase', firebase)
}