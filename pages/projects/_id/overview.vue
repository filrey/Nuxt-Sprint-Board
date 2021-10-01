<template>
  <div class="my-3 mx-5">
    <v-breadcrumbs :items="breadcrumbs" divider="-"></v-breadcrumbs>
    <!-- Banner -->
    <v-parallax
      v-if="this.bannerShow"
      height="450"
      :src="
        this.project.bannerUrl ||
          'https://cdn.vuetifyjs.com/images/parallax/material2.jpg'
      "
    >
      <h1>{{ this.project.name }}</h1>

      <v-btn
        @click="bannerEdit = true"
        class="ma-2 edit-banner"
        depressed
        outlined
        small
        dark
      >
        <v-icon>mdi-plus</v-icon>Edit Banner</v-btn
      >
    </v-parallax>

    <v-row>
      <!-- Tickets -->
      <v-col cols="12" md="6">
        <v-card>
          <v-toolbar flat>
            <v-card-title>Tickets</v-card-title>

            <v-spacer></v-spacer>

            <v-btn
              @click="dialog = true"
              type="file"
              class="ma-2"
              depressed
              outlined
            >
              <v-icon>mdi-plus</v-icon>New ticket</v-btn
            >
          </v-toolbar>

          <v-data-table
            v-if="
              this.project.tickets != undefined && this.project.tickets != null
            "
            :headers="ticketHeader"
            :items="tickets"
            :items-per-page="5"
            class="elevation-1"
          >
            <template v-slot:item.id="{ item }">
              {{ item[0] }}
            </template>

            <template v-slot:item.title="{ item }">
              {{ item[1].title }}
            </template>

            <template v-slot:item.type="{ item }">
              {{ item[1].type.toString() }}
            </template>

            <template v-slot:item.created="{ item }">
              {{ item[1].created }}
            </template>

            <template v-slot:item.issuer="{ item }">
              {{ item[1].issuer }}
            </template>

            <template v-slot:item.priority="{ item }">
              <v-chip :color="returnPriorityColor(item[1].priority)" label dark>
                {{ item[1].priority }}
              </v-chip>
              <!-- <v-btn @click="onDetails(item[0])">Details</v-btn> -->
            </template>

            <template v-slot:item.actions="{ item }">
              <v-icon small class="mr-2" @click="onDetails(item[0])">
                mdi-pencil
              </v-icon>
            </template>
          </v-data-table>

          <v-card-title v-else>There are no tickets!</v-card-title>
        </v-card>
      </v-col>

      <!-- Personnel -->
      <v-col cols="12" md="6">
        <v-card>
          <v-toolbar flat>
            <v-card-title>Members</v-card-title>

            <v-spacer></v-spacer>

            <v-btn
              @click="assignPersonnelModal = true"
              class="ma-2"
              depressed
              outlined
            >
              <v-icon>mdi-plus</v-icon>Assign Member</v-btn
            >
          </v-toolbar>

          <v-data-table
            v-if="
              this.project.personnel != undefined &&
                this.project.personnel != null
            "
            :headers="personnelHeader"
            :items="personnel"
            :items-per-page="5"
            class="elevation-1"
          >
            <template v-slot:item.name="{ item }">
              <v-avatar class="mr-2" color="primary" size="36" dark
                ><v-img :src="item.photoUrl" max-height="36"
              /></v-avatar>
              {{ item.email }}
            </template>

            <template v-slot:item.role="{ item }">
              <v-chip color="default" label dark>
                {{ item.role }}
              </v-chip>
            </template>
          </v-data-table>
          <v-card-title v-else>No Personnel Assigned!</v-card-title>
        </v-card>
      </v-col>

      <!-- Activity -->
      <v-col cols="12">
        <v-card>
          <v-card-title>Activity</v-card-title>
          <v-divider></v-divider>

          <v-timeline>
            <v-timeline-item>Filiberto added new Ticket</v-timeline-item>
            <v-timeline-item class="text-right">
              Task #2 Priority changed to High
            </v-timeline-item>
            <v-timeline-item
              >Jessica has been added to the project</v-timeline-item
            >
            <v-timeline-item class="text-right">
              Task #17 Marked as completed
            </v-timeline-item>
            <v-timeline-item>Filiberto assigned as manager</v-timeline-item>
            <v-timeline-item class="text-right">
              Project Creation
            </v-timeline-item>
          </v-timeline>
        </v-card>
      </v-col>
    </v-row>

    <v-spacer class="my-7"></v-spacer>

    <!-- New Ticket Dialog -->
    <v-row justify="center">
      <v-dialog v-model="dialog" persistent max-width="600px">
        <v-card>
          <v-card-title>
            <v-icon class="mr-2">mdi-folder-plus-outline</v-icon>
            <span class="headline">New Ticket</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="ticket.title"
                    label="Ticket Name*"
                    required
                  ></v-text-field>
                </v-col>

                <v-col cols="12">
                  <v-textarea
                    v-model="ticket.description"
                    label="Description"
                  ></v-textarea>
                </v-col>
                <v-col cols="12"> </v-col>
                <v-col cols="12" sm="6">
                  <v-select
                    v-model="ticket.priority"
                    :items="['Lowest', 'Low', 'Medium', 'High', 'Top Priority']"
                    label="Priority*"
                    required
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-autocomplete
                    v-model="ticket.type"
                    :items="['Bug', 'Feature', 'Task', 'Subtask', 'Epic']"
                    label="Type"
                    multiple
                  ></v-autocomplete>
                </v-col>
              </v-row>
            </v-container>
            <small
              >*Hey you can't win the lottery if you don't have a ticket</small
            >
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="dialog = false">
              Cancel
            </v-btn>
            <v-btn color="blue darken-1" text @click="onSubmitTicket()">
              Create
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>

    <!-- Assign Personnel Dialog -->
    <assign-personnel :showModal.sync="assignPersonnelModal"></assign-personnel>

    <!-- Banner image uploader -->
    <image-uploader
      :showModal.sync="bannerEdit"
      :path="'projects/' + this.project.id"
      :photoKey="'bannerUrl'"
      :mode="'update'"
    ></image-uploader>
  </div>
</template>

<script>
import firebase from "firebase";
import imageUploader from "../../../components/imageUploader.vue";
import AssignPersonnel from "../../../components/assignPersonnel.vue";

export default {
  name: "projectOverview",
  computed: {
    user() {
      return this.$store.getters.loadedUser;
    },
    personnel() {
      let result = this.$store.getters.loadedProjects.find(
        project => project.id == this.$route.params.id
      );

      return Object.values(result.personnel);
    },
    project() {
      return this.$store.getters.loadedProjects.find(
        project => project.id == this.$route.params.id
      );
    },
    tickets() {
      let project = this.$store.getters.loadedProjects.find(
        project => project.id == this.$route.params.id
      );

      let tickets = Object.entries(project.tickets);

      return tickets;
    }
  },
  middleware: ["check-auth", "auth"],
  components: { imageUploader, AssignPersonnel },

  methods: {
    onDetails(ticketID) {
      this.$router.push({
        path: "/projects/" + ticketID + "/ticketDetail",
        params: { projectID: "lo" }
      });
    },
    onSubmitTicket() {
      let timeStamp = new Date();
      this.ticket.created =
        timeStamp.getUTCMonth() +
        1 +
        "/" +
        timeStamp.getUTCDate() +
        "/" +
        timeStamp.getUTCFullYear();

      if (this.project.tickets == undefined) {
        this.ticket.id = 1;
      }

      this.ticket.issuer = this.user.email;

      let writeData = {
        collection: this.ticket,
        path: "projects/" + this.$route.params.id + "/tickets",
        msgSucces: "New ticket Created",
        msgError: "Error new ticket"
      };

      this.$store.dispatch("newDataPush", writeData);

      this.ticket.title = "";
      this.ticket.description = "";
      this.ticket.priority = "";
      this.ticket.type = "";
      this.ticket.created = "";

      this.dialog = false;
    },
    returnPriorityColor(priority) {
      if (priority === "Lowest") return "grey";
      else if (priority === "Low") return "brown";
      else if (priority === "Medium") return "blue";
      else if (priority === "High") return "red";
      else return "white";
    }
  },
  data() {
    return {
      assignPersonnelModal: false,
      bannerShow: true,
      bannerEdit: false,
      dialog: false,
      ticket: {
        id: "",
        title: "",
        description: "",
        priority: "",
        type: "",
        created: "",
        issuer: ""
      },

      breadcrumbs: [
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
          text: "Overview",
          disabled: true,
          href: "/"
        }
      ],

      personnelHeader: [
        {
          text: "Name",
          align: "start",
          sortable: false,
          value: "name"
        },
        { text: "Email", value: "email" },
        { text: "Role", value: "role" },
        { text: "Last Online", value: "lastOnline" }
      ],
      ticketHeader: [
        {
          text: "Id",
          align: "start",
          sortable: true,
          value: "id"
        },
        { text: "Title", value: "title" },
        { text: "Type", value: "type" },
        { text: "Created", value: "created" },
        { text: "Issuer", value: "issuer" },
        { text: "Priority", value: "priority" },
        { text: "Actions", value: "actions", sortable: false }
      ]
    };
  }
};
</script>

<style lang="css">
.edit-banner {
  max-width: 160px;
  position: relative;
  bottom: -154px;
}
</style>
