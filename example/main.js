import { createApp } from "vue";
import App from "./App.vue";
import { createRouter, createWebHistory } from "vue-router";

import routes from "./route";
import rawDisplayer from "./components/infra/raw-displayer";
import store from "./store";
import "bootstrap/dist/css/bootstrap.min.css";
import "font-awesome/css/font-awesome.css";

require("bootstrap");

const router = createRouter({
  history: createWebHistory(),
  routes
});

const app = createApp(App);
app.use(store);
app.use(router);
app.component("rawDisplayer", rawDisplayer);
router.isReady().then(() => app.mount("#app"));
