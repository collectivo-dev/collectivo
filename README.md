![Collectivo](docs/collectivo_rgb_header.png)

Collectivo is an open-source platform for collaboration, participation, and data management. The software is designed to promote the active engagement and self-organization of members in community projects and organizations. With a modular structure, it can be easily customized to meet the needs of different users.

Collectivo is build on [Nuxt](https://nuxt.com/docs/), [Directus](https://directus.io/), and [Keycloak](https://www.keycloak.org/). Features of the plattform are split into separate extensions, using [Nuxt Layers](https://nuxt.com/docs/guide/going-further/layers). The software is designed to make it as easy as possible to develop additional extensions and integrate existing tools into the plattform.

If you are interested in using Collectivo or contributing to its development, please join our Discord server: https://discord.gg/42MWureAYW

# Getting started

## Installation

Follow the instructions under [Collectivo Quickstart](https://github.com/collectivo-dev/collectivo-quickstart).

## Configuration

- Internationalization (see [nuxt/i18n](https://i18n.nuxtjs.org/))
  - Change the default language: add `i18n: {defaultLocale: 'en'}` to `nuxt.config.ts`.

## Migrations

Migrations between schemas can be run via the Nuxt API endpoint `/api/migrate/`. Extensions can define a schema for each version. E.g. a schema can be for version `0.0.1` of the core extension `collectivo`. A migration script can be run both before and after applying each schema version.

![Migration flow](docs/migrations.png)

Migration requests must be authorized with the `NUXT_API_TOKEN` from `.env`.

The following parameters can be passed:

- `extension (string)` - Apply migrations of a specific extension. If not given, all extensions will be migrated.
- `version (string)` - Apply schemas towards specified version. If not given, migration will run up to the latest version.
- `examples (boolean)` - Create example data (default false).
- `isolated (boolean)` - Apply only the specified schema (if version is passed) or example data (if no version passed).

Here is an example to prepare a new system for local development (the same code is run by `pnpm seed`):

```sh
curl --header "Authorization: badToken" --request POST "http://localhost:3000/api/migrate/?examples=true"
```

This cURL command can also imported in an HTTP client like [Postman](https://www.postman.com/).

Migration logs can be found in the nuxt terminal.

## Troubleshooting

- To reset the database, delete the volume of the directus-db database

# Development guide

## Overview

The repository is structured as follows:

- collectivo - Modular frontend & Nuxt API for migrations
  - app - A container to run collectivo
  - collectivo - Core functionalities
  - extensions - Optional modules
    - memberships - Manage memberships of an organization
- directus - Database, REST/GraphQL API, & Admin app
- keycloak - Authentication

## Creating an extension

To get started, create a fork of the [Collectivo Quickstart](https://github.com/collectivo-dev/collectivo-quickstart) repository.

## Adding a database schema

An extension can define a database schema

- Create a new schema file in `myExtension/server/schemas`.
  - Create a new [`ExtensionSchema`](#extensionschema) with [initschema()](#initschema).
  - Add collections, fields, and more to your schema (see [`ExtensionSchema`](#extensionschema))
- Add your schema to [myExtension/server/plugins/setup](#registerextension).

Note that database collections and fields should start with the name of the extension followed by an underscore to avoid name conflicts with other extensions. E.g. `myExtension_myCollection` and `myExtension_myField`.

Exceptions are the following system fields:

- `id`
- `user_created`
- `user_updated`
- `date_created`
- `date_updated`
- `sort`

## Best practices

- Regularly [sync your fork](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/syncing-a-fork) with the upstream repository.
- To update dependencies, run `pnpm update collectivo/extensions/my-extension -L`
- You can also add fields to collections that are not part of your extensions, like `directus_users`.
- To publish your extension, run `pnpm publish collectivo/extensions/my-extension --access=public --dry-run` (remove `--dry-run` after checking that everything is correct)
- The example extension is licensed under [public domain](https://de.wikipedia.org/wiki/Unlicense). You can choose your own license for your extension, it does not have to be the same as collectivo.

## Unit testing

- To run unit tests, use: `pnpm test`

## Linting

- To run linting checks, use: `pnpm lint`
- To apply linting to all files, use: `pnpm lint:fix`

## Formatting

- To run formatting checks, use: `pnpm format`
- To apply formatting to all files, use: `pnpm format:fix`

## Workspace

Collectivo uses a [pnpm workspace](https://pnpm.io/workspaces) to manage multiple packages in a single repository. This allows you to declare dependencies to other packages in the workspace with `package-name: "workspace:*"`. If you publish your package, the workspace `"workspace:*"` will be replaced with the current version of the depedency.

## Theme

Collectivo uses [`tailwindcss`](https://tailwindcss.com/) and [`nuxt-ui`](https://ui.nuxt.com/) for styling and components. The theme can be adapted in `tailwind.config.ts` and `app.config.ts`.

## Authentication

Collectivo authenticated through directus. To protect pages, add the following middleware to the setup script. If keycloak is used, this will forward people directly to keycloak, using Directus' [seamless SSO](https://docs.directus.io/self-hosted/sso.html#seamless-sso) feature.

```ts
definePageMeta({
  middleware: ["auth"],
});
```

## Types

To add types to the database schema of the directus client, add a file `your-extension/index.d.ts` with the following content:

```ts
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
```

You can then enjoy type checking when using directus:

```ts
const directus = useDirectus();
const data = await directus.request(readItems("example_collection"));
```

Typescript will then know that data is a `ExampleCollection[]` and that `data[0].example_field` is a string.

## Icons

Collectivo uses [`nuxt-ui`](https://ui.nuxt.com/getting-started/theming#icons) and [`Iconify`](https://iconify.design/) to load icons. They have to be defined as `i-{collection_name}-{icon_name}`. By default, Collectivo uses the [HeroIcons](https://icones.js.org/collection/heroicons) library. Additional libraries can be loaded in [`nuxt.config.ts`](https://ui.nuxt.com/getting-started/theming#icons).

## Dashboard

You can create custom components that can be displayed inside a dashboard tile. To do so, create a new component file `components/global/`. Then, add a new dashboard tile to your database and set the field `Component` to the name of your tile.

# API Reference

## Frontend

The following [composables](https://nuxt.com/docs/guide/directory-structure/composables) are available for frontend development.

### `setCollectivoTitle`

`setCollectivoTitle(title: string)`

Use in a page to set a page title for both the visible header and the metadata.

### `useDirectus`

`useDirectus(): DirectusClient`

Access the [directus client](https://docs.directus.io/guides/sdk/getting-started.html) to interact with the database.

### `useCollectivoUser`

`useCollectivoUser(): UserStore`

Store for data of the currently authenticated user, with the following attributes:

- `data: CollectivoUser | null`
- `inputs: CollectivoUserInput[]` -> Can be used to add fields to the profile section
- `isAuthenticated: boolean`
- `saving: boolean`
- `loading: boolean`
- `error: unknown`
- `load: (force: boolean = false) => Promise<UserStore>` -> Fetch user data
- `save: (data: CollectivoUser) => Promise<UserStore>` -> Update user data

### `useCollectivoMenus`

`useCollectivoMenus(): Ref<CollectivoMenus>`

This composable can be used to add or adapt menu items.

There are two menus in `CollectivoMenus`:

- `main`: Shown for authenticated users.
- `public`: Shown for unauthenticated users.

Attributes:

- `label: string` - Will be shown next to the icon.
- `icon: string` - Icon to be used (see [icons](#icons))
- `to: string` - A path like `/my/path` or `https://externallink.com`
- `external: boolan` - If true, path will be interepreted as an external URL.
- `hideOnMobile: boolean` - If true, item will not be shown on small screens.
- `target: string` - Target attribute of the link.
- `click: Function` - Click attribute of the link.
- `filter: (item: CollectivoMenuItem) => boolean` - Show item only if this function returns `true`.

Here is an example of how to add a menu item to the main menu through a plugin:

```ts
// my-extension/plugins/setup.ts
export default defineNuxtPlugin(() => {
  const menu = useCollectivoMenus();
  menu.value.main.push({
    label: "My menu item",
    icon: "i-heroicons-star",
    to: "/my/path",
    order: 100
  });
}
```

### `CollectivoFormBuilder`

This component can be used to build forms.

Attributes:

- `data: Record<string, any>`: Data to populate the initial form
- `fields: CollectivoFormField[]`: Defines the structure of the form
- `submit: (data: Record<string, any>) => Promise<void>`: Function to be called when form is submitted
- `submit-label: string`: Label of the submit button

To see the different possible form fields, check out the available types of `CollectivoFormField` in `index.d.ts`.

## Backend

The following utility functions can be used for server-side scripts (within `/my-extension/server/`)

### `registerExtension`

`registerExtension({name: string, description:string, version:string, schemas:ExtensionSchema[], examples: ()=>Promise<void>})`

Registers a function within the runtime of the backend server, being able to multiple schemas for different versions of the extension as well as a function to create example data.

Should be used within a server plugin as follows:

```ts
// my-extension/server/plugins/registerExtension.ts
import pkg from "../../package.json";
import examples from "../examples/examples";
import mySchema from "../schemas/mySchema";
export default defineNitroPlugin(() => {
  registerExtension({
    name: "myExtension",
    description: pkg.description,
    version: pkg.version,
    schemas: [mySchema],
    examples: examples,
  });
});
```

### `initSchema`

`initSchema(extension: string, version: string, options: ExtensionSchemaOptions): ExtensionSchema`

Initiates a new [ExtensionSchema](#extensionschema) that can be used to define the database structure and migrations of your extension (see [migrations](#migrations)).

Can be applied as follows and added to [`registerExtension`](#registerextension):

```ts
// my-extension/server/schemas/mySchema.ts
const schema = initSchema("myExtension", "0.0.1");

export default schema;
```

### `ExtensionSchema`

This class has the following attributes:

- `extension`: String. Name of the extension.
- `version`: String. The [semantic version](https://semver.org/) of the extension that this schema represents.
- `dependencies`: Array of [`ExtensionDependency`]().
- `run_before`: Async function. Custom migration script to be run before applying this schema version
- `run_after`: Async function. Custom migration script to be run after applying this schema version
- `collections`: Array of [`DirectusCollection`](https://docs.directus.io/reference/system/collections.html).
- `fields`: Array of [`DirectusField`](https://docs.directus.io/reference/system/fields.html).
- `relations`: Array of [`DirectusRelation`](https://docs.directus.io/reference/system/relations.html). See also the methods below.
- `roles`: Array of [`DirectusRole`](https://docs.directus.io/reference/system/roles.html).
- `permissions`: Array of [`DirectusPermission`](https://docs.directus.io/reference/system/permissions.html).
- `flows`: Array of [`DirectusFlowWrapper`](#directusflowwrapper). Define automated workflows.
- `translations`: Array of [`DirectusTranslation`](https://docs.directus.io/reference/system/translations.html)

And the following methods:

- `createO2MRelation()` - Utility method to create a [One-to-Many](https://docs.directus.io/app/data-model/relationships.html#one-to-many-o2m) relationship
- `createM2MRelation()` - Utility method to create a [Many-to_many](https://docs.directus.io/app/data-model/relationships.html#many-to-many-m2m) relationship
- `createM2ARelation()` - Utility method to create a [Many-to-Any](https://docs.directus.io/app/data-model/relationships.html#many-to-any-m2a) relationship

### `ExtensionDependency`

This type can be used to define dependencies of a schema on another extension.

Attributes:

- `extension`: String. The extension that the schema depends on.
- `version`: String. The [semantic version](https://semver.org/) of the extension that the schema depends on.

### `DirectusFlowWrapper`

This type can be used to construct directus flows in a schema.

Attributes:

- `flow: Partial<DirectusFlow<<any>>` - this will define the trigger, see [directus flow](https://docs.directus.io/reference/system/flows.html)
- `firstOperation: string` - key of the initial operation to be performed
- `operations: DirectusOperationWrapper[]` - define a list of connected operations

### `DirectusOperationWrapper`

This type can be used to define operations within [DirectusFlowWrapper](#directusflowwrapper).

Attributes:

- `operation: Partial<DirectusOperation<<any>>` - see [directus operation](https://docs.directus.io/reference/system/operations.html)
- `resolve: string` - key of the operation to execute when this one is resolved
- `reject: string` - key of the operation to execute when this one is rejected

### `useDirectusAdmin`

`useDirectusAdmin(): DirectusClient`

Access the [directus client](https://docs.directus.io/guides/sdk/getting-started.html) with admin access.

### `logger`

You can use winston to write information to the nuxt logs (`console.log` will not appear in production), e.g.:

```ts
logger.info("Hello world!");
```
