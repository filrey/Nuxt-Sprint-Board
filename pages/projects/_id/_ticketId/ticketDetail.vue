<template>
  <div class="my-3 mx-5">
    <v-breadcrumbs :items="info.breadcrumbs" divider="-"></v-breadcrumbs>
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
                v-model="info.ticket.title"
                :readonly="!editTicket"
                filled
                shaped
              >
              </v-text-field>
            </v-col>
            <v-col cols="6">
              <v-select
                v-model="info.ticket.assigned"
                :disabled="!editTicket"
                :items="Object.values(info.project.personnel)"
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
                v-model="info.ticket.type"
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
                v-model="info.ticket.priority"
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
                v-model="info.ticket.updated"
                filled
                shaped
                disabled
              >
              </v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                label="Created"
                v-model="info.ticket.created"
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
              v-model="info.ticket.description"
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
            :value="editTicket"
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
                v-if="this.info.ticket.comments != undefined"
                :dense="$vuetify.breakpoint.mdAndDown"
              >
                <v-timeline-item
                  v-for="comment in this.info.ticket.comments"
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
      <!-- Ticket History -->
      <v-col cols="12" lg="6">
        <v-card class="py-3 px-5">
          <v-toolbar flat><v-toolbar-title>Log</v-toolbar-title> </v-toolbar>
          <v-row>
            <v-col cols="12">
              <v-divider></v-divider>
              <v-timeline dense clipped>
                <v-timeline-item
                  v-for="log in this.info.ticket.logs"
                  :key="log.data"
                >
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
export default {
  name: "ticketDetail",
  middleware: ["check-auth", "auth"],
  computed: {
    info() {
      let idData = this.$route.path.split("/");
      idData.shift();
      idData.shift();
      idData.pop();
      let project = this.$store.getters.loadedProjects.find(
        project => project.id == idData[0]
      );
      let ticket = project.tickets[idData[1]];

      let breadcrumbs = [
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
          text: project.name,
          disabled: false,
          href: "/projects/" + project.id + "/overview"
        },
        {
          text: "Ticket" + idData[1],
          disabled: true,
          href: "/projects/"
        }
      ];

      return { project, ticket, breadcrumbs, idData };
    },
    user() {
      return this.$store.getters.loadedUser;
    }
  },
  methods: {
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
          this.info.idData[0] +
          "/tickets/" +
          this.info.idData[1] +
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
          this.info.idData[0] +
          "/tickets/" +
          this.info.idData[1] +
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

      this.info.ticket["updated"] = timestamp;

      let writeData = {
        collection: this.info.ticket,
        path: "projects/" + idData[2] + "/tickets/" + idData[3],
        msgSucces: "Ticket" + idData[3] + " updated",
        msgError: "Error while updating ticket"
      };

      this.$store.dispatch("newDataSet", writeData);

      let logData = {
        collection: {
          user: this.user,
          type: "detail",
          time: timestamp,
          data: {
            title: this.info.ticket.title,
            priority: this.info.ticket.priority,
            ticketType: this.info.ticket.type,
            description: this.info.ticket.description
          }
        },
        path: "projects/" + idData[2] + "/tickets/" + idData[3] + "/logs",
        msgSucces: "Ticket" + idData[3] + " updated",
        msgError: "Error while updating ticket"
      };

      this.$store.dispatch("newDataPush", logData);

      this.editTicket = false;
    }
  },
  data() {
    return {
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
