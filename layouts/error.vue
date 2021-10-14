<template>
  <v-app dark>
    <h1 v-if="error.statusCode === 404">
      <v-parallax
        src="https://images.unsplash.com/photo-1527467779599-34448b3fa6a7?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1170&q=80"
      >
        <v-row align="center" justify="center">
          <v-col class="text-center" cols="12">
            <h1 class="text-h4 font-weight-thin mb-4">
              {{ pageNotFound }}
            </h1>
            <h4 class="subheading">
              <NuxtLink to="/">
                Home page
              </NuxtLink>
            </h4>
          </v-col>
        </v-row></v-parallax
      >
    </h1>
    <h1 v-else>
      {{ otherError }}
    </h1>
  </v-app>
</template>

<script>
export default {
  layout: "empty",
  props: {
    error: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      pageNotFound: "404 Not Found",
      otherError: "An error occurred"
    };
  },
  head() {
    const title =
      this.error.statusCode === 404 ? this.pageNotFound : this.otherError;
    return {
      title
    };
  }
};
</script>

<style scoped>
h1 {
  font-size: 20px;
}
</style>
