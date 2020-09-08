<template>
  <div>
    <v-simple-table>
      <thead>
        <tr>
          <th>Title</th>
          <th>Description</th>
          <th>Priority</th>
          <th>Status</th>
          <th>Type</th>
        </tr>
      </thead>

      <tbody>
        <tr>
          <td>{{title}}</td>
          <td>{{description}}</td>
          <td>{{priority}}</td>
          <td>{{status}}</td>
          <td>{{type}}</td>
          <td>{{created}}</td>
        </tr>
      </tbody>
    </v-simple-table>
  </div>
</template>

<script>
export default {
  name: "ticket",
  props: {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    // assignedDevs: {
    //   type: String,
    //   required: false,
    // },
    // submitter: {
    //   type: String,
    //   required: true,
    // },
    priority: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      required: false,
    },
    type: {
      type: String,
      required: false,
    },
    created: {
      type: Date,
      required: false,
    },
    // updated: {
    //   type: String,
    //   required: false,
    // },
    // history: {
    //   type: String,
    //   required: false,
    // },
    // attachments: {
    //   type: String,
    //   required: false,
    // },
  },
};
</script>
