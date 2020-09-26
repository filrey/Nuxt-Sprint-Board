<template>
  <div>
    <nuxt-link to="/projects"><h2>Back to Projects</h2> </nuxt-link>

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
  data() {
    return {
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
