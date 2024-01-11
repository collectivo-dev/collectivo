declare global {
  // Database schema
  interface CollectivoShiftsSchema {
    collectivo_shifts: CollectivoShift[];
  }

  interface CollectivoShift {
    id: string;
    shifts_name: string;
    shifts_from: string;
    shifts_to: string;
  }
}

// Types for input of app.config.ts
declare module "nuxt/schema" {
  interface AppConfigInput {}
}

export {};
