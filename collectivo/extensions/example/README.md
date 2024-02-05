# Collectivo Example Extension

This is an example of an extension for [Collectivo](https://github.com/collectivo-dev/collectivo).

## Directory Structure

See also: [Nuxt Layers](https://nuxt.com/docs/getting-started/layers) and [Nuxt Directory Structure](https://nuxt.com/docs/guide/directory-structure/app)

- `plugins/setup.ts`: Initiate your extension on the client-side, e.g. in order to add menu items to the sidebar.
- `nuxt.config.ts`: Define your layers Nuxt configuration, which can also be used to override Collectivo's default configuration.
- `index.d.ts`: Add types for your extension, which will also be accessible to lower layers. Extend the schema of the directus client from `useDirectus()` by declaring an interface `CollectivoSchema` with the collections and fields of your extension.
