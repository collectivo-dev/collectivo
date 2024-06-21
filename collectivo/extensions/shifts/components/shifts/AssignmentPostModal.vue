<script setup lang="ts">
import { DateTime } from "luxon";
import { parse } from "marked";
import { createItem, readItems } from "@directus/sdk";

interface SlotContainer {
  slot: ShiftsSlot;
  freeUntil: DateTime | null;
  id: number;
  occurences: Date[];
}

const props = defineProps({
  shiftOccurence: {
    type: Object as PropType<ShiftOccurrence>,
    required: true,
  },
  shiftType: {
    type: String as PropType<"jumper" | "regular">,
    default: "regular",
  },
});

const isOpen = defineModel("isOpen", { required: true, type: Boolean });
const { t } = useI18n();
const directus = useDirectus();
const user = useCollectivoUser();
const shift = props.shiftOccurence.shift;
const start = props.shiftOccurence.start;
const startDate = start.toISO()?.split("T")[0];
const end = props.shiftOccurence.end;
const submitLoading = ref(false);
const repeats = shift.shifts_repeats_every ?? 0;
const isWeeks = repeats % 7 === 0;
const frequency = isWeeks ? repeats / 7 : repeats;
const slots = ref<SlotContainer[]>([]);
const chosenSlot = ref<SlotContainer | null>(null);

async function getOpenSlots() {
  const openSlots = props.shiftOccurence.openSlots;
  return (await directus.request(
    readItems("shifts_slots", {
      filter: { id: { _in: openSlots } },
    }),
  )) as ShiftsSlot[];
}

onMounted(async () => {
  const openSlots = await getOpenSlots();

  for (const slot of openSlots) {
    const nearestFutureAssignment = (
      await directus.request(
        readItems("shifts_assignments", {
          filter: {
            shifts_user: user.value.data!.id,
            shifts_slot: { _eq: slot.id },
            shifts_from: { _gte: startDate },
          },
          sort: "-shifts_from",
          limit: 1,
        }),
      )
    )[0] as ShiftsAssignment;

    const freeUntil = nearestFutureAssignment
      ? DateTime.fromISO(
          nearestFutureAssignment.shifts_from + "T00:00:00.000Z",
        ).minus({
          days: 1,
        })
      : null;

    const occurences = props.shiftOccurence.shiftRule.between(
      start.startOf("day").toJSDate(),
      freeUntil ? freeUntil.toJSDate() : start.startOf("day").toJSDate(),
      true,
    );

    slots.value.push({
      id: slot.id,
      slot,
      freeUntil: freeUntil,
      occurences: occurences,
    });
  }
});

async function postAssignment(slotContainer: SlotContainer) {
  try {
    await postAssignmentInner(slotContainer);

    showCollectivoToast({
      type: "success",
      description: "Shift assignment successfull",
    });

    navigateTo("profile");
  } catch (e) {
    showCollectivoToast({
      type: "error",
      description: "Shift assignment failed",
    });
  }
}

async function postAssignmentInner(slotContainer: SlotContainer) {
  submitLoading.value = true;

  const shiftStartString = start.toISO()!;

  const payload: ShiftsAssignment = {
    shifts_user: user.value.data!.id,
    shifts_slot: slotContainer.id,
    shifts_from: shiftStartString,
  };

  // One-time shifts have same start and end date
  // Regular shifts are either until freeUntil or forever
  if (props.shiftType === "jumper") {
    payload.shifts_to = shiftStartString;
  } else if (slotContainer.freeUntil) {
    payload.shifts_to = slotContainer.freeUntil.toISO()!;
  }

  await directus.request(createItem("shifts_assignments", payload));
}
</script>

<template>
  <UModal v-model="isOpen">
    <div class="m-10">
      <h2>{{ shift.shifts_name }}</h2>

      <p v-if="shiftType" class="font-bold text-lg my-5 leading-7">
        <span v-if="shiftType === 'jumper'">
          {{ t("One-time shift") }}
          <br />
          {{ start.toLocaleString(DateTime.DATE_MED) }} {{ t("from") }}
          {{ start.toLocaleString(DateTime.TIME_24_SIMPLE) }}
          {{ t("to") }}
          {{ end.toLocaleString(DateTime.TIME_24_SIMPLE) }}
        </span>
        <span v-else>
          {{ t("Regular shift") }}
          <br />
          {{ start.weekdayLong }} {{ t("from") }}
          {{ start.toLocaleString(DateTime.TIME_24_SIMPLE) }}
          {{ t("to") }}
          {{ end.toLocaleString(DateTime.TIME_24_SIMPLE) }}
          <br />
          {{ t("Repeating every") }}
          {{ frequency }} {{ isWeeks ? t("weeks") : t("days") }}
          <br />
          {{ t("Starting from") }}
          {{ start.toLocaleString(DateTime.DATE_MED) }}
          <span v-if="chosenSlot && chosenSlot.freeUntil">
            {{ t("until") }}
            {{ chosenSlot.freeUntil.toLocaleString(DateTime.DATE_MED) }}
          </span>
        </span>
      </p>

      <!-- Shift infos -->
      <p
        v-if="shift.shifts_description"
        class="mb-5"
        v-html="parse(shift.shifts_description)"
      ></p>

      <UFormGroup label="Slot" class="my-5">
        <USelectMenu
          v-model="chosenSlot"
          :options="slots"
          option-value="id"
          label="Slot"
          placeholder="Choose slot"
        >
          <template #option="{ option }">
            {{ option.id }} - {{ option.slot.shifts_name }}
            <span v-if="shiftType == 'regular' && option.freeUntil">
              (free until
              {{ option.freeUntil.toLocaleString(DateTime.DATE_MED) }}
              )
            </span>
          </template>

          <template #label>
            <template v-if="chosenSlot">
              {{ chosenSlot.id }} - {{ chosenSlot.slot.shifts_name }}
              <span v-if="shiftType == 'regular' && chosenSlot.freeUntil">
                (free until
                {{ chosenSlot.freeUntil.toLocaleString(DateTime.DATE_MED) }}
                )
              </span>
            </template>
            <template v-else> Choose slot </template>
          </template>
        </USelectMenu>
      </UFormGroup>

      <UButton
        class="w-full"
        size="lg"
        icon="i-heroicons-pencil-square"
        :loading="submitLoading"
        :disabled="!chosenSlot"
        @click="postAssignment(chosenSlot!)"
      >
        {{ t("Sign up") }}
      </UButton>
    </div>
  </UModal>
</template>

<i18n lang="yaml">
de:
  "Sign up": "Verbindlich anmelden"
  from: "von"
  to: "bis"
  Repeating every: "Wiederholt sich alle"
  days: "Tage"
  weeks: "Wochen"
  until: "bis"
  "Starting from": "Beginnend am"
  Regular shift: "Regelmäßige Schicht"
  One-time shift: "Einmalige Schicht"
</i18n>
