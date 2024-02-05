import { createItem, deleteItems, readUsers } from "@directus/sdk";

export default async function examples() {
  console.info("Creating example data for memberships");

  const directus = await useDirectusAdmin();

  // Clean up old data
  await directus.request(deleteItems("memberships", { limit: 1000 }));

  await directus.request(
    deleteItems("payments_invoices_out", {
      filter: { payments_entries: { payments_item: { name: "Shares" } } },
    }),
  );

  await directus.request(
    deleteItems("payments_items", { filter: { name: "Shares" } }),
  );

  await directus.request(deleteItems("memberships_types", { limit: 1000 }));

  // Create a shares item for accounting
  console.info("Creating shares item");

  const sharesItem = await directus.request(
    createItem("payments_items", {
      name: "Shares",
      payments_price: 100,
    }),
  );

  // Create some membership types
  console.info("Creating membership types");
  const types = [["Active"], ["Investing"]];
  const type_ids = [];

  for (const type of types) {
    const type_response = await directus.request(
      createItem("memberships_types", {
        name: type[0],
        memberships_shares_item: sharesItem.id,
      }),
    );

    type_ids.push(type_response.id);
  }

  console.info("Created membership types", type_ids);

  // Create some memberships
  console.info("Creating memberships");

  const users = [
    ["Alice", [type_ids[0]], "applied"],
    ["Bob", [type_ids[1]], "approved"],
    ["Charlie", type_ids, "approved"],
    ["Dave", type_ids, "in-cancellation"],
  ];

  for (const user of users) {
    // Get user id
    const user_id = (
      await directus.request(readUsers({ filter: { first_name: user[0] } }))
    )[0];

    // Create membership
    for (const membership_type of user[1]) {
      await directus.request(
        createItem("memberships", {
          memberships_user: user_id,
          memberships_type: membership_type,
          memberships_status: user[2],
          memberships_shares: "3",
        }),
      );
    }
  }
}
