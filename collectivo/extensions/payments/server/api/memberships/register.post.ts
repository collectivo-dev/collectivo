import { createItem, createUser } from "@directus/sdk";
import KcAdminClient from "@keycloak/keycloak-admin-client";

// Register a new membership
// Receives input from /memberships/register
export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    return await registerMembership(body);
  } catch (e: any) {
    if (
      e &&
      "response" in e &&
      typeof e.response === "object" &&
      e.response.status
    ) {
      setResponseStatus(event, e.response.status);
    } else {
      setResponseStatus(event, 500);
    }

    return e;
  }
});

async function registerMembership(body: any) {
  logger.info(
    "Received membership application: " + body["directus_users.email"],
  );

  const userData: any = {};
  const membershipData: any = {};

  for (const [key, value] of Object.entries(body)) {
    if (key.startsWith("directus_users__")) {
      userData[key.replace("directus_users__", "")] = value;
    } else if (key.startsWith("memberships__")) {
      membershipData[key.replace("memberships__", "")] = value;
    }
  }

  await refreshDirectus();
  const directus = await useDirectusAdmin();
  const config = useRuntimeConfig();

  // Connect to keycloak
  const keycloak = new KcAdminClient({
    baseUrl: config.public.keycloakUrl,
    realmName: config.public.keycloakRealm,
  });

  await keycloak.auth({
    grantType: "client_credentials",
    clientId: config.keycloakAdminClient,
    clientSecret: config.keycloakAdminSecret,
  });

  // Random call to test connection
  await keycloak.users.find({ first: 0, max: 1 });

  // Create user
  let password = "";

  if (config.public.authService == "keycloak") {
    password = userData.password;
    delete userData.password;
    userData.provider = "keycloak";
    userData.external_identifier = userData.email;
  }

  console.log("PASSWORD IS '" + password + "'");
  console.log("TYPE OF PASSWORD IS " + typeof password);

  const user_id = await directus.request(createUser(userData));

  // Prepare membership
  membershipData.memberships_user = user_id;
  membershipData.memberships_status = "applied";
  membershipData.memberships_date_applied = new Date().toISOString();
  // TODO: ADD ROLE

  // Create membership
  const membership_id = await directus.request(
    createItem("memberships", membershipData),
  );

  // Create keycloak user & send verification mail
  if (config.public.authService == "keycloak") {
    const kcUser = await keycloak.users.create({
      enabled: true,
      username: userData.email,
      email: userData.email,
      firstName: userData.first_name,
      lastName: userData.last_name,
      emailVerified: false,
    });

    await keycloak.users.resetPassword({
      id: kcUser.id,
      credential: {
        temporary: false,
        type: "password",
        value: password,
      },
    });

    // await keycloak.users.sendVerifyEmail({
    //   id: kcUser.id,
    //   clientId: "directus",
    //   redirectUri: config.public.collectivoUrl,
    // });
    // await keycloak.users.executeActionsEmail({
    //   id: kcUser.id,
    //   clientId: "directus",
    //   redirectUri: config.public.collectivoUrl,
    //   actions: ["VERIFY_EMAIL"],
    // });
  }

  return {
    status: 201,
    body: {
      // user: user_id,
      // membership: membership_id,
    },
  };
}
