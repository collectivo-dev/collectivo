<script setup lang="ts">
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

defineProps({
  modelValue: [Date],
});

defineEmits(["update:modelValue"]);

const customPosition = () => ({ top: 55, left: 0 });
</script>

<template>
  <div>
    <div id="date-picker" class="relative">
      <VueDatePicker
        :model-value="modelValue"
        placeholder="YYYY-MM-DD"
        text-input
        no-title
        hide-input-icon
        :enable-time-picker="false"
        :alt-position="customPosition"
        enter-submit
        :action-row="{
          showSelect: false,
          showCancel: false,
          showPreview: false,
        }"
        :format="'yyyy-MM-dd'"
        @date-update="
          (value: Date) => {
            $emit('update:modelValue', value);
          }
        "
      />
      <UIcon
        name="i-system-uicons-calendar-month"
        class="w-[18px] h-[18px] text-gray-500 absolute top-1/2 -translate-y-1/2 right-[18px] z-50"
      />
    </div>
  </div>
</template>
