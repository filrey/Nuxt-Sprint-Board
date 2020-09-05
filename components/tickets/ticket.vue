<template>
  <div>
    <v-card class="mx-auto" max-width="400">
      <v-img
        class="white--text align-end"
        height="200px"
        src="https://cdn.vuetifyjs.com/images/cards/docks.jpg"
      >
        <v-card-title>{{title}}</v-card-title>
      </v-img>

      <v-card-subtitle class="pb-0">Number 10</v-card-subtitle>

      <v-card-text class="text--primary">
        <div>Whitehaven Beach</div>

        <div>Whitsunday Island, Whitsunday Islands</div>
      </v-card-text>

      <v-card-actions>
        <v-btn color="orange" text>Share</v-btn>

        <v-btn color="orange" text>Explore</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "ticket",
  props: {
    title: {
      type: String,
      required: true,
    },
    // description: {
    //   type: String,
    //   required: true,
    // },
    // assignedDevs: {
    //   type: String,
    //   required: false,
    // },
    // submitter: {
    //   type: String,
    //   required: true,
    // },
    // priority: {
    //   type: String,
    //   required: false,
    // },
    // status: {
    //   type: String,
    //   required: false,
    // },
    // type: {
    //   type: String,
    //   required: false,
    // },
    // created: {
    //   type: String,
    //   required: false,
    // },
    // updated: {
    //   type: String,
    //   required: false,
    // },
    // history: {
    //   type: String,
    //   required: false,
    // },
    // attachments: {
    //   type: String,
    //   required: false,
    // },
  },
};
</script>