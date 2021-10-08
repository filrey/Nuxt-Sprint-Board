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
              v-if="!editTicket"
              @click="editTicket = true"
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
                :readonly="!editTicket"
                filled
                shaped
              >
              </v-text-field>
            </v-col>
            <v-col cols="6">
              <v-select
                v-model="info.ticket.assigned"
                :disabled="!editTicket"
                :items="Object.values(info.project.personnel)"
                item-text="email"
                item-value="uid"
                prepend-icon="mdi-account"
                label="Assigned Developer"
                chips
                return-object
                hint="Select personell to assign to this ticket."
              >
                <template v-slot:selection="{ item }">
                  <v-chip outlined label>
                    <v-list-item-avatar class="mr-2">
                      <v-img :src="item.photoUrl"></v-img>
                    </v-list-item-avatar>
                    {{ item.email }}
                  </v-chip>
                </template></v-select
              >
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="6">
              <v-select
                label="Type"
                v-model="info.ticket.type"
                :items="['Bug', 'Feature', 'Task', 'Subtask', 'Epic']"
                :readonly="!editTicket"
                multiple
                filled
                shaped
              >
              </v-select>
            </v-col>
            <v-col cols="6">
              <v-select
                label="Priority"
                v-model="info.ticket.priority"
                :items="['Lowest', 'Low', 'Medium', 'High', 'Top Priority']"
                :readonly="!editTicket"
                required
                filled
                shaped
              >
              </v-select>
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
              v-model="info.ticket.description"
              :readonly="!editTicket"
              class="ma-2"
              filled
            >
            </v-textarea>
          </v-row>
          <v-divider></v-divider>
          <v-btn
            v-if="editTicket"
            @click="onSubmitTicket()"
            class="mt-3"
            color="default"
            block
          >
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
  methods: {
    onSubmitTicket() {
      let idData = this.$route.path.split("/");
      let now = new Date();
      let timestamp =
        now.getMonth() +
        1 +
        "/" +
        now.getDate() +
        "/" +
        now.getFullYear() +
        " " +
        now.getHours() +
        ":" +
        now.getMinutes();

      this.info.ticket["updated"] = timestamp;

      let writeData = {
        collection: this.info.ticket,
        path: "projects/" + idData[2] + "/tickets/" + idData[3],
        msgSucces: "Ticket" + idData[3] + "updated",
        msgError: "Error while updating ticket"
      };

      this.$store.dispatch("newDataSet", writeData);

      this.editTicket = false;
    }
  },
  data() {
    return { editTicket: false };
  }
};
</script>
