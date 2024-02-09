import { defineOperationApp } from '@directus/extensions-sdk';

export default defineOperationApp({
	id: 'keycloak_sync',
	name: 'Keycloak sync',
	icon: 'box',
	description: 'Sync tags and user with Keycloak',
	overview:{},
	options: [
	],
});
