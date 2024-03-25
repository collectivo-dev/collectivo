import type { ShiftLogType } from "~/server/utils/ShiftLogType";
import { DateTime } from "luxon";

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
    id: string;
    shifts_name: string;
    shifts_shift: ShiftsShift;
    shifts_skills: string[];
  }

  export interface ShiftsSkill {
    id: string;
    shifts_name: string;
    shifts_slots: string[];
  }

  export interface ShiftsAssignment {
    id: string;
    shifts_from: string;
    shifts_to?: string;
    shifts_slot: ShiftsSlot;
    shifts_user: CollectivoUser;
  }

  export interface ShiftsLog {
    id: string;
    shifts_type: ShiftLogType;
    shifts_datetime: string;
    shifts_user: CollectivoUser;
    shifts_assignment: ShiftsAssignment;
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
  }

  export interface ShiftsSkillUserLink {
    id?: string;
    shifts_skills_id: string;
    directus_users_id: string;
  }

  export interface ShiftsSkillSlotLink {
    id?: string;
    shifts_skills_id: string;
    shifts_slot_id: string;
  }
}

// Types for input of app.config.ts
declare module "nuxt/schema" {
  interface AppConfigInput {}
}

export {};
