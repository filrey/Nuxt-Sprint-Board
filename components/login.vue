<template>
  <div>
    <v-container>
      <v-row class="justify-center">
        <v-col cols="12" md="7">
          <v-card class="px-12 py-6 text-center" elevation="1">
            <v-row>
              <v-col cols="12">
                <v-card-title class="display-1 mb-2 justify-center">
                  Welcome
                </v-card-title>
                <v-card-subtitle>
                  Sign in to continue
                </v-card-subtitle>
                <v-form>
                  <v-text-field
                    v-model="email"
                    prepend-inner-icon="mdi-email"
                    label="Email"
                    name="email"
                    type="email"
                    solo
                    outlined
                    required
                  ></v-text-field>

                  <v-text-field
                    v-model="password"
                    prepend-inner-icon="mdi-lock"
                    id="password"
                    label="Password"
                    name="password"
                    type="password"
                    solo
                    outlined
                    required
                  ></v-text-field>
                </v-form>
                <v-spacer></v-spacer>
                <v-btn
                  class="justify-center"
                  @click.prevent="onLogin()"
                  color="primary"
                  height="50px"
                  max-width="100%"
                  rounded
                  block
                  >Login</v-btn
                >
                <v-card-subtitle>
                  Or Sign in With
                </v-card-subtitle>
                <v-btn
                  class="justify-center"
                  @click.prevent="onGoogleLogin()"
                  color="secondary"
                  height="50px"
                  max-width="100%"
                  rounded
                  block
                >
                  <v-icon class="mr-2">mdi-google</v-icon> Google</v-btn
                >
                <div class="text-center mt-6">
                  Don't have an account?
                  <a href="/signUp" class="font-weight-bold">
                    Create one here
                  </a>
                </div>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import firebase from "firebase";
export default {
  name: "Login",
  components: {},
  data() {
    return {
      email: "",
      password: ""
    };
  },
  methods: {
    onGoogleLogin() {
      this.provider = new firebase.auth.GoogleAuthProvider();
      firebase
        .auth()
        .signInWithPopup(this.provider)
        .then(result => {
          let userData = {
            email: result.user.email,
            idToken: result.credential.idToken,
            localId: result.user.uid,
            displayName: result.user.displayName,
            photoUrl: result.user.photoURL,
            doesUserExist: !result.additionalUserInfo.isNewUser
          };
          this.$store.dispatch("authenticateGoogleUser", userData);
          this.$store.dispatch("userInit", userData);
          this.$store.dispatch("toggleSnackbar", {
            message: "Welcome back " + userData.email,
            color: "success"
          });
          this.$router.push("/");
        })
        .catch(e => {
          console.log(e);
          this.$store.dispatch("toggleSnackbar", {
            message: "Google Auth Error",
            color: "error"
          });
        });
    },
    onLogin() {
      this.$store
        .dispatch("authenticateUser", {
          email: this.email,
          password: this.password
        })
        .then(() => {
          this.$store.dispatch("toggleSnackbar", {
            message: "Login Successful",
            color: "success"
          });
          this.$router.push("/dashboard");
        })
        .catch(e => {
          this.$store.dispatch("toggleSnackbar", {
            message: "Invalid email or password",
            color: "error"
          });
        });
    }
  }
};
</script>
