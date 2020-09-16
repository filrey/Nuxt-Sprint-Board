<template>
  <div>
    Create
    <v-btn @click="onSubmit">Test firestore</v-btn>
  </div>
</template>
<script>
import axios from "axios";
export default {
  name: "create",
  methods: {
    onSubmit() {
      this.$store
        .dispatch("newTicket", {
          title: "hello",
          updatedDate: new Date(),
        })
        .then(() => {
          this.$router.push("/dashboard");
        })
        .catch();
    },
  },
};
</script>
