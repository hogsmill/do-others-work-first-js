import Vue from "vue";
import App from "./App.vue";

require("./assets/site.css");

Vue.config.productionTip = false;

new Vue({
  el: "#app",
  render: (h) => h(App),
});
