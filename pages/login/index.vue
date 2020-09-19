<template>
  <div>
    <!-- User Signup -->
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="4">
          <v-card class="elevation-12">
            <v-toolbar color="primary" dark flat>
              <v-toolbar-title>Signup form</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <v-form>
                <v-text-field
                  v-model="email"
                  label="Email"
                  name="email"
                  prepend-icon="mdi-email"
                  type="email"
                  required
                ></v-text-field>

                <v-text-field
                  v-model="password"
                  id="password"
                  label="Password"
                  name="password"
                  prepend-icon="mdi-lock"
                  type="password"
                  required
                ></v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn @click.prevent="onSubmit()" color="primary">Signup</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- user Login -->
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="4">
          <v-card class="elevation-12">
            <v-toolbar color="green" dark flat>
              <v-toolbar-title>Login form</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <v-form>
                <v-text-field
                  v-model="email"
                  label="Email"
                  name="email"
                  prepend-icon="mdi-email"
                  type="email"
                  required
                ></v-text-field>

                <v-text-field
                  v-model="password"
                  id="password"
                  label="Password"
                  name="password"
                  prepend-icon="mdi-lock"
                  type="password"
                  required
                ></v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn @click.prevent="onLogin()" color="green">Login</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
      <v-btn @click.prevent="onLogout()" color="red">Logout</v-btn>
    </v-container>
  </div>
</template>

<script>
import axios from "axios";
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
    onSignup() {
      axios
        .post(
          "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=" +
            process.env.fbAPIKey,
          {
            email: this.email,
            password: this.password,
            returnSecureToken: true
          }
        )
        .then(result => {
          console.log(result);
        })
        .catch(e => console.log(e));
    },
    onLogin() {
      this.$store
        .dispatch("authenticateUser", {
          email: this.email,
          password: this.password
        })
        .then(() => {
          this.$router.push("/dashboard");
        })
        .catch();
    },
    onLogout() {
      this.$store.dispatch("logout");
      this.$router.push("/login");
    }
  }
};
</script>
