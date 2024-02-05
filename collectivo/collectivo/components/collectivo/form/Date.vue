<script setup>
const props = defineProps({
  modelValue: {
    type: Date,
    default: null,
  },
});

const emit = defineEmits(["update:modelValue"]);
const { locale } = useI18n();

const date = ref(new Date(props.modelValue));

watch(
  () => date.value,
  (value) => {
    emit("update:modelValue", value);
  },
);

const label = computed(() =>
  date.value.toLocaleDateString(locale.value, {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
  }),
);
</script>

<template>
  <UPopover :popper="{ placement: 'bottom-start' }">
    <UInput
      v-model="label"
      icon="i-heroicons-calendar-days-20-solid"
      trailing
      class="w-full"
    />

    <template #panel="{ close }">
      <CollectivoFormDatePicker v-model="date" @close="close" />
    </template>
  </UPopover>
</template>
