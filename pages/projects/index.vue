<template>
  <div>
    <v-breadcrumbs :items="breadcrumbs" divider="-"></v-breadcrumbs>
    <h1>Projects</h1>
    <v-btn @click="dialog = true" type="file" class="ma-2" depressed outlined>
      <v-icon>mdi-plus</v-icon>New Project</v-btn
    >
    <!-- Project Tiles -->
    <v-row>
      <v-col cols="12" sm="6" v-for="item in projects" :key="item.id">
        <v-card class="mx-auto my-12" max-width="750">
          <v-img
            height="250"
            :src="
              item.bannerUrl ||
                'https://cdn.vuetifyjs.com/images/parallax/material2.jpg'
            "
          ></v-img>

          <v-card-title>{{ item.name }}</v-card-title>

          <v-card-text>
            <div>{{ item.description || "No Description" }}</div>
          </v-card-text>

          <v-divider class="mx-4"></v-divider>

          <v-card-title>Personnel</v-card-title>

          <v-card-text>
            <v-chip
              v-for="person in item.personnel"
              :key="person.id"
              class="ma-1"
            >
              <v-list-item-avatar class="mr-2">
                <v-img :src="person.photoUrl"></v-img> </v-list-item-avatar
              >{{ person.email }}</v-chip
            >
          </v-card-text>

          <v-card-actions>
            <v-btn
              color="deep-purple lighten-2"
              text
              @click="onOverview(item.id)"
              >Overview</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- New Project Dialog -->
    <v-row justify="center">
      <v-dialog v-model="dialog" persistent max-width="600px">
        <v-card>
          <v-card-title>
            <v-icon class="mr-2">mdi-folder-plus-outline</v-icon>
            <span class="headline">New Project</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="project.name"
                    label="Project Name*"
                    required
                  ></v-text-field>
                </v-col>

                <v-col cols="12">
                  <v-textarea
                    v-model="project.description"
                    label="Description"
                  ></v-textarea>
                </v-col>
                <!-- <v-col cols="12" sm="6">
                  <v-select
                    v-model="ticket.priority"
                    :items="['Lowest', 'Low', 'Medium', 'High', 'Top Priority']"
                    label="Priority*"
                    required
                  ></v-select>
                </v-col> -->
                <!-- <v-col cols="12" sm="6">
                  <v-autocomplete
                    v-model="ticket.type"
                    :items="['Bug', 'Feature', 'Task', 'Subtask', 'Epic']"
                    label="Type"
                    multiple
                  ></v-autocomplete>
                </v-col> -->
              </v-row>
            </v-container>
            <small>*Where it all begins</small>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="dialog = false">
              Cancel
            </v-btn>
            <v-btn color="blue darken-1" text @click="onSubmitProject()">
              Create
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
</template>
<script>
export default {
  name: "Projects",
  middleware: ["check-auth", "auth"],
  computed: {
    projects() {
      return this.$store.getters.loadedProjects;
    }
  },
  data() {
    return {
      dialog: false,
      project: {
        name: "",
        description: ""
      },
      breadcrumbs: [
        {
          text: "Home",
          disabled: false,
          href: "/"
        },
        {
          text: "Projects",
          disabled: true,
          href: "/projects"
        }
      ]
    };
  },
  methods: {
    onOverview(projectId) {
      this.$router.push("/projects/" + projectId + "/overview");
    },
    onSubmitProject() {
      let writeData = {
        collection: this.project,
        path: "projects/",
        msgSucces: this.project.name + " Created",
        msgError: "Error new project"
      };

      this.$store.dispatch("newDataPush", writeData);
    }
  }
};
</script>
