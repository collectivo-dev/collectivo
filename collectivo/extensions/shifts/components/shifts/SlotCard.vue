<script setup lang="ts">
import { getNextOccurrence } from "~/composables/shifts";
import { getStatusColor } from "~/composables/colors";
import getAssigneeName from "~/utils/assignments/getAssigneeName";
import hasActivePermanentAssignment from "~/utils/assignments/hasActivePermanentAssignment";

defineProps({
  shiftSlot: {
    type: Object as PropType<ShiftsSlot>,
    required: true,
  },
  skillNames: {
    type: Map<number, string>,
    required: false,
  },
});

const emit = defineEmits<{
  slotSelected: [slot: ShiftsSlot];
}>();
</script>

<template>
  <CollectivoCard
    :title="shiftSlot.shifts_name"
    :color="getStatusColor(shiftSlot.shifts_status)"
  >
    <template #content>
      <p v-if="skillNames">
        Required skills:
        <span v-if="shiftSlot.shifts_skills.length == 0">None</span>
        <span
          v-for="(
            link, index
          ) in shiftSlot.shifts_skills as ShiftsSkillSlotLink[]"
          :key="link.id"
          ><span v-if="index > 0">, </span>
          {{ skillNames.get(link.shifts_skills_id!) }}
        </span>
      </p>
      <p>
        Assigned to:
        {{
          getAssigneeName(
            shiftSlot.shifts_assignments as ShiftsAssignment[],
            getNextOccurrence(shiftSlot.shifts_shift as ShiftsShift)?.start,
          )
        }}
      </p>
      <p>
        <UTooltip
          :prevent="
            !hasActivePermanentAssignment(
              shiftSlot.shifts_assignments as ShiftsAssignment[],
            )
          "
        >
          <template #text>
            You can't assign yourself to this slot because someone else is
            already permanently assigned to it.
          </template>
          <UButton
            :label="'Assign myself to this slot'"
            :icon="'i-heroicons-user-plus'"
            :disabled="
              hasActivePermanentAssignment(
                shiftSlot.shifts_assignments as ShiftsAssignment[],
              )
            "
            @click="emit('slotSelected', shiftSlot)"
          />
        </UTooltip>
      </p>
    </template>
  </CollectivoCard>
</template>
