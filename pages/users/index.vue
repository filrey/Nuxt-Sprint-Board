<template>
  <div>
    <h1>Users</h1>
    <v-select
      v-model="role"
      :items="['Admin', 'Project Manager', 'Developer', 'Submitter']"
      label="Set Role"
      required
    ></v-select>
    <ul id="example-2">
      <li v-for="user in allUsers" :key="user.id">
        {{ user.email }}
        <v-btn @click="onSetRole(user)">Set</v-btn>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "users",
  middleware: ["check-auth", "auth"],
  computed: {
    allUsers() {
      return this.$store.getters.loadedSiteUsers;
    }
  },
  methods: {
    onSetRole(user) {
      let writeData = {
        collection: this.role,
        path: "users/" + user.uid + "/role",
        msgSucces: "[" + user.email + "] set as " + this.role,
        msgError: "Error setting role"
      };

      this.$store.dispatch("newDataSet", writeData);
    }
  },
  data() {
    return {
      role: ""
    };
  }
};
</script>
