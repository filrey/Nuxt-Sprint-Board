<template>
  <div>
    ID View
  </div>
</template>
<script>
import firebase from "firebase";
export default {
  name: "profileView",
  middleware: ["check-auth", "auth"],
  created() {
    const dbRef = firebase
      .database()
      .ref("/users/G7gDf3MFVhP7Jzox4BWY2ZjzKQZ2");
    dbRef
      .once("value")
      .then(snapshot => {
        if (snapshot.exists()) {
          this.profile = snapshot.val();
        } else {
          this.profile = null;
        }
      })
      .catch(error => {
        console.error(error);
      });
  },

  data() {
    return { profile: "" };
  }
};
</script>
