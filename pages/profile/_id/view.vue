<template>
  <div>
    ID View
  </div>
</template>
<script>
export default {
  name: "view",
  middleware: ["check-auth", "auth"],
  data() {
    return {};
  }
};
</script>
