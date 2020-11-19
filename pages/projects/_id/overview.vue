<template>
  <div class="my-3 mx-5">
    <nuxt-link to="/projects"><h2>Back to Projects</h2> </nuxt-link>
    <v-btn @click="dialog = true" class="ma-2" depressed outlined>
      <v-icon>mdi-plus</v-icon>Click to add a ticket</v-btn
    >

    <v-row>
      <v-col cols="12" md="6">
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

      <!-- Personnel -->
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>Assigned Personnel</v-card-title>

          <v-data-table
            :headers="personnelHeader"
            :items="desserts"
            :items-per-page="5"
            class="elevation-1"
          >
            <template v-slot:item.name="{ item }">
              <v-avatar class="mr-2" color="primary" size="36" dark
                ><span class="white--text">FR</span></v-avatar
              >
              {{ item.name }}
            </template>

            <template v-slot:item.role="{ item }">
              <v-chip color="red" label dark>
                {{ item.role }}
              </v-chip>
            </template>
          </v-data-table>
        </v-card>
      </v-col>

      <!-- Tickets -->
      <v-col cols="12">
        <v-card>
          <v-card-title>Tickets</v-card-title>

          <v-data-table
            :headers="ticketHeader"
            :items="tickets"
            :items-per-page="5"
            class="elevation-1"
          >
            <template v-slot:item.id="{ item }">
              {{}}
            </template>

            <template v-slot:item.priority="{ item }">
              <v-chip :color="returnPriorityColor(item.priority)" label dark>
                {{ item.priority }}
              </v-chip>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>

    <v-spacer class="my-7"></v-spacer>

    <!-- Dialog -->
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
  </div>
</template>

<script>
export default {
  name: "projectOverview",
  computed: {
    project() {
      return this.$store.getters.loadedProjects.find(
        project => project.id == this.$route.params.id
      );
    },
    tickets() {
      let project = this.$store.getters.loadedProjects.find(
        project => project.id == this.$route.params.id
      );

      return Object.values(project.tickets);
    }
  },
  middleware: ["check-auth", "auth"],
  methods: {
    onSubmitTicket() {
      this.$store.dispatch("newTicket", {
        ticketData: this.ticket,
        projectId: this.$route.params.id
      });

      this.ticket.title = "";
      this.ticket.description = "";
      this.ticket.priority = "";
      this.ticket.type = "";

      this.dialog = false;
    },
    returnPriorityColor(priority) {
      if (priority == "Lowest") return "grey";
      else if (priority == "Low") return "brown";
      else if (priority == "Medium") return "blue";
      else if (priority == "High") return "orange";
      else return "red";
    }
  },
  data() {
    return {
      dialog: false,
      ticket: {
        title: "",
        description: "",
        priority: "",
        type: ""
      },
      series: [44, 55, 41, 17, 15],
      chartOptions: {
        chart: {
          type: "donut"
        }
      },
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
        { text: "Priority", value: "priority" }
      ],
      desserts: [
        {
          name: "Filiberto Reyes",
          email: "filibertoreyes55@gmail.com",
          role: "Manager",
          lastOnline: "1 minute ago"
        },
        {
          name: "Filiberto Reyes",
          email: "filibertoreyes55@gmail.com",
          role: "Manager",
          lastOnline: "1 minute ago"
        },
        {
          name: "Filiberto Reyes",
          email: "filibertoreyes55@gmail.com",
          role: "Manager",
          lastOnline: "1 minute ago"
        },
        {
          name: "Filiberto Reyes",
          email: "filibertoreyes55@gmail.com",
          role: "Manager",
          lastOnline: "1 minute ago"
        },
        {
          name: "Filiberto Reyes",
          email: "filibertoreyes55@gmail.com",
          role: "Manager",
          lastOnline: "1 minute ago"
        },
        {
          name: "Filiberto Reyes",
          email: "filibertoreyes55@gmail.com",
          role: "Manager",
          lastOnline: "1 minute ago"
        },
        {
          name: "Filiberto Reyes",
          email: "filibertoreyes55@gmail.com",
          role: "Manager",
          lastOnline: "1 minute ago"
        },
        {
          name: "Filiberto Reyes",
          email: "filibertoreyes55@gmail.com",
          role: "Manager",
          lastOnline: "1 minute ago"
        },
        {
          name: "Filiberto Reyes",
          email: "filibertoreyes55@gmail.com",
          role: "Manager",
          lastOnline: "1 minute ago"
        }
      ]
    };
  }
};
</script>
