<template>
  <div>
    Dashboard Vue
    <h1>Projects and Tickets</h1>
    <h1>Statistics</h1>
  </div>
</template>

<script>
export default {
  middleware: ["check-auth", "auth"],

  created() {
    this.$store.dispatch("setTickets", this.tickets);
  },
  data() {
    return {
      tickets: [
        {
          title: "title 1",
          description: "My description",
          priority: "high",
          status: "open",
          type: "bug",
          created: new Date()
        },
        {
          title: "title 2",
          description: "My description",
          priority: "high",
          status: "open",
          type: "bug",
          created: new Date()
        }
      ]
    };
  }
};
</script>
