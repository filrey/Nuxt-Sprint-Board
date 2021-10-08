<template>
  <div class="my-3 mx-5">
    <v-breadcrumbs :items="info.breadcrumbs" divider="-"></v-breadcrumbs>
    <h1>Ticket Details</h1>

    <v-row>
      <!-- Ticket Details: title, description,priortiy,etc... -->
      <v-col cols="12" md="6">
        <v-card class="py-3 px-5">
          <v-toolbar flat>
            <v-chip class="ma-2" color="success" outlined label>
              <v-icon left>
                mdi-console-line
              </v-icon>
              Open
            </v-chip>

            <v-spacer></v-spacer>

            <v-btn
              v-if="!editDescription"
              @click="editDescription = true"
              type="file"
              class="ma-2"
              depressed
              outlined
            >
              <v-icon>mdi-plus</v-icon>Edit
            </v-btn>
          </v-toolbar>
          <v-row>
            <v-col cols="6">
              <v-text-field
                label="Title"
                v-model="info.ticket.title"
                :readonly="!editDescription"
                filled
                shaped
              >
              </v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                label="Assigned Developer"
                v-model="info.ticket.priority"
                :readonly="!editDescription"
                filled
                shaped
              >
              </v-text-field>
            </v-col>
          </v-row>
          <v-divider></v-divider>

          <v-row>
            <v-col cols="6">
              <v-text-field
                label="Type"
                v-model="info.ticket.type"
                :readonly="!editDescription"
                filled
                shaped
              >
              </v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                label="Priority"
                v-model="info.ticket.priority"
                :readonly="!editDescription"
                filled
                shaped
              >
              </v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="6">
              <v-text-field
                label="Updated"
                v-model="info.ticket.updated"
                filled
                shaped
                disabled
              >
              </v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                label="Created"
                v-model="info.ticket.created"
                filled
                shaped
                disabled
              >
              </v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-textarea
              label="Description"
              v-model="info.project.name"
              :readonly="!editDescription"
              class="ma-2"
              filled
            >
            </v-textarea>
          </v-row>
          <v-divider></v-divider>
          <v-btn v-if="editDescription" @click="editDescription = false">
            Save
          </v-btn>
        </v-card>
      </v-col>
      <!-- Ticket History -->
      <v-col cols="12" md="6"> </v-col>
    </v-row>

    <v-row>
      <!-- Comments -->
      <v-col cols="12" md="6"> </v-col>
      <!-- Attachments -->
      <v-col cols="12" md="6"> </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: "ticketDetail",
  middleware: ["check-auth", "auth"],
  computed: {
    info() {
      let idData = this.$route.path.split("/");
      let project = this.$store.getters.loadedProjects.find(
        project => project.id == idData[2]
      );
      let ticket = project.tickets[idData[3]];

      let breadcrumbs = [
        {
          text: "Home",
          disabled: false,
          href: "/"
        },
        {
          text: "Projects",
          disabled: false,
          href: "/projects"
        },
        {
          text: project.name,
          disabled: false,
          href: "/projects/" + project.id + "/overview"
        },
        {
          text: "Ticket" + idData[3],
          disabled: true,
          href: "/projects/"
        }
      ];

      return { project, ticket, breadcrumbs };
    }
  },
  data() {
    return { editDescription: false };
  }
};
</script>
