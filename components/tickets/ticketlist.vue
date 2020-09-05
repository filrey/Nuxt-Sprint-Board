<template>
  <div>
    Ticketlist
    <div v-for="ticket in this.tickets" :key="ticket.id">
      <Ticket :title="ticket.title" />
    </div>
  </div>
</template>

<script>
import Ticket from "@/components/tickets/ticket";
export default {
  props: ["tickets"],
  components: {
    Ticket,
  },
};
</script>