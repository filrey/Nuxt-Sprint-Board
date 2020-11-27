<template>
  <div>
    Create
    <v-btn @click="onSubmit">Test firestore</v-btn>

    <!-- Projects -->
    <h1>Add Projects</h1>
    <v-form>
      <v-text-field
        v-model="projectName"
        label="Project Name"
        name="projectName"
        prepend-icon="mdi-email"
        type="text"
      ></v-text-field>
      <v-btn @click.prevent="onAddProject()" color="green">Add Project</v-btn>
    </v-form>
    <h2>Test Snackbar</h2>
    <v-btn @click.prevent="onTestSnackbar()" color="grey">Test Snackbar</v-btn>
  </div>
</template>
<script>
import axios from "axios";
export default {
  name: "create",
  middleware: ["check-auth", "auth"],
  data() {
    return {
      projectName: ""
    };
  },
  methods: {
    onSubmit() {
      this.$store
        .dispatch("newTicket", {
          title: "hello",
          updatedDate: new Date()
        })
        .then(() => {
          this.$router.push("/dashboard");
        })
        .catch();
    },
    onAddProject() {
      let writeData = {
        collection: {
          name: this.projectName,
          manager: "The Boss",
          devs: ["Filiberto", "Jessica", "Steve"],
          submitters: ["Sub1", "Sub2", "Sub3"],
          tickets: [
            {
              title: "Create your first ticket!",
              description: "First Action",
              priority: "Medium",
              type: "Bug"
            }
          ]
        },
        path: "projects/",
        msgSucces: "New project Created",
        msgError: "Error new project"
      };

      this.$store.dispatch("newDataPush", writeData);
    },
    onTestSnackbar() {
      this.$store.dispatch("toggleSnackbar", {
        message: "Testing Snackbar...",
        color: ""
      });
    }
  }
};
</script>
