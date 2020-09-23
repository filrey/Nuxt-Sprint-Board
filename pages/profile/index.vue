<template>
  <v-container id="user-profile" fluid tag="section">
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card>
          <v-sheet class="pa-7 mx-3 rounded-lg" color="#4caf50" max-width="100%" elevation="5">
            <v-icon size="32" dark>mdi-account</v-icon>
          </v-sheet>

          <v-form>
            <v-container class="py-0">
              <v-row>
                <v-col cols="12" md="4">
                  <v-text-field label="Company (disabled)" disabled />
                </v-col>

                <v-col cols="12" md="4">
                  <v-text-field class="purple-input" label="User Name" />
                </v-col>

                <v-col cols="12" md="4">
                  <v-text-field label="Email Address" class="purple-input" />
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field label="First Name" class="purple-input" />
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field label="Last Name" class="purple-input" />
                </v-col>

                <v-col cols="12">
                  <v-text-field label="Adress" class="purple-input" />
                </v-col>

                <v-col cols="12" md="4">
                  <v-text-field label="City" class="purple-input" />
                </v-col>

                <v-col cols="12" md="4">
                  <v-text-field label="Country" class="purple-input" />
                </v-col>

                <v-col cols="12" md="4">
                  <v-text-field class="purple-input" label="Postal Code" type="number" />
                </v-col>

                <v-col cols="12">
                  <v-textarea
                    class="purple-input"
                    label="About Me"
                    value="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
                  />
                </v-col>

                <v-col cols="12" class="text-right">
                  <v-btn color="success" class="mr-0">Update Profile</v-btn>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card>
          <v-avatar color="indigo" size="52">
            <v-icon dark>mdi-account-circle</v-icon>
          </v-avatar>
          <v-card-text class="text-center">
            <h4 class="display-2 font-weight-light mb-3 black--text">Filiberto Reyes</h4>
            <h6 class="display-1 mb-1 grey--text">Owner</h6>

            <p
              class="font-weight-light grey--text"
            >Lorem ipsum dolor sit amet, consectetur adipisicing elit. Perspiciatis incidunt nesciunt neque. Tenetur amet repellat molestias unde. Consequatur velit reprehenderit earum sunt molestiae, blanditiis aperiam culpa minima explicabo reiciendis. Quos.</p>

            <v-btn color="success" rounded class="mr-0">Follow</v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "Profile",
  middleware: ["check-auth", "auth"],
  data() {
    return {};
  },
};
</script>
