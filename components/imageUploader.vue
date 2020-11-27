<template>
  <div>
    <v-dialog v-model="this.showModal" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <v-icon class="mr-2">mdi-image</v-icon>
          <span class="headline">New Image</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <input type="file" @change="onFileSelected" />
              </v-col>
              <v-col cols="12">
                <img :src="newImageUrl" height="150" width="100%" />
              </v-col>
              <v-col cols="12">
                <v-progress-linear
                  color="teal"
                  buffer-value="0"
                  :value="uploadValue"
                  stream
                >
                </v-progress-linear>
              </v-col>
            </v-row>
          </v-container>
          <small>*Recommended size is 1200x480px for banners</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="this.closeModal">
            Cancel
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="onImageUpload()"
            :disabled="selectedFile == null"
          >
            Upload
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import firebase from "firebase";

export default {
  name: "imageUploader",

  // showModal: controls whether the modal is on or off
  // path: directs where in the firebase database we will write to
  // mode: selects which method we will use to write to the database can be set, push, or update
  props: ["showModal", "path", "mode", "photoKey"],
  data() {
    return {
      imgUrl: null,
      uploadValue: 0,
      newImageUrl: null,
      selectedFile: null
    };
  },
  methods: {
    clearData() {
      this.imgUrl = null;
      this.newImageUrl = null;
      this.selectedFile = null;
      this.uploadValue = 0;
    },
    closeModal() {
      this.$emit("update:showModal", false);
      this.clearData();
    },
    onFileSelected(event) {
      this.selectedFile = event.target.files[0];
      let fileName = this.selectedFile.name;

      if (fileName.lastIndexOf(".") <= 0) {
        return alert("Please select a valid file!");
      }

      const fileReader = new FileReader();
      fileReader.addEventListener("load", () => {
        this.newImageUrl = fileReader.result;
      });

      fileReader.readAsDataURL(event.target.files[0]);
    },
    onImageUpload() {
      const storageRef = firebase
        .storage()
        .ref(`${this.selectedFile.name}`)
        .put(this.selectedFile);
      storageRef.on(
        `state_changed`,
        snapshot => {
          this.uploadValue =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        },
        error => {
          this.$store.dispatch("toggleSnackbar", {
            message: error.message,
            color: "error"
          });
        },
        () => {
          this.uploadValue = 100;
          storageRef.snapshot.ref.getDownloadURL().then(url => {
            this.imgUrl = url;

            let post = {
              [this.photoKey]: this.imgUrl
            };

            let writeData = {
              collection: post,
              path: this.path,
              msgSucces: "Image Uploaded Successfully",
              msgError: "Error while uploading image"
            };

            switch (this.mode) {
              case "set":
                this.$store.dispatch("newDataSet", writeData);

                break;

              case "push":
                this.$store.dispatch("newDataPush", writeData);

                break;

              case "update":
                this.$store.dispatch("newDataUpdate", writeData);

                break;

              default:
                this.$store.dispatch("newDataSet", writeData);
                break;
            }

            this.closeModal();
          });
        }
      );
    }
  }
};
</script>
