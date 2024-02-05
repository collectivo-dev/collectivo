import type { DirectusUser } from "@directus/sdk";

declare global {
  interface CollectivoSchema {
    memberships: MembershipsMembership[];
  }

  interface MembershipsMembership {
    id: number;
    name: string;
    memberships_user: DirectusUser | number;
  }
}

export {};
