<template>
  <div>
    Dashboard Vue
    <h1>Current Project</h1>
    <Ticket-List :tickets="this.tickets" />
    <h1>Pie chart</h1>
  </div>
</template>

<script>
import TicketList from "@/components/tickets/TicketList";
export default {
  components: {
    TicketList,
  },
  asyncData(context, callback) {
    callback(null, {
      tickets: [
        {
          title: "title 1",
        },
        {
          title: "title 2",
        },
      ],
    });
  },
  created() {
    this.$store.dispatch("setTickets", this.tickets);
  },
  // data() {
  //   return {
  //     tickets: [
  //       {
  //         title: "title 1",
  //       },
  //       {
  //         title: "title 2",
  //       },
  //     ],
  //   };
  // },
};
</script>