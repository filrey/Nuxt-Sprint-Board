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
        <v-icon>mdi-plus</v-icon>Edit Banner
      </v-btn>
    </v-parallax>

    <!-- Tickets -->
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>
            Tickets
            <v-spacer></v-spacer>
            <v-text-field
              :search="search"
              prepend-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
            ></v-text-field>
            <v-btn
              @click="dialog = true"
              type="file"
              class="ma-2"
              depressed
              outlined
            >
              <v-icon>mdi-plus</v-icon>New
            </v-btn>
          </v-card-title>
          <v-data-table
            v-if="
              this.project.tickets != undefined && this.project.tickets != null
            "
            :headers="ticketHeader"
            :items="Object.entries(project.tickets)"
            :search="search"
          >
            <template v-slot:[`item.title`]="{ item }">
              {{ item[1].title }}
            </template>

            <template v-slot:[`item.priority`]="{ item }">
              <v-chip :color="returnPriorityColor(item[1].priority)" label dark>
                {{ item[1].priority }}
              </v-chip>
            </template>

            <template v-slot:[`item.type`]="{ item }">
              {{ item[1].type.toString() }}
            </template>

            <template v-slot:[`item.created`]="{ item }">
              {{ item[1].created }}
            </template>

            <template v-slot:[`item.updated`]="{ item }">
              {{ item[1].updated }}
            </template>

            <template v-slot:[`item.assigned`]="{ item }">
              <v-avatar size="36" class="mr-2">
                <img :src="returnPhotoUrl(item[1].assigned)" />
              </v-avatar>
              {{ returnAssigned(item[1].assigned) }}
            </template>

            <template v-slot:[`item.actions`]="{ item }">
              <v-icon small class="mr-2" @click="onDetails(item[0])">
                mdi-pencil
              </v-icon>

              <v-icon
                small
                class="mr-2"
                @click="(deleteTicketModal = true), (deleteTicketId = item[0])"
              >
                mdi-delete
              </v-icon>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
    <!-- Personnel -->
    <v-row>
      <v-col cols="12" md="6">
        <v-card>
          <v-toolbar flat>
            <v-card-title>Personnel</v-card-title>

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
            :items="Object.values(project.personnel)"
            :items-per-page="5"
            class="elevation-1"
          >
            <template v-slot:[`item.name`]="{ item }">
              <v-avatar class="mr-2" color="grey" size="36" dark
                ><v-img :src="item.photoUrl" max-height="36"
              /></v-avatar>
              {{ item.email }}
            </template>

            <template v-slot:[`item.role`]="{ item }">
              <v-chip :color="returnRoleColor(item.role)" label dark>
                {{ item.role }}
              </v-chip>
            </template>

            <template v-slot:[`item.actions`]="{ item }">
              <v-icon small class="mr-2" @click="onProfileView(item.uid)">
                mdi-account
              </v-icon>

              <v-icon
                small
                class="mr-2"
                @click="(removePersonModal = true), (removePersonId = item.uid)"
              >
                mdi-delete
              </v-icon>
            </template>
          </v-data-table>
          <v-card-title v-else>No Personnel Assigned!</v-card-title>
        </v-card>
      </v-col>

      <!-- Logs -->
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>Logs</v-card-title>
          <v-divider></v-divider>

          <v-timeline dense clipped class="timeLineScroll">
            <v-timeline-item v-for="log in project.logs" :key="log.data">
              <template v-slot:icon>
                <v-avatar>
                  <img :src="log.user.photoUrl" />
                </v-avatar>
              </template>
              <v-expansion-panels popout>
                <v-expansion-panel>
                  <v-expansion-panel-header
                    ><div v-if="log.type == 'newTicket'">
                      {{ log.user.name }} created a new ticket {{ log.time }}
                    </div>
                    <div v-if="log.type == 'detail'">
                      {{ log.user.name }} updated ticket details
                      {{ log.time }}
                    </div>
                  </v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <div v-if="log.type == 'newTicket'">
                      Ticket: "{{ log.data }}"
                    </div>

                    <div v-if="log.type == 'detail'">
                      New Details: "{{ log.data }}"
                    </div>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-timeline-item>
          </v-timeline>
        </v-card>
      </v-col></v-row
    >

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

    <!-- Delete Ticket Modal -->
    <v-dialog v-model="deleteTicketModal" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <v-icon class="mr-2">mdi-delete</v-icon>
          <span class="headline">Delete Ticket</span>
        </v-card-title>

        <v-card-text
          >Are you sure you want to delete this ticket? This action can not be
          undone.</v-card-text
        >
        <v-card-actions>
          <v-btn @click="(deleteTicketModal = false), (deleteTicketId = '')"
            >Cancel</v-btn
          >
          <v-btn color="error" @click="onDeleteTicket(deleteTicketId)"
            >Delete</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Remove Person Modal -->
    <v-dialog v-model="removePersonModal" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <v-icon class="mr-2">mdi-delete</v-icon>
          <span class="headline">Remove Person</span>
        </v-card-title>

        <v-card-text
          >Are you sure you want to remove this person from the
          project?</v-card-text
        >
        <v-card-actions>
          <v-btn @click="(removePersonModal = false), (removePersonId = '')"
            >Cancel</v-btn
          >
          <v-btn
            color="error"
            @click="onRemovePerson(removePersonId), (removePersonModal = false)"
            >Delete</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
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
    }
  },
  middleware: ["check-auth", "auth"],
  components: { imageUploader, AssignPersonnel },
  mounted() {
    const dbRef = firebase.database().ref("/projects/" + this.$route.params.id);

    dbRef.on("value", snapshot => {
      this.project = {};
      this.project = snapshot.val();
    });
  },
  methods: {
    onProfileView(uid) {
      // If current user direct to profile
      if (this.user.uid == uid) {
        this.$router.push({
          path: `/profile`
        });
      } else {
        // else viewing other user direct to readOnly profile
        this.$router.push({
          path: `/profile/${uid}/view`
        });
      }
    },
    returnPhotoUrl(assigned) {
      if (assigned == undefined || assigned == null) {
        return "https://demos.creative-tim.com/vuetify-material-dashboard/favicon.ico";
      }
      return assigned.photoUrl;
    },
    returnAssigned(assigned) {
      if (assigned == undefined || assigned == null) {
        return "None Assigned";
      }
      return assigned.email;
    },
    onDetails(ticketID) {
      this.$router.push({
        path:
          "/projects/" +
          this.$route.params.id +
          "/" +
          ticketID +
          "/ticketDetail",
        query: { project: this.project }
      });
    },
    onDeleteTicket(ticketID) {
      let writeData = {
        path: "projects/" + this.$route.params.id + "/tickets/" + ticketID,
        msgSucces: "Ticket deletion successful",
        msgError: "Error while deleting ticket"
      };
      this.$store.dispatch("dataRemove", writeData);
      this.deleteTicketId = "";
      this.deleteTicketModal = false;
    },
    onRemovePerson(uid) {
      let writeData = {
        path: "projects/" + this.$route.params.id + "/personnel/" + uid,
        msgSucces: "Personnel removed",
        msgError: "Error while removing personnel"
      };
      this.$store.dispatch("dataRemove", writeData);
      this.deleteTicketId = "";
      this.deleteTicketModal = false;
    },
    onSubmitTicket() {
      let now = new Date();
      let hours = now.getHours();
      let minutes = now.getMinutes();
      let ampm = hours >= 12 ? "pm" : "am";
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      minutes = minutes < 10 ? "0" + minutes : minutes;
      let strTime = hours + ":" + minutes + " " + ampm;

      let timestamp =
        now.getMonth() +
        1 +
        "/" +
        now.getDate() +
        "/" +
        now.getFullYear() +
        " " +
        strTime;

      this.ticket.issuer = this.user.email;
      this.ticket.created = timestamp;
      this.ticket.updated = timestamp;

      let writeData = {
        collection: this.ticket,
        path: "projects/" + this.$route.params.id + "/tickets",
        msgSucces: "New ticket Created",
        msgError: "Error new ticket"
      };

      let logData = {
        collection: {
          data: this.ticket,
          time: timestamp,
          user: this.user,
          type: "newTicket"
        },
        path: "projects/" + this.$route.params.id + "/logs",
        msgSucces: "New ticket Created",
        msgError: "Error new ticket"
      };

      this.$store.dispatch("newDataPush", writeData);
      this.$store.dispatch("newDataPush", logData);

      this.ticket.title = "";
      this.ticket.description = "";
      this.ticket.priority = "";
      this.ticket.type = "";
      this.ticket.created = "";
      this.ticket.updated = "";

      this.dialog = false;
    },
    returnPriorityColor(priority) {
      if (priority === "Lowest") return "grey";
      else if (priority === "Low") return "brown";
      else if (priority === "Medium") return "blue";
      else if (priority === "High") return "red";
      else return "white";
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
      project: "",
      removePersonId: "",
      removePersonModal: "",
      deleteTicketId: "",
      deleteTicketModal: false,
      search: "",
      assignPersonnelModal: false,
      bannerShow: true,
      bannerEdit: false,
      dialog: false,
      ticket: {
        title: "",
        description: "",
        priority: "",
        type: "",
        created: "",
        updated: "",
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
        { text: "Actions", value: "actions", sortable: false }
      ],
      ticketHeader: [
        { text: "Title", value: "title" },
        { text: "Priority", value: "priority" },
        { text: "Created", value: "created" },
        { text: "Updated", value: "updated" },
        { text: "Assigned", value: "assigned" },
        { text: "Type", value: "type" },
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

.timeLineScroll {
  max-height: 377px;
  overflow-y: auto;
  display: flex;
  flex-direction: column-reverse;
}
</style>
