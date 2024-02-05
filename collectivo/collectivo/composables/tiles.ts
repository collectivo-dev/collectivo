import { readItems } from "@directus/sdk";

export const useCollectivoTiles = () =>
  useState<CollectivoTileStore>(
    "collectivo_tiles",
    () => new CollectivoTileStore(),
  );

class CollectivoTileStore {
  data: CollectivoTile[] | null;
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
      this.data = await directus.request(
        readItems("collectivo_tiles", { fields: ["*.*"] }),
      );
    } catch (error) {
      this.error = error;
    }

    this.loading = false;
  }
}
