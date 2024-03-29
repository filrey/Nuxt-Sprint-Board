<template>
  <div class="my-3 mx-5">
    <v-breadcrumbs :items="breadcrumbs" divider="-"></v-breadcrumbs>
    <v-row>
      <v-col cols="12">
        <v-card
          ><v-card-title>My Tickets</v-card-title>
          <v-data-table
            :headers="ticketHeader"
            :items="this.tickets"
            :search="search"
          >
            <template v-slot:[`item.priority`]="{ item }">
              <v-chip :color="returnPriorityColor(item.priority)" label dark>
                {{ item.priority }}
              </v-chip>
            </template>
            <template v-slot:[`item.actions`]="{ item }">
              <v-icon
                small
                class="mr-2"
                @click="onDetails(item.projectId, item.ticketId)"
              >
                mdi-pencil
              </v-icon>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
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
  head() {
    return {
      title: "Dashboard"
    };
  },
  mounted() {
    let exportProjects = {};
    let projectResults = [];
    let projectRefs = [];
    let projectIds;
    const userRef = firebase.database().ref(`/users/${this.loadedUser.uid}`);
    userRef
      .once("value", snapshot => {
        this.user = snapshot.val();
        projectIds = Object.values(snapshot.val().assignedProjects);
      })
      .then(res => {
        projectIds.forEach(project => {
          projectRefs.push(firebase.database().ref(`/projects/${project}`));
        });
      })
      .then(res => {
        let i = 0;
        projectRefs.forEach(project => {
          project
            .once("value", snapshot => {
              projectResults.push(snapshot.val());
            })
            .then(res => {
              let projectId = projectIds[i];
              let project = projectResults[i];
              exportProjects[projectId] = project;
              for (let ticket in project.tickets) {
                let amendedTicket = project.tickets[ticket];
                if (amendedTicket.hasOwnProperty("assigned")) {
                  if (amendedTicket.assigned.uid == this.user.uid) {
                    amendedTicket["projectId"] = projectId;
                    amendedTicket["projectName"] = project.name;
                    amendedTicket["ticketId"] = ticket;
                    this.tickets.push(amendedTicket);
                  }
                }
              }
              i++;
            })
            .catch(err => {
              console.log(err);
            });
        });
      })
      .catch(err => {
        console.log(err);
      });

    this.projects = exportProjects;
  },
  methods: {
    onDetails(projectId, ticketID) {
      this.$router.push({
        path: "/projects/" + projectId + "/" + ticketID + "/ticketDetail",
        query: { project: this.projects[projectId] }
      });
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
      user: "",
      tickets: [],
      projects: [],
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
      ],
      breadcrumbs: [
        {
          text: "Home",
          disabled: false,
          href: "/"
        },
        {
          text: "Dashboard",
          disabled: true,
          href: "/dashboard"
        }
      ]
    };
  }
};
</script>
