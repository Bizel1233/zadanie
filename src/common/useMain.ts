import { useApi } from "../context/api/hook";

type clientAppsType = {
	page: number | undefined;
	itemsPerPage: number | undefined;
	appName: string[] | undefined;
};

export type clientAppsDataType = {
	"hydra:member": [
		{
			id: number;
			version: string;
			url: string;
			fileName: string;
			md5: string;
			appName: string;
			description: string | null;
			launchArgs: string | null;
			createdAt: string;
			createdBy: {
				email: string;
			};
			updatedAt: string | null;
			updatedBy: {
				email: string;
			} | null;
		}
	];
	"hydra:totalItems": number;
	"hydra:view": {
		"hydra:first": string;
		"hydra:last": string;
		"hydra:previous": string;
		"hydra:next": string;
	};
	"hydra:search": {
		"hydra:template": string;
		"hydra:variableRepresentation": string;
		"hydra:mapping": [
			{
				variable: string;
				property: string | null;
				required: boolean;
			}
		];
	};
};

export const useMain = () => {
	const { get } = useApi();

	// pobranie danych o aplikacjach
	async function clientApps(data: clientAppsType) {
		try {
			let params = "";
			// jeśli przekazano przynajmniej jeden parametr to dodaj je do zapytania
			if (data.appName || data.itemsPerPage || data.page) {
				params += "?";
				if (data.appName !== undefined) {
					if (data.appName.length === 1) {
						params += `appName=${data.appName[0]}`;
					} else {
						params += data.appName.map((e) => `appName[]=${e}`).join("&");
					}
				}
				if (data.itemsPerPage !== undefined) {
					if (params.length > 1) params += "&";
					params += `itemsPerPage=${data.itemsPerPage}`;
				}
				if (data.page !== undefined) {
					if (params.length > 1) params += "&";
					params += `page=${data.page}`;
				}
			}

			const res = await get<clientAppsDataType>(`/client_apps${params}`);
			return res;
		} catch (e) {
			console.log(e);
		}
	}

	return { clientApps };
};
