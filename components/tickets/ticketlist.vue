<template>
  <div>
    <v-card class="mx-3 pa-3 px- py-3 rounded-lg">
      <v-sheet class="pa-7 ticket-badge rounded-lg" color="#4caf50" max-width="90px" elevation="5">
        <v-icon size="32" dark>mdi-clipboard-text</v-icon>
      </v-sheet>
      <div v-for="ticket in this.tickets" :key="ticket.id">
        <Ticket
          :title="ticket.title"
          :description="ticket.description"
          :priority="ticket.priority"
          :status="ticket.status"
          :type="ticket.type"
        />
      </div>
    </v-card>
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
<style scoped>
.ticket-badge {
  position: relative;
  top: -30px;
}
</style>