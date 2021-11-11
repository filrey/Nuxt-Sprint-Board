<template>
  <div>
    <v-breadcrumbs :items="breadcrumbs" divider="-"></v-breadcrumbs>
    <h1>Manage User Roles</h1>
    <v-row justify="center">
      <!-- Users select and role select -->
      <v-col cols="12" md="6">
        <v-select
          v-model="userSelect"
          :items="Object.values(users)"
          item-text="email"
          item-value="uid"
          prepend-icon="mdi-account"
          label="User select"
          multiple
          chips
          hint="Select one or more users to change role."
          persistent-hint
        >
          <template v-slot:selection="{ item }">
            <v-chip>
              <v-list-item-avatar class="mr-2">
                <v-img :src="item.photoUrl"></v-img>
              </v-list-item-avatar>
              {{ item.email }}
            </v-chip>
          </template></v-select
        >

        <v-select
          v-model="role"
          prepend-icon="mdi-account-cog"
          :items="['Admin', 'Project Manager', 'Developer', 'Submitter']"
          label="Set Role"
          hint="Users selected will be assigned this role."
          persistent-hint
          required
        ></v-select>
        <v-spacer class="mt-4"></v-spacer>
        <v-btn @click="onSubmitRoleChange(userSelect, role)" block elevation="5"
          >Submit</v-btn
        >
      </v-col>
      <!-- Personnel list -->
      <v-col cols="12" md="6">
        <v-card>
          <v-toolbar flat>
            <v-card-title>Users</v-card-title>
          </v-toolbar>

          <v-data-table
            v-if="users != undefined && users != null"
            :headers="personnelHeader"
            :items="Object.values(users)"
            :items-per-page="5"
            class="elevation-1"
          >
            <template v-slot:item.name="{ item }">
              <v-avatar class="mr-2" color="primary" size="36" dark
                ><v-img :src="item.photoUrl" max-height="36"
              /></v-avatar>
              {{ item.email }}
            </template>

            <template v-slot:item.role="{ item }">
              <v-chip :color="returnPriorityColor(item.role)" label dark>
                {{ item.role }}
              </v-chip>
            </template>
          </v-data-table>
          <v-card-title v-else>No Personnel Assigned!</v-card-title>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import firebase from "firebase";
export default {
  name: "users",
  middleware: ["check-auth", "auth"],
  head() {
    return {
      title: "Users"
    };
  },
  created() {
    const dbRef = firebase.database().ref(`/users`);

    dbRef.on("value", snapshot => {
      this.users = snapshot.val();
    });
  },

  methods: {
    onSubmitRoleChange(users, role) {
      users.forEach(user => {
        let writeData = {
          collection: role,
          path: "users/" + user + "/role",
          msgSucces: "Role assigned",
          msgError: "Error while assigning role"
        };

        this.$store.dispatch("newDataSet", writeData);
      });
      this.userSelect = [];
      this.role = "";
    },

    returnPriorityColor(priority) {
      if (priority === "Submitter") return "grey";
      else if (priority === "Project Manager") return "green";
      else if (priority === "Developer") return "blue";
      else if (priority === "Admin") return "red";
      else return "default";
    }
  },
  data() {
    return {
      users: "",
      role: "",
      userSelect: [],
      personnelHeader: [
        {
          text: "Name",
          align: "start",
          sortable: false,
          value: "name"
        },
        { text: "Email", value: "email" },
        { text: "Role", value: "role" },
        { text: "Last Online", value: "lastOnline" }
      ],
      breadcrumbs: [
        {
          text: "Home",
          disabled: false,
          href: "/"
        },
        {
          text: "Manage Users",
          disabled: true,
          href: "/users"
        }
      ]
    };
  }
};
</script>
