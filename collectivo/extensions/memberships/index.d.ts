import type { DirectusUser } from "@directus/sdk";

declare global {
  interface CollectivoSchema {
    memberships: MembershipsMembership[];
  }

  interface MembershipsMembership {
    id: number;
    name: string;
    memberships_user: DirectusUser | number;
    memberships_status: string;
    memberships_type: {
      memberships_name: string;
    };
    memberships_shares: number;
  }
}

export {};
