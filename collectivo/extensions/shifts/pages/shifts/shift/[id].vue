<script setup lang="ts">
import { readItem, readItems } from "@directus/sdk";
import { DateTime } from "luxon";
import { getNextOccurrences } from "~/composables/shifts";
import showShiftToast from "~/composables/toast";
import { ItemStatus } from "@collectivo/collectivo/server/utils/directusFields";
import SlotCard from "~/components/shifts/SlotCard.vue";

const route = useRoute();
const directus = useDirectus();
const user = useCollectivoUser();
user.value.load();
const shift = ref<ShiftsShift>();
const nextOccurrences: Ref<ShiftOccurrence[]> = ref([]);
const shift_start = ref<DateTime>();
const shift_end = ref<DateTime>();
const skillNames = ref<Map<number, string>>();
const selectedSlot = ref<ShiftsSlot>();
const assignmentCreationModalOpen = ref(false);

loadShift();

function loadShift() {
  directus
    .request(
      readItem("shifts_shifts", route.params.id as string, {
        fields: [
          "*",
          {
            shifts_slots: [
              "*",
              {
                shifts_skills: ["*"],
                shifts_assignments: [
                  "*",
                  { shifts_user: ["first_name", "last_name"] },
                ],
                shifts_shift: ["*"],
              },
            ],
          },
        ],
      }),
    )
    .then((item) => {
      shift.value = item as ShiftsShift;
      getSlotSkillNames(shift.value.shifts_slots as ShiftsSlot[]);
    })
    .catch((error) =>
      showShiftToast("Shift data could not be loaded", error, "error"),
    );
}

function getSlotSkillNames(slots: ShiftsSlot[]) {
  const skillIds = [];

  for (const slot of slots) {
    for (const link of slot.shifts_skills as ShiftsSkillSlotLink[]) {
      skillIds.push(link.shifts_skills_id);
    }
  }

  directus
    .request(
      readItems("shifts_skills", {
        filter: {
          id: {
            _in: skillIds,
          },
        },
        fields: ["id", "shifts_name"],
      }),
    )
    .then((skills) => {
      skillNames.value = new Map<number, string>();

      for (const skill of skills) {
        skillNames.value.set(skill.id, skill.shifts_name);
      }
    })
    .catch((error) => {
      showShiftToast("Failed to load skill names", error, "error");
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
    { backLink: "shift_calendar" },
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
      <li
        v-if="shift.shifts_status != ItemStatus.PUBLISHED"
        class="text-primary"
      >
        Status: {{ shift.shifts_status }}
      </li>
    </ul>
  </CollectivoContainer>

  <CollectivoContainer>
    <h1>Slots</h1>
    <ul v-if="shift">
      <template
        v-for="slot in shift.shifts_slots as ShiftsSlot[]"
        :key="slot.id"
      >
        <li>
          <SlotCard
            :shift-slot="slot"
            :skill-names="skillNames"
            @slot-selected="
              (newSelection) => {
                selectedSlot = newSelection;
                assignmentCreationModalOpen = true;
              }
            "
          />
        </li>
      </template>
    </ul>
    <span v-else>Loading...</span>
    <ShiftsAssignmentModal
      v-if="selectedSlot"
      v-model:is-open="assignmentCreationModalOpen"
      :shifts-slot="selectedSlot"
      @assignment-created="loadShift"
    />
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
