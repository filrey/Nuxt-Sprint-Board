<template>
  <div>
    Create
    <v-btn @click="onSubmit">Test firestore</v-btn>
  </div>
</template>
<script>
import axios from "axios";
export default {
  methods: {
    onSubmit() {
      axios
        .post("https://agile-sprint-board.firebaseio.com/test.json", {
          title: "hello",
          updatedDate: new Date(),
        })
        .then((result) => console.log(result))
        .catch((e) => console.log(e));
    },
  },
};
</script>
