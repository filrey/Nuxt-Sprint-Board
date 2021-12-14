<template>
  <div class="my-3 mx-5">
    <v-breadcrumbs
      :items="Object.values(breadcrumbs)"
      divider="-"
    ></v-breadcrumbs>
    <h1>Ticket Details</h1>

    <v-row>
      <!-- Ticket Details: title, description,priortiy,etc... -->
      <v-col cols="12" lg="6">
        <v-card class="py-3 px-5">
          <v-toolbar flat>
            <v-chip class="ma-2" color="success" outlined label>
              <v-icon left>
                mdi-console-line
              </v-icon>
              Open
            </v-chip>

            <v-spacer></v-spacer>

            <v-btn
              v-if="!editTicket"
              @click="editTicket = true"
              type="file"
              class="ma-2"
              depressed
              outlined
            >
              <v-icon>mdi-plus</v-icon>Edit
            </v-btn>
          </v-toolbar>
          <v-row>
            <v-col cols="6">
              <v-text-field
                label="Title"
                v-model="ticket.title"
                :readonly="!editTicket"
                filled
                shaped
              >
              </v-text-field>
            </v-col>
            <v-col cols="6">
              <v-select
                @change="changeAssigned(ticket, $event)"
                :value="this.originalAssigned"
                :disabled="!editTicket"
                :items="personnel"
                item-text="email"
                item-value="uid"
                prepend-icon="mdi-account"
                label="Assigned Developer"
                chips
                return-object
                hint="Select personell to assign to this ticket."
              >
                <template v-slot:selection="{ item }">
                  <v-chip outlined label>
                    <v-list-item-avatar class="mr-2">
                      <v-img :src="item.photoUrl"></v-img>
                    </v-list-item-avatar>
                    {{ item.email }}
                  </v-chip>
                </template></v-select
              >
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="6">
              <v-select
                label="Type"
                v-model="ticket.type"
                :items="['Bug', 'Feature', 'Task', 'Subtask', 'Epic']"
                :readonly="!editTicket"
                multiple
                filled
                shaped
              >
              </v-select>
            </v-col>
            <v-col cols="6">
              <v-select
                label="Priority"
                v-model="ticket.priority"
                :items="['Lowest', 'Low', 'Medium', 'High', 'Top Priority']"
                :readonly="!editTicket"
                required
                filled
                shaped
              >
              </v-select>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="6">
              <v-text-field
                label="Updated"
                v-model="ticket.updated"
                filled
                shaped
                disabled
              >
              </v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                label="Created"
                v-model="ticket.created"
                filled
                shaped
                disabled
              >
              </v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-textarea
              label="Description"
              v-model="ticket.description"
              :readonly="!editTicket"
              class="ma-2"
              filled
            >
            </v-textarea>
          </v-row>

          <v-progress-linear
            v-if="editTicket"
            color="teal"
            buffer-value="0"
            :value="0"
            stream
          >
          </v-progress-linear>
          <v-divider v-else></v-divider>
          <v-btn
            v-if="editTicket"
            @click="editTicket = false"
            class="mt-3"
            color="error"
            block
          >
            Cancel
          </v-btn>
          <v-btn
            v-if="editTicket"
            @click="onSubmitTicket()"
            class="mt-3"
            color="default"
            block
          >
            Save
          </v-btn>
        </v-card>
      </v-col>
      <!-- Comments -->
      <v-col cols="12" lg="6">
        <v-card class="py-3 px-5">
          <v-toolbar flat>
            <v-toolbar-title>Comments</v-toolbar-title>
          </v-toolbar>
          <v-divider></v-divider>
          <!-- Comment List -->
          <v-row>
            <v-col class="timeLineScroll" cols="12">
              <v-timeline
                v-if="comments != undefined"
                :dense="$vuetify.breakpoint.mdAndDown"
              >
                <v-timeline-item
                  v-for="comment in comments"
                  :key="comment.msg"
                  :left="comment.user.uid !== user.uid"
                  :right="comment.user.uid == user.uid"
                >
                  <template v-slot:icon>
                    <v-avatar>
                      <img
                        :src="
                          comment.user.photoUrl ||
                            'https://demos.creative-tim.com/vuetify-material-dashboard/favicon.ico'
                        "
                      />
                    </v-avatar>
                  </template>
                  <template v-slot:opposite>
                    <span>{{ comment.user.name || comment.user.email }}</span>
                  </template>
                  <v-card class="elevation-2">
                    <v-card-text>{{ comment.msg }}</v-card-text>
                    <v-card-text> {{ comment.time }}</v-card-text>
                  </v-card>
                </v-timeline-item>
              </v-timeline>
              <v-timeline v-else dense>
                <v-timeline-item>
                  <v-card>
                    <v-card-title>Admin</v-card-title>
                    <v-card-text
                      >No comments yet, start the conversation!</v-card-text
                    >
                  </v-card>
                </v-timeline-item>
              </v-timeline>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="newComment"
                :label="user.name || user.email"
                outlined
                clearable
                dense
                clear-icon="mdi-close"
              >
                <template v-slot:prepend>
                  <v-avatar class="my-n2" color="grey" size="36" dark>
                    <v-img :src="user.photoUrl" max-height="36" />
                  </v-avatar>
                </template>

                <template v-slot:append-outer>
                  <v-btn class="my-n2" @click="addComment()">
                    <v-icon left> mdi-send </v-icon>Send</v-btn
                  >
                </template>
              </v-text-field>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <!-- Ticket Logs -->
      <v-col cols="12" lg="6">
        <v-card class="py-3 px-5">
          <v-toolbar flat><v-toolbar-title>Log</v-toolbar-title> </v-toolbar>
          <v-row>
            <v-col cols="12">
              <v-divider></v-divider>
              <v-timeline class="timeLineScroll" dense clipped>
                <v-timeline-item v-for="log in this.ticket.logs" :key="log.id">
                  <template v-slot:icon>
                    <v-avatar>
                      <img :src="log.user.photoUrl" />
                    </v-avatar>
                  </template>
                  <v-expansion-panels popout>
                    <v-expansion-panel>
                      <v-expansion-panel-header
                        ><div v-if="log.type == 'comment'">
                          {{ log.user.name }} commented {{ log.time }}
                        </div>
                        <div v-if="log.type == 'detail'">
                          {{ log.user.name }} updated ticket details
                          {{ log.time }}
                        </div>
                      </v-expansion-panel-header>
                      <v-expansion-panel-content>
                        <div v-if="log.type == 'comment'">
                          Comment: "{{ log.data }}"
                        </div>

                        <div v-if="log.type == 'detail'">
                          New Details: "{{ log.data }}"
                        </div>
                      </v-expansion-panel-content>
                    </v-expansion-panel>
                  </v-expansion-panels>
                </v-timeline-item>
              </v-timeline>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
      <!-- Attachments -->
      <v-col cols="12" lg="6"> </v-col>
    </v-row>
  </div>
</template>

<script>
import firebase from "firebase";
export default {
  name: "ticketDetail",
  middleware: ["check-auth", "auth"],
  head() {
    return {
      title: "Ticket Details"
    };
  },
  mounted() {
    const projectRef = firebase
      .database()
      .ref(`/projects/${this.$route.params.id}`);

    const ticketRef = firebase
      .database()
      .ref(
        `/projects/${this.$route.params.id}/tickets/${this.$route.params.ticketId}`
      );

    projectRef.on("value", snapshot => {
      this.project = snapshot.val();
    });

    ticketRef.on("value", snapshot => {
      this.ticket = snapshot.val();
    });

    this.breadcrumbs = [
      {
        text: "Home",
        disabled: false,
        href: "/"
      },
      {
        text: "Projects",
        disabled: false,
        href: "/projects"
      },
      {
        text: this.project.name,
        disabled: false,
        href: "/projects/" + this.$route.params.id + "/overview"
      },
      {
        text: "Ticket" + this.$route.params.ticketId,
        disabled: true,
        href: "/projects/"
      }
    ];

    this.originalAssigned = this.ticket.assigned;
    this.comments = this.ticket.comments;

    this.personnel = Object.values(this.project.personnel);
  },
  computed: {
    user() {
      return this.$store.getters.loadedUser;
    }
  },
  methods: {
    changeAssigned(ticket, person) {
      ticket.assigned = person;
    },
    addComment() {
      let now = new Date();
      let hours = now.getHours();
      let minutes = now.getMinutes();
      let ampm = hours >= 12 ? "pm" : "am";
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      minutes = minutes < 10 ? "0" + minutes : minutes;
      let strTime = hours + ":" + minutes + " " + ampm;

      let timestamp =
        now.getMonth() +
        1 +
        "/" +
        now.getDate() +
        "/" +
        now.getFullYear() +
        " " +
        strTime;

      let writeData = {
        collection: { msg: this.newComment, time: timestamp, user: this.user },
        path:
          "projects/" +
          this.$route.params.id +
          "/tickets/" +
          this.$route.params.ticketId +
          "/comments",
        msgSucces: "Comment added",
        msgError: "Error while adding comment"
      };

      let logData = {
        collection: {
          data: this.newComment,
          time: timestamp,
          user: this.user,
          type: "comment"
        },
        path:
          "projects/" +
          this.$route.params.id +
          "/tickets/" +
          this.$route.params.ticketId +
          "/logs",
        msgSucces: "Comment added",
        msgError: "Error while adding comment"
      };

      this.$store.dispatch("newDataPush", writeData);
      this.$store.dispatch("newDataPush", logData);
    },
    onSubmitTicket() {
      let idData = this.$route.path.split("/");
      let now = new Date();
      let hours = now.getHours();
      let minutes = now.getMinutes();
      let ampm = hours >= 12 ? "pm" : "am";
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      minutes = minutes < 10 ? "0" + minutes : minutes;
      let strTime = hours + ":" + minutes + " " + ampm;

      let timestamp =
        now.getMonth() +
        1 +
        "/" +
        now.getDate() +
        "/" +
        now.getFullYear() +
        " " +
        strTime;

      this.ticket["updated"] = timestamp;
      if (this.originalAssigned != undefined) {
        let idRemove = {
          path: `users/${this.originalAssigned.uid}/assignedTickets/${this.$route.params.id}/${this.$route.params.ticketId}`,
          msgSucces: "New user assigned",
          msgError: "Error while assigning personnel"
        };
        this.$store.dispatch("dataRemove", idRemove);
      }

      let assignTicket = {
        collection: {
          [this.$route.params.ticketId]: this.$route.params.ticketId
        },
        path: `users/${this.ticket.assigned.uid}/assignedTickets/${this.$route.params.id}`,
        msgSucces: "New user assigned",
        msgError: "Error while assigning personnel"
      };

      let writeData = {
        collection: this.ticket,
        path: "projects/" + idData[2] + "/tickets/" + idData[3],
        msgSucces: "Ticket" + idData[3] + " updated",
        msgError: "Error while updating ticket"
      };

      this.$store.dispatch("newDataUpdate", assignTicket);

      this.$store.dispatch("newDataSet", writeData);

      let logData = {
        collection: {
          user: this.user,
          type: "detail",
          time: timestamp,
          data: {
            title: this.ticket.title,
            priority: this.ticket.priority,
            ticketType: this.ticket.type,
            description: this.ticket.description
          }
        },
        path: "projects/" + idData[2] + "/tickets/" + idData[3] + "/logs",
        msgSucces: "Ticket" + idData[3] + " updated",
        msgError: "Error while updating ticket"
      };

      this.$store.dispatch("newDataPush", logData);

      this.originalAssigned = this.ticket.assigned;

      this.editTicket = false;
    }
  },
  data() {
    return {
      project: "",
      ticket: "",
      personnel: [],
      breadcrumbs: "",
      originalAssigned: null,
      comments: "",
      editTicket: false,
      newComment: ""
    };
  }
};
</script>
<style lang="css">
.timeLineScroll {
  max-height: 420px;
  overflow-y: auto;
  display: flex;
  flex-direction: column-reverse;
}
</style>
