import type { ShiftLogType } from "~/server/utils/ShiftLogType";
import { DateTime } from "luxon";
import { ItemStatus } from "@collectivo/collectivo/server/utils/directusFields";

declare global {
  interface CollectivoSchema {
    shifts_slots: ShiftsSlot[];
    shifts_skills: ShiftsSkill[];
    shifts_assignments: ShiftsAssignment[];
    shifts_logs: ShiftsLog[];
    shifts_shifts: ShiftsShift[];
    shifts_skills_directus_users: ShiftsSkillUserLink[];
    shifts_skills_shifts_slots: ShiftsSkillSlotLink[];
  }

  export interface ShiftsSlot {
    id: number;
    shifts_name: string;
    shifts_shift: ShiftsShift | number;
    shifts_skills: ShiftsSkillSlotLink[] | number[];
    shifts_assignments: ShiftsAssignment[] | number[];
    shifts_status: ItemStatus;
  }

  export interface ShiftsSkill {
    id: number;
    shifts_name: string;
    shifts_slots: string[];
  }

  export interface ShiftsAssignment {
    id?: number;
    shifts_from: string;
    shifts_to?: string;
    shifts_slot: ShiftsSlot | number;
    shifts_user: CollectivoUser | string;
    shifts_status: ItemStatus;
  }

  export interface ShiftsLog {
    id: number;
    shifts_type: ShiftLogType;
    shifts_datetime: string;
    shifts_assignment?: ShiftsAssignment;
    shifts_user: CollectivoUser;
  }

  export interface ShiftOccurrence {
    shift: ShiftsShift;
    start: DateTime;
    end: DateTime;
  }

  export interface ShiftsShift {
    id?: string;
    shifts_name: string;
    shifts_from: string;
    shifts_to?: string;
    shifts_duration: number;
    shifts_repeats_every: number;
    shifts_slots?: ShiftsSlot[] | number[];
    shifts_status: ItemStatus;
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
