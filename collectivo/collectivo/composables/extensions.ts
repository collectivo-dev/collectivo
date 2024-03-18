import { readItems } from "@directus/sdk";

export const useCollectivoExtensions = () =>
  useState<CollectivoExtensionsStore>(
    "collectivo_extensions",
    () => new CollectivoExtensionsStore(),
  );

class CollectivoExtensionsStore {
  data: CollectivoExtension[] | null;
  loading: boolean;
  error: unknown;

  constructor() {
    this.data = null;
    this.loading = false;
    this.error = null;
  }

  async load() {
    this.loading = true;
    const directus = useDirectus();

    try {
      this.data = await directus.request(readItems("collectivo_extensions"));
    } catch (error) {
      this.error = error;
    }

    this.loading = false;
  }
}
