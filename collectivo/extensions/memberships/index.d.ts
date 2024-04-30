import type { DirectusUser } from "@directus/sdk";

declare global {
  interface CollectivoSchema {
    memberships: MembershipsMembership[];
  }

  interface CollectivoUser {
    memberships: MembershipsMembership[] | number[];
  }

  export interface MembershipsMembership {
    id: number;
    name: string;
    memberships_user: DirectusUser | number;
    memberships_status: string;
    memberships_type: string;
    memberships_shares: number;
  }
}

// Types for input of app.config.ts
declare module "nuxt/schema" {
  interface AppConfigInput {}
}

export {};
