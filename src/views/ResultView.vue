<template>
  <div>{{ percentageScore }}</div>
</template>

<script>
import { useMainStore } from "@/stores/main";
import { computed } from "vue";

export default {
  setup() {
    const mainStore = useMainStore();
    const percentageScore = computed(() => mainStore.score);

    return {
      percentageScore,
    };
  },
};
</script>
