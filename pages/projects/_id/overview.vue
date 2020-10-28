<template>
  <div class="my-3 mx-5">
    <nuxt-link to="/projects"><h2>Back to Projects</h2> </nuxt-link>
    <v-btn @click="dialog = true" class="ma-2" depressed outlined> <v-icon>mdi-plus</v-icon>Click to add a ticket</v-btn>


    <v-sheet>
      <v-sheet
        class="pa-7 ticket-badge rounded-lg"
        color="#4caf50"
        max-width="100%"
        elevation="5"
        dark
      >
        <div class="text-h6">{{ project.name }}</div>
      </v-sheet>

      <v-simple-table fixed-header height="300px">
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-left">Name</th>
              <th class="text-left">Email</th>
              <th class="text-left">Role</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in desserts" :key="item.name">
              <td>{{ item.name }}</td>
              <td>{{ item.email || "No email" }}</td>
              <td>{{ item.calories }}</td>
            </tr>
          </tbody>
        </template>
      </v-simple-table></v-sheet
    >

    <v-sheet>
      <v-sheet
        class="pa-7 ticket-badge rounded-lg"
        color="#4caf50"
        max-width="100%"
        elevation="5"
        dark
      >
        <div class="text-h6">Assigned Personnel</div>
      </v-sheet>

      <v-simple-table fixed-header height="300px">
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-left">Name</th>
              <th class="text-left">Email</th>
              <th class="text-left">Role</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in desserts" :key="item.name">
              <td>{{ item.name }}</td>
              <td>{{ item.email || "No email" }}</td>
              <td>{{ item.calories }}</td>
            </tr>
          </tbody>
        </template>
      </v-simple-table></v-sheet
    >

    <v-spacer class="my-7"></v-spacer>

    <!-- TICKETS -->
    <v-sheet>
      <v-sheet
        class="pa-7 ticket-badge rounded-lg"
        color="#4caf50"
        max-width="100%"
        elevation="5"
        dark
      >
        <div class="text-h6">Tickets</div>
      </v-sheet>
      <v-simple-table v-if="project.tickets != null" fixed-header height="300px">
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-left">Title</th>
              <th class="text-left">Description</th>
              <th class="text-left">Type</th>
              <th class="text-left">Priority</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="ticket in project.tickets" :key="ticket.id">
              <td>{{ ticket.title }}</td>
              <td>{{ ticket.description || "No Description" }}</td>
              <td>{{ ticket.type || "No Type Specified" }}</td>
              <td>{{ ticket.priority }}</td>
            </tr>
          </tbody>
        </template>
      </v-simple-table></v-sheet
    >
      <v-row justify="center">
      <v-dialog
        v-model="dialog"
        persistent
        max-width="600px"
      >

        <v-card>
          <v-card-title>
            <v-icon class="mr-2">mdi-folder-plus-outline</v-icon>
            <span class="headline">New Ticket</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col
                  cols="12"
                >
                  <v-text-field
                    v-model="ticket.title"
                    label="Ticket Name*"
                    required
                  ></v-text-field>
                </v-col>

                <v-col
                  cols="12"
                >
                  <v-textarea
                    v-model="ticket.description"
                    label="Description"
                  ></v-textarea>
                </v-col>
                <v-col cols="12">
                </v-col>
                <v-col
                  cols="12"
                  sm="6"
                >
                  <v-select
                    v-model="ticket.priority"
                  :items="['Lowest', 'Low', 'Medium', 'High','Top Priority']"
                  label="Priority*"
                    required
                  ></v-select>
                </v-col>
                <v-col
                  cols="12"
                  sm="6"
                >
                  <v-autocomplete
                    v-model="ticket.type"
                    :items="['Bug', 'Feature', 'Task', 'Subtask', 'Epic']"
                    label="Type"
                    multiple
                  ></v-autocomplete>
                </v-col>
              </v-row>
            </v-container>
            <small>*Hey you can't win the lottery if you don't have a ticket</small>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="blue darken-1"
              text
              @click="dialog = false"
            >
              Cancel
            </v-btn>
            <v-btn
              color="blue darken-1"
              text
              @click="onSubmitTicket()"
            >
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
        (project) => project.id == this.$route.params.id
      );
    },
  },
  methods: {
    onSubmitTicket() {
      this.$store.dispatch('newTicket', {
        ticketData: this.ticket,
        projectId: this.$route.params.id
      })

      // this.project.tickets.push(this.ticket)
      this.ticket.title = ''
      this.ticket.description = ''
      this.ticket.priority = ''
      this.ticket.type = ''

      this.dialog = false
    }
  },
  data() {
    return {
      dialog: false,
      ticket:{
        title: '',
        description: '',
        priority: '',
        type: '',
      },
      desserts: [
        {
          name: "Frozen Yogurt",
          calories: 159,
        },
        {
          name: "Ice cream sandwich",
          calories: 237,
        },
        {
          name: "Eclair",
          calories: 262,
        },
        {
          name: "Cupcake",
          calories: 305,
        },
        {
          name: "Gingerbread",
          calories: 356,
        },
        {
          name: "Jelly bean",
          calories: 375,
        },
        {
          name: "Lollipop",
          calories: 392,
        },
        {
          name: "Honeycomb",
          calories: 408,
        },
        {
          name: "Donut",
          calories: 452,
        },
        {
          name: "KitKat",
          calories: 518,
        },
      ],
    };
  },
};
</script>
