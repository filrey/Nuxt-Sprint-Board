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
    <v-btn class="mb-5" @click.prevent="onTestSnackbar()" color="grey"
      >Test Snackbar</v-btn
    >

    <image-uploader
      :showModal.sync="showImageUploader"
      :path="'testImages/'"
      :mode="'push'"
      :photoKey="'imgUrl'"
    ></image-uploader>
    <v-btn @click="showImageUploader = !showImageUploader">
      Toggle image upload</v-btn
    >
    <v-btn @click="testRead()">Test Data Read</v-btn>
  </div>
</template>
<script>
import firebase from "firebase";
import imageUploader from "../../components/imageUploader.vue";
export default {
  name: "create",
  middleware: ["check-auth", "auth"],
  components: [imageUploader],
  data() {
    return {
      projectName: "",
      showImageUploader: false
    };
  },
  methods: {
    testRead() {
      let res = this.$store.dispatch(
        "dataRead",
        "/users/G7gDf3MFVhP7Jzox4BWY2ZjzKQZ2"
      );

      console.log(res.email);
    },
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
          submitters: ["Sub1", "Sub2", "Sub3"]
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
