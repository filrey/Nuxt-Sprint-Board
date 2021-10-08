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
          <v-divider></v-divider>
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

            <v-spacer></v-spacer>

            <v-btn
              @click="addComment()"
              type="file"
              class="ma-2"
              depressed
              outlined
            >
              <v-icon>mdi-plus</v-icon>Add Comment
            </v-btn>
          </v-toolbar>
          <!-- Comment List -->
          <v-row>
            <v-col cols="12">
              <v-list v-if="this.info.ticket.comments != undefined" three-line>
                <template v-for="(item, index) in this.info.ticket.comments">
                  <v-subheader
                    v-if="item.header"
                    :key="item.header"
                    v-text="item.header"
                  ></v-subheader>

                  <v-divider
                    v-else-if="item.divider"
                    :key="index"
                    :inset="item.inset"
                  ></v-divider>

                  <v-list-item v-else :key="item.title">
                    <v-list-item-avatar>
                      <v-img :src="item.avatar"></v-img>
                    </v-list-item-avatar>

                    <v-list-item-content>
                      <v-list-item-title
                        v-html="item.title"
                      ></v-list-item-title>
                      <v-list-item-subtitle
                        v-html="item.subtitle"
                      ></v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </template>
              </v-list>
              <span v-else>There are no comments. Start the conversation!</span>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="3">
              <!-- <v-avatar class="mr-2" color="grey" size="36" dark
                ><v-img :src="item.photoUrl" max-height="36" />
              </v-avatar> -->
            </v-col>
            <v-col cols="12"
              ><v-textarea
                label="Add Comment"
                v-model="newComment"
                rows="2"
                shaped
              ></v-textarea
            ></v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <!-- Ticket History -->
      <v-col cols="12" md="6"> </v-col>
      <!-- Attachments -->
      <v-col cols="12" md="6"> </v-col>
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
      let project = this.$store.getters.loadedProjects.find(
        project => project.id == idData[2]
      );
      let ticket = project.tickets[idData[3]];

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
          text: "Ticket" + idData[3],
          disabled: true,
          href: "/projects/"
        }
      ];

      return { project, ticket, breadcrumbs };
    },
    user() {
      return this.$store.getters.loadedUser;
    }
  },
  methods: {
    addComment() {},
    onSubmitTicket() {
      let idData = this.$route.path.split("/");
      let now = new Date();
      let timestamp =
        now.getMonth() +
        1 +
        "/" +
        now.getDate() +
        "/" +
        now.getFullYear() +
        " " +
        now.getHours() +
        ":" +
        now.getMinutes();

      this.info.ticket["updated"] = timestamp;

      let writeData = {
        collection: this.info.ticket,
        path: "projects/" + idData[2] + "/tickets/" + idData[3],
        msgSucces: "Ticket" + idData[3] + " updated",
        msgError: "Error while updating ticket"
      };

      this.$store.dispatch("newDataSet", writeData);

      this.editTicket = false;
    }
  },
  data() {
    return {
      editTicket: false,
      newComment: "",
      items: [
        { header: "Today" },
        {
          avatar: "https://cdn.vuetifyjs.com/images/lists/1.jpg",
          title: "Brunch this weekend?",
          subtitle: `<span class="text--primary">Ali Connors</span> &mdash; I'll be in your neighborhood doing errands this weekend. Do you want to hang out?`
        },
        { divider: true, inset: true },
        {
          avatar: "https://cdn.vuetifyjs.com/images/lists/2.jpg",
          title: 'Summer BBQ <span class="grey--text text--lighten-1">4</span>',
          subtitle: `<span class="text--primary">to Alex, Scott, Jennifer</span> &mdash; Wish I could come, but I'm out of town this weekend.`
        },
        { divider: true, inset: true },
        {
          avatar: "https://cdn.vuetifyjs.com/images/lists/3.jpg",
          title: "Oui oui",
          subtitle:
            '<span class="text--primary">Sandra Adams</span> &mdash; Do you have Paris recommendations? Have you ever been?'
        },
        { divider: true, inset: true },
        {
          avatar: "https://cdn.vuetifyjs.com/images/lists/4.jpg",
          title: "Birthday gift",
          subtitle:
            '<span class="text--primary">Trevor Hansen</span> &mdash; Have any ideas about what we should get Heidi for her birthday?'
        },
        { divider: true, inset: true },
        {
          avatar: "https://cdn.vuetifyjs.com/images/lists/5.jpg",
          title: "Recipe to try",
          subtitle:
            '<span class="text--primary">Britta Holt</span> &mdash; We should eat this: Grate, Squash, Corn, and tomatillo Tacos.'
        }
      ]
    };
  }
};
</script>
