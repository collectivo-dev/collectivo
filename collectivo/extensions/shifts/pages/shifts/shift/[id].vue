<script setup lang="ts">
import { readItem, readItems } from "@directus/sdk";
import { DateTime } from "luxon";
import { getNextOccurrences } from "~/composables/shifts";
import showShiftToast from "~/composables/toast";

const route = useRoute();
const directus = useDirectus();
const user = useCollectivoUser();
user.value.load();
const shift = ref<ShiftsShift>();
const slots = ref<ShiftsSlot[] | undefined>(undefined);
const nextOccurrences: Ref<ShiftOccurrence[]> = ref([]);
const shift_start = ref<DateTime>();
const shift_end = ref<DateTime>();
const slotsLoading = ref(true);
const skillNames = ref<Map<string, string>>();

loadShift();

function loadShift() {
  directus
    .request(readItem("shifts_shifts", route.params.id as string))
    .then((item) => {
      shift.value = item;
      loadSlots();
    })
    .catch((error) => showShiftToast("Shift data could not be loaded", error));
}

function loadSlots() {
  directus
    .request(
      readItems("shifts_slots", {
        filter: { shifts_shift: { id: { _eq: shift.value!.id } } },
      }),
    )
    .then((items) => {
      slots.value = items;
      getSlotSkillNames(items);
    })
    .catch((error) => showShiftToast("Slot data could not be loaded", error))
    .finally(() => {
      slotsLoading.value = false;
    });
}

function getSlotSkillNames(slots: ShiftsSlot[]) {
  const linkIds = [];

  for (const slot of slots) {
    for (const link of slot.shifts_skills) {
      linkIds.push(link);
    }
  }

  directus
    .request(
      readItems("shifts_skills_shifts_slots", {
        filter: {
          id: {
            _in: linkIds,
          },
        },
      }),
    )
    .then((links) => {
      directus
        .request(
          readItems("shifts_skills", {
            filter: {
              id: {
                _in: links.map((link) => link.shifts_skills_id),
              },
            },
          }),
        )
        .then((skills) => {
          skillNames.value = new Map<string, string>();

          for (const skill of skills) {
            for (const linkId of skill.shifts_slots) {
              skillNames.value.set(linkId, skill.shifts_name);
            }
          }
        })
        .catch((error) => {
          showShiftToast("Failed to load skill names names", error);
          slotsLoading.value = false;
        })
        .finally(() => (slotsLoading.value = false));
    })
    .catch((error) => {
      showShiftToast("Failed to load slots<->skills links", error);
      slotsLoading.value = false;
    });
}

watch(shift, () => {
  if (!shift.value) return;
  setDetails(shift.value);
});

function setDetails(shift: ShiftsShift) {
  shift_start.value = DateTime.fromISO(shift.shifts_from);

  shift_end.value = shift_start.value.plus({
    minutes: shift.shifts_duration,
  });

  setCollectivoTitle(
    shift.shifts_name +
      ", " +
      shift_start.value.toLocaleString({ weekday: "long" }) +
      " from " +
      shift_start.value.toLocaleString(DateTime.TIME_SIMPLE) +
      " to " +
      shift_end.value.toLocaleString(DateTime.TIME_SIMPLE),
  );

  nextOccurrences.value = getNextOccurrences(shift, 5);
}
</script>

<template>
  <CollectivoContainer>
    <h1>Details</h1>
    <ul v-if="shift">
      <li>Is currently active : {{ isShiftDurationModelActive(shift) }}</li>
      <li v-if="shift_start">
        Started on: {{ shift_start.toLocaleString(DateTime.DATE_SHORT) }}
      </li>
      <li>
        Ends on :
        <span v-if="shift.shifts_to">{{
          DateTime.fromISO(shift.shifts_to)
        }}</span>
        <span v-else>never</span>
      </li>
    </ul>
  </CollectivoContainer>

  <CollectivoContainer>
    <h1>Slots</h1>
    <ul v-if="slots != undefined">
      <li v-for="(slot, index) in slots" :key="slot.id">
        {{ slot["shifts_name"] }}
        <span v-if="skillNames && slot.shifts_skills.length > 0">
          (required skills:
          <span v-for="skillLinkId in slot.shifts_skills" :key="skillLinkId"
            ><span v-if="index > 0">, </span>
            {{ skillNames.get(skillLinkId) }}</span
          >
          )
        </span>
      </li>
    </ul>
    <span v-else>Loading...</span>
  </CollectivoContainer>

  <ShiftsAssignmentList
    v-if="shift && user.data"
    :shift="shift"
    :user="user.data"
  />

  <CollectivoContainer>
    <h1>Future occurrences</h1>
    <p v-if="nextOccurrences.length == 0">
      There are no occurrences of this shift in the future.
    </p>
    <ShiftsOccurrenceCard
      v-for="(occurrence, i) in nextOccurrences"
      :key="i"
      :shift-occurrence="occurrence"
    >
    </ShiftsOccurrenceCard>
  </CollectivoContainer>
</template>
