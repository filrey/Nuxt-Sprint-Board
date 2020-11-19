<template>
  <v-container id="user-profile" fluid tag="section">
    <v-row justify="center">
      <v-col cols="12" md="12">
        <v-card class="py-3 px-5">
          <v-card-title>Profile</v-card-title>
          <v-row>
            <v-col cols="12" md="1">
              <v-avatar class="profile" color="grey" size="100" tile>
                <v-img :src="user.photoUrl"></v-img>
              </v-avatar>
              <v-chip class=" mt-3 d-flex justify-center" color="red" dark
                >Administrator</v-chip
              >
            </v-col>
            <v-col cols="12" md="11">
              <v-text-field
                label="Name"
                v-model="user.name"
                disabled
              ></v-text-field>
              <v-text-field
                label="Display Name"
                v-model="user.displayName"
              ></v-text-field>
              <v-btn color="primary">Save</v-btn>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "Profile",
  middleware: ["check-auth", "auth"],
  computed: {
    user() {
      return this.$store.getters.loadedUser;
    }
  },
  data() {
    return {};
  }
};
</script>
