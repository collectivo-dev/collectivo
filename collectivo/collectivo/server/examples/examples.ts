import {
  createItem,
  createItems,
  createUser,
  deleteItems,
  readRoles,
  readUsers,
  updateUser,
} from "@directus/sdk";

async function getRole(name: string) {
  const directus = await useDirectusAdmin();

  const membersRoles = await directus.request(
    readRoles({
      filter: {
        name: { _eq: name },
      },
    }),
  );

  if (membersRoles.length < 1) {
    throw new Error(name + " role not found");
  }

  return membersRoles[0].id;
}

export default async function examples() {
  console.info("Creating example data for collectivo");

  const directus = await useDirectusAdmin();

  const userRole = await getRole("collectivo_user");
  const editorRole = await getRole("collectivo_editor");
  const adminRole = await getRole("collectivo_admin");

  // Create some users
  console.info("Creating users");

  const userNames = [
    "Admin",
    "Editor",
    "User",
    "Alice",
    "Bob",
    "Charlie",
    "Dave",
  ];

  const users = [];

  for (const userName of userNames) {
    const email = `${userName.toLowerCase()}@example.com`;

    const u = {
      first_name: userName,
      last_name: "Example",
      email: email,
      role: userRole,
      provider: "keycloak",
      status: "active",
      external_identifier: email,
    };

    if (userName == "Admin") {
      u.role = adminRole;
    }

    if (userName == "Editor") {
      u.role = editorRole;
    }

    users.push(u);
  }

  for (const user of users) {
    const usersDB = await directus.request(
      readUsers({
        filter: { email: { _eq: user.email } },
      }),
    );

    let userID;

    if (usersDB.length > 0) {
      userID = usersDB[0].id;
      // tslint:disable-next-line:no-console
      console.info("Updating user " + user.email + " with ID " + userID);
      await directus.request(updateUser(userID, user));
      // tslint:disable-next-line:no-console
      console.info("Updated good");
    } else {
      // tslint:disable-next-line:no-console
      console.info("Creating user " + user.email);
      const us = await directus.request(createUser(user));
      userID = us.id;
    }
  }

  // Create some tags
  console.info("Creating tags");
  await directus.request(deleteItems("collectivo_tags", { limit: 1000 }));
  const tagNames = ["Has a dog", "Has a cat", "Has a bird", "Has a fish"];
  const tags: any[] = [];

  for (const tagName of tagNames) {
    tags.push({
      tags_name: tagName,
    });
  }

  // Add some members to some tags
  // TODO: This is not working
  // console.info("Creating tag-member relations");
  // for (var i = 0; i < 3; i++) {
  //   tags[i].directus_users = {
  //     create: [
  //       { collectivo_tags_id: "+", directus_users_id: { id: 1 } },
  //       { collectivo_tags_id: "+", directus_users_id: { id: 2 } },
  //       { collectivo_tags_id: "+", directus_users_id: { id: 3 } },
  //     ],
  //   };
  // }

  try {
    await directus.request(createItems("collectivo_tags", tags));
  } catch (error) {
    console.info(error);
  }

  // Create email templates
  console.info("Creating email templates");
  await directus.request(deleteItems("messages_templates", { limit: 1000 }));
  const templates = [];

  for (const i in [1, 2, 3]) {
    templates.push({
      messages_name: `Example Template ${i}`,
      messages_method: "email",
      messages_subject: `Example Subject ${i}`,
      messages_content:
        "Hello {{recipient_first_name}} {{recipient_last_name}}. \n This is a second line.",
    });
  }

  const templateIds = [];

  try {
    const ids = await directus.request(
      createItems("messages_templates", templates),
    );

    templateIds.push(...ids);
  } catch (error) {
    console.info(error);
  }

  // Create some tiles
  console.info("Creating tiles");
  await directus.request(deleteItems("collectivo_tiles", { limit: 1000 }));

  const tileData = [
    {
      name: "Tile 1",
      color: "primary",
    },
    {
      name: "Tile 2",
      color: "green",
    },
    {
      name: "Tile 3",
      color: "orange",
    },
    {
      name: "Tile 4",
      color: "blue",
    },
  ];

  const tiles = [];

  const tileButton = {
    tiles_label: "Example Button",
    tiles_path: "/some/path",
    tiles_tile: "",
  };

  for (const td of tileData) {
    tiles.push({
      tiles_name: td.name,
      tiles_content: "Hello! I am an example tile!",
      tiles_color: td.color,
    });
  }

  try {
    const tilesRes = await directus.request(
      createItems("collectivo_tiles", tiles),
    );

    for (const tile of tilesRes) {
      tileButton.tiles_tile = tile.id;

      await directus.request(
        createItem("collectivo_tiles_buttons", tileButton),
      );
    }
  } catch (error) {
    console.info(error);
  }
}
