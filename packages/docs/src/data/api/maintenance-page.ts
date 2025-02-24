import { Api } from '~/types';

export const api: Api = {
	MaintenancePage: {
		props: [
			{
				name: "page-title",
				type: "string",
				required: true,
				description: "Le titre de la page.",
			},
			{
				name: "message",
				type: "string",
				required: true,
				description: "Le message d’erreur à afficher à l’utilisateur.",
			}
		],
	},
};
