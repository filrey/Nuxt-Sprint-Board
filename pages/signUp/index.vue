<template>
  <div>
    <v-container>
      <v-row class="justify-center">
        <v-col cols="12" md="4">
          <v-card class="px-5 py-6 text-center" elevation="1">
            <v-card-title class="display-1 mb-2 justify-center">
              Create Account
            </v-card-title>
            <v-card-subtitle>
              Start building
            </v-card-subtitle>
            <v-form>
              <v-text-field
                v-model="email"
                prepend-inner-icon="mdi-email"
                label="Email"
                name="email"
                type="email"
                solo
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
                required
              ></v-text-field>
            </v-form>
            <v-spacer></v-spacer>
            <v-btn
              class="justify-center"
              @click.prevent="onSignup()"
              color="primary"
              height="50px"
              max-width="100%"
              block
              >Create Account</v-btn
            >
          </v-card>
          <div class="text-center mt-6">
            Already have an account?
            <a href="/login" class="font-weight-bold">
              Sign in
            </a>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "SignUp",
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
          let writeData = {
            collection: {
              email: result.data.email,
              uid: result.data.localId,
              photoUrl: `https://demos.creative-tim.com/vuetify-material-dashboard/favicon.ico`
            },
            path: "users/" + result.data.localId,
            msgSucces: "You are now registered",
            msgError: "Error registering"
          };

          this.$store.dispatch("newDataSet", writeData);
        })
        .catch(e => console.log(e));
    }
  }
};
</script>
