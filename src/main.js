import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import VueGoogleMaps from "@fawmi/vue-google-maps";

const app = createApp(App);

app.use(router);

app.use(VueGoogleMaps, {
  load: {
    key: "AIzaSyCMrwoxs_vYYuwpIqn2pcOS-889rPBchy8",
  },
});

app.mount("#app");
