<template>
  <div>
    <h1>Projects</h1>
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
            <v-row align="center" class="mx-0">
              <v-rating
                :value="4.5"
                color="amber"
                dense
                half-increments
                readonly
                size="14"
              ></v-rating>

              <div class="grey--text ml-4">4.5 (413)</div>
            </v-row>

            <div class="my-4 subtitle-1">Manager • {{ item.manager }}</div>

            <div>This is the project's description</div>
          </v-card-text>

          <v-divider class="mx-4"></v-divider>

          <v-card-title>Developers</v-card-title>

          <v-card-text>
            <v-chip-group
              v-model="selectedDev"
              active-class="deep-purple accent-4 white--text"
              column
            >
              <v-chip v-for="dev in item.devs" :key="dev.id">{{ dev }}</v-chip>
            </v-chip-group>
          </v-card-text>

          <v-divider class="mx-4"></v-divider>

          <v-card-title>Submitters</v-card-title>

          <v-card-text>
            <v-chip-group
              v-model="selectedSub"
              active-class="green accent-4 white--text"
              column
            >
              <v-chip v-for="sub in item.submitters" :key="sub.id">{{
                sub
              }}</v-chip>
            </v-chip-group>
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
    return { loading: false, selectedDev: "", selectedSub: "" };
  },
  methods: {
    onOverview(projectId) {
      this.$router.push("/projects/" + projectId + "/overview");
    }
  }
};
</script>
