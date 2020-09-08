<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      :src="require('@/assets/images/dock.jpg')"
      dark
      fixed
      app
    >
      <v-list>
        <v-avatar color="indigo">
          <v-icon dark>mdi-account-circle</v-icon>
        </v-avatar>
        {{loadedUser}}
        <v-divider></v-divider>
        <v-list-item v-for="(item, i) in items" :key="i" :to="item.to" router exact>
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar :clipped-left="clipped" fixed app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title v-text="title" />
      <v-spacer />
      <v-avatar color="indigo">
        <v-icon dark>mdi-account-circle</v-icon>
      </v-avatar>User Name
    </v-app-bar>
    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
    <v-footer :absolute="!fixed" app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  computed: {
    loadedUser() {
      return this.$store.getters.loadedUser;
    },
  },
  data() {
    return {
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
          icon: "mdi-face",
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
