import { createItem, deleteItems, readUsers } from "@directus/sdk";
import { MembershipStatus } from "@collectivo/memberships/server/schemas/memberships_01";

export default async function examples() {
  console.info("Creating example data for memberships");

  const directus = await useDirectusAdmin();

  // Clean up old data
  await directus.request(deleteItems("memberships", { limit: 1000 }));

  // Create some memberships
  console.info("Creating memberships");

  const users = [
    ["Alice", MembershipStatus.APPLIED, null],
    ["Bob", MembershipStatus.APPROVED, new Date(2023, 1, 5)],
    ["Charlie", MembershipStatus.APPROVED, new Date(2023, 6, 12)],
    ["Dave", MembershipStatus.IN_CANCELLATION, new Date(2024, 1, 2)],
    ["User", MembershipStatus.APPROVED, new Date(2024, 3, 6)],
  ];

  for (const user of users) {
    // Get user id
    const user_id = (
      await directus.request(readUsers({ filter: { first_name: user[0] } }))
    )[0];

    // Create membership
    await directus.request(
      createItem("memberships", {
        memberships_user: user_id,
        memberships_type: "normal",
        memberships_status: user[1],
        memberships_date_approved: user[2],
      }),
    );
  }
}
