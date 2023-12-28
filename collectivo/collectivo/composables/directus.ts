export const useDirectus = () => {
  const { $directus } = useNuxtApp();
  return $directus;
};

export function requireAuth(force: boolean = false) {
  const directus = useDirectus();
  const user = useCollectivoUser();
  const runtimeConfig = useRuntimeConfig();

  // If user is authenticated, do nothing
  if (user.value.isAuthenticated === true && !force) return;

  // If user is not authenticated, log out of directus and redirect to keycloak
  directus.logout();

  if (runtimeConfig.public.authService === "keycloak") {
    return navigateTo(
      `${runtimeConfig.public.directusUrl}/auth/login/keycloak?redirect=${runtimeConfig.public.collectivoUrl}`,
      { external: true }
    );
  } else {
    throw new Error(
      "Unknown auth service in nuxt.config: " + runtimeConfig.public.authService
    );
  }
}

export async function fetchWithAuth(request: string, options?: any) {
  const directus = useDirectus();
  const token = await directus.getToken();
  return await $fetch(request, {
    ...(options || {}),
    headers: {
      Authorization: `Bearer ${token}`,
      ...(options?.headers || {}),
    },
  });
}
