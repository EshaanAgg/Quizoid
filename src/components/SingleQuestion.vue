<template>
  <div>
    <div
      class="rounded-lg bg-gray-100 p-2 neumorph-1 text-center font-bold text-gray-800 mt-8"
    >
      <div class="bg-white p-5">
        {{ formattedQuestion }}
      </div>
    </div>

    <div class="mt-8">
      <!-- Options -->
      <div v-for="(choice, index) in currentQuestion.choices" :key="index">
        <div
          class="neumorph-1 option-default bg-gray-100 p-2 rounded-lg mb-3 relative"
          :ref="optionChosen"
          @click="onOptionClicked(choice, index)"
        >
          <div
            class="bg-blue-700 p-1 transform rotate-45 rounded-md h-10 w-10 text-white font-bold absolute right-0 top-0 shadow-md"
          >
            <p class="transform -rotate-45">+10</p>
          </div>

          <div class="rounded-lg font-bold flex p-2">
            <!-- Option ID -->
            <div class="p-3 rounded-lg">{{ index + 1 }}</div>
            <!-- Option Name -->
            <div class="flex items-center pl-6">{{ choice }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, ref, watch } from "vue";

export default {
  props: ["currentQuestion"],
  emits: ["correctResponse", "loadNewQuestion", "timerChanged"],
  setup(props, { emit }) {
    let canClick = true;
    let timer = ref(100);

    watch(timer, (newVal) => {
      emit("timerChanged", { newVal });
    });

    const countDownTimer = function () {
      let interVal = setInterval(() => {
        if (timer.value > 0) {
          timer.value--;
        } else {
          // TODO : Add a popup signifying that the time for this question is over
          timer.value = 100;
          canClick = false;
          clearInterval(interVal);
          emit("loadNewQuestion");
        }
      }, 150);
    };

    let itemsRef = [];
    const optionChosen = (element) => {
      if (element) {
        itemsRef.push(element);
      }
    };

    const onOptionClicked = (choice, item) => {
      if (canClick) {
        const divContainer = itemsRef[item];
        const optionID = item + 1;
        console.log("Clicked");
        if (props.currentQuestion.answer == optionID) {
          emit("correctResponse");
          // TODO : Add a popup notifying the correct option was chosen
          divContainer.classList.add("option-correct");
          divContainer.classList.remove("option-default");
        } else {
          // TODO : Add a popup notifying that the wrong option was chosen
          divContainer.classList.add("option-wrong");
          divContainer.classList.remove("option-default");
        }
        timer.value = 100;
        canClick = false;
        clearSelected(divContainer);
      } else {
        // TODO : Add a popup showing that the option can't be selected
        console.log("cant select question");
      }
    };

    const clearSelected = (divSelected) => {
      setTimeout(() => {
        divSelected.classList.remove("option-correct");
        divSelected.classList.remove("option-wrong");
        divSelected.classList.add("option-default");
        emit("loadNewQuestion");
      }, 1000);
    };

    onMounted(() => {
      countDownTimer();
    });

    return {
      onOptionClicked,
      optionChosen,
    };
  },
  computed: {
    formattedQuestion() {
      let entities = {
        amp: "&",
        apos: "'",
        "#x27": "'",
        "#x2F": "/",
        "#39": "'",
        "#47": "/",
        lt: "<",
        gt: ">",
        nbsp: " ",
        quot: '"',
        "#039": "'",
      };

      return this.currentQuestion.question.replace(
        /&([^;]+);/gm,
        function (match, entity) {
          return entities[entity] || match;
        }
      );
    },
  },
};
</script>
