declare global {
  interface CollectivoSchema {
    example_collection: ExampleCollection[];
  }

  interface ExampleCollection {
    id: number;
    example_field: string;
  }
}

export {};
