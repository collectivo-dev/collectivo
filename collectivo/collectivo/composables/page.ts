export const useCollectivoTitle = () =>
  useState<string>("collectivoTitle", () => "");

export const useCollectivoBackLink = () =>
  useState<string | undefined>("collectivoBackLink", () => "");

interface CollectivoTitleOptions {
  backLink?: string;
}

export const setCollectivoTitle = (
  title: string,
  options?: CollectivoTitleOptions,
) => {
  useCollectivoTitle().value = title;
  useCollectivoBackLink().value = options?.backLink;
  useHead({
    title: title + " - " + useAppConfig().collectivo.projectName,
  });
};

export const useCollectivoMenus = () =>
  useState<CollectivoMenus>("collectivoMenus", () => {
    return {
      main: [],
      main_public: [],
      profile: [],
      profile_public: [],
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
