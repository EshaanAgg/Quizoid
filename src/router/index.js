import { createRouter, createWebHistory } from "vue-router";
import QuizView from "../views/QuizView.vue";
import ResultView from "../views/ResultView.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: QuizView,
  },
  {
    path: "/result",
    name: "result",
    component: ResultView,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
