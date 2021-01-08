<template>
  <div>
    <v-dialog v-model="this.showModal" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <v-icon class="mr-2">mdi-account</v-icon>
          <span class="headline">Assign Personnel</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-list subheader two-line flat>
                  <v-subheader>Available Personnel</v-subheader>
                  <v-list-item-group v-model="newPersonnelList" multiple>
                    <v-list-item v-for="user in loadedUsers" :key="user.id">
                      <template v-slot:default="{ active }">
                        <v-list-item-action>
                          <v-checkbox
                            :input-value="active"
                            color="primary"
                          ></v-checkbox>
                        </v-list-item-action>

                        <v-list-item-avatar class="mr-2">
                          <v-img :src="user.photoUrl"></v-img>
                        </v-list-item-avatar>

                        <v-list-item-content>
                          <v-list-item-title
                            v-text="user.email"
                          ></v-list-item-title>
                        </v-list-item-content>
                      </template>
                    </v-list-item>
                  </v-list-item-group>
                </v-list>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="this.closeModal">
            Cancel
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="onAssignPersonnel()"
            :disabled="this.newPersonnelList.length < 1"
          >
            Assign
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import firebase from "firebase";
export default {
  name: "newPersonnelModal",
  props: ["showModal"],
  data() {
    return {
      newPersonnelList: []
    };
  },
  computed: {
    loadedUsers() {
      return this.$store.getters.loadedSiteUsers;
    }
  },
  methods: {
    onAssignPersonnel() {
      console.log("AssignPersonnel");
    },
    closeModal() {
      this.$emit("update:showModal", false);
      this.clearData();
    },
    clearData() {
      this.newPersonnelList = [];
    }
  }
};
</script>
