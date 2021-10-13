<template>
  <v-container>
    <v-breadcrumbs :items="breadcrumbs" divider="-"></v-breadcrumbs>

    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card class="py-3 px-5">
          <v-toolbar flat>
            <v-chip
              class="ma-2"
              :color="returnRoleColor(profile.role)"
              outlined
              label
            >
              <v-icon left>
                mdi-console-line
              </v-icon>
              {{ profile.role }}
            </v-chip>

            <v-spacer></v-spacer>
          </v-toolbar>
          <v-card-title>Profile</v-card-title>
          <!-- Avatar -->
          <v-row>
            <v-col cols="12" md="6">
              <v-avatar class="profile" color="grey" size="100" tile>
                <v-img :src="profile.photoUrl"></v-img>
              </v-avatar>
            </v-col>
          </v-row>
          <!-- Name and DisplayName -->
          <v-row>
            <v-col cols="6">
              <v-text-field
                label="Name"
                v-model="profile.name"
                readonly
                filled
                shaped
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                label="Display Name"
                v-model="profile.displayName"
                readonly
                filled
                shaped
              ></v-text-field
            ></v-col>
          </v-row>
          <!-- Bio -->
          <v-row>
            <v-col cols="12">
              <v-textarea
                label="Bio"
                v-model="profile.bio"
                readonly
                counter
                maxlength="200"
                filled
                shaped
              >
              </v-textarea
            ></v-col>
          </v-row>
          <!-- Email and UserID -->
          <v-row>
            <v-col cols="6">
              <v-text-field
                label="Email"
                v-model="profile.email"
                filled
                shaped
                disabled
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                label="User ID"
                v-model="profile.uid"
                filled
                shaped
                disabled
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import firebase from "firebase";
export default {
  name: "profileView",
  middleware: ["check-auth", "auth"],
  created() {
    const dbRef = firebase.database().ref("/users/" + this.$route.params.id);

    dbRef.on("value", snapshot => {
      this.profile = snapshot.val();
    });
  },
  methods: {
    returnRoleColor(role) {
      if (role === "Submitter") return "grey";
      else if (role === "Project Manager") return "green";
      else if (role === "Developer") return "blue";
      else if (role === "Admin") return "red";
      else return "default";
    }
  },
  data() {
    return {
      profile: "",
      breadcrumbs: [
        {
          text: "Home",
          disabled: false,
          href: "/"
        },
        {
          text: "Profile",
          disabled: true,
          href: "/profile"
        }
      ]
    };
  }
};
</script>
