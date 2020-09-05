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
  data() {
    return {
      tickets: [
        {
          title: "title 1",
        },
        {
          title: "title 2",
        },
      ],
    };
  },
};
</script>