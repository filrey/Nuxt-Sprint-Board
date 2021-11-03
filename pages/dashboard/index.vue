<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-card
          ><v-card-title>My Tickets</v-card-title>
          <v-data-table
            :headers="ticketHeader"
            :items="this.tickets"
            :search="search"
          >
            <template v-slot:[`item.actions`]="{ item }">
              <v-icon
                small
                class="mr-2"
                @click="onDetails(item.projectId, item.ticketId)"
              >
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

    <h1>Statistics</h1>
  </div>
</template>

<script>
import firebase from "firebase";
export default {
  name: "dashboard",
  middleware: ["check-auth", "auth"],
  computed: {
    loadedUser() {
      return this.$store.getters.loadedUser;
    }
  },
  mounted() {
    const userRef = firebase.database().ref(`/users/${this.loadedUser.uid}`);
    userRef.on("value", snapshot => {
      this.user = snapshot.val();
      let projectResult = Object.values(snapshot.val().assignedProjects);

      projectResult.forEach(project => {
        let projRef = firebase.database().ref(`/projects/${project}`);

        projRef.on("value", snapshot => {
          this.projects[project] = snapshot.val();
        });

        if (project in this.user.assignedTickets) {
          for (let ticket in this.projects[project].tickets) {
            let amendedTicket = this.projects[project].tickets[ticket];
            if (amendedTicket.hasOwnProperty("assigned")) {
              if (amendedTicket.assigned.uid == this.user.uid) {
                amendedTicket["projectId"] = project;
                amendedTicket["projectName"] = this.projects[project].name;
                amendedTicket["ticketId"] = ticket;
                this.tickets.push(amendedTicket);
              }
            }
          }
        }
      });
    });
  },
  methods: {
    onDetails(projectId, ticketID) {
      this.$router.push({
        path: "/projects/" + projectId + "/" + ticketID + "/ticketDetail",
        query: { project: this.projects[projectId] }
      });
    }
  },
  data() {
    return {
      user: "",
      projects: {},
      tickets: [],
      search: "",
      ticketHeader: [
        { text: "Title", value: "title" },
        { text: "Project", value: "projectName" },
        { text: "Priority", value: "priority" },
        { text: "Created", value: "created" },
        { text: "Updated", value: "updated" },
        { text: "Assigned", value: "assigned.name" },
        { text: "Type", value: "type" },
        { text: "Actions", value: "actions", sortable: false }
      ]
    };
  }
};
</script>
