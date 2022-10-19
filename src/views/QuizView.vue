<template>
  <main class="flex h-screen items-center justify-center bg-gray-100">
    <!-- Quiz container -->
    <div
      class="overflow-hidden bg-white flex-none container relative shadow-lg rounded-lg px-12 py-6"
    >
      <img
        src="@/assets/images/abstract.svg"
        alt=""
        class="absolute -top-10 left-0 object-none"
      />

      <!-- Contents -->
      <div class="relative z-20">
        <!-- Score container -->
        <div class="text-right text-gray-800">
          <p class="text-sm leading-3">Score</p>
          <p class="font-bold">{{ score }}</p>
        </div>

        <!-- Timer container -->
        <div class="bg-white shadow-lg p-1 rounded-full w-full h-5 mt-4">
          <div
            class="bg-blue-700 rounded-full w-11/12 h-full"
            :style="`width:${timer}%`"
          ></div>
        </div>

        <!-- question container -->
        <SingleQuestion
          :key="questionCounter"
          :currentQuestion="currentQuestion"
          @correctResponse="score += 10"
          @loadNewQuestion="loadNewQuestion"
          @timerChanged="updateTimer"
        />

        <!-- progress indicator container -->
        <div class="mt-8 text-center">
          <div class="h-1 w-12 bg-gray-800 rounded-full mx-auto"></div>
          <p class="font-bold text-gray-800">
            {{ questionCounter }}/{{ questions.length }}
          </p>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.neumorph-1 {
  box-shadow: 6px 6px 18px rgba(0, 0, 0, 0.09), -6px -6px 18px #ffffff;
}
.container {
  max-width: 400px;
  border-radius: 25px;
}
</style>

<script>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

import SingleQuestion from "@/components/SingleQuestion";

import { questionList } from "@/assets/questions";
import { useMainStore } from "@/stores/main";

export default {
  setup() {
    // Data for managing the quiz
    let questionCounter = ref(0);
    let score = ref(0);
    let timer = ref(100);
    const currentQuestion = ref({
      question: "",
      answer: 1,
      choices: [],
    });

    const questions = ref(questionList);
    const router = useRouter();
    const mainStore = useMainStore();

    const loadNewQuestion = () => {
      // Check if there are more questions to load first, else just handle the quiz end
      if (questions.value.length > questionCounter.value) {
        currentQuestion.value = questions.value[questionCounter.value];
        questionCounter.value++;
      } else handleQuizEnd();
    };

    const handleQuizEnd = function () {
      mainStore.score = (score.value / 100) * 100;
      router.push("/result");
    };

    // TODO: Remove in successive commits, kept here for backwards compatibility
    // const onQuizStart = function () {
    //   // Set default values
    //   questionCounter.value = 0;
    //   score.value = 0;
    //   currentQuestion.value = {
    //     question: "",
    //     answer: 1,
    //     choices: [],
    //   };

    //   loadNewQuestion();
    // };

    onMounted(() => {
      loadNewQuestion();
    });

    function updateTimer(obj) {
      timer.value = obj.newVal;
    }

    return {
      timer,
      currentQuestion,
      questions,
      score,
      questionCounter,
      updateTimer,
      handleQuizEnd,
      loadNewQuestion,
    };
  },
  components: {
    SingleQuestion,
  },
};
</script>
