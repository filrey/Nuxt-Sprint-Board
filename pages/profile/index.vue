<template>
  <v-container id="user-profile" fluid>
    <v-breadcrumbs :items="breadcrumbs" divider="-"></v-breadcrumbs>

    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card class="py-3 px-5">
          <v-toolbar flat>
            <v-chip
              class="ma-2"
              :color="returnRoleColor(user.role)"
              outlined
              label
            >
              <v-icon left>
                mdi-console-line
              </v-icon>
              {{ user.role }}
            </v-chip>

            <v-spacer></v-spacer>

            <v-btn
              v-if="!editProfile"
              @click="editProfile = true"
              type="file"
              class="ma-2"
              depressed
              outlined
            >
              <v-icon>mdi-pencil-outline</v-icon>Edit
            </v-btn>
          </v-toolbar>
          <v-card-title>My Profile</v-card-title>
          <!-- Avatar -->
          <v-row>
            <v-col cols="12" md="6">
              <v-avatar class="profile" color="grey" size="100" tile>
                <v-img :src="user.photoUrl"></v-img>
              </v-avatar>
            </v-col>
          </v-row>
          <!-- Name and DisplayName -->
          <v-row>
            <v-col cols="6">
              <v-text-field
                label="Name"
                v-model="user.name"
                :readonly="!editProfile"
                filled
                shaped
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                label="Display Name"
                v-model="user.displayName"
                :readonly="!editProfile"
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
                v-model="user.bio"
                :readonly="!editProfile"
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
                v-model="user.email"
                filled
                shaped
                disabled
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                label="User ID"
                v-model="user.uid"
                filled
                shaped
                disabled
              ></v-text-field>
            </v-col>
          </v-row>
          <!-- Save Button -->
          <v-row>
            <v-col cols="12"></v-col>
            <v-progress-linear
              v-if="editProfile"
              color="teal"
              buffer-value="0"
              class="mb-3"
              :value="editProfile"
              stream
            >
            </v-progress-linear>
            <v-btn
              class="ml-2 mb-2"
              v-if="editProfile"
              @click="editProfile = false"
              color="error"
              block
              >Cancel
            </v-btn>
            <v-btn
              class="ml-2"
              v-if="editProfile"
              @click="onSubmitEdit()"
              color="primary"
              block
              >Save
            </v-btn>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import firebase from "firebase";
export default {
  name: "Profile",
  middleware: ["check-auth", "auth"],
  created() {
    let loadedUser = this.$store.getters.loadedUser;
    const dbRef = firebase.database().ref("/users/" + loadedUser.uid);

    dbRef.on("value", snapshot => {
      this.user = snapshot.val();
    });
  },
  head() {
    return {
      title: "Profile"
    };
  },
  methods: {
    onSubmitEdit() {
      let writeData = {
        collection: this.user,
        path: "users/" + this.user.uid,
        msgSucces: "User updated",
        msgError: "Error while updating user"
      };

      this.$store.dispatch("newDataSet", writeData);

      this.editProfile = false;
    },
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
      user: "",
      editProfile: false,
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
