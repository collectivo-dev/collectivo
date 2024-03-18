import { readMe, updateMe } from "@directus/sdk";

export const useCollectivoUser = () => {
  const state = useState<CollectivoUserStore>(
    "collectivo_user",
    () => new CollectivoUserStore(),
  );

  return state;
};

class CollectivoUserStore {
  data: CollectivoUser | null;
  fields: CollectivoFormField[];
  isAuthenticated: boolean;
  saving: boolean;
  loading: boolean;
  error: unknown;

  constructor() {
    this.data = null;
    this.fields = [];
    this.isAuthenticated = false;
    this.saving = false;
    this.loading = false;
    this.error = null;
  }

  async load(force: boolean = false) {
    const directus = useDirectus();
    if (!force && this.data) return this;
    this.loading = true;

    this.data = (await directus.request(
      readMe({
        fields: ["*", "role.*"],
      }),
    )) as CollectivoUser;

    this.loading = false;
    return this;
  }

  async save(data: CollectivoUser) {
    const { $directus } = useNuxtApp();
    this.saving = true;
    await $directus?.request(updateMe(data));
    this.data = data;
    this.saving = false;
    return this;
  }

  async login(force: boolean = false) {
    const directus = useDirectus();
    const user = useCollectivoUser();
    const route = useRoute();
    const runtimeConfig = useRuntimeConfig();

    // If user is authenticated, do nothing
    if (user.value.isAuthenticated === true && !force) return;

    // If user is not authenticated, log out of directus and redirect to keycloak
    directus.logout();

    if (runtimeConfig.public.authService === "keycloak") {
      return navigateTo(
        `${runtimeConfig.public.directusUrl}/auth/login/keycloak?redirect=${runtimeConfig.public.collectivoUrl}${route.path}`,
        { external: true },
      );
    } else {
      throw new Error(
        "Unknown auth service in nuxt.config: " +
          runtimeConfig.public.authService,
      );
    }
  }

  async logout() {
    const runtimeConfig = useRuntimeConfig();
    const directus = useDirectus();
    await directus.logout();

    if (runtimeConfig.public.authService === "keycloak") {
      const logoutPath = `${runtimeConfig.public.keycloakUrl}/realms/collectivo/protocol/openid-connect/logout`;
      return navigateTo(logoutPath, { external: true });
    } else {
      throw new Error(
        "Unknown auth service in nuxt.config: " +
          runtimeConfig.public.authService,
      );
    }
  }
}
