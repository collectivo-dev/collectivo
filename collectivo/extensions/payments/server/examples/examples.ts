import { createItem, deleteItems, readUsers } from "@directus/sdk";

export default async function examples() {
  console.info("Creating example data for payments");

  const directus = await useDirectusAdmin();

  // Clean up old data
  await directus.request(deleteItems("payments_invoices_out", { limit: 1000 }));
  await directus.request(deleteItems("payments_items", { limit: 1000 }));

  const item_names = ["Test item 1", "Test item 2"];
  const item_ids = [];
  const invoice_ids = [];

  for (const name of item_names) {
    const res = await directus.request(
      createItem("payments_items", {
        name: name,
      }),
    );

    item_ids.push(res.id);
  }

  const users = await directus.request(
    readUsers({ filter: { first_name: "Alice" } }),
  );

  for (const status of ["pending", "paid"]) {
    const res = await directus.request(
      createItem("payments_invoices_out", {
        payments_recipient_user: users[0].id,
        payments_status: status,
        payments_date_issued: new Date(),
      }),
    );

    invoice_ids.push(res.id);
  }

  for (const invoice_id of invoice_ids) {
    for (const item_id of item_ids) {
      await directus.request(
        createItem("payments_invoices_entries", {
          payments_invoice: invoice_id,
          payments_item: item_id,
          payments_quantity: 1,
          payments_price: 100,
        }),
      );
    }
  }
}
