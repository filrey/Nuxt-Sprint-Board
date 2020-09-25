<template>
  <v-app>
    <v-navigation-drawer
      class="pb-0 drawer"
      v-model="drawer"
      :src="require('@/assets/images/dock.jpg')"
      :dark="
        'rgba(0, 0, 0, .8), rgba(0, 0, 0, .8)' !==
        'rgba(228, 226, 226, 1), rgba(255, 255, 255, 0.7)'
      "
      app
    >
      <!-- USER AVATAR AND NAME -->
      <v-list dense nav>
        <v-list-item>
          <v-list-item-avatar class="align-self-center" color="white" contain>
            <v-img
              src="https://demos.creative-tim.com/vuetify-material-dashboard/favicon.ico"
              max-height="30"
            />
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title v-text="loadedUser.email || 'Guest'" />
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <v-divider class="mb-2"></v-divider>

      <!-- NAV LINKS -->
      <v-list expand nav>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- APP-BAR -->
    <v-app-bar :clipped-left="clipped" absolute app color="transparent" flat>
      <v-btn
        class="mr-3"
        @click.stop="drawer = !drawer"
        elevation="1"
        color="white"
        tile
      >
        <v-icon>mdi-view-quilt</v-icon>
      </v-btn>
      <v-toolbar-title v-text="title" />
      <v-spacer />
    </v-app-bar>

    <!-- MAIN_VIEW AND FOOTER-->
    <v-main class="main mx-1 pb-0">
      <v-container>
        <nuxt />
        <v-footer :absolute="!fixed" color="#eee" app>
          <span>&copy; {{ new Date().getFullYear() }}</span>
        </v-footer>
      </v-container>
    </v-main>

    <!-- SNACKBAR -->
    <v-snackbar v-model="showSnackbar" :color="this.snackColor" shaped bottom>
      {{ message }}
      <template v-slot:action="{ attrs }">
        <v-btn color="white" text v-bind="attrs" @click="showSnackbar = false"
          >Close</v-btn
        >
      </template>
    </v-snackbar>
  </v-app>
</template>

<script>
export default {
  name: "Default",
  computed: {
    loadedUser() {
      return this.$store.getters.loadedUser;
    },
    isAuthenticated() {
      return this.$store.getters.isAuthenticated;
    },
    snackbarMessage() {
      return this.$store.getters.loadedSnackbarMessage;
    },
    snackbarValue() {
      return this.$store.getters.loadedSnackbarValue;
    },
    snackbarColor() {
      return this.$store.getters.loadedSnackbarColor;
    },
  },
  watch: {
    snackbarValue(newValue, oldValue) {
      if (this.snackbarValue) {
        this.message = this.snackbarMessage;
        this.snackColor = this.snackbarColor;
        this.showSnackbar = true;
      }
    },
  },
  data() {
    return {
      showSnackbar: false,
      snackColor: "",
      message: "",
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: "mdi-apps",
          title: "Welcome",
          to: "/",
        },
        {
          icon: "mdi-account",
          title: "Profile",
          to: "/profile",
        },
        {
          icon: "mdi-chevron-right-box-outline",
          title: "Login",
          to: "/login",
        },
        {
          icon: "mdi-chart-bubble",
          title: "Projects",
          to: "/projects",
        },
        {
          icon: "mdi-grid",
          title: "Dashboard",
          to: "/dashboard",
        },
        {
          icon: "mdi-face",
          title: "Demo",
          to: "/demo",
        },
        {
          icon: "mdi-plus",
          title: "Create",
          to: "/create",
        },
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: "Agile-Sprint-Board",
    };
  },
};
</script>

<style lang="css" scoped>
.drawer {
  max-height: 100% !important;
}
.main {
  background-color: #eee;
}
</style>
