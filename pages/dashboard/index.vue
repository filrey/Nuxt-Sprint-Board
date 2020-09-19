<template>
  <div>
    Dashboard Vue
    <h1>Current Project</h1>
    <Ticket-List :tickets="this.tickets" />
    <h1>Pie chart</h1>
    <v-progress-circular :size="100" color="purple" :value="75" :width="20"></v-progress-circular>
  </div>
</template>

<script>
import TicketList from "@/components/tickets/TicketList";
export default {
  components: {
    TicketList,
  },
  middleware: ["check-auth", "auth"],
  // asyncData(context, callback) {
  //   callback(null, {
  //     tickets: [
  //       {
  //         title: "title 1",
  //         description: "My description",
  //         priority: "high",
  //         status: "open",
  //         type: "bug",
  //         created: new Date(),
  //       },
  //       {
  //         title: "title 2",
  //         description: "My description",
  //         priority: "high",
  //         status: "open",
  //         type: "bug",
  //         created: new Date(),
  //       },
  //     ],
  //   });
  // },
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
          created: new Date(),
        },
        {
          title: "title 2",
          description: "My description",
          priority: "high",
          status: "open",
          type: "bug",
          created: new Date(),
        },
      ],
    };
  },
};
</script>