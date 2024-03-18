<script setup lang="ts">
import { DatePicker as VCalendarDatePicker } from "v-calendar";
import "v-calendar/style.css";

const props = defineProps({
  modelValue: {
    type: Date,
    default: null,
  },
});

const emit = defineEmits(["update:model-value", "close"]);

const date = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit("update:model-value", value);
    emit("close");
  },
});

const attrs = [
  {
    key: "today",
    highlight: {
      color: "blue",
      fillMode: "outline",
      class: "!bg-gray-100 dark:!bg-gray-800",
    },
    dates: new Date(),
  },
];
</script>

<template>
  <div class="cv-calendar">
    <VCalendarDatePicker
      v-model="date"
      :attributes="attrs"
      transparent
      borderless
      title-position="left"
      trim-weeks
      :first-day-of-week="2"
    />
  </div>
</template>

<style scoped>
/* TODO: Load primary color */
.cv-calendar :deep(.vc-blue) {
  --vc-accent-50: #3b2476;
  --vc-accent-100: #3b2476;
  --vc-accent-200: #3b2476;
  --vc-accent-300: #3b2476;
  --vc-accent-400: #3b2476;
  --vc-accent-500: #3b2476;
  --vc-accent-600: #3b2476;
  --vc-accent-700: #3b2476;
  --vc-accent-800: #3b2476;
  --vc-accent-900: #3b2476;
}
</style>
