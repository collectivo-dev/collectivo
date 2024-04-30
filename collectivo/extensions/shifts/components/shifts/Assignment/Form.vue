<script setup lang="ts">
import type { DateTime } from "luxon";

defineProps({
  submit: {
    type: Function as PropType<
      (data: Record<string, unknown>) => Promise<void>
    >,
    required: true,
  },
  from: { type: Object as PropType<DateTime>, required: false },
  to: { type: Object as PropType<DateTime>, required: false },
});
</script>

<template>
  <CollectivoFormBuilder
    submit-label="Check"
    :submit="submit"
    :data="{ from: from, to: to }"
    :fields="[
      {
        order: 110,
        type: 'date',
        key: 'from',
        label: 'From',
        required: true,
        useDatePicker: true,
        default: new Date(),
      },
      {
        order: 120,
        type: 'date',
        key: 'to',
        label: 'To',
        required: false,
        useDatePicker: true,
      },
    ]"
  />
</template>

<style scoped lang="scss"></style>
