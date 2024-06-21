import type { ShiftLogType } from "~/server/utils/ShiftLogType";
import { DateTime } from "luxon";
import { ItemStatus } from "@collectivo/collectivo/server/utils/directusFields";

declare global {
  interface CollectivoSchema {
    shifts_slots: ShiftsSlot[];
    shifts_skills: ShiftsSkill[];
    shifts_assignments: ShiftsAssignment[];
    shifts_absences: ShiftsAbsence[];
    shifts_logs: ShiftsLog[];
    shifts_shifts: ShiftsShift[];
    shifts_skills_directus_users: ShiftsSkillUserLink[];
    shifts_skills_shifts_slots: ShiftsSkillSlotLink[];
  }

  export type ShiftsUserType = "jumper" | "regular" | "exempt" | "inactive";

  export interface CollectivoUser {
    shifts_user_type: string;
    shifts_skills: number[];
  }

  export interface ShiftsShift {
    id?: string;
    shifts_name?: string;
    shifts_from: string;
    shifts_to?: string;
    shifts_from_time?: string;
    shifts_to_time?: string;
    shifts_repeats_every?: number;
    shifts_slots?: ShiftsSlot[] | number[];
    shifts_status: ItemStatus;
    shifts_description?: string;
  }

  export interface ShiftsSlot {
    id: number;
    shifts_name?: string;
    shifts_shift: ShiftsShift | number;
    shifts_skills: ShiftsSkillSlotLink[] | number[];
    shifts_assignments: ShiftsAssignment[] | number[];
  }

  export interface ShiftsAssignment {
    id?: number;
    shifts_from: string;
    shifts_to?: string;
    shifts_slot: ShiftsSlot | number;
    shifts_user: CollectivoUser | string;
  }

  export interface ShiftsAssignmentRules {
    assignment: ShiftsAssignment;
    absences: ShiftsAbsence[];
    assignmentRule: RRuleSet;
    absencesRule: RRuleSet;
    nextOccurrence: Date | null;
    isRegular: boolean;
  }

  export interface ShiftsAbsence {
    id?: number;
    shifts_from: string;
    shifts_to: string;
    shifts_assignment?: number;
  }

  export interface ShiftsSkill {
    id: number;
    shifts_name: string;
    shifts_slots: string[];
  }

  export interface ShiftsLog {
    id?: number;
    shifts_type: ShiftLogType;
    shifts_date: string;
    shifts_assignment?: ShiftsAssignment;
    shifts_user: string;
  }

  export interface ShiftOccurrence {
    shift: ShiftsShift;
    start: DateTime;
    end: DateTime;
    slots: number;
    openSlots: number[];
    shiftRule: RRuleSet;
  }

  export interface ShiftsSkillUserLink {
    id?: string;
    shifts_skills_id: number;
    directus_users_id: string;
  }

  export interface ShiftsSkillSlotLink {
    id?: string;
    shifts_skills_id: number;
    shifts_slot_id: number;
  }
}

// Types for input of app.config.ts
declare module "nuxt/schema" {
  interface AppConfigInput {}
}

export {};
