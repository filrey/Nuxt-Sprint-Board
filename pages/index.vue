<template>
  <div>
    <section>
      <section id="hero">
        <v-row no-gutters>
          <v-img
            :gradient="`to bottom, rgba(0, 0, 0, .3), rgba(0, 0, 0, .3)`"
            :min-height="'calc(100vh - ' + $vuetify.application.top + 'px)'"
            src="https://images.unsplash.com/photo-1507037102386-199766bac257?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1158&q=80"
          >
            <v-theme-provider dark>
              <v-container fill-height>
                <v-row
                  align="center"
                  class="white--text mx-auto"
                  justify="center"
                >
                  <v-col class="white--text text-center" cols="12" tag="h1">
                    <br />

                    <login></login>
                  </v-col>

                  <v-btn
                    class="align-self-end"
                    fab
                    outlined
                    @click="$vuetify.goTo('#about-me')"
                  >
                    <v-icon>mdi-chevron-double-down</v-icon>
                  </v-btn>
                </v-row>
              </v-container>
            </v-theme-provider>
          </v-img>
        </v-row>
      </section>

      <section id="about-me">
        <div class="py-12"></div>

        <v-container class="text-center">
          <h2 class="display-2 font-weight-bold mb-3">ABOUT</h2>

          <v-responsive class="mx-auto mb-8" width="56">
            <v-divider class="mb-1"></v-divider>

            <v-divider></v-divider>
          </v-responsive>

          <v-responsive
            class="mx-auto title font-weight-light mb-8"
            max-width="720"
          >
            Agile-Sprint-Board is a mobile first web application designed with
            the intention to create a stylish and accessible workflow for
            project development. Manage user roles, create projects, and
            collaborate in completing tickets with your team. I hope you enjoy
            the app! If you have the chance check out some of my other projects
            in the link below.
          </v-responsive>

          <v-avatar class="elevation-12 mb-12" size="128">
            <v-img :src="require('@/assets/images/grad.jpg')"></v-img>
          </v-avatar>

          <div></div>

          <v-btn
            color="grey"
            href="https://filibertoreyes.dev/"
            target="blank"
            outlined
            large
          >
            <span class="grey--text text--darken-1 font-weight-bold">
              My other projects
            </span>
          </v-btn>
        </v-container>

        <div class="py-12"></div>
      </section>

      <section id="blog">
        <div class="py-12"></div>

        <v-container>
          <h2
            class="display-2 font-weight-bold mb-3 text-uppercase text-center"
          >
            Features
          </h2>

          <v-responsive class="mx-auto mb-12" width="56">
            <v-divider class="mb-1"></v-divider>

            <v-divider></v-divider>
          </v-responsive>

          <v-row>
            <v-col
              v-for="({ src, text, title }, i) in articles"
              :key="i"
              cols="12"
              md="4"
            >
              <v-img
                :src="src"
                class="mb-4"
                height="275"
                max-width="100%"
              ></v-img>

              <h3
                class="font-weight-black mb-4 text-uppercase"
                v-text="title"
              ></h3>

              <div class="title font-weight-light mb-5" v-text="text"></div>

              <!-- <v-btn class="ml-n4 font-weight-black" text>
                Continue Reading
              </v-btn> -->
            </v-col>
          </v-row>
        </v-container>

        <div class="py-12"></div>
      </section>

      <section id="stats">
        <v-parallax
          :height="$vuetify.breakpoint.smAndDown ? 700 : 750"
          :src="require('@/assets/images/vueBg.png')"
        >
          <v-container fill-height>
            <v-row class="mx-auto">
              <v-col
                v-for="[value, title] of stats"
                :key="title"
                cols="12"
                md="12"
              >
                <div class="vueDark text-center">
                  <div
                    class="display-3 font-weight-black mb-4"
                    v-text="value"
                  ></div>

                  <v-btn
                    :href="title"
                    fab
                    x-large
                    color="#425366"
                    class="vueLight"
                    target="blank"
                    ><v-icon>mdi-vuejs</v-icon></v-btn
                  >
                </div>
              </v-col>
            </v-row>
          </v-container>
        </v-parallax>
      </section>

      <section id="features" class="grey lighten-3">
        <div class="py-12"></div>

        <v-container class="text-center">
          <h2 class="display-2 font-weight-bold mb-3">TECH STACK</h2>

          <v-responsive class="mx-auto mb-12" width="56">
            <v-divider class="mb-1"></v-divider>

            <v-divider></v-divider>
          </v-responsive>

          <v-row>
            <v-col
              v-for="({ link, icon, title, text }, i) in features"
              :key="i"
              cols="12"
              md="4"
            >
              <v-card class="py-12 px-4" color="grey lighten-5" flat>
                <v-theme-provider dark>
                  <div>
                    <v-avatar color="primary" size="88">
                      <v-icon large v-text="icon"></v-icon>
                    </v-avatar>
                  </div>
                </v-theme-provider>

                <v-card-title
                  class="justify-center font-weight-black text-uppercase"
                  v-text="title"
                ></v-card-title>

                <v-card-text class="subtitle-1" v-text="text"> </v-card-text>
                <v-card-actions
                  ><v-btn
                    v-text="title + ` Site`"
                    :href="link"
                    target="blank"
                    color="primary"
                    text
                  ></v-btn
                ></v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </v-container>

        <div class="py-12"></div>
      </section>
    </section>
  </div>
</template>

<script>
import Login from "../components/login.vue";
export default {
  name: "welcome",
  components: { Login },
  data() {
    return {
      articles: [
        {
          src:
            "https://images.unsplash.com/photo-1506606352681-649023fac596?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
          title: "Mobile first & Responsive",
          text:
            "Thanks to Vuetify's mobile first approach to design Agile-Sprint-Board just works responsively right out of the box whether it's on a phone, tablet or desktop computer."
        },
        {
          src: "https://miro.medium.com/max/1024/1*HFlYgB6gVLc4Su9HsB9MZg.png",
          title: "NoSQL backend with Firebase",
          text:
            "The Firebase Realtime Database is a cloud-hosted database. Data is stored as JSON and synchronized in realtime to every connected client."
        },
        {
          src:
            "https://images.unsplash.com/photo-1523567271574-cfcd2ba942ff?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1173&q=80",
          title: "Dynamic Ticketing System",
          text:
            "Manage and priortize project backlog's with ticket types and collaborate with other team members using the comment system."
        }
      ],
      features: [
        {
          link: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
          icon: "mdi-language-javascript",
          title: "Javascript",
          text:
            "JavaScript, often abbreviated as JS, is a programming language that conforms to the ECMAScript specification. JavaScript is high-level, often just-in-time compiled and multi-paradigm. It has dynamic typing, prototype-based object-orientation and first-class functions."
        },
        {
          link: "https://nuxtjs.org/",
          icon: "mdi-nuxt",
          title: "Nuxt",
          text:
            "Nuxt.js is a free and open source web application framework based on Vue.js, Node.js, Webpack and Babel.js. Nuxt is inspired by Next.js, which is a framework of similar purpose, based on React.js. The framework is advertised as a `meta-framework for universal applications`."
        },
        {
          link: "https://vuetifyjs.com/en/",
          icon: "mdi-vuetify",
          title: "Vuetify",
          text:
            "Vuetify is a complete UI framework built on top of Vue.js. The goal of the project is to provide developers with the tools they need to build rich and engaging user experiences. Vuetify is designed from the ground up to be easy to learn and rewarding to master with hundreds of carefully crafted components from the Material Design specification"
        }
      ],
      stats: [["Powered by Vue.js", "https://vuejs.org/"]]
    };
  }
};
</script>

<style lang="css" scoped>
.heroBG {
  background-image: url("../assets/images/workdesk.jpg");
}
.vueDark {
  color: #425366;
}
.vueLight {
  color: #4db986;
}
</style>
