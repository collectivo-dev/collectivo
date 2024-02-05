export const useCollectivoTitle = () =>
  useState<string>("collectivoTitle", () => "");

export const setCollectivoTitle = (title: string) => {
  useCollectivoTitle().value = title;

  useHead({
    title: title + " - " + useAppConfig().projectName,
  });
};

export const useCollectivoMenus = () =>
  useState<CollectivoMenus>("collectivoMenus", () => {
    return {
      main: [],
      public: [],
    };
  });

interface CollectivoValidator {
  message: string;
  test:
    | ((value: any, context: any, state: { [key: string]: any }) => boolean)
    | ((
        value: any,
        context: any,
        state: { [key: string]: any },
      ) => Promise<boolean>);
}

interface CollectivoValidators {
  tests: { [index: string]: CollectivoValidator };
  transformers: { [index: string]: (value: any, originalValue: any) => any };
}

export const useCollectivoValidators = () =>
  useState<CollectivoValidators>("collectivoValidators", () => {
    return {
      tests: {},
      transformers: {},
    };
  });
