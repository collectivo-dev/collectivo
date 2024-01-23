<script setup>
const props = defineProps(["calendarRef"]);

const displayedDate = ref("");
const calendarApi = ref(null);
const dropdownLabel = ref("");
const dropdownIcon = ref("");

const prevHandler = () => {
  calendarApi.value.prev();
  displayedDate.value = calendarApi.value.view.title;
};

const nextHandler = () => {
  calendarApi.value.next();
  displayedDate.value = calendarApi.value.view.title;
};

const items = [
  {
    label: "Month",
    icon: "i-system-uicons-calendar-month",
    view: "dayGridMonth",
  },
  {
    label: "Week",
    icon: "i-system-uicons-calendar-week",
    view: "timeGridWeek",
  },
  {
    label: "Day",
    icon: "i-system-uicons-calendar-day",
    view: "timeGridDay",
  },
];

for (const item of items) {
  item["click"] = () => {
    calendarApi.value.changeView(item.view);
    displayedDate.value = calendarApi.value.view.title;
    dropdownLabel.value = item.label;
    dropdownIcon.value = item.icon;
  };
}

onMounted(async () => {
  const calendar = await props.calendarRef.value.getApi;
  calendarApi.value = calendar();
  displayedDate.value = calendarApi.value.view.title;
  items[0].click();
});
</script>

<template>
  <div class="calendar-header">
    <div class="calendar-header__left">
      <h2 class="calendar-header__left__title">
        {{ displayedDate }}
      </h2>
      <div class="calendar-header__left__buttons">
        <UButton
          color="gray"
          variant="solid"
          :padded="false"
          @click="prevHandler"
        >
          <UIcon name="i-system-uicons-chevron-left" class="text-[22px]" />
        </UButton>
        <UButton
          color="gray"
          variant="solid"
          :padded="false"
          @click="nextHandler"
        >
          <UIcon name="i-system-uicons-chevron-right" class="text-[22px]" />
        </UButton>
      </div>
    </div>
    <div class="calendar-header__right">
      <UDropdown :items="[items]">
        <UButton
          :label="dropdownLabel"
          color="white"
          trailing-icon="i-system-uicons-chevron-down"
          :leading-icon="dropdownIcon"
        />
      </UDropdown>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.calendar-header {
  @apply flex items-center justify-between mb-6;
  &__left {
    @apply flex items-center gap-5 justify-between lg:justify-start w-full;
    &__title {
      @apply font-semibold text-2xl;
    }

    &__buttons {
      @apply flex items-center gap-2.5;
      button {
        @apply h-auto rounded-lg p-1;
      }
    }
  }

  &__right {
    @apply hidden lg:block;
    &__btn {
      @apply h-auto py-2 pl-4 pr-2.5 rounded-[10px] gap-0;
    }
  }
}

.dropdown-item {
  @apply text-left;
  &__title {
    @apply font-semibold text-sm;
  }

  &__description {
    @apply font-semibold text-xs line-clamp-3;
  }
}
</style>
